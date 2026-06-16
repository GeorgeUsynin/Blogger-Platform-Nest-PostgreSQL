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
import { CommandBus } from '@nestjs/cqrs';
import { ApiBasicAuth, ApiBearerAuth } from '@nestjs/swagger';
import { PostsQueryRepository } from '../infrastructure';
import { CommentsQueryRepository } from '../../comments/infrastructure';
import { PaginatedViewDto } from '../../../../core/dto';
import {
  CommentCreationFailedError,
  PostCreationFailedError,
  PostNotFoundError,
} from '../../../../core/exceptions';
import {
  PostViewDto,
  CreatePostInputDto,
  GetPostsQueryParamsInputDto,
  UpdatePostInputDto,
} from './dto';
import {
  CommentViewDto,
  CreateCommentInputDto,
  GetCommentsQueryParamsInputDto,
} from '../../comments/api/dto';
import {
  GetAllPostsApi,
  GetPostApi,
  GetAllCommentsByPostIdApi,
  CreatePostApi,
  DeletePostApi,
  UpdatePostApi,
  CreateCommentByPostIdApi,
  UpdatePostLikeStatusApi,
} from './swagger';
import {
  CreateUpdatePostLikeStatusCommand,
  UpdatePostCommand,
  DeletePostCommand,
  CreatePostCommand,
} from '../application';
import { BasicAuthGuard } from '../../../user-accounts/users/guards/basic';
import {
  JwtHeaderAuthGuard,
  JwtOptionalAuthGuard,
} from '../../../user-accounts/users/guards/bearer';
import {
  ExtractUserFromRequest,
  ExtractUserIfExistsFromRequest,
} from '../../../user-accounts/users/guards/decorators';
import { UserContextDto } from '../../../user-accounts/users/guards/dto';
import { CreateUpdateLikeStatusInputDto } from '../../likes/api/dto';
import { CreateCommentCommand } from '../../comments/application';
import { ROUTES } from '../../../../constants';

@Controller(ROUTES.POSTS)
export class PostsController {
  constructor(
    private postsQueryRepository: PostsQueryRepository,
    private commentsQueryRepository: CommentsQueryRepository,
    private commandBus: CommandBus,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtOptionalAuthGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  @GetAllPostsApi()
  async getAllPosts(
    @Query() query: GetPostsQueryParamsInputDto,
    @ExtractUserIfExistsFromRequest() user: UserContextDto | null,
  ): Promise<PaginatedViewDto<PostViewDto>> {
    const userId = user ? user.userId : null;
    const { items, totalCount } = await this.postsQueryRepository.getAllPosts(
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

  @ApiBearerAuth()
  @UseGuards(JwtOptionalAuthGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @GetPostApi()
  async getPostById(
    @Param('id', ParseIntPipe) id: number,
    @ExtractUserIfExistsFromRequest() user: UserContextDto | null,
  ): Promise<PostViewDto> {
    const userId = user ? user.userId : null;
    const foundPost = await this.findPostByIdOrThrowNotFound(id, userId);

    return PostViewDto.mapToView(foundPost);
  }

  @ApiBearerAuth()
  @UseGuards(JwtOptionalAuthGuard)
  @Get(`:postId/${ROUTES.COMMENTS}`)
  @HttpCode(HttpStatus.OK)
  @GetAllCommentsByPostIdApi()
  async getAllCommentsByPostId(
    @Param('postId', ParseIntPipe) postId: number,
    @Query() query: GetCommentsQueryParamsInputDto,
    @ExtractUserIfExistsFromRequest() user: UserContextDto | null,
  ) {
    await this.findPostByIdOrThrowNotFound(postId);

    const userId = user ? user.userId : null;
    const { items, totalCount } =
      await this.commentsQueryRepository.getAllCommentsByPostId(
        postId,
        query,
        userId,
      );

    const mappedItems = items.map(CommentViewDto.mapToView);

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
  @CreatePostApi()
  async createPost(@Body() body: CreatePostInputDto): Promise<PostViewDto> {
    const blogId = Number(body.blogId);

    const postId = await this.commandBus.execute(
      new CreatePostCommand({ ...body, blogId }),
    );

    const createdPost = await this.postsQueryRepository.getPostById(postId);

    if (!createdPost) {
      throw new PostCreationFailedError();
    }

    return PostViewDto.mapToView(createdPost);
  }

  @ApiBearerAuth()
  @UseGuards(JwtHeaderAuthGuard)
  @Post(`:postId/${ROUTES.COMMENTS}`)
  @HttpCode(HttpStatus.CREATED)
  @CreateCommentByPostIdApi()
  async createCommentByPostId(
    @Param('postId', ParseIntPipe) postId: number,
    @Body() body: CreateCommentInputDto,
    @ExtractUserFromRequest() user: UserContextDto,
  ) {
    const commentId = await this.commandBus.execute(
      new CreateCommentCommand(postId, user.userId, body),
    );

    const createdComment =
      await this.commentsQueryRepository.getCommentById(commentId);

    if (!createdComment) {
      throw new CommentCreationFailedError();
    }

    return CommentViewDto.mapToView(createdComment);
  }

  @ApiBearerAuth()
  @UseGuards(JwtHeaderAuthGuard)
  @Put(`:postId/${ROUTES.LIKE_STATUS}`)
  @HttpCode(HttpStatus.NO_CONTENT)
  @UpdatePostLikeStatusApi()
  async createUpdatePostLikeStatus(
    @Param('postId', ParseIntPipe) postId: number,
    @Body() body: CreateUpdateLikeStatusInputDto,
    @ExtractUserFromRequest() user: UserContextDto,
  ) {
    const userId = user.userId;
    const likeStatus = body.likeStatus;

    await this.commandBus.execute(
      new CreateUpdatePostLikeStatusCommand({ postId, userId, likeStatus }),
    );
  }

  @ApiBasicAuth()
  @UseGuards(BasicAuthGuard)
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UpdatePostApi()
  async updatePostById(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdatePostInputDto,
  ): Promise<void> {
    const blogId = Number(body.blogId);
    await this.commandBus.execute(
      new UpdatePostCommand({ ...body, blogId, id }),
    );
  }

  @ApiBasicAuth()
  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @DeletePostApi()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.commandBus.execute(new DeletePostCommand(id));
  }

  private async findPostByIdOrThrowNotFound(
    id: number,
    userId: number | null = null,
  ) {
    const post = await this.postsQueryRepository.getPostById(id, userId);
    if (!post) throw new PostNotFoundError();
    return post;
  }
}
