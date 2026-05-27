import { Injectable } from '@nestjs/common';
import {
  Like,
  LikeDocument,
  type LikeModelType,
  LikeStatus,
  NonNoneLikeStatus,
  ParentType,
} from '../../domain';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class LikesQueryRepository {
  constructor(
    @InjectModel(Like.name)
    private LikeModel: LikeModelType,
  ) {}

  async findLikesByParentIds(
    authorId: string,
    parentType: ParentType,
    parentIds: string[],
  ): Promise<LikeDocument[]> {
    return this.LikeModel.find({
      authorId,
      parentType,
      parentId: { $in: parentIds },
    })
      .lean()
      .exec();
  }

  async findMyStatusByParentId(
    authorId: number,
    parentType: ParentType,
    parentId: string,
  ): Promise<LikeStatus.None | NonNoneLikeStatus> {
    const foundLike = await this.LikeModel.findOne({
      // @ts-expect-error userId type mismatch
      authorId,
      parentType,
      parentId,
    })
      .lean()
      .exec();

    return foundLike !== null ? foundLike.likeStatus : LikeStatus.None;
  }

  async getNewestLikesPerParentId(
    parentIds: string[],
    parentType: ParentType,
    limit: number,
  ): Promise<{ parentId: string; newestLikes: LikeDocument[] }[]> {
    return this.LikeModel.aggregate()
      .match({
        parentId: {
          $in: parentIds,
        },
        parentType,
        likeStatus: LikeStatus.Like,
      })
      .group({
        _id: '$parentId',
        newestLikes: {
          $topN: {
            output: {
              authorId: '$authorId',
              createdAt: '$createdAt',
            },
            sortBy: { createdAt: -1 },
            n: limit,
          },
        },
      })
      .project({
        parentId: '$_id',
        _id: 0,
        newestLikes: 1,
      });
  }
}
