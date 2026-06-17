import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UsersRepository } from '../../infrastructure';
import { UserAccountsConfig } from '../../config';
import { CodeCreationService } from '../code-creation.service';

export class ResendEmailConfirmationCommand {
  constructor(public readonly email: string) {}
}

@CommandHandler(ResendEmailConfirmationCommand)
export class ResendEmailConfirmationUseCase implements ICommandHandler<ResendEmailConfirmationCommand> {
  constructor(
    private usersRepository: UsersRepository,
    private codeCreationService: CodeCreationService,
    private userAccountsConfig: UserAccountsConfig,
    private eventEmitter: EventEmitter2,
  ) {}

  async execute({ email }: ResendEmailConfirmationCommand): Promise<void> {
    const user = await this.usersRepository.findUserByEmail(email);

    if (user) {
      const { code: confirmationCode, expirationDate } =
        this.codeCreationService.generateCodeWithExpirationDate(
          this.userAccountsConfig
            .EMAIL_CONFIRMATION_CODE_EXPIRATION_TIME_IN_HOURS,
        );

      user.requestEmailConfirmationRenewal({
        confirmationCode,
        expirationDate,
      });
      await this.usersRepository.saveUserAggregate(user);

      const emailConfirmationRequestedEvent = user.getUncommittedEvents()[0];

      await this.eventEmitter.emitAsync(
        'email.confirmation.requested',
        emailConfirmationRequestedEvent,
      );

      user.uncommit();
    }
  }
}
