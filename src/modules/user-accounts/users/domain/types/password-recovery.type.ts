export type PasswordRecoveryState = {
  recoveryCode: string | null;
  expirationDate: Date | null;
};

export type CreatePasswordRecoveryInput = PasswordRecoveryState;

export type ReconstructPasswordRecoveryInput = PasswordRecoveryState;
