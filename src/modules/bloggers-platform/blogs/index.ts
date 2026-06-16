export { BlogsController } from './api';
import {
  CreateBlogUseCase,
  UpdateBlogUseCase,
  DeleteBlogUseCase,
} from './application';
import { BlogsRepository, BlogsQueryRepository } from './infrastructure';

const blogsUseCases = [CreateBlogUseCase, UpdateBlogUseCase, DeleteBlogUseCase];

export const blogsProviders = [
  BlogsRepository,
  BlogsQueryRepository,
  ...blogsUseCases,
];
