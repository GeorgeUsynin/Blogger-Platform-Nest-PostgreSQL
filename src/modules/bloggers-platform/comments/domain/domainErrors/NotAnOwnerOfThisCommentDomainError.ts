import { BaseDomainException } from '../../../../../core/exceptions';
import { ErrorCodes } from '../../../../../core/exceptions/constants';

export class NotAnOwnerOfThisCommentDomainError extends BaseDomainException {
  constructor() {
    super(ErrorCodes.NOT_AN_OWNER_OF_THIS_COMMENT);
  }
}
