import { BaseDomainException } from '../../../../../core/exceptions';
import { ErrorCodes } from '../../../../../core/exceptions/constants';

export class PlayerNotInGameDomainError extends BaseDomainException {
  constructor() {
    super(ErrorCodes.PLAYER_NOT_IN_GAME);
  }
}
