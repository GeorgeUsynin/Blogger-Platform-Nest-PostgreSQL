import { EmailConfirmation, PasswordRecovery } from '../value-objects/';

export type CreateConfirmedUserInput = {
  login: string;
  email: string;
  passwordHash: string;
};

export type CreateUnconfirmedUserInput = {
  login: string;
  email: string;
  passwordHash: string;
  confirmation: {
    code: string;
    expirationDate: Date;
  };
};

export type UserState = {
  id?: number;
  login: string;
  email: string;
  passwordHash: string;
  emailConfirmation: EmailConfirmation;
  passwordRecovery: PasswordRecovery | null;
};

export type ReconstructUserInput = Omit<UserState, 'id'> & { id: number };

export type StartPasswordRecoveryInput = {
  recoveryCode: string;
  expirationDate: Date;
};

export type ResetPasswordInput = {
  recoveryCode: string;
  newPasswordHash: string;
};

export type RequestEmailConfirmationRenewalInput = {
  confirmationCode: string;
  expirationDate: Date;
};
