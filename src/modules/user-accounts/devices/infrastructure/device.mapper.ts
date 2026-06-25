import { Device } from '../domain';
import { DeviceEntity } from './entities/device.entity';

export class DeviceMapper {
  static toDomain(entity: DeviceEntity): Device {
    return Device.reconstruct({
      deviceId: entity.deviceId,
      userId: entity.userId,
      clientIp: entity.clientIp,
      deviceName: entity.deviceName,
      issuedAt: entity.issuedAt,
      expiresIn: entity.expiresIn,
    });
  }

  static toPersistence(device: Device): DeviceEntity {
    const entity = new DeviceEntity();

    entity.deviceId = device.deviceId;
    entity.userId = device.userId;
    entity.clientIp = device.clientIp;
    entity.deviceName = device.deviceName;
    entity.issuedAt = device.issuedAt;
    entity.expiresIn = device.expiresIn;

    return entity;
  }
}
