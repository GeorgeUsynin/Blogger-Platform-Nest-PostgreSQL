export { BlogsController } from './api';
import {
  CreateBlogUseCase,
  UpdateBlogUseCase,
  DeleteBlogUseCase,
} from './application/use-cases';
import {
  BlogsRepository,
  BlogsQueryRepository,
  BlogEntity,
} from './infrastructure';

const blogsUseCases = [CreateBlogUseCase, UpdateBlogUseCase, DeleteBlogUseCase];

export const blogsProviders = [
  BlogsRepository,
  BlogsQueryRepository,
  ...blogsUseCases,
];
export { BlogEntity };
