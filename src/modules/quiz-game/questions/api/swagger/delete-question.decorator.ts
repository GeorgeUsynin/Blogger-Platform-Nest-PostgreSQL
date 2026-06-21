import { applyDecorators } from '@nestjs/common';
import {
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export const DeleteQuestionApi = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete question specified by id',
    }),
    ApiParam({ name: 'id', type: String, description: 'Question id' }),
    ApiNoContentResponse({
      description: 'No Content',
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
    }),
    ApiNotFoundResponse({
      description: 'Not Found',
    }),
  );
};
