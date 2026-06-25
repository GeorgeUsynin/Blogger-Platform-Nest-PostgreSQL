import { BaseDomainException } from '../../../../../core/exceptions';
import { ErrorCodes } from '../../../../../core/exceptions/constants';

export class GameNotAcceptingPlayersDomainError extends BaseDomainException {
  constructor() {
    super(ErrorCodes.GAME_NOT_ACCEPTING_PLAYERS);
  }
}
