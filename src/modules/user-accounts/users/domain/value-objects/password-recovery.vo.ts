import {
  InvalidPasswordRecoveryCodeDomainError,
  PasswordRecoveryCodeExpiredDomainError,
} from '../domainErrors';
import {
  CreatePasswordRecoveryInput,
  PasswordRecoveryState,
  ReconstructPasswordRecoveryInput,
} from '../types/password-recovery.type';

export class PasswordRecovery {
  private constructor(private props: PasswordRecoveryState) {}

  // ---------- factory ----------

  static create(input: CreatePasswordRecoveryInput): PasswordRecovery {
    return new PasswordRecovery(input);
  }

  static reconstruct(input: ReconstructPasswordRecoveryInput) {
    return new PasswordRecovery(input);
  }

  // ---------- domain logic ----------

  public ensureValidRecoveryCode(code: string): void {
    this.ensureCodeMatches(code);
    this.ensureNotExpired();
  }

  // ---------- state mutation ----------

  public invalidate(): void {
    this.props.recoveryCode = null;
    this.props.expirationDate = null;
  }

  // ---------- guards ----------

  private ensureCodeMatches(code: string): void {
    if (this.recoveryCode !== code) {
      throw new InvalidPasswordRecoveryCodeDomainError();
    }
  }

  private ensureNotExpired(): void {
    if (this.isExpired()) {
      throw new PasswordRecoveryCodeExpiredDomainError();
    }
  }

  // ---------- queries ----------

  private isExpired(): boolean {
    if (!this.expirationDate) {
      return false;
    }

    return Date.now() > this.expirationDate.getTime();
  }

  // ---------- getters ---------

  public get recoveryCode(): PasswordRecoveryState['recoveryCode'] {
    return this.props.recoveryCode;
  }

  public get expirationDate(): PasswordRecoveryState['expirationDate'] {
    return this.props.expirationDate;
  }
}
