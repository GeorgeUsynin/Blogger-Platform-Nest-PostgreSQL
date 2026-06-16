export enum LikeStatus {
  None = 'None',
  Like = 'Like',
  Dislike = 'Dislike',
}

export enum ParentType {
  Comment = 'comment',
  Post = 'post',
}

export type NonNoneLikeStatus = Exclude<LikeStatus, LikeStatus.None>;

export type LikeState = {
  id?: number;
  authorId: number;
  parentId: number;
  parentType: ParentType;
  likeStatus: NonNoneLikeStatus;
};

export type CreateLikeInput = Omit<LikeState, 'id'>;

export type ReconstructLikeInput = Omit<LikeState, 'id'> & { id: number };
