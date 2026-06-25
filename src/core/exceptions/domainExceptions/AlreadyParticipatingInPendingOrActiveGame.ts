import { ErrorCodes } from '../constants';
import { BaseDomainException } from './BaseDomainException';

export class AlreadyParticipatingInPendingOrActiveGame extends BaseDomainException {
  constructor() {
    super(ErrorCodes.USER_ALREADY_HAS_PENDING_OR_ACTIVE_GAME);
  }
}
