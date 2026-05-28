import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure';
import {
  InvalidPasswordRecoveryCode,
  PasswordRecoveryCodeExpired,
} from '../../../../../core/exceptions';
import { PasswordHasherService } from '../password-hasher.service';

export class NewPasswordCommand {
  constructor(
    public readonly newPassword: string,
    public readonly recoveryCode: string,
  ) {}
}

@CommandHandler(NewPasswordCommand)
export class NewPasswordUseCase implements ICommandHandler<NewPasswordCommand> {
  constructor(
    private passwordHasherService: PasswordHasherService,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    newPassword,
    recoveryCode,
  }: NewPasswordCommand): Promise<void> {
    const user =
      await this.usersRepository.findUserByPasswordRecoveryCode(recoveryCode);

    if (!user) {
      throw new InvalidPasswordRecoveryCode();
    }

    if (user.recoveryCode !== recoveryCode) {
      throw new InvalidPasswordRecoveryCode();
    }

    if (Date.now() > Date.parse(user.expirationDate.toISOString())) {
      throw new PasswordRecoveryCodeExpired();
    }

    const newPasswordHash =
      await this.passwordHasherService.hashPassword(newPassword);
    const updatedAt = new Date().toISOString();

    await this.usersRepository.updateUserPasswordHash(
      user.id,
      newPasswordHash,
      updatedAt,
    );
  }
}
