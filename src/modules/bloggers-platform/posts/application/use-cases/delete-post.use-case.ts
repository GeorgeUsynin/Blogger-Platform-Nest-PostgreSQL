import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostNotFoundError } from '../../../../../core/exceptions';
import { PostsRepository } from '../../infrastructure';
import { DeletePostRepositoryDto } from '../../infrastructure/dto';

export class DeletePostCommand {
  constructor(public readonly id: number) {}
}

@CommandHandler(DeletePostCommand)
export class DeletePostUseCase implements ICommandHandler<DeletePostCommand> {
  constructor(private postsRepository: PostsRepository) {}

  async execute({ id }: DeletePostCommand): Promise<void> {
    const foundPost = await this.postsRepository.findById(id);
    if (!foundPost) {
      throw new PostNotFoundError();
    }

    const now = new Date();

    const deletePostRepositoryDto: DeletePostRepositoryDto = {
      id,
      isDeleted: true,
      deletedAt: now,
      updatedAt: now,
    };

    await this.postsRepository.deletePost(deletePostRepositoryDto);
  }
}
