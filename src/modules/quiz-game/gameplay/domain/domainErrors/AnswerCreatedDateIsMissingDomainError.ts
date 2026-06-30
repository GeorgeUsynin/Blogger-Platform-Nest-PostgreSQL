import { BaseDomainException } from '../../../../../core/exceptions';
import { ErrorCodes } from '../../../../../core/exceptions/constants';

export class AnswerCreatedDateIsMissingDomainError extends BaseDomainException {
  constructor() {
    super(ErrorCodes.ANSWER_CREATED_DATE_IS_MISSING);
  }
}
