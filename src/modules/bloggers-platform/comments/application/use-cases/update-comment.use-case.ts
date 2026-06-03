import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  CommentNotFoundError,
  NotAnOwnerOfThisComment,
} from '../../../../../core/exceptions';
import { UpdateCommentDto } from '../dto';
import { CommentsRepository } from '../../infrastructure';
import { UpdateCommentRepositoryDto } from '../../infrastructure/dto';

export class UpdateCommentCommand {
  constructor(
    public readonly userId: number,
    public readonly dto: UpdateCommentDto,
  ) {}
}

@CommandHandler(UpdateCommentCommand)
export class UpdateCommentUseCase implements ICommandHandler<UpdateCommentCommand> {
  constructor(private commentsRepository: CommentsRepository) {}

  async execute({ userId, dto }: UpdateCommentCommand): Promise<void> {
    const { id, content } = dto;

    const foundComment = await this.commentsRepository.findById(id);
    if (!foundComment) {
      throw new CommentNotFoundError();
    }

    if (foundComment.authorId !== userId) {
      throw new NotAnOwnerOfThisComment();
    }

    const updateCommentRepositoryDto: UpdateCommentRepositoryDto = {
      id,
      content,
      updatedAt: new Date(),
    };

    await this.commentsRepository.updateContent(updateCommentRepositoryDto);
  }
}
