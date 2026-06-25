import { applyDecorators } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GameViewDto } from '../dto';

export const CreateGameConnectionApi = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Connect current user to a quiz game pair',
    }),
    ApiOkResponse({
      description: 'Returns current pair game',
      type: GameViewDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
    }),
    ApiForbiddenResponse({
      description: 'If current user is already participating in active pair',
    }),
    ApiConflictResponse({
      description: 'If there are not enough published questions to start game',
    }),
  );
};
