import { ErrorCodes } from '../constants';
import { BaseDomainException } from './BaseDomainException';

export class QuestionIdNotDefinedDomainError extends BaseDomainException {
  constructor() {
    super(ErrorCodes.QUESTION_ID_NOT_DEFINED_DOMAIN_ERROR);
  }
}
