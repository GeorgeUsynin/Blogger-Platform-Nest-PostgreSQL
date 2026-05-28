import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrastructure';
import { BlogNotFoundError } from '../../../../../core/exceptions';
import { DeleteBlogRepositoryDto } from '../../infrastructure/dto';

export class DeleteBlogCommand {
  constructor(public readonly id: number) {}
}
@CommandHandler(DeleteBlogCommand)
export class DeleteBlogUseCase implements ICommandHandler<DeleteBlogCommand> {
  constructor(private blogsRepository: BlogsRepository) {}

  async execute({ id }: DeleteBlogCommand): Promise<void> {
    const foundBlog = await this.blogsRepository.findById(id);

    if (!foundBlog) throw new BlogNotFoundError();

    const now = new Date();

    const deleteBlogRepositoryDto: DeleteBlogRepositoryDto = {
      id,
      isDeleted: true,
      deletedAt: now,
      updatedAt: now,
    };

    await this.blogsRepository.deleteBlog(deleteBlogRepositoryDto);
  }
}
