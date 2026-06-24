import { ErrorCodes } from '../constants';
import { BaseDomainException } from './BaseDomainException';

export class AlreadyParticipatingInActiveGame extends BaseDomainException {
  constructor() {
    super(ErrorCodes.USER_ALREADY_HAS_ACTIVE_GAME);
  }
}
