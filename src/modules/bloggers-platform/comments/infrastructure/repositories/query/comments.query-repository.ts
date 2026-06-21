import { Injectable } from '@nestjs/common';
import { GetCommentsQueryParamsInputDto } from '../../../api/dto';
import { CommentQueryModel } from './model';
import { LikeStatus } from '../../../../likes/domain';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CommentSortByFields } from '../../../api/dto/input-dto/comment-sort-by-fields';
import { SortDirection } from '../../../../../../core/dto/base.query-params.input-dto';
import { CommentEntity } from '../../entities';
import { CommentLikeEntity } from '../../../../likes/infrastructure/entities/comment-like.entity';

type FindCommentsFilter = Partial<Pick<CommentEntity, 'postId'>>;

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectRepository(CommentEntity)
    private commentsRepo: Repository<CommentEntity>,
  ) {}

  async getAllCommentsByPostId(
    postId: number,
    query: GetCommentsQueryParamsInputDto,
    userId: number | null,
  ): Promise<{ items: CommentQueryModel[]; totalCount: number }> {
    return this.findManyWithFilter(query, { postId }, userId);
  }

  private async findManyWithFilter(
    query: GetCommentsQueryParamsInputDto,
    filter: FindCommentsFilter = {},
    userId: number | null,
  ): Promise<{ items: CommentQueryModel[]; totalCount: number }> {
    const { sortBy, sortDirection, pageSize } = query;

    const safeSortBy = Object.values(CommentSortByFields).includes(sortBy)
      ? sortBy
      : CommentSortByFields.CreatedAt;
    const safeSortDirection = Object.values(SortDirection).includes(
      sortDirection,
    )
      ? sortDirection.toUpperCase()
      : SortDirection.Desc.toUpperCase();

    const qb = this.getCommentWithLikesBuilder(userId);

    if (filter.postId) {
      qb.where('c."postId" = :postId', { postId: filter.postId });
    }

    qb.orderBy(`"${safeSortBy}"`, safeSortDirection as 'ASC' | 'DESC')
      .offset(query.calculateSkip())
      .limit(pageSize);

    const [rawCommentItems, totalCount] = await Promise.all([
      qb.getRawMany<CommentQueryModel>(),
      qb.getCount(),
    ]);

    return {
      items: rawCommentItems,
      totalCount,
    };
  }

  async getCommentById(
    id: number,
    userId: number | null = null,
  ): Promise<CommentQueryModel | null> {
    const rawComment = await this.getCommentWithLikesBuilder(userId)
      .where('c.id = :commentId', { commentId: id })
      .getRawOne<CommentQueryModel>();

    if (!rawComment) return null;

    return rawComment;
  }

  private getCommentWithLikesBuilder(userId: number | null = null) {
    return this.commentsRepo
      .createQueryBuilder('c')
      .select([
        'c.id AS id',
        'c."authorId" AS "authorId"',
        'c."postId" AS "postId"',
        'c.content AS content',
        'c."createdAt" AS "createdAt"',
        'u.login AS "authorLogin"',
        'COALESCE(l."likesCount", 0)::int as "likesCount"',
        'COALESCE(l."dislikesCount", 0)::int as "dislikesCount"',
        'ml."likeStatus" as "myStatus"',
      ])
      .leftJoin('c.user', 'u')
      .leftJoin(
        (subQuery: SelectQueryBuilder<CommentLikeEntity>) =>
          subQuery
            .select('cl."parentId"', 'parentId')
            .addSelect(
              `COUNT(*) FILTER (WHERE cl."likeStatus" = :like)`,
              'likesCount',
            )
            .addSelect(
              `COUNT(*) FILTER (WHERE cl."likeStatus" = :dislike)`,
              'dislikesCount',
            )
            .from(CommentLikeEntity, 'cl')
            .groupBy('cl."parentId"'),
        'l',
        'l."parentId" = c.id',
      )
      .leftJoin(
        CommentLikeEntity,
        'ml',
        'ml."parentId" = c.id AND ml."authorId" = :authorId',
      )
      .setParameters({
        authorId: userId,
        like: LikeStatus.Like,
        dislike: LikeStatus.Dislike,
      });
  }
}
