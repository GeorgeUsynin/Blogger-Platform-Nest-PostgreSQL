import { BaseDomainException } from '../../../../../core/exceptions';
import { ErrorCodes } from '../../../../../core/exceptions/constants';

export class NotEnoughPublishedQuestionsDomainError extends BaseDomainException {
  constructor() {
    super(ErrorCodes.NOT_ENOUGH_PUBLISHED_QUESTIONS);
  }
}
