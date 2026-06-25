import { BaseDomainException } from '../../../../../core/exceptions';
import { ErrorCodes } from '../../../../../core/exceptions/constants';

export class GameIsNotActiveDomainError extends BaseDomainException {
  constructor() {
    super(ErrorCodes.GAME_IS_NOT_ACTIVE);
  }
}
