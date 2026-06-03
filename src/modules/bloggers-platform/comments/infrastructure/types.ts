export type TCommentDB = {
  id: number;
  authorId: number;
  postId: number;
  content: string;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type WithTotalCount<T> = T & { TotalCount: number };
