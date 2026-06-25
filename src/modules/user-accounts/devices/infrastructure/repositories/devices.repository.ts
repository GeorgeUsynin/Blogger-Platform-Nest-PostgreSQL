import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { DeviceEntity } from '../entities/device.entity';
import { DeviceMapper } from '../device.mapper';
import { Device } from '../../domain';

@Injectable()
export class DevicesRepository {
  constructor(
    @InjectRepository(DeviceEntity)
    private devicesRepository: Repository<DeviceEntity>,
  ) {}

  async findByDeviceId(deviceId: string): Promise<Device | null> {
    const entity = await this.devicesRepository.findOneBy({ deviceId });

    return this.mapToDomain(entity);
  }

  async deleteByDeviceId(id: string): Promise<void> {
    await this.devicesRepository.delete(id);
  }

  async removeAllDevicesExceptCurrent(
    deviceId: string,
    userId: number,
  ): Promise<void> {
    await this.devicesRepository.delete({ userId, deviceId: Not(deviceId) });
  }

  async saveDeviceAggregate(device: Device): Promise<void> {
    const entity = DeviceMapper.toPersistence(device);

    await this.devicesRepository.save(entity);
  }

  private mapToDomain(entity: DeviceEntity | null): Device | null {
    if (!entity) return null;

    return DeviceMapper.toDomain(entity);
  }
}
