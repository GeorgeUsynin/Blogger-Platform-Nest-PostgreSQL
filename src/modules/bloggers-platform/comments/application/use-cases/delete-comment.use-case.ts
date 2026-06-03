import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  CommentNotFoundError,
  NotAnOwnerOfThisComment,
} from '../../../../../core/exceptions';
import { CommentsRepository } from '../../infrastructure';
import { DeleteCommentRepositoryDto } from '../../infrastructure/dto';

export class DeleteCommentCommand {
  constructor(
    public readonly userId: number,
    public readonly id: number,
  ) {}
}

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentUseCase implements ICommandHandler<DeleteCommentCommand> {
  constructor(private commentsRepository: CommentsRepository) {}

  async execute({ userId, id }: DeleteCommentCommand): Promise<void> {
    const foundComment = await this.commentsRepository.findById(id);
    if (!foundComment) {
      throw new CommentNotFoundError();
    }

    if (foundComment.authorId !== userId) {
      throw new NotAnOwnerOfThisComment();
    }

    const now = new Date();

    const deleteCommentRepositoryDto: DeleteCommentRepositoryDto = {
      id,
      isDeleted: true,
      deletedAt: now,
      updatedAt: now,
    };

    await this.commentsRepository.deleteComment(deleteCommentRepositoryDto);
  }
}
