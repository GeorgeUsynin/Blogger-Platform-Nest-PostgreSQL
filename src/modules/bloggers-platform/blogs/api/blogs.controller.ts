import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBasicAuth, ApiBearerAuth } from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import { BlogsQueryRepository } from '../infrastructure';
import { PostsQueryRepository } from '../../posts/infrastructure';
import { PaginatedViewDto } from '../../../../core/dto';
import {
  BlogCreationFailedError,
  BlogNotFoundError,
  PostCreationFailedError,
} from '../../../../core/exceptions/domainExceptions';
import {
  BlogViewDto,
  CreateBlogInputDto,
  CreatePostWithoutBlogIdInputDto,
  GetBlogsQueryParamsInputDto,
  UpdateBlogInputDto,
} from './dto';
import { GetPostsQueryParamsInputDto, PostViewDto } from '../../posts/api/dto';
import {
  CreateBlogApi,
  CreatePostByBlogIdApi,
  DeleteBlogApi,
  GetAllBlogsApi,
  GetAllPostsByBlogIdApi,
  GetBlogApi,
  UpdateBlogApi,
} from './swagger';
import { BasicAuthGuard } from '../../../user-accounts/users/guards/basic';
import { JwtOptionalAuthGuard } from '../../../user-accounts/users/guards/bearer';
import { ExtractUserIfExistsFromRequest } from '../../../user-accounts/users/guards/decorators';
import { UserContextDto } from '../../../user-accounts/users/guards/dto';
import {
  CreateBlogCommand,
  DeleteBlogCommand,
  UpdateBlogCommand,
} from '../application';
// be care with circular dependency
import { CreatePostCommand } from '../../posts/application/use-cases/create-post.use-case';
import { ROUTES } from '../../../../constants';

@Controller(ROUTES.BLOGS)
export class BlogsController {
  constructor(
    private blogsQueryRepository: BlogsQueryRepository,
    private postsQueryRepository: PostsQueryRepository,
    private commandBus: CommandBus,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @GetAllBlogsApi()
  async getAllBlogs(
    @Query() query: GetBlogsQueryParamsInputDto,
  ): Promise<PaginatedViewDto<BlogViewDto>> {
    const { items, totalCount } =
      await this.blogsQueryRepository.getAllBlogs(query);

    const mappedItems = items.map(BlogViewDto.mapToView);

    return PaginatedViewDto.mapToView({
      items: mappedItems,
      page: query.pageNumber,
      size: query.pageSize,
      totalCount,
    });
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @GetBlogApi()
  async getBlogById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<BlogViewDto> {
    const foundBlog = await this.findBlogByIdOrThrowNotFound(id);

    return BlogViewDto.mapToView(foundBlog);
  }

  @ApiBearerAuth()
  @UseGuards(JwtOptionalAuthGuard)
  @Get(`:blogId/${ROUTES.POSTS}`)
  @HttpCode(HttpStatus.OK)
  @GetAllPostsByBlogIdApi()
  async getPostsByBlogId(
    @Param('blogId', ParseIntPipe) blogId: number,
    @Query() query: GetPostsQueryParamsInputDto,
    @ExtractUserIfExistsFromRequest() user: UserContextDto | null,
  ) {
    await this.findBlogByIdOrThrowNotFound(blogId);

    const userId = user ? user.userId : null;
    const { items, totalCount } =
      await this.postsQueryRepository.getAllPostsByBlogId(
        blogId,
        query,
        userId,
      );

    const mappedItems = items.map(PostViewDto.mapToView);

    return PaginatedViewDto.mapToView({
      items: mappedItems,
      page: query.pageNumber,
      size: query.pageSize,
      totalCount,
    });
  }

  @ApiBasicAuth()
  @UseGuards(BasicAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @CreateBlogApi()
  async createBlog(@Body() body: CreateBlogInputDto): Promise<BlogViewDto> {
    const blogId = await this.commandBus.execute(new CreateBlogCommand(body));

    const createdBlog = await this.blogsQueryRepository.getBlogById(blogId);

    if (!createdBlog) {
      throw new BlogCreationFailedError();
    }

    return BlogViewDto.mapToView(createdBlog);
  }

  @ApiBasicAuth()
  @UseGuards(BasicAuthGuard)
  @Post(`:blogId/${ROUTES.POSTS}`)
  @HttpCode(HttpStatus.CREATED)
  @CreatePostByBlogIdApi()
  async createPostForBlogByBlogId(
    @Param('blogId', ParseIntPipe) blogId: number,
    @Body() body: CreatePostWithoutBlogIdInputDto,
  ) {
    const postId = await this.commandBus.execute(
      new CreatePostCommand({ ...body, blogId }),
    );

    const createdPost = await this.postsQueryRepository.getPostById(postId);

    if (!createdPost) {
      throw new PostCreationFailedError();
    }

    return PostViewDto.mapToView(createdPost);
  }

  @ApiBasicAuth()
  @UseGuards(BasicAuthGuard)
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UpdateBlogApi()
  async updateBlogById(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateBlogInputDto,
  ): Promise<void> {
    await this.commandBus.execute(new UpdateBlogCommand({ ...body, id }));
  }

  @ApiBasicAuth()
  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @DeleteBlogApi()
  async deleteBlog(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.commandBus.execute(new DeleteBlogCommand(id));
  }

  private async findBlogByIdOrThrowNotFound(id: number) {
    const blog = await this.blogsQueryRepository.getBlogById(id);
    if (!blog) throw new BlogNotFoundError();
    return blog;
  }
}
