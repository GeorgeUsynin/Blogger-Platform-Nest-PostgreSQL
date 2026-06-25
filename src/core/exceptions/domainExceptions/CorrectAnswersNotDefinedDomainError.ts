import { ErrorCodes } from '../constants';
import { BaseDomainException } from './BaseDomainException';

export class CorrectAnswersNotDefinedDomainError extends BaseDomainException {
  constructor() {
    super(ErrorCodes.CORRECT_ANSWERS_NOT_DEFINED_DOMAIN_ERROR);
  }
}
