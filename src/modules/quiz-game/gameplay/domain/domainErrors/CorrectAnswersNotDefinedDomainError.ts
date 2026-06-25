import { BaseDomainException } from '../../../../../core/exceptions';
import { ErrorCodes } from '../../../../../core/exceptions/constants';

export class CorrectAnswersNotDefinedDomainError extends BaseDomainException {
  constructor() {
    super(ErrorCodes.CORRECT_ANSWERS_NOT_DEFINED_DOMAIN_ERROR);
  }
}
