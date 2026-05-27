import {
  CommandBus,
  CommandHandler,
  EventBus,
  ICommandHandler,
} from '@nestjs/cqrs';
import { CreateUserDto } from '../dto';
import { EmailConfirmationRequestedEvent } from '../events';
import { CreateUnconfirmedUserCommand } from './create-unconfirmed-user.use-case';
import { UserAccountsConfig } from '../../config';

export class RegisterUserCommand {
  constructor(public readonly dto: CreateUserDto) {}
}

@CommandHandler(RegisterUserCommand)
export class RegisterUserUseCase implements ICommandHandler<RegisterUserCommand> {
  constructor(
    private commandBus: CommandBus,
    private userAccountsConfig: UserAccountsConfig,
    private eventBus: EventBus,
  ) {}

  async execute({ dto }: RegisterUserCommand): Promise<void> {
    const { email, confirmationCode } = await this.commandBus.execute(
      new CreateUnconfirmedUserCommand(dto),
    );

    // TODO:
    // Implement the Outbox Pattern: in the same transaction that creates the user,
    // persist an “email confirmation requested” event in the database,
    // then send the email asynchronously via a separate worker with retries,
    // so events are not lost between commit and publish.

    // Why: this guarantees reliability and consistency: either both the user and the email task are saved,
    // or neither is saved, eliminating the “user created but email event lost” failure window.

    if (!this.userAccountsConfig.IS_USER_AUTOMATICALLY_CONFIRMED) {
      this.eventBus.publish(
        new EmailConfirmationRequestedEvent(email, confirmationCode),
      );
    }
  }
}
