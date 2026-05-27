import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  EmailConfirmationsRepository,
  UsersRepository,
} from '../../infrastructure';
import {
  ConfirmationCodeExpired,
  EmailAlreadyConfirmedByCode,
  InvalidConfirmationCode,
} from '../../../../../core/exceptions';

export class ConfirmRegistrationCommand {
  constructor(public readonly code: string) {}
}

@CommandHandler(ConfirmRegistrationCommand)
export class ConfirmRegistrationUseCase implements ICommandHandler<ConfirmRegistrationCommand> {
  constructor(
    private usersRepository: UsersRepository,
    private emailConfirmationsRepository: EmailConfirmationsRepository,
  ) {}

  async execute({ code }: ConfirmRegistrationCommand): Promise<void> {
    const user = await this.usersRepository.findUserByConfirmationCode(code);

    if (!user) {
      throw new InvalidConfirmationCode();
    }

    if (user.isConfirmed) {
      throw new EmailAlreadyConfirmedByCode();
    }

    if (user.confirmationCode !== code) {
      throw new InvalidConfirmationCode();
    }

    if (Date.now() > Date.parse(user.expirationDate?.toISOString()!)) {
      throw new ConfirmationCodeExpired();
    }

    await this.emailConfirmationsRepository.updateEmailConfirmationStatus(
      user.id,
      true,
    );
  }
}
