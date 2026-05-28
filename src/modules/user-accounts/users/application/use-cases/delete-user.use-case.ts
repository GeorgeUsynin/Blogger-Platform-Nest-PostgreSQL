import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure';
import {
  UserAlreadyDeleted,
  UserNotFoundError,
} from '../../../../../core/exceptions';
import { DeleteUserRepositoryDto } from '../../infrastructure/dto';

export class DeleteUserCommand {
  constructor(public readonly id: number) {}
}

@CommandHandler(DeleteUserCommand)
export class DeleteUserUseCase implements ICommandHandler<DeleteUserCommand> {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ id }: DeleteUserCommand): Promise<void> {
    const foundUser = await this.usersRepository.findById(id);

    if (!foundUser) {
      throw new UserNotFoundError();
    }

    if (foundUser.isDeleted) {
      throw new UserAlreadyDeleted();
    }

    const now = new Date();

    const deleteUserRepositoryDto: DeleteUserRepositoryDto = {
      id: foundUser.id,
      isDeleted: true,
      deletedAt: now,
      updatedAt: now,
    };

    await this.usersRepository.deleteUser(deleteUserRepositoryDto);
  }
}
