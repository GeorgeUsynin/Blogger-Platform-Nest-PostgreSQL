import { NonNoneLikeStatus } from '../../../../../likes/domain';

export type RawComment = {
  id: number;
  authorId: number;
  authorLogin: string;
  postId: number;
  content: string;
  createdAt: Date;
};

export type CommentQueryModel = RawComment & {
  likesCount: number;
  dislikesCount: number;
  myStatus: NonNoneLikeStatus | null;
};
