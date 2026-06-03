import { LikeStatus } from '../../../likes/domain';

export class CreateUpdateCommentLikeStatusDto {
  commentId: number;
  userId: number;
  likeStatus: LikeStatus;
}
