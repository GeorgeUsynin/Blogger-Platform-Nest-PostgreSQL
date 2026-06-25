import { AggregateRoot } from '@nestjs/cqrs';
import {
  CreateDeviceInput,
  DeviceState,
  ReconstructDeviceInput,
  UpdateSessionInput,
} from './types';
import { NotAnOwnerOfThisDeviceDomainError } from './domainErrors';

export class Device extends AggregateRoot {
  private constructor(private props: DeviceState) {
    super();
  }

  // ---------- factory ----------

  static create(input: CreateDeviceInput): Device {
    return new Device(input);
  }

  static reconstruct(input: ReconstructDeviceInput): Device {
    return new Device(input);
  }

  // ---------- domain logic ----------

  public updateSession(input: UpdateSessionInput): void {
    this.props.issuedAt = input.issuedAt;
    this.props.expiresIn = input.expiresIn;
  }

  // ---------- queries ----------

  public isDeviceOwner(userId: number): boolean {
    return this.userId === userId;
  }

  public isDeviceIssuedAtMatch(issuedAt: Date): boolean {
    return this.issuedAt.toISOString() === issuedAt.toISOString();
  }

  // ---------- guards ----------

  public ensureDeviceOwner(userId: number) {
    if (this.userId !== userId) {
      throw new NotAnOwnerOfThisDeviceDomainError();
    }
  }

  // ---------- getters ---------

  public get deviceId(): DeviceState['deviceId'] {
    return this.props.deviceId;
  }

  public get userId(): DeviceState['userId'] {
    return this.props.userId;
  }

  public get clientIp(): DeviceState['clientIp'] {
    return this.props.clientIp;
  }

  public get deviceName(): DeviceState['deviceName'] {
    return this.props.deviceName;
  }

  public get issuedAt(): DeviceState['issuedAt'] {
    return this.props.issuedAt;
  }

  public get expiresIn(): DeviceState['expiresIn'] {
    return this.props.expiresIn;
  }
}
