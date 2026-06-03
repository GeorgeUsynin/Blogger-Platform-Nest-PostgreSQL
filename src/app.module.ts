import { configModule } from './config.module';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import {
  BloggersPlatformModule,
  UserAccountsModule,
  NotificationsModule,
  TestingModule,
} from './modules';
import { AppController } from './app.controller';
import { CoreModule } from './core';
import { configValidationUtility, CoreConfig } from './core/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DB_TYPE, PG_PORT } from './constants';

const includeTestingModule = configValidationUtility.convertToBoolean(
  process.env.INCLUDE_TESTING_MODULE!,
);

@Module({
  imports: [
    configModule,
    CoreModule,
    ...(includeTestingModule ? [TestingModule] : []),
    TypeOrmModule.forRootAsync({
      useFactory: (coreConfig: CoreConfig) => {
        return {
          type: DB_TYPE,
          host: coreConfig.POSTGRESQL_URL,
          port: PG_PORT,
          username: coreConfig.PG_USERNAME,
          password: coreConfig.PG_PASSWORD,
          database: coreConfig.DB_NAME_PG,
          autoLoadEntities: false,
          synchronize: false,
        };
      },
      inject: [CoreConfig],
    }),
    ThrottlerModule.forRootAsync({
      useFactory: (coreConfig: CoreConfig) => [
        {
          ttl: coreConfig.API_REQUEST_TIME_TO_LIVE,
          limit: coreConfig.API_REQUEST_MAXIMUM_LIMIT,
        },
      ],
      inject: [CoreConfig],
    }),
    CqrsModule.forRoot(),
    BloggersPlatformModule,
    UserAccountsModule,
    NotificationsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
