import { ErrorCodes } from '../constants';
import { BaseDomainException } from './BaseDomainException';

export class QuestionNotFoundDomainError extends BaseDomainException {
  constructor() {
    super(ErrorCodes.QUESTION_NOT_FOUND_DOMAIN_ERROR);
  }
}
