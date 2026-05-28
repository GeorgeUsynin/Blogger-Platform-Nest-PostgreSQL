import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { GetBlogsQueryParamsInputDto } from '../../api/dto';
import { BlogSortByFields } from '../../api/dto/input-dto/blog-sort-by-fields';
import { SortDirection } from '../../../../../core/dto/base.query-params.input-dto';
import { TBlogDB, WithTotalCount } from '../types';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async getAllBlogs(
    query: GetBlogsQueryParamsInputDto,
  ): Promise<{ items: TBlogDB[]; totalCount: number }> {
    const { sortBy, sortDirection, pageSize, searchNameTerm } = query;

    const safeSortBy = Object.values(BlogSortByFields).includes(sortBy)
      ? sortBy
      : BlogSortByFields.CreatedAt;
    const safeSortDirection = Object.values(SortDirection).includes(
      sortDirection,
    )
      ? sortDirection.toUpperCase()
      : SortDirection.Asc.toUpperCase();

    const sqlQuery = `
          SELECT B.*, COUNT(*) OVER() as "TotalCount" 
          FROM public."Blogs" B
          WHERE B.NAME ILIKE $1 AND B."isDeleted" = FALSE
          ORDER BY "${safeSortBy}" ${safeSortDirection}
          LIMIT $2 OFFSET $3
        `;

    const rows = await this.dataSource.query<WithTotalCount<TBlogDB>[]>(
      sqlQuery,
      [`%${searchNameTerm}%`, pageSize, query.calculateSkip()],
    );

    return {
      items: rows,
      totalCount: rows.length > 0 ? Number(rows[0].TotalCount) : 0,
    };
  }

  async getBlogById(id: number): Promise<TBlogDB | null> {
    const query = `
      SELECT * FROM public."Blogs" B
      WHERE B.ID = $1 AND B."isDeleted" = FALSE 
    `;

    const rows = await this.dataSource.query<TBlogDB[]>(query, [id]);

    return rows[0] ?? null;
  }
}
