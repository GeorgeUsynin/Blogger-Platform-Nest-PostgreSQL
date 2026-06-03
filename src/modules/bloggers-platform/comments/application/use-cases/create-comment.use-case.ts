import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../infrastructure';
import { PostsRepository } from '../../../posts/infrastructure';
import { UsersExternalRepository } from '../../../../user-accounts/users/infrastructure';
import { CreateCommentDto } from '../dto';
import {
  CommentCreationFailedError,
  PostNotFoundError,
  UserNotFoundError,
} from '../../../../../core/exceptions';
import { CreateCommentRepositoryDto } from '../../infrastructure/dto';

export class CreateCommentCommand extends Command<number> {
  constructor(
    public readonly postId: number,
    public readonly userId: number,
    public readonly dto: CreateCommentDto,
  ) {
    super();
  }
}

@CommandHandler(CreateCommentCommand)
export class CreateCommentUseCase implements ICommandHandler<
  CreateCommentCommand,
  number
> {
  constructor(
    private commentsRepository: CommentsRepository,
    private postsRepository: PostsRepository,
    private usersExternalRepository: UsersExternalRepository,
  ) {}

  async execute({
    postId,
    userId,
    dto,
  }: CreateCommentCommand): Promise<number> {
    const foundPost = await this.postsRepository.findById(postId);
    if (!foundPost) {
      throw new PostNotFoundError();
    }

    const user = await this.usersExternalRepository.findById(userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    const createCommentRepositoryDto: CreateCommentRepositoryDto = {
      authorId: userId,
      postId,
      content: dto.content,
    };

    const commentId = await this.commentsRepository.createComment(
      createCommentRepositoryDto,
    );

    if (!commentId) {
      throw new CommentCreationFailedError();
    }

    return commentId;
  }
}
