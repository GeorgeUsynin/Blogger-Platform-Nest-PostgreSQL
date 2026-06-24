import { ErrorCodes } from '../constants';
import { BaseDomainException } from './BaseDomainException';

export class NotEnoughPublishedQuestions extends BaseDomainException {
  constructor() {
    super(ErrorCodes.NOT_ENOUGH_PUBLISHED_QUESTIONS);
  }
}
