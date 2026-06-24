import { ErrorCodes } from '../constants';
import { BaseDomainException } from './BaseDomainException';

export class GameConnectionCreationFailedError extends BaseDomainException {
  constructor() {
    super(ErrorCodes.GAME_CONNECTION_CREATION_FAILED);
  }
}
