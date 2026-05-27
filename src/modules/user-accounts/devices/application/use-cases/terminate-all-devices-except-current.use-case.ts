import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DevicesRepository } from '../../infrastructure';

export class TerminateAllDevicesExceptCurrentCommand {
  constructor(
    public readonly deviceId: string,
    public readonly userId: number,
  ) {}
}

@CommandHandler(TerminateAllDevicesExceptCurrentCommand)
export class TerminateAllDevicesExceptCurrentUseCase implements ICommandHandler<TerminateAllDevicesExceptCurrentCommand> {
  constructor(private devicesRepository: DevicesRepository) {}

  async execute({
    deviceId,
    userId,
  }: TerminateAllDevicesExceptCurrentCommand): Promise<void> {
    await this.devicesRepository.removeAllDevicesExceptCurrent(
      deviceId,
      userId,
    );
  }
}
