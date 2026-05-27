import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TUserDB } from './types';

@Injectable()
export class UsersExternalRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async findById(id: number): Promise<TUserDB | null> {
    const query = `
        SELECT * FROM PUBLIC."Users" U
        WHERE U.ID = $1 AND U."isDeleted" = FALSE
        `;

    const rows = await this.dataSource.query<TUserDB[]>(query, [id]);

    return rows[0] ?? null;
  }
}
