import { applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ApiPaginatedResponse } from '../../../../../core/decorators';
import { QuestionViewDto } from '../dto';

export const GetAllQuestionsApi = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Returns questions with paging' }),
    ApiPaginatedResponse(QuestionViewDto),
  );
};
