export { UsersController, AuthController } from './api';
export { User, UserSchema } from './domain';
import {
  PasswordHasherService,
  AuthService,
  UserCreationService,
  CodeCreationService,
} from './application';
import {
  ConfirmRegistrationUseCase,
  CreateUnconfirmedUserUseCase,
  CreateConfirmedUserUseCase,
  DeleteUserUseCase,
  LoginUserUseCase,
  LogoutUserUseCase,
  NewPasswordUseCase,
  RecoverPasswordUseCase,
  RegisterUserUseCase,
  ResendEmailConfirmationUseCase,
  UpdateTokensUseCase,
} from './application/use-cases';
import { UserAccountsConfig } from './config';
import { JwtCookiesStrategy, JwtHeaderStrategy } from './guards/bearer';
import { LocalStrategy } from './guards/local';
import {
  UsersRepository,
  UsersQueryRepository,
  UsersExternalQueryRepository,
  UsersExternalRepository,
  EmailConfirmationsRepository,
  PasswordRecoveriesRepository,
} from './infrastructure';

export const usersProviders = [
  EmailConfirmationsRepository,
  PasswordRecoveriesRepository,
  UsersRepository,
  UsersExternalRepository,
  UsersQueryRepository,
  UsersExternalQueryRepository,
  UserAccountsConfig,
  UserCreationService,
  CodeCreationService,
];

export const authProviders = [
  AuthService,
  PasswordHasherService,
  LocalStrategy,
  JwtHeaderStrategy,
  JwtCookiesStrategy,
];

export const usersUseCases = [
  LoginUserUseCase,
  RegisterUserUseCase,
  CreateUnconfirmedUserUseCase,
  CreateConfirmedUserUseCase,
  DeleteUserUseCase,
  RecoverPasswordUseCase,
  ConfirmRegistrationUseCase,
  NewPasswordUseCase,
  ResendEmailConfirmationUseCase,
  LogoutUserUseCase,
  UpdateTokensUseCase,
];
