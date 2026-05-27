import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import {
  CreateEmailConfirmationRepositoryDto,
  UpdateEmailConfirmationCodeAndDateRepositoryDto,
} from './dto';
import { TEmailConfirmationDB } from './types';

@Injectable()
export class EmailConfirmationsRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async createForUser(
    dto: CreateEmailConfirmationRepositoryDto,
  ): Promise<void> {
    const { userId, isConfirmed, confirmationCode, expirationDate } = dto;

    const query = `
          INSERT INTO
            PUBLIC."EmailConfirmations" (
          "userId",
		      "isConfirmed",
		      "confirmationCode",
		      "expirationDate"
            )
          VALUES
            ($1, $2, $3, $4);
        `;

    await this.dataSource.query(query, [
      userId,
      isConfirmed,
      confirmationCode,
      expirationDate,
    ]);
  }

  async findEmailConfirmationByUserId(
    userId: number,
  ): Promise<TEmailConfirmationDB | null> {
    const query = `
      SELECT * FROM PUBLIC."EmailConfirmations" EC
      WHERE EC."userId" = $1
    `;

    const rows = await this.dataSource.query<TEmailConfirmationDB[]>(query, [
      userId,
    ]);

    return rows[0] ?? null;
  }

  async updateEmailConfirmationStatus(
    userId: number,
    isConfirmed: boolean,
  ): Promise<void> {
    const query = `
      UPDATE PUBLIC."EmailConfirmations" EC
      SET "isConfirmed" = $1
      WHERE EC."userId" = $2
    `;

    await this.dataSource.query(query, [isConfirmed, userId]);
  }

  async updateEmailConfirmationCodeAndDate(
    dto: UpdateEmailConfirmationCodeAndDateRepositoryDto,
  ): Promise<void> {
    const { userId, confirmationCode, expirationDate } = dto;

    const query = `
      UPDATE PUBLIC."EmailConfirmations" EC
      SET "confirmationCode" = $1, "expirationDate" = $2
      WHERE EC."userId" = $3
    `;

    await this.dataSource.query(query, [
      confirmationCode,
      expirationDate,
      userId,
    ]);
  }
}
