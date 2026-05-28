import { LikeStatus } from '../../../../likes/domain';
import { TPostDB } from '../../types';

export type TNewestLike = {
  createdAt: Date;
  authorId: string;
  authorLogin: string;
};

export type PostReadDto = TPostDB & {
  blogName: string;
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
  newestLikes: TNewestLike[];
};
