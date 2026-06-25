import { BaseDomainException } from '../../../../../core/exceptions';
import { ErrorCodes } from '../../../../../core/exceptions/constants';

export class PasswordRecoveryNotInitiatedDomainError extends BaseDomainException {
  constructor() {
    super(ErrorCodes.PASSWORD_RECOVERY_NOT_INITIATED);
  }
}
