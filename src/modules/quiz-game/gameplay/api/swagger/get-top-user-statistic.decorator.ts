import { applyDecorators } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOperation } from '@nestjs/swagger';
import { ApiPaginatedResponse } from '../../../../../core/decorators';
import { SwaggerErrorsMessagesViewDto } from '../../../../../core/dto';
import { TopUserStatisticViewDto } from '../dto';

export const GetTopUserStatisticApi = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Returns top users statistics',
    }),
    ApiPaginatedResponse(TopUserStatisticViewDto),
    ApiBadRequestResponse({
      description: 'If the query has incorrect values',
      type: SwaggerErrorsMessagesViewDto,
    }),
  );
};
