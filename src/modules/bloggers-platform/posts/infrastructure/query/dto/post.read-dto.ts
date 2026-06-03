import { NonNoneLikeStatus } from '../../../../likes/domain';
import { TPostDB } from '../../types';

export type TNewestLike = {
  createdAt: Date;
  authorId: number;
  authorLogin: string;
};

export type PostReadDto = TPostDB & {
  blogName: string;
  likesCount: number;
  dislikesCount: number;
  myStatus: NonNoneLikeStatus | null;
  newestLikes: TNewestLike[];
};

export type WithParentId<T> = T & { parentId: number };
