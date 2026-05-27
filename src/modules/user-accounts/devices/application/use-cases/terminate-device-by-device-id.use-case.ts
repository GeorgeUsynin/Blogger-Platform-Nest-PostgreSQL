import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DevicesRepository } from '../../infrastructure';
import {
  DeviceNotFoundError,
  NotAnOwnerOfThisDevice,
} from '../../../../../core/exceptions';

export class TerminateDeviceByDeviceIdCommand {
  constructor(
    public readonly deviceId: string,
    public readonly userId: number,
  ) {}
}

@CommandHandler(TerminateDeviceByDeviceIdCommand)
export class TerminateDeviceByDeviceIdUseCase implements ICommandHandler<TerminateDeviceByDeviceIdCommand> {
  constructor(private devicesRepository: DevicesRepository) {}

  async execute({
    deviceId,
    userId,
  }: TerminateDeviceByDeviceIdCommand): Promise<void> {
    const foundDevice = await this.devicesRepository.findByDeviceId(deviceId);

    if (!foundDevice) {
      throw new DeviceNotFoundError();
    }

    const isDeviceOwner = foundDevice.userId === userId;

    if (!isDeviceOwner) {
      throw new NotAnOwnerOfThisDevice();
    }

    await this.devicesRepository.removeByDeviceId(deviceId);
  }
}
