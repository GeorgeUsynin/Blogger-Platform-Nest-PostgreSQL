import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Device } from '../../domain/device.entity';
import { DeviceQueryModel } from './model';

@Injectable()
export class DevicesQueryRepository {
  constructor(
    @InjectRepository(Device) private devicesRepository: Repository<Device>,
  ) {}

  async getAllByUserId(userId: number): Promise<DeviceQueryModel[]> {
    const devices = this.devicesRepository.find({
      where: { userId },
      select: {
        clientIp: true,
        deviceId: true,
        issuedAt: true,
        deviceName: true,
      },
    });

    return devices;
  }
}
