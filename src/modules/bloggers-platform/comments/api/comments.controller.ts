import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CommentsQueryRepository } from '../infrastructure';
import { CommentViewDto, UpdateCommentInputDto } from './dto';
import {
  DeleteCommentApi,
  GetCommentApi,
  UpdateCommentApi,
  UpdateCommentLikeStatusApi,
} from './swagger';
import { CommentNotFoundError } from '../../../../core/exceptions';
import { ObjectIdValidationPipe } from '../../../../core/pipes';
import {
  JwtHeaderAuthGuard,
  JwtOptionalAuthGuard,
} from '../../../user-accounts/users/guards/bearer';
import { UserContextDto } from '../../../user-accounts/users/guards/dto';
import {
  ExtractUserFromRequest,
  ExtractUserIfExistsFromRequest,
} from '../../../user-accounts/users/guards/decorators';
import {
  CreateUpdateCommentLikeStatusCommand,
  DeleteCommentCommand,
  UpdateCommentCommand,
} from '../application/use-cases';
import { CreateUpdateLikeStatusInputDto } from '../../likes/api/dto';

@Controller('comments')
export class CommentsController {
  constructor(
    private commentsQueryRepository: CommentsQueryRepository,
    private commandBus: CommandBus,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtOptionalAuthGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @GetCommentApi()
  async getCommentById(
    @Param('id', ObjectIdValidationPipe) id: string,
    @ExtractUserIfExistsFromRequest() user: UserContextDto | null,
  ): Promise<CommentViewDto> {
    const foundComment = await this.commentsQueryRepository.getCommentById(
      id,
      user?.userId,
    );

    if (!foundComment) {
      throw new CommentNotFoundError();
    }

    return CommentViewDto.mapToView(foundComment);
  }

  @ApiBearerAuth()
  @UseGuards(JwtHeaderAuthGuard)
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UpdateCommentApi()
  async updateCommentById(
    @Param('id', ObjectIdValidationPipe) id: string,
    @Body() body: UpdateCommentInputDto,
    @ExtractUserFromRequest() user: UserContextDto,
  ): Promise<void> {
    await this.commandBus.execute(
      // @ts-expect-error userId type mismatch
      new UpdateCommentCommand(user.userId, { ...body, id }),
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtHeaderAuthGuard)
  @Put(':commentId/like-status')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UpdateCommentLikeStatusApi()
  async createUpdateCommentLikeStatus(
    @Param('commentId', ObjectIdValidationPipe) commentId: string,
    @Body() body: CreateUpdateLikeStatusInputDto,
    @ExtractUserFromRequest() user: UserContextDto,
  ) {
    const userId = user.userId;
    const likeStatus = body.likeStatus;

    await this.commandBus.execute(
      new CreateUpdateCommentLikeStatusCommand({
        commentId,
        // @ts-expect-error userId type mismatch
        userId,
        likeStatus,
      }),
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtHeaderAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @DeleteCommentApi()
  async deleteComment(
    @Param('id', ObjectIdValidationPipe) id: string,
    @ExtractUserFromRequest() user: UserContextDto,
  ): Promise<void> {
    // @ts-expect-error userId type mismatch
    await this.commandBus.execute(new DeleteCommentCommand(user.userId, id));
  }
}
