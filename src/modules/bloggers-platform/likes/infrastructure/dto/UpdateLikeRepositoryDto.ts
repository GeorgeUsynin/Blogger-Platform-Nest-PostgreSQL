import { LikeStatus } from '../../domain';

export class UpdateLikeRepositoryDto {
  id: number;
  likeStatus: LikeStatus;
  updatedAt: Date;
}
