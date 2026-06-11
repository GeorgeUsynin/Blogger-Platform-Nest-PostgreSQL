import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DevicesRepository } from '../../../devices/infrastructure';

export class LogoutUserCommand {
  constructor(public readonly deviceId: string) {}
}

@CommandHandler(LogoutUserCommand)
export class LogoutUserUseCase implements ICommandHandler<LogoutUserCommand> {
  constructor(private devicesRepository: DevicesRepository) {}

  async execute({ deviceId }: LogoutUserCommand): Promise<void> {
    await this.devicesRepository.deleteByDeviceId(deviceId);
  }
}
