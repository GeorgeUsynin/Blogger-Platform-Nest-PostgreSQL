import { Injectable } from '@nestjs/common';
import { GetCommentsQueryParamsInputDto } from '../../api/dto';
import { CommentReadDto } from './dto';
import { LikeStatus } from '../../../likes/domain';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CommentSortByFields } from '../../api/dto/input-dto/comment-sort-by-fields';
import { SortDirection } from '../../../../../core/dto/base.query-params.input-dto';
import { TCommentDB, WithTotalCount } from '../types';

type FindCommentsFilter = Partial<Pick<TCommentDB, 'postId'>>;

@Injectable()
export class CommentsQueryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async getAllCommentsByPostId(
    postId: number,
    query: GetCommentsQueryParamsInputDto,
    userId: number | null,
  ): Promise<{ items: CommentReadDto[]; totalCount: number }> {
    return this.findManyWithFilter(query, { postId }, userId);
  }

  private async findManyWithFilter(
    query: GetCommentsQueryParamsInputDto,
    filter: FindCommentsFilter = {},
    userId: number | null,
  ): Promise<{ items: CommentReadDto[]; totalCount: number }> {
    const { sortBy, sortDirection, pageSize } = query;

    const safeSortBy = Object.values(CommentSortByFields).includes(sortBy)
      ? sortBy
      : CommentSortByFields.CreatedAt;
    const safeSortDirection = Object.values(SortDirection).includes(
      sortDirection,
    )
      ? sortDirection.toUpperCase()
      : SortDirection.Asc.toUpperCase();

    let sqlQuery: string;
    let params: Array<unknown>;

    if (filter.postId) {
      sqlQuery = `
        SELECT C.*, U."login" as "authorLogin",
        COALESCE(L."likesCount", 0)::int as "likesCount",
        COALESCE(L."dislikesCount", 0)::int as "dislikesCount",
        ML."likeStatus" as "myStatus",
        COUNT(*) OVER()::int as "TotalCount"

        FROM public."Comments" C
        JOIN public."Users" U
        ON U.ID = C."authorId" 

        LEFT JOIN (
        SELECT
        "parentId",
        COUNT(*) FILTER(WHERE CL."likeStatus" = $1) as "likesCount",
        COUNT(*) FILTER(WHERE CL."likeStatus" = $2) as "dislikesCount"
        FROM public."CommentLikes" CL
        GROUP BY "parentId"
        ) L
        ON L."parentId" = C.ID

        LEFT JOIN public."CommentLikes" ML
        ON ML."parentId" = C.ID
        AND ML."authorId" = $3

        WHERE C."postId" = $4 AND C."isDeleted" = FALSE

        ORDER BY "${safeSortBy}" ${safeSortDirection}
        LIMIT $5 OFFSET $6
      `;

      params = [
        LikeStatus.Like,
        LikeStatus.Dislike,
        userId,
        filter.postId,
        pageSize,
        query.calculateSkip(),
      ];
    } else {
      sqlQuery = `
        SELECT C.*, U."login" as "authorLogin",
        COALESCE(L."likesCount", 0)::int as "likesCount",
        COALESCE(L."dislikesCount", 0)::int as "dislikesCount",
        ML."likeStatus" as "myStatus",
        COUNT(*) OVER()::int as "TotalCount"

        FROM public."Comments" C
        JOIN public."Users" U
        ON U.ID = C."authorId" 

        LEFT JOIN (
        SELECT
        "parentId",
        COUNT(*) FILTER(WHERE CL."likeStatus" = $1) as "likesCount",
        COUNT(*) FILTER(WHERE CL."likeStatus" = $2) as "dislikesCount"
        FROM public."CommentLikes" CL
        GROUP BY "parentId"
        ) L
        ON L."parentId" = C.ID

        LEFT JOIN public."CommentLikes" ML
        ON ML."parentId" = C.ID
        AND ML."authorId" = $3

        WHERE C."isDeleted" = FALSE

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

    const rows = await this.dataSource.query<WithTotalCount<CommentReadDto>[]>(
      sqlQuery,
      params,
    );

    return {
      items: rows,
      totalCount: rows.length > 0 ? rows[0].TotalCount : 0,
    };
  }

  async getCommentById(
    id: number,
    userId: number | null = null,
  ): Promise<CommentReadDto | null> {
    const query = `
      SELECT C.*, U."login" as "authorLogin",
      COALESCE(L."likesCount", 0)::int as "likesCount",
      COALESCE(L."dislikesCount", 0)::int as "dislikesCount",
      ML."likeStatus" as "myStatus"

      FROM public."Comments" C
      JOIN public."Users" U
      ON U.ID = C."authorId" 

      LEFT JOIN (
      SELECT
      "parentId",
      COUNT(*) FILTER(WHERE CL."likeStatus" = $1) as "likesCount",
      COUNT(*) FILTER(WHERE CL."likeStatus" = $2) as "dislikesCount"
      FROM public."CommentLikes" CL
      GROUP BY "parentId"
      ) L
      ON L."parentId" = C.ID

      LEFT JOIN public."CommentLikes" ML
      ON ML."parentId" = C.ID
      AND ML."authorId" = $3

      WHERE C.ID = $4 AND C."isDeleted" = FALSE
    `;

    const rows = await this.dataSource.query<CommentReadDto[]>(query, [
      LikeStatus.Like,
      LikeStatus.Dislike,
      userId,
      id,
    ]);

    return rows[0] ?? null;
  }
}
