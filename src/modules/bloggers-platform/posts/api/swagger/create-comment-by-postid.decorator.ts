import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiProperty,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SwaggerErrorsMessagesViewDto } from '../../../../../core/dto';
import {
  CreateCommentInputDto,
  CommentViewDto,
} from '../../../comments/api/dto';
import { contentConstraints } from '../../../comments/infrastructure/entities/constraints';

export class SwaggerCreateCommentInputDto implements CreateCommentInputDto {
  @ApiProperty({
    type: String,
    minLength: contentConstraints.minLength,
    maxLength: contentConstraints.maxLength,
  })
  content: string;
}

export const CreateCommentByPostIdApi = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Create new comment for specified post',
    }),
    ApiParam({ name: 'postId', type: String, description: 'Post id' }),
    ApiBody({
      type: SwaggerCreateCommentInputDto,
      description: 'Data for constructing new comment entity',
      required: false,
    }),
    ApiCreatedResponse({
      type: CommentViewDto,
      description: 'Returns the newly created comment',
    }),
    ApiBadRequestResponse({
      description: 'If the inputModel has incorrect values',
      type: SwaggerErrorsMessagesViewDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
    }),
    ApiNotFoundResponse({
      description: "If specified post doesn't exists",
    }),
  );
};
