import { AggregateRoot } from '@nestjs/cqrs';
import { EmailConfirmation, PasswordRecovery } from './value-objects';
import { PasswordRecoveryNotInitiatedDomainError } from './domainErrors';
import {
  EmailConfirmationRequestedEvent,
  PasswordRecoveryRequestedEvent,
} from '../application/events';
import {
  CreateConfirmedUserInput,
  CreateUnconfirmedUserInput,
  ReconstructUserInput,
  RequestEmailConfirmationRenewalInput,
  ResetPasswordInput,
  StartPasswordRecoveryInput,
  UserState,
} from './types';

export class User extends AggregateRoot {
  private constructor(private props: UserState) {
    super();
  }

  // ---------- factory ----------

  static createConfirmed(input: CreateConfirmedUserInput) {
    const user = new User({
      id: undefined,
      ...input,
      emailConfirmation: EmailConfirmation.createConfirmed(),
      passwordRecovery: null,
    });

    return user;
  }

  static createUnconfirmed(input: CreateUnconfirmedUserInput) {
    const user = new User({
      id: undefined,
      ...input,
      emailConfirmation: EmailConfirmation.createPending(
        input.confirmation.code,
        input.confirmation.expirationDate,
      ),
      passwordRecovery: null,
    });

    user.apply(
      new EmailConfirmationRequestedEvent(input.email, input.confirmation.code),
    );

    return user;
  }

  static reconstruct(input: ReconstructUserInput) {
    return new User(input);
  }

  // ---------- email confirmation use-cases ----------

  public confirmEmail(code: string): void {
    this.emailConfirmation.confirmEmail(code);
  }

  public requestEmailConfirmationRenewal(
    input: RequestEmailConfirmationRenewalInput,
  ): void {
    this.emailConfirmation.requestNewCode(
      input.confirmationCode,
      input.expirationDate,
    );

    this.apply(
      new EmailConfirmationRequestedEvent(this.email, input.confirmationCode),
    );
  }

  // ---------- password recovery use-cases ----------

  public startPasswordRecovery(input: StartPasswordRecoveryInput): void {
    this.props.passwordRecovery = PasswordRecovery.create(input);

    this.apply(
      new PasswordRecoveryRequestedEvent(this.email, input.recoveryCode),
    );
  }

  public resetPassword(input: ResetPasswordInput): void {
    this.validateAndClearPasswordRecovery(input.recoveryCode);

    this.props.passwordHash = input.newPasswordHash;
  }

  // ---------- domain logic ----------

  private validateAndClearPasswordRecovery(recoveryCode: string): void {
    if (!this.passwordRecovery) {
      throw new PasswordRecoveryNotInitiatedDomainError();
    }

    this.passwordRecovery.ensureValidRecoveryCode(recoveryCode);
    this.passwordRecovery.invalidate();
  }

  // ---------- getters ---------

  public get id(): UserState['id'] {
    return this.props.id;
  }

  public get email(): UserState['email'] {
    return this.props.email;
  }

  public get login(): UserState['login'] {
    return this.props.login;
  }

  public get passwordHash(): UserState['passwordHash'] {
    return this.props.passwordHash;
  }

  public get emailConfirmation(): UserState['emailConfirmation'] {
    return this.props.emailConfirmation;
  }

  public get passwordRecovery(): UserState['passwordRecovery'] {
    return this.props.passwordRecovery;
  }
}
