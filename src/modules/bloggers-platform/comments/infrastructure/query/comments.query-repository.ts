import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, type CommentModelType } from '../../domain';
import { GetCommentsQueryParamsInputDto } from '../../api/dto';
import { CommentReadDto } from './dto';
import { LikeStatus, ParentType } from '../../../likes/domain';
import { LikesQueryRepository } from '../../../likes/infrastructure';

type FindCommentsFilter = Partial<Pick<Comment, 'postId'>>;

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name)
    private CommentModel: CommentModelType,
    private likesQueryRepository: LikesQueryRepository,
  ) {}

  async getAllCommentsByPostId(
    postId: number,
    query: GetCommentsQueryParamsInputDto,
    userId?: number,
  ): Promise<{ items: CommentReadDto[]; totalCount: number }> {
    //@ts-expect-error change postId type
    return this.findManyWithFilter(query, { postId }, userId);
  }

  private async findManyWithFilter(
    query: GetCommentsQueryParamsInputDto,
    filter: FindCommentsFilter = {},
    userId?: string,
  ): Promise<{ items: CommentReadDto[]; totalCount: number }> {
    const { sortBy, sortDirection, pageSize } = query;

    const [items, totalCount] = await Promise.all([
      this.CommentModel.find(filter)
        .sort({ [sortBy]: sortDirection })
        .skip(query.calculateSkip())
        .limit(pageSize)
        .lean()
        .exec(),
      this.CommentModel.countDocuments(filter).exec(),
    ]);

    if (items.length === 0) {
      return { items: [], totalCount };
    }

    if (!userId) {
      const mappedItems = items.map((comment) => ({
        ...comment,
        myStatus: LikeStatus.None,
      }));
      return { items: mappedItems, totalCount };
    }

    const commentIds = items.map((comment) => comment._id.toString());
    const likes = await this.likesQueryRepository.findLikesByParentIds(
      userId,
      ParentType.Comment,
      commentIds,
    );
    const statusByCommentId = new Map(
      likes.map((like) => [like.parentId.toString(), like.likeStatus]),
    );
    const mappedItems = items.map((comment) => {
      const id = comment._id.toString();
      return {
        ...comment,
        myStatus: statusByCommentId.get(id) ?? LikeStatus.None,
      };
    });

    return { items: mappedItems, totalCount };
  }

  async getCommentById(
    id: string,
    userId?: number,
  ): Promise<CommentReadDto | null> {
    const comment = await this.CommentModel.findById(id).lean().exec();

    if (!comment) return null;

    const myStatus = userId
      ? await this.likesQueryRepository.findMyStatusByParentId(
          userId,
          ParentType.Comment,
          id,
        )
      : LikeStatus.None;

    return { ...comment, myStatus };
  }
}
