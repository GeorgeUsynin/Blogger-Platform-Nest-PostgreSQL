import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { User } from '../../domain';
import { CreateUserDto } from '../dto';
import { UserAccountsConfig } from '../../config';
import { UserCreationService } from '../user-creation.service';
import { CodeCreationService } from '../code-creation.service';
import { UsersRepository } from '../../infrastructure';
import { UserCreationFailedError } from '../../../../../core/exceptions';

type TResult = {
  userId: number;
  email: string;
  confirmationCode: string;
};
export class RegisterUserCommand {
  constructor(public readonly dto: CreateUserDto) {}
}

@CommandHandler(RegisterUserCommand)
export class RegisterUserUseCase implements ICommandHandler<
  RegisterUserCommand,
  TResult
> {
  constructor(
    private userAccountsConfig: UserAccountsConfig,
    private userCreationService: UserCreationService,
    private codeCreationService: CodeCreationService,
    private usersRepository: UsersRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async execute({ dto }: RegisterUserCommand): Promise<TResult> {
    const createUserDomainDto =
      await this.userCreationService.prepareUserCreation(dto);

    const { code: confirmationCode, expirationDate } =
      this.codeCreationService.generateCodeWithExpirationDate(
        this.userAccountsConfig
          .EMAIL_CONFIRMATION_CODE_EXPIRATION_TIME_IN_HOURS,
      );

    const user = User.createUnconfirmed({
      ...createUserDomainDto,
      confirmation: {
        code: confirmationCode,
        expirationDate,
      },
    });
    const userId = await this.usersRepository.saveUserAggregate(user);

    if (!userId) {
      throw new UserCreationFailedError();
    }

    const emailConfirmationRequestedEvent = user.getUncommittedEvents()[0];

    await this.eventEmitter.emitAsync(
      'email.confirmation.requested',
      emailConfirmationRequestedEvent,
    );

    user.uncommit();

    return {
      userId,
      email: dto.email,
      confirmationCode,
    };
  }
}
