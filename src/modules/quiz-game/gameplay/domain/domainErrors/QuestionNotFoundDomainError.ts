import { BaseDomainException } from '../../../../../core/exceptions';
import { ErrorCodes } from '../../../../../core/exceptions/constants';

export class QuestionNotFoundDomainError extends BaseDomainException {
  constructor() {
    super(ErrorCodes.QUESTION_NOT_FOUND_DOMAIN_ERROR);
  }
}
