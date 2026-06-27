import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ApiPaginatedResponse } from '../../../../../core/decorators';
import { GameViewDto } from '../dto';

export const GetMyGamesApi = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Returns all my games (closed games and current)',
    }),
    ApiPaginatedResponse(GameViewDto),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
    }),
  );
};
