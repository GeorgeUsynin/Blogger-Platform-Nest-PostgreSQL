import { ErrorCodes } from '../constants';
import { BaseDomainException } from './BaseDomainException';

export class QuestionNotFoundError extends BaseDomainException {
  constructor() {
    super(ErrorCodes.QUESTION_NOT_FOUND);
  }
}
