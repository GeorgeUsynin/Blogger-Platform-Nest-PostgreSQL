import { BaseDomainException } from '../../../../../core/exceptions';
import { ErrorCodes } from '../../../../../core/exceptions/constants';

export class QuestionIdNotDefinedDomainError extends BaseDomainException {
  constructor() {
    super(ErrorCodes.QUESTION_ID_NOT_DEFINED_DOMAIN_ERROR);
  }
}
