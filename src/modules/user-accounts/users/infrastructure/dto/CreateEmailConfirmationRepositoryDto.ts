export class CreateEmailConfirmationRepositoryDto {
  userId: number;
  isConfirmed: boolean;
  confirmationCode: string | null;
  expirationDate: Date | null;
}
