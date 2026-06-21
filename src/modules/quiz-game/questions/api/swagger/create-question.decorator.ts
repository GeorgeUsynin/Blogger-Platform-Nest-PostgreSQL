import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiProperty,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SwaggerErrorsMessagesViewDto } from '../../../../../core/dto';
import { CreateQuestionInputDto, QuestionViewDto } from '../dto';
import { bodyConstraints } from '../../infrastructure/entities/constraints';

export class SwaggerCreateQuestionInputDto implements CreateQuestionInputDto {
  @ApiProperty({
    type: String,
    minLength: bodyConstraints.minLength,
    maxLength: bodyConstraints.maxLength,
  })
  body: string;

  @ApiProperty({
    type: [String],
    description:
      "All variants of possible correct answers for current questions Examples: ['6', 'six', 'шесть', 'дофига'] In Postgres save this data in JSON column",
  })
  correctAnswers: string[];
}

export const CreateQuestionApi = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Create new question',
    }),
    ApiBody({
      type: SwaggerCreateQuestionInputDto,
      description: 'Data for constructing new Question entity',
      required: false,
    }),
    ApiCreatedResponse({
      type: QuestionViewDto,
      description: 'Returns the newly created question',
    }),
    ApiBadRequestResponse({
      type: SwaggerErrorsMessagesViewDto,
      description: 'If the inputModel has incorrect values',
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
    }),
  );
};
