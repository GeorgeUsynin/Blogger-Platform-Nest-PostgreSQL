import { Injectable } from '@nestjs/common';
import { GetUsersQueryParamsInputDto } from '../../api/dto';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { TUserDB, WithTotalCount } from '../types';
import { UserSortByFields } from '../../api/dto/input-dto/user-sort-by-fields';
import { SortDirection } from '../../../../../core/dto/base.query-params.input-dto';

@Injectable()
export class UsersQueryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async getAllUsers(
    query: GetUsersQueryParamsInputDto,
  ): Promise<{ items: TUserDB[]; totalCount: number }> {
    const {
      sortBy,
      sortDirection,
      pageSize,
      searchEmailTerm,
      searchLoginTerm,
    } = query;

    const safeSortBy = Object.values(UserSortByFields).includes(sortBy)
      ? sortBy
      : UserSortByFields.CreatedAt;
    const safeSortDirection = Object.values(SortDirection).includes(
      sortDirection,
    )
      ? sortDirection.toUpperCase()
      : SortDirection.Asc.toUpperCase();

    const sqlQuery = `
      SELECT U.*, COUNT(*) OVER() as "TotalCount" 
      FROM public."Users" U
      WHERE (U.LOGIN ILIKE $1 OR U.EMAIL ILIKE $2)
      AND U."isDeleted" = FALSE
      ORDER BY "${safeSortBy}" ${safeSortDirection}
      LIMIT $3 OFFSET $4
    `;

    const rows = await this.dataSource.query<WithTotalCount<TUserDB>[]>(
      sqlQuery,
      [
        `%${searchLoginTerm}%`,
        `%${searchEmailTerm}%`,
        pageSize,
        query.calculateSkip(),
      ],
    );

    return {
      items: rows,
      totalCount: rows.length > 0 ? Number(rows[0].TotalCount) : 0,
    };
  }

  async getUserById(id: number): Promise<TUserDB | null> {
    const query = `
          SELECT * FROM PUBLIC."Users" U
          WHERE U.ID = $1 AND U."isDeleted" = FALSE
          `;

    const rows = await this.dataSource.query<TUserDB>(query, [id]);

    return rows[0] ?? null;
  }
}
