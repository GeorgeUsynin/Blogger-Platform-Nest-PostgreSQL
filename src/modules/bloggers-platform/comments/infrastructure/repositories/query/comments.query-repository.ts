import { Injectable } from '@nestjs/common';
import { GetCommentsQueryParamsInputDto } from '../../../api/dto';
import { CommentQueryModel } from './model';
import { LikeStatus } from '../../../../likes/domain';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentSortByFields } from '../../../api/dto/input-dto/comment-sort-by-fields';
import { SortDirection } from '../../../../../../core/dto/base.query-params.input-dto';
import { CommentEntity } from '../../entities';
import { RawComment } from './model/CommentQueryModel';

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
      : SortDirection.Asc.toUpperCase();

    const qb = this.commentsRepo
      .createQueryBuilder('c')
      .leftJoin('c.user', 'u');

    if (filter.postId) {
      qb.where('c."postId" = :postId', { postId: filter.postId });
    }

    qb.select([
      'c.id AS id',
      'c."authorId" AS "authorId"',
      'c."postId" AS "postId"',
      'c.content AS content',
      'c."createdAt" AS "createdAt"',
      'u.login AS "authorLogin"',
    ])
      .orderBy(`"${safeSortBy}"`, safeSortDirection as 'ASC' | 'DESC')
      .offset(query.calculateSkip())
      .limit(pageSize);

    const [rawCommentItems, totalCount] = await Promise.all([
      qb.getRawMany<RawComment>(),
      qb.getCount(),
    ]);

    return {
      items: rawCommentItems.map((rawComment) => ({
        ...rawComment,
        likesCount: 0,
        dislikesCount: 0,
        myStatus: null,
      })),
      totalCount,
    };
  }

  async getCommentById(
    id: number,
    userId: number | null = null,
  ): Promise<CommentQueryModel | null> {
    const rawComment = await this.commentsRepo
      .createQueryBuilder('c')
      .leftJoin('c.user', 'u')
      .where('c.id = :commentId', { commentId: id })
      .select([
        'c.id AS id',
        'c."authorId" AS "authorId"',
        'c."postId" AS "postId"',
        'c.content AS content',
        'c."createdAt" AS "createdAt"',
        'u.login AS "authorLogin"',
      ])
      .getRawOne<RawComment>();

    if (!rawComment) return null;

    return {
      ...rawComment,
      likesCount: 0,
      dislikesCount: 0,
      myStatus: null,
    };
  }
}
