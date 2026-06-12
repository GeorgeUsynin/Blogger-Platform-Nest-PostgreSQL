import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogNotFoundError } from '../../../../../core/exceptions';
import { BlogsRepository } from '../../infrastructure';
import { UpdateBlogDto } from '../dto';

export class UpdateBlogCommand {
  constructor(public readonly dto: UpdateBlogDto) {}
}

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogUseCase implements ICommandHandler<UpdateBlogCommand> {
  constructor(private blogsRepository: BlogsRepository) {}

  async execute({ dto }: UpdateBlogCommand): Promise<void> {
    const foundBlog = await this.blogsRepository.findById(dto.id);

    if (!foundBlog) throw new BlogNotFoundError();

    foundBlog.update({
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
    });

    await this.blogsRepository.saveBlogAggregate(foundBlog);
  }
}
