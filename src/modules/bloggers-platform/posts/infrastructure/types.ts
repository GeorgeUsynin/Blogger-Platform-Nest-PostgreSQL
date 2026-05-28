export type TPostDB = {
  id: number;
  blogId: number;
  title: string;
  shortDescription: string;
  content: string;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type WithBlogName<T> = T & { blogName: string };

export type WithTotalCount<T> = T & { TotalCount: string };
