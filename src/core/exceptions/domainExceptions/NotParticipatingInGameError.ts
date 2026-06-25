import { ErrorCodes } from '../constants';
import { BaseDomainException } from './BaseDomainException';

export class NotParticipatingInGameError extends BaseDomainException {
  constructor() {
    super(ErrorCodes.NOT_PARTICIPATING_IN_GAME);
  }
}
