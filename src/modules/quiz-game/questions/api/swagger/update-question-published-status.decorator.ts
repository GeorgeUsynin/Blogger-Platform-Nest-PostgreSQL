import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiProperty,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SwaggerErrorsMessagesViewDto } from '../../../../../core/dto';
import { UpdateQuestionPublishedStatusInputDto } from '../dto';

export class SwaggerUpdateQuestionPublishedStatusInputDto implements UpdateQuestionPublishedStatusInputDto {
  @ApiProperty({
    type: Boolean,
    description:
      'True if question is completed and can be used in the Quiz game',
  })
  published: boolean;
}

export const UpdateQuestionPublishedStatusApi = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Update existing Question by id with InputModel',
    }),
    ApiParam({ name: 'id', type: String, description: 'Question id' }),
    ApiBody({
      type: SwaggerUpdateQuestionPublishedStatusInputDto,
      description: 'Data for updating',
      required: false,
    }),
    ApiNoContentResponse({
      description: 'No Content',
    }),
    ApiBadRequestResponse({
      description: 'If the inputModel has incorrect values',
      type: SwaggerErrorsMessagesViewDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
    }),
    ApiNotFoundResponse({
      description: 'Not Found',
    }),
  );
};
