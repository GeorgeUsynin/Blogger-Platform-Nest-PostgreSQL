import { BaseDomainException } from '../../../../../core/exceptions';
import { ErrorCodes, ErrorFields } from '../../../../../core/exceptions/constants';

export class InvalidPasswordRecoveryCodeDomainError extends BaseDomainException {
  constructor() {
    super(ErrorCodes.INVALID_PASSWORD_RECOVERY_CODE, ErrorFields.RECOVERY_CODE);
  }
}
