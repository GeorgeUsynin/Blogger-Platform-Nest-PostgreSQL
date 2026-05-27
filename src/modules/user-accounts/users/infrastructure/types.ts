export type TUserDB = {
  id: number;
  login: string;
  passwordHash: string;
  email: string;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type TEmailConfirmationDB = {
  userId: number;
  isConfirmed: boolean;
  confirmationCode: string | null;
  expirationDate: Date | null;
};

export type TPasswordRecoveryDB = {
  userId: number;
  recoveryCode: string;
  expirationDate: Date;
};
