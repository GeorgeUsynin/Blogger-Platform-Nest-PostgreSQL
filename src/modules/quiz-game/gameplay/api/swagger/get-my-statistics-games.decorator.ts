import { applyDecorators } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { StatisticViewDto } from '../dto';

export const GetMyStatisticsGamesApi = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Returns current user game statistics',
    }),
    ApiOkResponse({
      description: 'Success',
      type: StatisticViewDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
    }),
  );
};
