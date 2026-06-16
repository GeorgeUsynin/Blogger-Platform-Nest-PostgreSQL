export { PostsController } from './api';
import {
  CreatePostUseCase,
  UpdatePostUseCase,
  DeletePostUseCase,
  CreateUpdatePostLikeStatusUseCase,
} from './application';
import { PostsRepository, PostsQueryRepository } from './infrastructure';

const postsUseCases = [
  CreatePostUseCase,
  UpdatePostUseCase,
  DeletePostUseCase,
  CreateUpdatePostLikeStatusUseCase,
];

export const postsProviders = [
  PostsRepository,
  PostsQueryRepository,
  ...postsUseCases,
];
