import { LikeStatus } from '../../../likes/domain';

export class CreateUpdatePostLikeStatusDto {
  postId: number;
  userId: number;
  likeStatus: LikeStatus;
}
