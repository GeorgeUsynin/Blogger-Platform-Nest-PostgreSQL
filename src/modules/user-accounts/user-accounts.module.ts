import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  AuthController,
  authProviders,
  usersUseCases,
  UsersController,
  usersProviders,
} from './users';
import {
  ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
  REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
} from './users/application/constants';
import { NotificationsModule } from '../notification';
import { UsersExternalRepository } from './users/infrastructure';
import { UserAccountsConfig } from './users/config';
import {
  DevicesController,
  devicesProviders,
  devicesUseCases,
} from './devices';

@Module({
  imports: [NotificationsModule],
  controllers: [UsersController, AuthController, DevicesController],
  providers: [
    {
      provide: ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
      useFactory: (userAccountsConfig: UserAccountsConfig): JwtService => {
        return new JwtService({
          secret: process.env.JWT_ACCESS_SECRET,
          signOptions: {
            expiresIn: userAccountsConfig.ACCESS_TOKEN_EXPIRATION_TIME,
          },
        });
      },
      inject: [UserAccountsConfig],
    },
    {
      provide: REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
      useFactory: (userAccountsConfig: UserAccountsConfig): JwtService => {
        return new JwtService({
          secret: process.env.JWT_REFRESH_SECRET,
          signOptions: {
            expiresIn: userAccountsConfig.REFRESH_TOKEN_EXPIRATION_TIME,
          },
        });
      },
      inject: [UserAccountsConfig],
    },
    ...usersProviders,
    ...authProviders,
    ...usersUseCases,
    ...devicesProviders,
    ...devicesUseCases,
  ],
  exports: [UsersExternalRepository, UserAccountsConfig],
})
export class UserAccountsModule {}
