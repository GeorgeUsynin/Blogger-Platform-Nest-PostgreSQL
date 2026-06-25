import { ErrorCodes } from '../constants';
import { BaseDomainException } from './BaseDomainException';

export class AnswerCreationFailedError extends BaseDomainException {
  constructor() {
    super(ErrorCodes.ANSWER_CREATION_FAILED);
  }
}
