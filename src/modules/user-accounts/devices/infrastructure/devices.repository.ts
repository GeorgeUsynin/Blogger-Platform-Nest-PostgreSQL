import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TDeviceDB } from './types';
import {
  CreateDeviceRepositoryDto,
  UpdateDeviceAttributesRepositoryDto,
} from './dto';

@Injectable()
export class DevicesRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async findByDeviceId(id: string): Promise<TDeviceDB | null> {
    const query = `
          SELECT * FROM PUBLIC."Devices" D
          WHERE D."deviceId" = $1
          `;

    const rows = await this.dataSource.query<TDeviceDB[]>(query, [id]);

    return rows[0] ?? null;
  }

  async createDevice(dto: CreateDeviceRepositoryDto): Promise<void> {
    const { deviceId, userId, issuedAt, deviceName, clientIp, expiresIn } = dto;

    const query = `
        INSERT INTO
          PUBLIC."Devices" (
            "deviceId",
            "userId",
            "issuedAt",
            "deviceName",
            "clientIp",
            "expiresIn"
          )
        VALUES
          ($1, $2, $3, $4, $5, $6)
      `;

    await this.dataSource.query(query, [
      deviceId,
      userId,
      issuedAt,
      deviceName,
      clientIp,
      expiresIn,
    ]);
  }

  async updateDeviceAttributes(
    dto: UpdateDeviceAttributesRepositoryDto,
  ): Promise<void> {
    const { deviceId, issuedAt, expiresIn } = dto;

    const query = `
          UPDATE public."Devices" D
          SET "issuedAt" = $1, "expiresIn" = $2
          WHERE D."deviceId" = $3
          `;

    await this.dataSource.query(query, [issuedAt, expiresIn, deviceId]);
  }

  async removeByDeviceId(id: string): Promise<void> {
    const query = `
          DELETE FROM public."Devices" D
	        WHERE D."deviceId" = $1
          `;

    await this.dataSource.query(query, [id]);
  }

  async removeAllDevicesExceptCurrent(
    deviceId: string,
    userId: number,
  ): Promise<void> {
    const query = `
          DELETE FROM public."Devices" D
	        WHERE D."userId" = $1 AND D."deviceId" <> $2
          `;

    await this.dataSource.query(query, [userId, deviceId]);
  }
}
