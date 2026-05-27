import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TEmailConfirmationDB, TPasswordRecoveryDB, TUserDB } from './types';
import { CreateUserRepositoryDto, DeleteUserRepositoryDto } from './dto';

@Injectable()
export class UsersRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async findById(id: number): Promise<TUserDB | null> {
    const query = `
      SELECT * FROM PUBLIC."Users" U
      WHERE U.ID = $1 AND U."isDeleted" = FALSE
      `;

    const rows = await this.dataSource.query<TUserDB[]>(query, [id]);

    return rows[0] ?? null;
  }

  async findUserByLogin(login: string): Promise<TUserDB | null> {
    const query = `
      SELECT * FROM PUBLIC."Users" U
      WHERE U.LOGIN = $1 AND U."isDeleted" = FALSE
      `;

    const rows = await this.dataSource.query<TUserDB[]>(query, [login]);

    return rows[0] ?? null;
  }

  async findUserByEmail(email: string): Promise<TUserDB | null> {
    const query = `
      SELECT * FROM PUBLIC."Users" U
      WHERE U.EMAIL = $1 AND U."isDeleted" = FALSE
      `;

    const rows = await this.dataSource.query<TUserDB[]>(query, [email]);

    return rows[0] ?? null;
  }

  async findUserByLoginOrEmail(loginOrEmail: string): Promise<TUserDB | null> {
    const query = `
      SELECT * FROM PUBLIC."Users" U
      WHERE (U.LOGIN = $1 OR U.EMAIL = $1) AND U."isDeleted" = FALSE
      `;

    const rows = await this.dataSource.query<TUserDB[]>(query, [loginOrEmail]);

    return rows[0] ?? null;
  }

  async findUserByPasswordRecoveryCode(
    code: string,
  ): Promise<(TUserDB & TPasswordRecoveryDB) | null> {
    const query = `
      SELECT U.*, PR.* FROM PUBLIC."Users" U
      LEFT JOIN PUBLIC."PasswordRecoveries" PR
      ON PR."userId" = U.ID
      WHERE PR."recoveryCode" = $1 AND U."isDeleted" = FALSE
      `;

    const rows = await this.dataSource.query<(TUserDB & TPasswordRecoveryDB)[]>(
      query,
      [code],
    );

    return rows[0] ?? null;
  }

  async findUserByConfirmationCode(
    code: string,
  ): Promise<(TUserDB & TEmailConfirmationDB) | null> {
    const query = `
      SELECT U.*, EC.* FROM PUBLIC."Users" U
      LEFT JOIN PUBLIC."EmailConfirmations" EC
      ON EC."userId" = U.ID
      WHERE EC."confirmationCode" = $1 AND U."isDeleted" = FALSE
      `;

    const rows = await this.dataSource.query<
      (TUserDB & TEmailConfirmationDB)[]
    >(query, [code]);

    return rows[0] ?? null;
  }

  async createUser(dto: CreateUserRepositoryDto): Promise<number | null> {
    const { login, passwordHash, email, createdAt, updatedAt } = dto;

    const query = `
      INSERT INTO
        PUBLIC."Users" (
          LOGIN,
          "passwordHash",
          EMAIL,
          "createdAt",
          "updatedAt"
        )
      VALUES
        ($1, $2, $3, $4, $5)
      RETURNING ID
    `;

    const rows = await this.dataSource.query<TUserDB[]>(query, [
      login,
      passwordHash,
      email,
      createdAt,
      updatedAt,
    ]);

    return rows[0].id ?? null;
  }

  async updateUserPasswordHash(
    userId: number,
    passwordHash: string,
  ): Promise<void> {
    const query = `
      UPDATE PUBLIC."Users" U
      SET "passwordHash" = $1
      WHERE U.ID = $2
    `;

    await this.dataSource.query(query, [passwordHash, userId]);
  }

  async deleteUser(dto: DeleteUserRepositoryDto): Promise<void> {
    const { id, isDeleted, deletedAt, updatedAt } = dto;

    const query = `
      UPDATE public."Users" U
	    SET "isDeleted" = $1, "deletedAt" = $2, "updatedAt" = $3
      WHERE U.ID = $4
      `;

    await this.dataSource.query(query, [isDeleted, deletedAt, updatedAt, id]);
  }
}
