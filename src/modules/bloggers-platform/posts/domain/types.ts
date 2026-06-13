export type PostState = {
  id?: number;
  blogId: number;
  title: string;
  shortDescription: string;
  content: string;
};

export type CreatePostInput = Omit<PostState, 'id'>;

export type ReconstructPostInput = Omit<PostState, 'id'> & { id: number };

export type UpdatePostInput = CreatePostInput;
