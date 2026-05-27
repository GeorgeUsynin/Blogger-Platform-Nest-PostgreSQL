import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, type PostModelType } from '../../domain';
import { GetPostsQueryParamsInputDto } from '../../api/dto';
import { PostReadDto, TNewestLike } from './dto';
import { LikeDocument, LikeStatus, ParentType } from '../../../likes/domain';
import { LikesQueryRepository } from '../../../likes/infrastructure';
import { UsersExternalQueryRepository } from '../../../../user-accounts/users/infrastructure';

type FindPostsFilter = Partial<Pick<Post, 'blogId'>>;
type TParentNewestLikes = Map<string, LikeDocument[]>;
type TParentNewestLikesWithLogin = Map<string, TNewestLike[]>;

const NEWEST_LIKES_LIMIT = 3;
@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectModel(Post.name)
    private PostModel: PostModelType,
    private likesQueryRepository: LikesQueryRepository,
    private usersExternalQueryRepository: UsersExternalQueryRepository,
  ) {}

  async getAllPosts(
    query: GetPostsQueryParamsInputDto,
    userId?: string,
  ): Promise<{ items: PostReadDto[]; totalCount: number }> {
    return this.findManyWithFilter(query, {}, userId);
  }

  async getAllPostsByBlogId(
    blogId: string,
    query: GetPostsQueryParamsInputDto,
    userId?: number,
  ): Promise<{ items: PostReadDto[]; totalCount: number }> {
    // @ts-expect-error userId type mismatch
    return this.findManyWithFilter(query, { blogId }, userId);
  }

  private async findManyWithFilter(
    query: GetPostsQueryParamsInputDto,
    filter: FindPostsFilter = {},
    userId?: string,
  ): Promise<{ items: PostReadDto[]; totalCount: number }> {
    const { sortBy, sortDirection, pageSize } = query;

    const [items, totalCount] = await Promise.all([
      this.PostModel.find(filter)
        .sort({ [sortBy]: sortDirection })
        .skip(query.calculateSkip())
        .limit(pageSize)
        .lean()
        .exec(),
      this.PostModel.countDocuments(filter).exec(),
    ]);

    if (items.length === 0) {
      return { items: [], totalCount };
    }

    const postIds = items.map((post) => post._id.toString());

    const newestLikes = await this.getNewestLikesByPostIds(
      postIds,
      NEWEST_LIKES_LIMIT,
    );
    const enrichedNewestLikes =
      await this.enrichNewestLikesWithAuthorLogin(newestLikes);

    if (!userId) {
      const mappedItems = items.map((post) => ({
        ...post,
        myStatus: LikeStatus.None,
        newestLikes: enrichedNewestLikes.get(post._id.toString()) ?? [],
      }));

      return { items: mappedItems, totalCount };
    } else {
      const likes = await this.likesQueryRepository.findLikesByParentIds(
        userId,
        ParentType.Post,
        postIds,
      );
      const statusByPostId = new Map(
        likes.map((like) => [like.parentId.toString(), like.likeStatus]),
      );

      const mappedItems = items.map((post) => {
        const id = post._id.toString();
        return {
          ...post,
          myStatus: statusByPostId.get(id) ?? LikeStatus.None,
          newestLikes: enrichedNewestLikes.get(post._id.toString()) ?? [],
        };
      });
      return { items: mappedItems, totalCount };
    }
  }

  async getPostById(id: string, userId?: string): Promise<PostReadDto | null> {
    const post = await this.PostModel.findById(id).lean().exec();

    if (!post) return null;

    const myStatus = userId
      ? await this.likesQueryRepository.findMyStatusByParentId(
          // @ts-expect-error userId type mismatch
          userId,
          ParentType.Post,
          id,
        )
      : LikeStatus.None;

    const newestLikes = await this.getNewestLikesByPostIds(
      [id],
      NEWEST_LIKES_LIMIT,
    );
    const enrichedNewestLikes =
      await this.enrichNewestLikesWithAuthorLogin(newestLikes);

    return {
      ...post,
      myStatus,
      newestLikes: enrichedNewestLikes.get(id) ?? [],
    };
  }

  private async getNewestLikesByPostIds(
    postIds: string[],
    limit: number,
  ): Promise<TParentNewestLikes> {
    const newestLikes =
      await this.likesQueryRepository.getNewestLikesPerParentId(
        postIds,
        ParentType.Post,
        limit,
      );

    return new Map(newestLikes.map((el) => [el.parentId, el.newestLikes]));
  }

  private async enrichNewestLikesWithAuthorLogin(
    newestLikes: TParentNewestLikes,
  ): Promise<TParentNewestLikesWithLogin> {
    const uniqueAuthorIds = new Set(
      [...newestLikes.values()].flat().map((like) => like.authorId),
    );
    const authors = await this.usersExternalQueryRepository.findUsersByUserIds([
      ...uniqueAuthorIds,
    ]);
    const loginByAuthorId = new Map(
      authors.map((author) => [author._id.toString(), author.login]),
    );

    const result: TParentNewestLikesWithLogin = new Map();

    for (const [postId, likes] of newestLikes) {
      result.set(
        postId,
        likes.map((like) => ({
          authorId: like.authorId,
          authorLogin: loginByAuthorId.get(like.authorId)!,
          createdAt: like.createdAt,
        })),
      );
    }

    return result;
  }
}
