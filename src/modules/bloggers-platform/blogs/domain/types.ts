export type BlogState = {
  id?: number;
  name: string;
  description: string;
  websiteUrl: string;
  isMembership: boolean;
};

export type CreateBlogInput = {
  name: string;
  description: string;
  websiteUrl: string;
};

export type ReconstructBlogInput = Omit<BlogState, 'id'> & { id: number };

export type UpdateInput = CreateBlogInput;
