import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrastructure';
import { CreateBlogDto } from '../dto';
import { BlogCreationFailedError } from '../../../../../core/exceptions';
import { Blog } from '../../domain';

export class CreateBlogCommand extends Command<number> {
  constructor(public readonly dto: CreateBlogDto) {
    super();
  }
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogUseCase implements ICommandHandler<
  CreateBlogCommand,
  number
> {
  constructor(private blogsRepository: BlogsRepository) {}

  async execute({ dto }: CreateBlogCommand): Promise<number> {
    const blog = Blog.create(dto);
    const blogId = await this.blogsRepository.saveBlogAggregate(blog);

    if (!blogId) {
      throw new BlogCreationFailedError();
    }

    return blogId;
  }
}
