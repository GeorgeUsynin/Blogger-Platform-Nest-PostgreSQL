import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserDto } from '../dto';
import {
  EmailConfirmationsRepository,
  UsersRepository,
} from '../../infrastructure';
import { UserCreationService } from '../user-creation.service';
import { CreateEmailConfirmationRepositoryDto } from '../../infrastructure/dto';
import { UserCreationFailedError } from '../../../../../core/exceptions';
import { UserAccountsConfig } from '../../config';
import { CodeCreationService } from '../code-creation.service';

type TResult = {
  userId: number;
  email: string;
  confirmationCode: string;
};

export class CreateUnconfirmedUserCommand extends Command<TResult> {
  constructor(public readonly dto: CreateUserDto) {
    super();
  }
}

@CommandHandler(CreateUnconfirmedUserCommand)
export class CreateUnconfirmedUserUseCase implements ICommandHandler<
  CreateUnconfirmedUserCommand,
  TResult
> {
  constructor(
    private userAccountsConfig: UserAccountsConfig,
    private userCreationService: UserCreationService,
    private codeCreationService: CodeCreationService,
    private usersRepository: UsersRepository,
    private emailConfirmationsRepository: EmailConfirmationsRepository,
  ) {}

  async execute({ dto }: CreateUnconfirmedUserCommand): Promise<TResult> {
    const createUserRepositoryDto =
      await this.userCreationService.prepareUserCreation(dto);

    const { code: confirmationCode, expirationDate } =
      this.codeCreationService.generateCodeWithExpirationDate(
        this.userAccountsConfig
          .EMAIL_CONFIRMATION_CODE_EXPIRATION_TIME_IN_HOURS,
      );

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
        isConfirmed: false,
        confirmationCode,
        expirationDate,
      };

    await this.emailConfirmationsRepository.createForUser(
      createEmailConfirmationRepositoryDto,
    );
    // TODO END

    return {
      userId,
      email: dto.email,
      confirmationCode: createEmailConfirmationRepositoryDto.confirmationCode!,
    };
  }
}
