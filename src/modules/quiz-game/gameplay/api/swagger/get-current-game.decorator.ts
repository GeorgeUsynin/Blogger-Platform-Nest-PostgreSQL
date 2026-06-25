import { applyDecorators } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GameViewDto } from '../dto';

export const GetCurrentGameApi = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Returns current unfinished pair game for current user',
    }),
    ApiOkResponse({
      description: 'Success',
      type: GameViewDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
    }),
    ApiNotFoundResponse({
      description: 'No active pair for current user',
    }),
  );
};
