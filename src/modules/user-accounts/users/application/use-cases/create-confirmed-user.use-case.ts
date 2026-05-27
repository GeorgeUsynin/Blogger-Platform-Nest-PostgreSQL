import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserDto } from '../dto';
import { CreateEmailConfirmationRepositoryDto } from '../../infrastructure/dto';
import {
  EmailConfirmationsRepository,
  UsersRepository,
} from '../../infrastructure';
import { UserCreationFailedError } from '../../../../../core/exceptions';
import { UserCreationService } from '../user-creation.service';

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
    private emailConfirmationsRepository: EmailConfirmationsRepository,
  ) {}

  async execute({ dto }: CreateConfirmedUserCommand): Promise<number> {
    const createUserRepositoryDto =
      await this.userCreationService.prepareUserCreation(dto);

    // TODO: create transaction (user creation + email confirmation creation)
    const userId = await this.usersRepository.createUser(
      createUserRepositoryDto,
    );

    if (!userId) {
      throw new UserCreationFailedError();
    }

    const createEmailConfirmationRepositoryDto: CreateEmailConfirmationRepositoryDto =
      {
        userId,
        isConfirmed: true,
        confirmationCode: null,
        expirationDate: null,
      };

    await this.emailConfirmationsRepository.createForUser(
      createEmailConfirmationRepositoryDto,
    );
    // TODO END

    return userId;
  }
}
