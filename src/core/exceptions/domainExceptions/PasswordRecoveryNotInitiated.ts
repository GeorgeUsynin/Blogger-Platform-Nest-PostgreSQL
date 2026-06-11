import { ErrorCodes } from '../constants';
import { BaseDomainException } from './BaseDomainException';

export class PasswordRecoveryNotInitiated extends BaseDomainException {
  constructor() {
    super(ErrorCodes.PASSWORD_RECOVERY_NOT_INITIATED);
  }
}
