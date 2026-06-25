import { BaseDomainException } from '../../../../../core/exceptions';
import { ErrorCodes, ErrorFields } from '../../../../../core/exceptions/constants';

export class PasswordRecoveryCodeExpiredDomainError extends BaseDomainException {
  constructor() {
    super(ErrorCodes.PASSWORD_RECOVERY_CODE_EXPIRED, ErrorFields.RECOVERY_CODE);
  }
}
