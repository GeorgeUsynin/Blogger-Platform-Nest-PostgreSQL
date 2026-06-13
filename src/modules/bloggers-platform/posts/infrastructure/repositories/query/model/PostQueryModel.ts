import { NonNoneLikeStatus } from '../../../../../likes/domain';

export type TNewestLike = {
  createdAt: Date;
  authorId: number;
  authorLogin: string;
};

export type RawPost = {
  id: number;
  blogId: number;
  blogName: string;
  title: string;
  shortDescription: string;
  content: string;
  createdAt: Date;
};

export type PostQueryModel = RawPost & {
  likesCount: number;
  dislikesCount: number;
  myStatus: NonNoneLikeStatus | null;
  newestLikes: TNewestLike[];
};
