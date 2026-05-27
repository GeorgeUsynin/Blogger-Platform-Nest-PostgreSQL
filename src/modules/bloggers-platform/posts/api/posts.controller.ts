import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
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
import { ObjectIdValidationPipe } from '../../../../core/pipes';
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
  CreatePostCommand,
  CreateUpdatePostLikeStatusCommand,
  DeletePostCommand,
  UpdatePostCommand,
} from '../application/use-cases';
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
import { CreateCommentCommand } from '../../comments/application/use-cases';

@Controller('posts')
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
    const { items, totalCount } = await this.postsQueryRepository.getAllPosts(
      query,
      // @ts-expect-error userId type mismatch
      user?.userId,
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
    @Param('id', ObjectIdValidationPipe) id: string,
    @ExtractUserIfExistsFromRequest() user: UserContextDto | null,
  ): Promise<PostViewDto> {
    // @ts-expect-error userId type mismatch
    const foundPost = await this.findPostByIdOrThrowNotFound(id, user?.userId);

    return PostViewDto.mapToView(foundPost);
  }

  @ApiBearerAuth()
  @UseGuards(JwtOptionalAuthGuard)
  @Get(':postId/comments')
  @HttpCode(HttpStatus.OK)
  @GetAllCommentsByPostIdApi()
  async getAllCommentsByPostId(
    @Param('postId', ObjectIdValidationPipe) postId: string,
    @Query() query: GetCommentsQueryParamsInputDto,
    @ExtractUserIfExistsFromRequest() user: UserContextDto | null,
  ) {
    await this.findPostByIdOrThrowNotFound(postId);

    const { items, totalCount } =
      await this.commentsQueryRepository.getAllCommentsByPostId(
        postId,
        query,
        // @ts-expect-error userId type mismatch
        user?.userId,
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
    const postId = await this.commandBus.execute(new CreatePostCommand(body));

    const createdPost = await this.postsQueryRepository.getPostById(postId);

    if (!createdPost) {
      throw new PostCreationFailedError();
    }

    return PostViewDto.mapToView(createdPost);
  }

  @ApiBearerAuth()
  @UseGuards(JwtHeaderAuthGuard)
  @Post('/:postId/comments')
  @HttpCode(HttpStatus.CREATED)
  @CreateCommentByPostIdApi()
  async createCommentByPostId(
    @Param('postId', ObjectIdValidationPipe) postId: string,
    @Body() body: CreateCommentInputDto,
    @ExtractUserFromRequest() user: UserContextDto,
  ) {
    const commentId = await this.commandBus.execute(
      // @ts-expect-error userId type mismatch
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
  @Put(':postId/like-status')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UpdatePostLikeStatusApi()
  async createUpdatePostLikeStatus(
    @Param('postId', ObjectIdValidationPipe) postId: string,
    @Body() body: CreateUpdateLikeStatusInputDto,
    @ExtractUserFromRequest() user: UserContextDto,
  ) {
    const userId = user.userId;
    const likeStatus = body.likeStatus;

    await this.commandBus.execute(
      // @ts-expect-error userId type mismatch
      new CreateUpdatePostLikeStatusCommand({ postId, userId, likeStatus }),
    );
  }

  @ApiBasicAuth()
  @UseGuards(BasicAuthGuard)
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UpdatePostApi()
  async updatePostById(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Body() body: UpdatePostInputDto,
  ): Promise<void> {
    await this.commandBus.execute(new UpdatePostCommand({ ...body, id }));
  }

  @ApiBasicAuth()
  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @DeletePostApi()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(
    @Param('id', ObjectIdValidationPipe) id: string,
  ): Promise<void> {
    await this.commandBus.execute(new DeletePostCommand(id));
  }

  private async findPostByIdOrThrowNotFound(id: string, userId?: string) {
    const post = await this.postsQueryRepository.getPostById(id, userId);
    if (!post) throw new PostNotFoundError();
    return post;
  }
}
