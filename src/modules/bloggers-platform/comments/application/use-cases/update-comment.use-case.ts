import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentNotFoundError } from '../../../../../core/exceptions';
import { UpdateCommentDto } from '../dto';
import { CommentsRepository } from '../../infrastructure';

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

    foundComment.ensureCommentOwner(userId);

    foundComment.update({ content });
    await this.commentsRepository.saveCommentAggregate(foundComment);
  }
}
