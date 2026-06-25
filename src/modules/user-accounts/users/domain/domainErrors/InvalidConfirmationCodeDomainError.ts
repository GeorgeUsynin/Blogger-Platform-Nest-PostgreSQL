import { BaseDomainException } from '../../../../../core/exceptions';
import { ErrorCodes, ErrorFields } from '../../../../../core/exceptions/constants';

export class InvalidConfirmationCodeDomainError extends BaseDomainException {
  constructor() {
    super(ErrorCodes.INVALID_CONFIRMATION_CODE, ErrorFields.CODE);
  }
}
