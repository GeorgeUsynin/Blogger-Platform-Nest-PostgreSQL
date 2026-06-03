import { LikesService } from './application';
import { PostLikesRepository, CommentLikesRepository } from './infrastructure';

export const likesProviders = [
  LikesService,
  PostLikesRepository,
  CommentLikesRepository,
];
