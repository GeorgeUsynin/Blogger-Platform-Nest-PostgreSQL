import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure';
import { InvalidPasswordRecoveryCode } from '../../../../../core/exceptions';
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

    const newPasswordHash =
      await this.passwordHasherService.hashPassword(newPassword);

    user.resetPassword({ recoveryCode, newPasswordHash });

    await this.usersRepository.saveUserAggregate(user);
  }
}
