import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserDto } from '../dto';
import { UsersRepository } from '../../infrastructure';
import { UserCreationFailedError } from '../../../../../core/exceptions';
import { UserCreationService } from '../user-creation.service';
import { User } from '../../domain/user.aggregate';

export class CreateConfirmedUserCommand extends Command<number> {
  constructor(public readonly dto: CreateUserDto) {
    super();
  }
}

@CommandHandler(CreateConfirmedUserCommand)
export class CreateConfirmedUserUseCase implements ICommandHandler<
  CreateConfirmedUserCommand,
  number
> {
  constructor(
    private userCreationService: UserCreationService,
    private usersRepository: UsersRepository,
  ) {}

  async execute({ dto }: CreateConfirmedUserCommand): Promise<number> {
    const createUserDomainDto =
      await this.userCreationService.prepareUserCreation(dto);

    const user = User.createConfirmed(createUserDomainDto);
    const userId = await this.usersRepository.saveUserAggregate(user);

    if (!userId) {
      throw new UserCreationFailedError();
    }

    return userId;
  }
}
