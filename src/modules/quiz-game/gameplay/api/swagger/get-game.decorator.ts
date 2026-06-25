import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GameViewDto } from '../dto';
import { SwaggerErrorsMessagesViewDto } from '../../../../../core/dto';

export const GetGameApi = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Returns pair game by id',
    }),
    ApiParam({ name: 'id', type: String, description: 'Existing game id' }),
    ApiOkResponse({
      description: 'Success',
      type: GameViewDto,
    }),
    ApiBadRequestResponse({
      description: 'If id has invalid format',
      type: SwaggerErrorsMessagesViewDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
    }),
    ApiForbiddenResponse({
      description: 'If current user is not participating in this game',
    }),
    ApiNotFoundResponse({
      description: 'Not Found',
    }),
  );
};
