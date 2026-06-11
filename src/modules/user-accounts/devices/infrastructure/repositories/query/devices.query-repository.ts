import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeviceQueryModel } from './model';
import { DeviceEntity } from '../../entities';

@Injectable()
export class DevicesQueryRepository {
  constructor(
    @InjectRepository(DeviceEntity)
    private devicesRepository: Repository<DeviceEntity>,
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
