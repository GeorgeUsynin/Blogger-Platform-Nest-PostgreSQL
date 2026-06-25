import { ErrorCodes } from '../constants';
import { BaseDomainException } from './BaseDomainException';

export class GameNotAcceptingPlayersError extends BaseDomainException {
  constructor() {
    super(ErrorCodes.GAME_NOT_ACCEPTING_PLAYERS);
  }
}
