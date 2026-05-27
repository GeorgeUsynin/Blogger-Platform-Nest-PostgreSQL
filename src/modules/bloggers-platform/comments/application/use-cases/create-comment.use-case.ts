import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, type CommentModelType } from '../../domain';
import { CommentsRepository } from '../../infrastructure';
import { PostsRepository } from '../../../posts/infrastructure';
import { UsersExternalRepository } from '../../../../user-accounts/users/infrastructure';
import { CreateCommentDto } from '../dto';
import {
  PostNotFoundError,
  UserNotFoundError,
} from '../../../../../core/exceptions';

export class CreateCommentCommand extends Command<string> {
  constructor(
    public readonly postId: string,
    public readonly userId: string,
    public readonly dto: CreateCommentDto,
  ) {
    super();
  }
}

@CommandHandler(CreateCommentCommand)
export class CreateCommentUseCase implements ICommandHandler<
  CreateCommentCommand,
  string
> {
  constructor(
    @InjectModel(Comment.name)
    private CommentModel: CommentModelType,
    private commentsRepository: CommentsRepository,
    private postsRepository: PostsRepository,
    private usersExternalRepository: UsersExternalRepository,
  ) {}

  async execute({
    postId,
    userId,
    dto,
  }: CreateCommentCommand): Promise<string> {
    const foundPost = await this.postsRepository.findById(postId);
    if (!foundPost) {
      throw new PostNotFoundError();
    }
    // @ts-expect-error userId type mismatch
    const user = await this.usersExternalRepository.findById(userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    const newComment = this.CommentModel.createComment({
      content: dto.content,
      postId,
      userId,
      userLogin: user.login,
    });

    await this.commentsRepository.save(newComment);

    return newComment._id.toString();
  }
}
