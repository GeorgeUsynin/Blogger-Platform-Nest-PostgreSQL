import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdatePostDto } from '../dto';
import {
  BlogNotFoundError,
  PostNotFoundError,
} from '../../../../../core/exceptions';
import { BlogsRepository } from '../../../blogs/infrastructure';
import { PostsRepository } from '../../infrastructure';

export class UpdatePostCommand {
  constructor(public readonly dto: UpdatePostDto) {}
}

@CommandHandler(UpdatePostCommand)
export class UpdatePostUseCase implements ICommandHandler<UpdatePostCommand> {
  constructor(
    private blogsRepository: BlogsRepository,
    private postsRepository: PostsRepository,
  ) {}

  async execute({ dto }: UpdatePostCommand): Promise<void> {
    const blog = await this.blogsRepository.findById(dto.blogId);

    if (!blog) {
      throw new BlogNotFoundError();
    }

    const foundPost = await this.postsRepository.findById(dto.id);

    if (!foundPost) {
      throw new PostNotFoundError();
    }

    foundPost.update({
      blogId: dto.blogId,
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
    });

    await this.postsRepository.savePostAggregate(foundPost);
  }
}
