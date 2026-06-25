import { ErrorCodes } from '../constants';
import { BaseDomainException } from './BaseDomainException';

export class GameIsNotActiveError extends BaseDomainException {
  constructor() {
    super(ErrorCodes.GAME_IS_NOT_ACTIVE);
  }
}
