import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetPostsQueryParamsInputDto } from '../../../api/dto';
import { PostQueryModel, RawPost, TNewestLike } from './model';
import { LikeStatus } from '../../../../likes/domain';
import { PostSortByFields } from '../../../api/dto/input-dto/posts-sort-by-fields';
import { SortDirection } from '../../../../../../core/dto/base.query-params.input-dto';
import { PostEntity } from '../../entities';

type FindPostsFilter = Partial<Pick<PostEntity, 'blogId'>>;

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectRepository(PostEntity) private postsRepo: Repository<PostEntity>,
  ) {}

  async getAllPosts(
    query: GetPostsQueryParamsInputDto,
    userId: number | null,
  ): Promise<{ items: PostQueryModel[]; totalCount: number }> {
    return this.findManyWithFilter(query, {}, userId);
  }

  async getAllPostsByBlogId(
    blogId: number,
    query: GetPostsQueryParamsInputDto,
    userId: number | null,
  ): Promise<{ items: PostQueryModel[]; totalCount: number }> {
    return this.findManyWithFilter(query, { blogId }, userId);
  }

  private async findManyWithFilter(
    query: GetPostsQueryParamsInputDto,
    filter: FindPostsFilter = {},
    userId: number | null,
  ): Promise<{ items: PostQueryModel[]; totalCount: number }> {
    const { sortBy, sortDirection, pageSize } = query;

    const safeSortBy = Object.values(PostSortByFields).includes(sortBy)
      ? sortBy
      : PostSortByFields.CreatedAt;
    const safeSortDirection = Object.values(SortDirection).includes(
      sortDirection,
    )
      ? sortDirection.toUpperCase()
      : SortDirection.Asc.toUpperCase();

    const qb = this.postsRepo.createQueryBuilder('p').leftJoin('p.blog', 'b');

    if (filter.blogId) {
      qb.where('p."blogId" = :blogId', { blogId: filter.blogId });
    }

    qb.select([
      'p.id AS id',
      'p."blogId" AS "blogId"',
      'p.title AS title',
      'p."shortDescription" AS "shortDescription"',
      'p.content AS content',
      'p."createdAt" AS "createdAt"',
      'b.name AS "blogName"',
    ])
      .orderBy(`"${safeSortBy}"`, safeSortDirection as 'ASC' | 'DESC')
      .offset(query.calculateSkip())
      .limit(pageSize);

    const [rawPostItems, totalCount] = await Promise.all([
      qb.getRawMany<RawPost>(),
      qb.getCount(),
    ]);

    return {
      items: rawPostItems.map((rawPost) => ({
        ...rawPost,
        likesCount: 0,
        dislikesCount: 0,
        myStatus: null,
        newestLikes: [],
      })),
      totalCount,
    };
  }

  async getPostById(
    id: number,
    userId: number | null = null,
  ): Promise<PostQueryModel | null> {
    const rawPost = await this.postsRepo
      .createQueryBuilder('p')
      .leftJoin('p.blog', 'b')
      .where('p.id = :postId', { postId: id })
      .select([
        'p.id AS id',
        'p."blogId" AS "blogId"',
        'p.title AS title',
        'p."shortDescription" AS "shortDescription"',
        'p.content AS content',
        'p."createdAt" AS "createdAt"',
        'b.name AS "blogName"',
      ])
      .getRawOne<RawPost>();

    if (!rawPost) return null;

    return {
      ...rawPost,
      likesCount: 0,
      dislikesCount: 0,
      myStatus: null,
      newestLikes: [],
    };
  }
}
