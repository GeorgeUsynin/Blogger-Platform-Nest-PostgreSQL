import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import {
  EmailConfirmationsRepository,
  UsersRepository,
} from '../../infrastructure';
import { EmailConfirmationRequestedEvent } from '../events';
import { UserAccountsConfig } from '../../config';
import { EmailAlreadyConfirmedByCode } from '../../../../../core/exceptions';
import { CodeCreationService } from '../code-creation.service';
import { UpdateEmailConfirmationCodeAndDateRepositoryDto } from '../../infrastructure/dto';

export class ResendEmailConfirmationCommand {
  constructor(public readonly email: string) {}
}

@CommandHandler(ResendEmailConfirmationCommand)
export class ResendEmailConfirmationUseCase implements ICommandHandler<ResendEmailConfirmationCommand> {
  constructor(
    private usersRepository: UsersRepository,
    private emailConfirmationsRepository: EmailConfirmationsRepository,
    private codeCreationService: CodeCreationService,
    private userAccountsConfig: UserAccountsConfig,
    private eventBus: EventBus,
  ) {}

  async execute({ email }: ResendEmailConfirmationCommand): Promise<void> {
    const user = await this.usersRepository.findUserByEmail(email);

    if (user) {
      const emailConfirmation =
        await this.emailConfirmationsRepository.findEmailConfirmationByUserId(
          user.id,
        );

      if (!emailConfirmation) return;

      if (emailConfirmation.isConfirmed) {
        throw new EmailAlreadyConfirmedByCode();
      }

      const { code: confirmationCode, expirationDate } =
        this.codeCreationService.generateCodeWithExpirationDate(
          this.userAccountsConfig
            .EMAIL_CONFIRMATION_CODE_EXPIRATION_TIME_IN_HOURS,
        );

      const updateEmailConfirmationCodeAndDateRepositoryDto: UpdateEmailConfirmationCodeAndDateRepositoryDto =
        {
          userId: user.id,
          confirmationCode,
          expirationDate,
        };

      await this.emailConfirmationsRepository.updateEmailConfirmationCodeAndDate(
        updateEmailConfirmationCodeAndDateRepositoryDto,
      );

      this.eventBus.publish(
        new EmailConfirmationRequestedEvent(email, confirmationCode),
      );
    }
  }
}
