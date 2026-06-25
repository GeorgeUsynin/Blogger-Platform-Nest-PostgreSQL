import { ErrorCodes } from '../constants';
import { BaseDomainException } from './BaseDomainException';

export class AllQuestionsAlreadyAnsweredError extends BaseDomainException {
  constructor() {
    super(ErrorCodes.ALL_QUESTIONS_ALREADY_ANSWERED);
  }
}
