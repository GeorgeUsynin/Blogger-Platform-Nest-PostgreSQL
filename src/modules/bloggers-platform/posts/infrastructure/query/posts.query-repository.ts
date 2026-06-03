import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { GetPostsQueryParamsInputDto } from '../../api/dto';
import { PostReadDto, TNewestLike, WithParentId } from './dto';
import { LikeStatus } from '../../../likes/domain';
import { PostSortByFields } from '../../api/dto/input-dto/posts-sort-by-fields';
import { SortDirection } from '../../../../../core/dto/base.query-params.input-dto';
import { TPostDB, WithBlogName, WithTotalCount } from '../types';

type FindPostsFilter = Partial<Pick<TPostDB, 'blogId'>>;

const newestLikesLimit = 3;

@Injectable()
export class PostsQueryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async getAllPosts(
    query: GetPostsQueryParamsInputDto,
    userId: number | null,
  ): Promise<{ items: PostReadDto[]; totalCount: number }> {
    return this.findManyWithFilter(query, {}, userId);
  }

  async getAllPostsByBlogId(
    blogId: number,
    query: GetPostsQueryParamsInputDto,
    userId: number | null,
  ): Promise<{ items: PostReadDto[]; totalCount: number }> {
    return this.findManyWithFilter(query, { blogId }, userId);
  }

  private async findManyWithFilter(
    query: GetPostsQueryParamsInputDto,
    filter: FindPostsFilter = {},
    userId: number | null,
  ): Promise<{ items: PostReadDto[]; totalCount: number }> {
    const { sortBy, sortDirection, pageSize } = query;

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
          COUNT(*) OVER()::int as "TotalCount",
          COALESCE(L."likesCount", 0)::int as "likesCount",
          COALESCE(L."dislikesCount", 0)::int as "dislikesCount",
          ML."likeStatus" as "myStatus"

          FROM public."Posts" P
          JOIN public."Blogs" B
          ON P."blogId" = B.ID

          LEFT JOIN (
          SELECT
          "parentId",
          COUNT(*) FILTER(WHERE PL."likeStatus" = $1) as "likesCount",
          COUNT(*) FILTER(WHERE PL."likeStatus" = $2) as "dislikesCount"
          FROM public."PostLikes" PL
          GROUP BY "parentId"
          ) L
          ON L."parentId" = P.ID

          LEFT JOIN public."PostLikes" ML
          ON ML."parentId" = P.ID
          AND ML."authorId" = $3

          WHERE P."blogId" = $4 AND P."isDeleted" = FALSE
          ORDER BY "${safeSortBy}" ${safeSortDirection}
          LIMIT $5 OFFSET $6
      `;
      params = [
        LikeStatus.Like,
        LikeStatus.Dislike,
        userId,
        filter.blogId,
        pageSize,
        query.calculateSkip(),
      ];
    } else {
      // GOOD TO KNOW
      // COUNT(*) OVER() counts rows after WHERE, but before LIMIT/OFFSET !
      sqlQuery = `
          SELECT P.*, B."name" as "blogName",
          COUNT(*) OVER()::int as "TotalCount",
          COALESCE(L."likesCount", 0)::int as "likesCount",
          COALESCE(L."dislikesCount", 0)::int as "dislikesCount",
          ML."likeStatus" as "myStatus"

          FROM public."Posts" P
          JOIN public."Blogs" B
          ON P."blogId" = B.ID

          LEFT JOIN (
          SELECT
          "parentId",
          COUNT(*) FILTER(WHERE PL."likeStatus" = $1) as "likesCount",
          COUNT(*) FILTER(WHERE PL."likeStatus" = $2) as "dislikesCount"
          FROM public."PostLikes" PL
          GROUP BY "parentId"
          ) L
          ON L."parentId" = P.ID

          LEFT JOIN public."PostLikes" ML
          ON ML."parentId" = P.ID
          AND ML."authorId" = $3

          WHERE P."isDeleted" = FALSE
          ORDER BY "${safeSortBy}" ${safeSortDirection}
          LIMIT $4 OFFSET $5
      `;
      params = [
        LikeStatus.Like,
        LikeStatus.Dislike,
        userId,
        pageSize,
        query.calculateSkip(),
      ];
    }

    const rows = await this.dataSource.query<
      WithTotalCount<WithBlogName<Omit<PostReadDto, 'newestLikes'>>>[]
    >(sqlQuery, params);

    let newestLikesMap = new Map<number, TNewestLike[]>();

    if (rows.length > 0) {
      const postIds = rows.map((post) => post.id);

      const newestLikesQuery = `
      WITH ranked AS (
      SELECT PL."parentId", PL."createdAt", PL."authorId", U."login" as "authorLogin",
      ROW_NUMBER() OVER(PARTITION BY PL."parentId" ORDER BY PL."parentId" ASC, PL."createdAt" DESC) as rn
      
      FROM public."PostLikes" PL
      JOIN public."Users" U
      ON U.ID = PL."authorId"

      WHERE PL."parentId" = ANY($1) AND PL."likeStatus" = $2
      )
      SELECT "parentId", "createdAt", "authorId", "authorLogin" FROM ranked
      WHERE rn <= $3;
    `;

      const newestLikesRows = await this.dataSource.query<
        WithParentId<TNewestLike>[]
      >(newestLikesQuery, [postIds, LikeStatus.Like, newestLikesLimit]);

      newestLikesRows.forEach((like) => {
        const newestLike: TNewestLike = {
          createdAt: like.createdAt,
          authorId: like.authorId,
          authorLogin: like.authorLogin,
        };

        if (!newestLikesMap.has(like.parentId)) {
          newestLikesMap.set(like.parentId, [newestLike]);
        } else {
          newestLikesMap.get(like.parentId)!.push(newestLike);
        }
      });
    }

    return {
      items: rows.map((post) => {
        return {
          ...post,
          newestLikes: newestLikesMap.get(post.id) ?? [],
        };
      }),
      totalCount: rows.length > 0 ? rows[0].TotalCount : 0,
    };
  }

  async getPostById(
    id: number,
    userId: number | null = null,
  ): Promise<PostReadDto | null> {
    const query = `
      SELECT P.*, B."name" as "blogName",
      COALESCE(L."likesCount", 0)::int as "likesCount",
      COALESCE(L."dislikesCount", 0)::int as "dislikesCount",
      ML."likeStatus" as "myStatus"

      FROM public."Posts" P
      JOIN public."Blogs" B
      ON P."blogId" = B.ID

      LEFT JOIN (
      SELECT
      "parentId",
      COUNT(*) FILTER(WHERE PL."likeStatus" = $1) as "likesCount",
      COUNT(*) FILTER(WHERE PL."likeStatus" = $2) as "dislikesCount"
      FROM public."PostLikes" PL
      GROUP BY "parentId"
      ) L
      ON L."parentId" = P.ID

      LEFT JOIN public."PostLikes" ML
      ON ML."parentId" = P.ID
      AND ML."authorId" = $3

      WHERE P.ID = $4 AND P."isDeleted" = FALSE
      `;

    const rows = await this.dataSource.query<
      WithBlogName<Omit<PostReadDto, 'newestLikes'>>[]
    >(query, [LikeStatus.Like, LikeStatus.Dislike, userId, id]);

    let newestLikesRows: TNewestLike[] = [];

    // if there is no post, we don't need to search for newest likes
    if (rows[0]) {
      const newestLikesQuery = `
      SELECT PL."createdAt", PL."authorId", U."login" as "authorLogin"
      
      FROM public."PostLikes" PL
      JOIN public."Users" U
      ON U.ID = PL."authorId"

      WHERE PL."parentId" = $1 AND PL."likeStatus" = $2
      ORDER BY PL."createdAt" DESC
      LIMIT $3
    `;

      newestLikesRows = await this.dataSource.query<TNewestLike[]>(
        newestLikesQuery,
        [id, LikeStatus.Like, newestLikesLimit],
      );
    }

    return rows[0]
      ? {
          ...rows[0],
          newestLikes: newestLikesRows,
        }
      : null;
  }
}
