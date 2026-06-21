import { ErrorCodes } from '../constants';
import { BaseDomainException } from './BaseDomainException';

export class QuestionCreationFailedError extends BaseDomainException {
  constructor() {
    super(ErrorCodes.QUESTION_CREATION_FAILED);
  }
}
