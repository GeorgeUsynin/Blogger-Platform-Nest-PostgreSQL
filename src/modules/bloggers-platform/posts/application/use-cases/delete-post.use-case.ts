import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostNotFoundError } from '../../../../../core/exceptions';
import { PostsRepository } from '../../infrastructure';

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

    await this.postsRepository.softDeletePostById(id);
  }
}
