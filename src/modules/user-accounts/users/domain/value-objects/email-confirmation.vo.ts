import {
  ConfirmationCodeExpiredDomainError,
  EmailAlreadyConfirmedByCodeDomainError,
  InvalidConfirmationCodeDomainError,
} from '../domainErrors';
import {
  EmailConfirmationState,
  ReconstructEmailConfirmationInput,
} from '../types/email-confirmation.type';

export class EmailConfirmation {
  private constructor(private props: EmailConfirmationState) {}

  // ---------- factory ----------

  static createPending(
    confirmationCode: string,
    expirationDate: Date,
  ): EmailConfirmation {
    return new EmailConfirmation({
      isConfirmed: false,
      confirmationCode,
      expirationDate,
    });
  }

  static createConfirmed(): EmailConfirmation {
    return new EmailConfirmation({
      isConfirmed: true,
      confirmationCode: null,
      expirationDate: null,
    });
  }

  static reconstruct(input: ReconstructEmailConfirmationInput) {
    return new EmailConfirmation(input);
  }

  // ---------- domain logic ----------

  public confirmEmail(code: string): void {
    this.ensureNotConfirmed();
    this.ensureCodeIsValid(code);
    this.ensureNotExpired();

    this.applyConfirmation();
  }

  public requestNewCode(confirmationCode: string, expirationDate: Date): void {
    this.ensureNotConfirmed();
    this.applyNewCode(confirmationCode, expirationDate);
  }

  // ---------- guards ----------

  private ensureNotConfirmed(): void {
    if (this.isConfirmed) {
      throw new EmailAlreadyConfirmedByCodeDomainError();
    }
  }

  private ensureCodeIsValid(code: string): void {
    if (this.confirmationCode !== code) {
      throw new InvalidConfirmationCodeDomainError();
    }
  }

  private ensureNotExpired(): void {
    if (this.isExpired()) {
      throw new ConfirmationCodeExpiredDomainError();
    }
  }

  // ---------- state queries ----------

  private isExpired(): boolean {
    if (!this.expirationDate) {
      return false;
    }

    return Date.now() > this.expirationDate.getTime();
  }

  // ---------- state mutation ----------

  private applyConfirmation(): void {
    this.props.isConfirmed = true;
    this.props.confirmationCode = null;
    this.props.expirationDate = null;
  }

  private applyNewCode(code: string, expirationDate: Date): void {
    this.props.confirmationCode = code;
    this.props.expirationDate = expirationDate;
  }

  // ---------- getters ---------

  public get isConfirmed(): EmailConfirmationState['isConfirmed'] {
    return this.props.isConfirmed;
  }

  public get confirmationCode(): EmailConfirmationState['confirmationCode'] {
    return this.props.confirmationCode;
  }

  public get expirationDate(): EmailConfirmationState['expirationDate'] {
    return this.props.expirationDate;
  }
}
