import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure';
import { InvalidConfirmationCode } from '../../../../../core/exceptions';

export class ConfirmRegistrationCommand {
  constructor(public readonly code: string) {}
}

@CommandHandler(ConfirmRegistrationCommand)
export class ConfirmRegistrationUseCase implements ICommandHandler<ConfirmRegistrationCommand> {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ code }: ConfirmRegistrationCommand): Promise<void> {
    const user =
      await this.usersRepository.findUserByEmailConfirmationCode(code);

    if (!user) {
      throw new InvalidConfirmationCode();
    }

    user.confirmEmail(code);

    await this.usersRepository.saveUserAggregate(user);
  }
}
