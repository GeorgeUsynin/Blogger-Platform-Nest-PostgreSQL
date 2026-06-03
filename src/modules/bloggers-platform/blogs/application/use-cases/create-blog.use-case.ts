import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrastructure';
import { CreateBlogDto } from '../dto';
import { CreateBlogRepositoryDto } from '../../infrastructure/dto';
import { BlogCreationFailedError } from '../../../../../core/exceptions';

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
    const createBlogRepositoryDto: CreateBlogRepositoryDto = {
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
    };

    const blogId = await this.blogsRepository.createBlog(
      createBlogRepositoryDto,
    );

    if (!blogId) {
      throw new BlogCreationFailedError();
    }

    return blogId;
  }
}
