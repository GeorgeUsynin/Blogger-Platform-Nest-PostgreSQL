import { BaseDomainException } from '../../../../../core/exceptions';
import { ErrorCodes } from '../../../../../core/exceptions/constants';

export class AllQuestionsAlreadyAnsweredDomainError extends BaseDomainException {
  constructor() {
    super(ErrorCodes.ALL_QUESTIONS_ALREADY_ANSWERED);
  }
}
