import { ErrorCodes } from '../constants';
import { BaseDomainException } from './BaseDomainException';

export class PlayerNotInGameError extends BaseDomainException {
  constructor() {
    super(ErrorCodes.PLAYER_NOT_IN_GAME);
  }
}
