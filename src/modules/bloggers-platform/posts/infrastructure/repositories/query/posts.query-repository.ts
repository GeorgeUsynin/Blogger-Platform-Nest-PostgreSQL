import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { GetPostsQueryParamsInputDto } from '../../../api/dto/input-dto/get-posts-query-params.input-dto';
import { PostQueryModel, TNewestLike } from './model/PostQueryModel';
import { PostSortByFields } from '../../../api/dto/input-dto/posts-sort-by-fields';
import { SortDirection } from '../../../../../../core/dto/base.query-params.input-dto';
import { PostEntity } from '../../entities/post.entity';
import { PostLikeEntity } from '../../../../likes/infrastructure/entities/post-like.entity';
import { LikeStatus } from '../../../../likes/domain';
import { UserEntity } from '../../../../../user-accounts/users/infrastructure/entities/user.entity';

type FindPostsFilter = Partial<Pick<PostEntity, 'blogId'>>;
const newestLikesLimit = 3;

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectRepository(PostEntity) private postsRepo: Repository<PostEntity>,
    @InjectRepository(PostLikeEntity)
    private postLikesRepo: Repository<PostLikeEntity>,
    @InjectDataSource() private dataSource: DataSource,
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
      : SortDirection.Desc.toUpperCase();

    const qb = this.getPostWithLikesBuilder(userId);

    if (filter.blogId) {
      qb.where('p."blogId" = :blogId', { blogId: filter.blogId });
    }

    qb.orderBy(`"${safeSortBy}"`, safeSortDirection as 'ASC' | 'DESC')
      .offset(query.calculateSkip())
      .limit(pageSize);

    const [rawPostItems, totalCount] = await Promise.all([
      qb.getRawMany<Omit<PostQueryModel, 'newestLikes'>>(),
      qb.getCount(),
    ]);

    let newestLikesMap = new Map<number, TNewestLike[]>();

    if (rawPostItems.length > 0) {
      const postIds = rawPostItems.map((post) => post.id);

      const newestLikesBuilder = this.postLikesRepo
        .createQueryBuilder('pl')
        .select([
          'pl."parentId" AS "parentId"',
          'pl."createdAt" AS "createdAt"',
          'pl."authorId" AS "authorId"',
          'u.login AS "authorLogin"',
          'ROW_NUMBER() OVER(PARTITION BY pl."parentId" ORDER BY pl."parentId" ASC, pl."createdAt" DESC) as rn',
        ])
        .innerJoin(UserEntity, 'u', 'pl."authorId" = u.id')
        .where('pl."parentId" = ANY(:postIds) AND PL."likeStatus" = :like', {
          postIds,
          like: LikeStatus.Like,
        });

      const newestLikes = await this.dataSource
        .createQueryBuilder()
        .addCommonTableExpression(newestLikesBuilder, 'ranked')
        .select([
          'rn."parentId"',
          'rn."createdAt"',
          'rn."authorId"',
          'rn."authorLogin"',
        ])
        .from('ranked', 'rn')
        .where('rn <= :newestLikesLimit', { newestLikesLimit })
        .getRawMany<TNewestLike & { parentId: number }>();

      newestLikes.forEach((like) => {
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
      items: rawPostItems.map((post) => {
        return {
          ...post,
          newestLikes: newestLikesMap.get(post.id) ?? [],
        };
      }),
      totalCount,
    };
  }

  async getPostById(
    id: number,
    userId: number | null = null,
  ): Promise<PostQueryModel | null> {
    const rawPost = await this.getPostWithLikesBuilder(userId)
      .where('p.id = :postId', { postId: id })
      .getRawOne<Omit<PostQueryModel, 'newestLikes'>>();

    if (!rawPost) return null;

    const newestLikes = await this.postsRepo
      .createQueryBuilder('p')
      .select([
        'pl."createdAt" AS "createdAt"',
        'pl."authorId" AS "authorId"',
        'u.login AS "authorLogin"',
      ])
      .innerJoin(
        PostLikeEntity,
        'pl',
        'pl."parentId" = p.id AND pl."likeStatus" = :like',
        { like: LikeStatus.Like },
      )
      .innerJoin(UserEntity, 'u', 'pl."authorId" = u.id')
      .where('p.id = :postId', { postId: id })
      .orderBy('pl."createdAt"', 'DESC')
      .limit(newestLikesLimit)
      .getRawMany<TNewestLike>();

    return {
      ...rawPost,
      newestLikes,
    };
  }

  private getPostWithLikesBuilder(userId: number | null = null) {
    return this.postsRepo
      .createQueryBuilder('p')
      .select([
        'p.id AS id',
        'p."blogId" AS "blogId"',
        'p.title AS title',
        'p."shortDescription" AS "shortDescription"',
        'p.content AS content',
        'p."createdAt" AS "createdAt"',
        'b.name AS "blogName"',
        'COALESCE(l."likesCount", 0)::int as "likesCount"',
        'COALESCE(l."dislikesCount", 0)::int as "dislikesCount"',
        'ml."likeStatus" as "myStatus"',
      ])
      .leftJoin('p.blog', 'b')
      .leftJoin(
        (subQuery: SelectQueryBuilder<PostLikeEntity>) =>
          subQuery
            .select('pl."parentId"', 'parentId')
            .addSelect(
              `COUNT(*) FILTER (WHERE pl."likeStatus" = :like)`,
              'likesCount',
            )
            .addSelect(
              `COUNT(*) FILTER (WHERE pl."likeStatus" = :dislike)`,
              'dislikesCount',
            )
            .from(PostLikeEntity, 'pl')
            .groupBy('pl."parentId"'),
        'l',
        'l."parentId" = p.id',
      )
      .leftJoin(
        PostLikeEntity,
        'ml',
        'ml."parentId" = p.id AND ml."authorId" = :authorId',
      )
      .setParameters({
        authorId: userId,
        like: LikeStatus.Like,
        dislike: LikeStatus.Dislike,
      });
  }
}
