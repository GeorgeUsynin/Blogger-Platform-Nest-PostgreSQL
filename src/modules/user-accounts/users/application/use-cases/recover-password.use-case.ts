import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure';
import { UserAccountsConfig } from '../../config';
import { CodeCreationService } from '../code-creation.service';

export class RecoverPasswordCommand {
  constructor(public readonly email: string) {}
}

@CommandHandler(RecoverPasswordCommand)
export class RecoverPasswordUseCase implements ICommandHandler<RecoverPasswordCommand> {
  constructor(
    private codeCreationService: CodeCreationService,
    private usersRepository: UsersRepository,
    private userAccountsConfig: UserAccountsConfig,
  ) {}

  async execute({ email }: RecoverPasswordCommand): Promise<void> {
    const user = await this.usersRepository.findUserByEmail(email);

    if (user) {
      const { code: recoveryCode, expirationDate } =
        this.codeCreationService.generateCodeWithExpirationDate(
          this.userAccountsConfig.RECOVERY_CODE_EXPIRATION_TIME_IN_HOURS,
        );

      user.startPasswordRecovery({
        recoveryCode,
        expirationDate,
      });
      await this.usersRepository.saveUserAggregate(user);

      user.commit();
    }
  }
}
