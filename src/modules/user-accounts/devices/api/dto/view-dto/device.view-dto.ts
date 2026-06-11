import { ApiProperty } from '@nestjs/swagger';
import { DeviceQueryModel } from '../../../infrastructure/query/model';

export class DeviceViewDto {
  @ApiProperty()
  ip: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ type: Date })
  lastActiveDate: Date;

  @ApiProperty()
  deviceId: string;

  public static mapToView(device: DeviceQueryModel): DeviceViewDto {
    const dto = new DeviceViewDto();

    dto.ip = device.clientIp;
    dto.title = device.deviceName;
    dto.lastActiveDate = device.issuedAt;
    dto.deviceId = device.deviceId;

    return dto;
  }
}
