export { CommentsController } from './api';
import {
  CreateCommentUseCase,
  CreateUpdateCommentLikeStatusUseCase,
  DeleteCommentUseCase,
  UpdateCommentUseCase,
} from './application/use-cases';
import { CommentsRepository, CommentsQueryRepository } from './infrastructure';

const commentsUseCases = [
  CreateCommentUseCase,
  UpdateCommentUseCase,
  DeleteCommentUseCase,
  CreateUpdateCommentLikeStatusUseCase,
];

export const commentsProviders = [
  CommentsRepository,
  CommentsQueryRepository,
  ...commentsUseCases,
];
