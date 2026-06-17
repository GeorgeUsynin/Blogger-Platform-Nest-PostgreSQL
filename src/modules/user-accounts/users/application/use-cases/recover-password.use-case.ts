import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventEmitter2 } from '@nestjs/event-emitter';
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
    private eventEmitter: EventEmitter2,
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

      const passwordRecoveryRequestedEvent = user.getUncommittedEvents()[0];

      await this.eventEmitter.emitAsync(
        'password.recovery.requested',
        passwordRecoveryRequestedEvent,
      );

      user.uncommit();
    }
  }
}
