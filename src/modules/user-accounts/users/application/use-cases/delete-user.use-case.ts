import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure';
import { UserNotFoundError } from '../../../../../core/exceptions';

export class DeleteUserCommand {
  constructor(public readonly id: number) {}
}

@CommandHandler(DeleteUserCommand)
export class DeleteUserUseCase implements ICommandHandler<DeleteUserCommand> {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ id }: DeleteUserCommand): Promise<void> {
    const foundUser = await this.usersRepository.findUserById(id);

    if (!foundUser) {
      throw new UserNotFoundError();
    }

    await this.usersRepository.softDeleteUserById(foundUser.id);
  }
}
