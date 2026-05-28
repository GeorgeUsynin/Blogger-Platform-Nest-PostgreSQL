import { ApiProperty } from '@nestjs/swagger';
import { TDeviceDB } from '../../../infrastructure/types';

export class DeviceViewDto {
  @ApiProperty()
  ip: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ type: Date })
  lastActiveDate: Date;

  @ApiProperty()
  deviceId: string;

  public static mapToView(device: TDeviceDB): DeviceViewDto {
    const dto = new DeviceViewDto();

    dto.ip = device.clientIp;
    dto.title = device.deviceName;
    dto.lastActiveDate = device.issuedAt;
    dto.deviceId = device.deviceId;

    return dto;
  }
}
