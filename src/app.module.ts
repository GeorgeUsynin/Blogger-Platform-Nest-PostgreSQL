import { configModule } from './config.module';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import {
  BloggersPlatformModule,
  UserAccountsModule,
  NotificationsModule,
  TestingModule,
} from './modules';
import { AppController } from './app.controller';
import { CoreModule } from './core';
import {
  configValidationUtility,
  CoreConfig,
  getDbConfig,
} from './core/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';

const includeTestingModule = configValidationUtility.convertToBoolean(
  process.env.INCLUDE_TESTING_MODULE!,
);

@Module({
  imports: [
    // Serve static files from swagger-static folder
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'swagger-static'),
      serveRoot: '/api',
    }),
    configModule,
    CoreModule,
    ...(includeTestingModule ? [TestingModule] : []),
    TypeOrmModule.forRootAsync({
      useFactory: (coreConfig: CoreConfig) => getDbConfig(coreConfig),
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
    EventEmitterModule.forRoot(),
    CqrsModule.forRoot(),
    BloggersPlatformModule,
    UserAccountsModule,
    NotificationsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
