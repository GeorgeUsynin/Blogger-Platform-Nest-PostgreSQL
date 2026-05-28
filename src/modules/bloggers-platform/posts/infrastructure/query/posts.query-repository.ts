import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { GetPostsQueryParamsInputDto } from '../../api/dto';
import { PostReadDto } from './dto';
import { LikeStatus } from '../../../likes/domain';
import { PostSortByFields } from '../../api/dto/input-dto/posts-sort-by-fields';
import { SortDirection } from '../../../../../core/dto/base.query-params.input-dto';
import { TPostDB, WithBlogName, WithTotalCount } from '../types';

type FindPostsFilter = Partial<Pick<TPostDB, 'blogId'>>;

@Injectable()
export class PostsQueryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async getAllPosts(
    query: GetPostsQueryParamsInputDto,
    userId?: number,
  ): Promise<{ items: PostReadDto[]; totalCount: number }> {
    return this.findManyWithFilter(query, {}, userId);
  }

  async getAllPostsByBlogId(
    blogId: number,
    query: GetPostsQueryParamsInputDto,
    userId?: number,
  ): Promise<{ items: PostReadDto[]; totalCount: number }> {
    return this.findManyWithFilter(query, { blogId }, userId);
  }

  private async findManyWithFilter(
    query: GetPostsQueryParamsInputDto,
    filter: FindPostsFilter = {},
    userId?: number,
  ): Promise<{ items: PostReadDto[]; totalCount: number }> {
    const { sortBy, sortDirection, pageSize, pageNumber } = query;

    const safeSortBy = Object.values(PostSortByFields).includes(sortBy)
      ? sortBy
      : PostSortByFields.CreatedAt;
    const safeSortDirection = Object.values(SortDirection).includes(
      sortDirection,
    )
      ? sortDirection.toUpperCase()
      : SortDirection.Asc.toUpperCase();

    let sqlQuery: string;
    let params: Array<unknown>;

    if (filter.blogId) {
      // GOOD TO KNOW
      // COUNT(*) OVER() counts rows after WHERE, but before LIMIT/OFFSET !
      sqlQuery = `
          SELECT P.*, B."name" as "blogName",
          COUNT(*) OVER() as "TotalCount"
          FROM public."Posts" P
          JOIN public."Blogs" B
          ON P."blogId" = B.ID
          WHERE P."blogId" = $1 AND P."isDeleted" = FALSE
          ORDER BY "${safeSortBy}" ${safeSortDirection}
          LIMIT $2 OFFSET $3
      `;
      params = [filter.blogId, pageSize, query.calculateSkip()];
    } else {
      // GOOD TO KNOW
      // COUNT(*) OVER() counts rows after WHERE, but before LIMIT/OFFSET !
      sqlQuery = `
          SELECT P.*, B."name" as "blogName",
          COUNT(*) OVER() as "TotalCount"
          FROM public."Posts" P
          JOIN public."Blogs" B
          ON P."blogId" = B.ID
          WHERE P."isDeleted" = FALSE
          ORDER BY "${safeSortBy}" ${safeSortDirection}
          LIMIT $1 OFFSET $2
      `;
      params = [pageSize, query.calculateSkip()];
    }

    const rows = await this.dataSource.query<
      WithTotalCount<WithBlogName<TPostDB>>[]
    >(sqlQuery, params);

    return {
      items: rows.map((post) => ({
        ...post,
        likesCount: 0,
        dislikesCount: 0,
        myStatus: LikeStatus.None,
        newestLikes: [],
      })),
      totalCount: rows.length > 0 ? Number(rows[0].TotalCount) : 0,
    };
  }

  async getPostById(id: number, userId?: number): Promise<PostReadDto | null> {
    const query = `
          SELECT P.*, B."name" as "blogName" 
          FROM public."Posts" P
          JOIN public."Blogs" B
          ON P."blogId" = B.ID
          WHERE P.ID = $1 AND P."isDeleted" = FALSE 
        `;

    const rows = await this.dataSource.query<WithBlogName<TPostDB>[]>(query, [
      id,
    ]);

    return rows[0]
      ? {
          ...rows[0],
          likesCount: 0,
          dislikesCount: 0,
          myStatus: LikeStatus.None,
          newestLikes: [],
        }
      : null;
  }
}
