export type TBlogDB = {
  id: number;
  name: string;
  description: string;
  isMembership: boolean;
  websiteUrl: string;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type WithTotalCount<T> = T & { TotalCount: string };
