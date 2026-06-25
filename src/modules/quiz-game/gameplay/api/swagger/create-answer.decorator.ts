import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SwaggerErrorsMessagesViewDto } from '../../../../../core/dto';
import { AnswerViewDto, CreateAnswerInputDto } from '../dto';

export class SwaggerCreateAnswerInputDto implements CreateAnswerInputDto {
  @ApiProperty({
    type: String,
  })
  answer: string;
}

export const CreateAnswerApi = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Send answer for next not answered question in active pair',
    }),
    ApiBody({
      type: SwaggerCreateAnswerInputDto,
      description: 'Answer body',
      required: true,
    }),
    ApiOkResponse({
      description: 'Returns created answer',
      type: AnswerViewDto,
    }),
    ApiBadRequestResponse({
      description: 'If the inputModel has incorrect values',
      type: SwaggerErrorsMessagesViewDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
    }),
    ApiForbiddenResponse({
      description:
        'If current user is not participating in active game or all questions are already answered',
    }),
  );
};
