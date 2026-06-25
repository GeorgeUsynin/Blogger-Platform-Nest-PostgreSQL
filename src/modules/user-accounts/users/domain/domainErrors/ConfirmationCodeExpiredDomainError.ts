import { BaseDomainException } from '../../../../../core/exceptions';
import { ErrorCodes, ErrorFields } from '../../../../../core/exceptions/constants';

export class ConfirmationCodeExpiredDomainError extends BaseDomainException {
  constructor() {
    super(ErrorCodes.CONFIRMATION_CODE_EXPIRED, ErrorFields.CODE);
  }
}
