import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import {
  PasswordRecoveriesRepository,
  UsersRepository,
} from '../../infrastructure';
import { PasswordRecoveryRequestedEvent } from '../events';
import { UserAccountsConfig } from '../../config';
import { CodeCreationService } from '../code-creation.service';
import { CreatePasswordRecoveryRepositoryDto } from '../../infrastructure/dto';

export class RecoverPasswordCommand {
  constructor(public readonly email: string) {}
}

@CommandHandler(RecoverPasswordCommand)
export class RecoverPasswordUseCase implements ICommandHandler<RecoverPasswordCommand> {
  constructor(
    private codeCreationService: CodeCreationService,
    private usersRepository: UsersRepository,
    private passwordRecoveriesRepository: PasswordRecoveriesRepository,
    private userAccountsConfig: UserAccountsConfig,
    private eventBus: EventBus,
  ) {}

  async execute({ email }: RecoverPasswordCommand): Promise<void> {
    const user = await this.usersRepository.findUserByEmail(email);

    if (user) {
      const { code: recoveryCode, expirationDate } =
        this.codeCreationService.generateCodeWithExpirationDate(
          this.userAccountsConfig.RECOVERY_CODE_EXPIRATION_TIME_IN_HOURS,
        );

      const createPasswordRecoveryRepositoryDto: CreatePasswordRecoveryRepositoryDto =
        {
          userId: user.id,
          recoveryCode,
          expirationDate,
        };

      await this.passwordRecoveriesRepository.createForUser(
        createPasswordRecoveryRepositoryDto,
      );

      this.eventBus.publish(
        new PasswordRecoveryRequestedEvent(email, recoveryCode),
      );
    }
  }
}
