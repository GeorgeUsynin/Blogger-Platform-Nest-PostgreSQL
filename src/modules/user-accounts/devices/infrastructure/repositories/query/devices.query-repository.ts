import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeviceQueryModel } from './model/device.query-model';
import { DeviceEntity } from '../../entities/device.entity';

@Injectable()
export class DevicesQueryRepository {
  constructor(
    @InjectRepository(DeviceEntity)
    private devicesRepository: Repository<DeviceEntity>,
  ) {}

  async getAllByUserId(userId: number): Promise<DeviceQueryModel[]> {
    const devices = await this.devicesRepository.find({
      where: { userId },
      select: {
        clientIp: true,
        deviceId: true,
        issuedAt: true,
        deviceName: true,
      },
    });

    return devices.map((device) => ({
      clientIp: device.clientIp,
      deviceId: device.deviceId,
      issuedAt: device.issuedAt,
      deviceName: device.deviceName,
    }));
  }
}
