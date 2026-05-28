export class CreatePasswordRecoveryRepositoryDto {
  userId: number;
  recoveryCode: string;
  expirationDate: Date;
}
