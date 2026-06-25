import { ErrorCodes } from '../constants';
import { BaseDomainException } from './BaseDomainException';

export class NotParticipatingInActiveGameError extends BaseDomainException {
  constructor() {
    super(ErrorCodes.NOT_PARTICIPATING_IN_ACTIVE_GAME);
  }
}
