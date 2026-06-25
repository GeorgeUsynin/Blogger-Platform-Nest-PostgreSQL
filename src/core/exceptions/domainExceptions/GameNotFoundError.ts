import { ErrorCodes } from '../constants';
import { BaseDomainException } from './BaseDomainException';

export class GameNotFoundError extends BaseDomainException {
  constructor() {
    super(ErrorCodes.GAME_NOT_FOUND);
  }
}
