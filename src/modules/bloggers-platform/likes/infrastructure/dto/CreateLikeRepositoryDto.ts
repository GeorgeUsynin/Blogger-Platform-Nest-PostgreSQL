import { LikeStatus } from '../../domain';

export class CreateLikeRepositoryDto {
  authorId: number;
  parentId: number;
  likeStatus: LikeStatus;
}
