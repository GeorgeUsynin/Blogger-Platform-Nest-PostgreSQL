import { LikeStatus } from '../domain';

export type TLikeDB = {
  id: number;
  authorId: number;
  parentId: number;
  likeStatus: LikeStatus;
  createdAt: Date;
  updatedAt: Date;
};
