import { BaseDomainException } from '../../../../../core/exceptions';
import { ErrorCodes, ErrorFields } from '../../../../../core/exceptions/constants';

export class EmailAlreadyConfirmedByCodeDomainError extends BaseDomainException {
  constructor() {
    super(ErrorCodes.EMAIL_ALREADY_CONFIRMED_BY_CODE, ErrorFields.CODE);
  }
}
