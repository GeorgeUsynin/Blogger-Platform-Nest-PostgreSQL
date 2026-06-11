export type EmailConfirmationState = {
  isConfirmed: boolean;
  confirmationCode: string | null;
  expirationDate: Date | null;
};

export type ReconstructEmailConfirmationInput = EmailConfirmationState;
