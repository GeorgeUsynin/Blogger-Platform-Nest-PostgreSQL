import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Device } from '../domain/device.entity';
@Injectable()
export class DevicesRepository {
  constructor(
    @InjectRepository(Device) private devicesRepository: Repository<Device>,
  ) {}

  async findByDeviceId(deviceId: string): Promise<Device | null> {
    return this.devicesRepository.findOneBy({ deviceId });
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

  async saveDevice(device: Device): Promise<void> {
    await this.devicesRepository.save(device);
  }
}
