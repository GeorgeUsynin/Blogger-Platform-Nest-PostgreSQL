import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CreatePasswordRecoveryRepositoryDto } from './dto';

@Injectable()
export class PasswordRecoveriesRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async createForUser(dto: CreatePasswordRecoveryRepositoryDto): Promise<void> {
    const { userId, recoveryCode, expirationDate } = dto;

    const query = `
        INSERT INTO public."PasswordRecoveries" ("userId", "recoveryCode", "expirationDate")
        VALUES ($1, $2, $3)
        ON CONFLICT ("userId")
        DO UPDATE SET
        "recoveryCode" = EXCLUDED."recoveryCode",
        "expirationDate" = EXCLUDED."expirationDate";
        `;

    await this.dataSource.query(query, [userId, recoveryCode, expirationDate]);
  }

  async clearPasswordRecoveryCode(code: string): Promise<void> {
    const query = `
    DELETE FROM public."PasswordRecoveries" pr
    WHERE pr."recoveryCode" = $1
    `;

    await this.dataSource.query(query, [code]);
  }
}
