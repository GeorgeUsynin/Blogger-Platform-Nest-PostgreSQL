import { BaseDomainException } from '../../../../../core/exceptions';
import { ErrorCodes } from '../../../../../core/exceptions/constants';

export class NotAnOwnerOfThisDeviceDomainError extends BaseDomainException {
  constructor() {
    super(ErrorCodes.NOT_AN_OWNER_OF_THIS_DEVICE);
  }
}
