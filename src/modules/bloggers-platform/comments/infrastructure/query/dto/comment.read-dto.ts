import { NonNoneLikeStatus } from '../../../../likes/domain';
import { TCommentDB } from '../../types';

export type CommentReadDto = TCommentDB & {
  authorLogin: string;
  likesCount: number;
  dislikesCount: number;
  myStatus: NonNoneLikeStatus | null;
};
