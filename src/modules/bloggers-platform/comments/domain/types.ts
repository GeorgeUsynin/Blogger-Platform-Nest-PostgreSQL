export type CommentState = {
  id?: number;
  authorId: number;
  postId: number;
  content: string;
};

export type CreateCommentInput = Omit<CommentState, 'id'>;

export type ReconstructCommentInput = Omit<CommentState, 'id'> & { id: number };

export type UpdateCommentInput = Pick<CommentState, 'content'>;
