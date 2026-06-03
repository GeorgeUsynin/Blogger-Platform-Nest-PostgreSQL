import { LikeStatus, ParentType } from '../../domain';

export class SetLikeStatusDto {
  likeStatus: LikeStatus;
  parentId: number;
  authorId: number;
  parentType: ParentType;
}
