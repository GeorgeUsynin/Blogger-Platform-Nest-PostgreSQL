export { UsersController, AuthController } from './api';
import {
  PasswordHasherService,
  AuthService,
  UserCreationService,
  CodeCreationService,
  // -- use-cases --
  ConfirmRegistrationUseCase,
  CreateConfirmedUserUseCase,
  DeleteUserUseCase,
  LoginUserUseCase,
  LogoutUserUseCase,
  NewPasswordUseCase,
  RecoverPasswordUseCase,
  RegisterUserUseCase,
  ResendEmailConfirmationUseCase,
  UpdateTokensUseCase,
} from './application';
import { UserAccountsConfig } from './config';
import { JwtCookiesStrategy, JwtHeaderStrategy } from './guards/bearer';
import { LocalStrategy } from './guards/local';
import {
  UsersRepository,
  UsersQueryRepository,
  UsersExternalRepository,
} from './infrastructure';

export const usersProviders = [
  UsersRepository,
  UsersExternalRepository,
  UsersQueryRepository,
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
  CreateConfirmedUserUseCase,
  DeleteUserUseCase,
  RecoverPasswordUseCase,
  ConfirmRegistrationUseCase,
  NewPasswordUseCase,
  ResendEmailConfirmationUseCase,
  LogoutUserUseCase,
  UpdateTokensUseCase,
];
