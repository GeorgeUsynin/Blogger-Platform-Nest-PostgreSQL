import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TDeviceDB } from '../types';

@Injectable()
export class DevicesQueryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async getAllByUserId(userId: number): Promise<TDeviceDB[]> {
    const query = `
              SELECT * FROM PUBLIC."Devices" D
              WHERE D."userId" = $1
              `;

    const rows = await this.dataSource.query<TDeviceDB[]>(query, [userId]);

    return rows;
  }
}
