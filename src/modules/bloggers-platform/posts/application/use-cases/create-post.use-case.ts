import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePostDto } from '../dto';
import { PostsRepository } from '../../infrastructure';
import { CreatePostRepositoryDto } from '../../infrastructure/dto';
import {
  BlogNotFoundError,
  PostCreationFailedError,
} from '../../../../../core/exceptions';
import { BlogsRepository } from '../../../blogs/infrastructure';

export class CreatePostCommand extends Command<number> {
  constructor(public readonly dto: CreatePostDto) {
    super();
  }
}

@CommandHandler(CreatePostCommand)
export class CreatePostUseCase implements ICommandHandler<
  CreatePostCommand,
  number
> {
  constructor(
    private postsRepository: PostsRepository,
    private blogsRepository: BlogsRepository,
  ) {}

  async execute({ dto }: CreatePostCommand): Promise<number> {
    const blog = await this.blogsRepository.findById(dto.blogId);
    if (!blog) {
      throw new BlogNotFoundError();
    }

    const now = new Date();

    const createPostRepositoryDto: CreatePostRepositoryDto = {
      title: dto.title,
      content: dto.content,
      shortDescription: dto.shortDescription,
      blogId: dto.blogId,
      createdAt: now,
      updatedAt: now,
    };

    const postId = await this.postsRepository.createPost(
      createPostRepositoryDto,
    );

    if (!postId) {
      throw new PostCreationFailedError();
    }

    return postId;
  }
}
