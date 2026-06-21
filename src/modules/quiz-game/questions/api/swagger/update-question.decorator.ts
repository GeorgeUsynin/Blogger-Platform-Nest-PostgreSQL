import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiProperty,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SwaggerErrorsMessagesViewDto } from '../../../../../core/dto';
import { UpdateQuestionInputDto } from '../dto';
import { bodyConstraints } from '../../infrastructure/entities/constraints';

export class SwaggerUpdateQuestionInputDto implements UpdateQuestionInputDto {
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

export const UpdateQuestionApi = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Update existing Question by id with InputModel',
    }),
    ApiParam({ name: 'id', type: String, description: 'Question id' }),
    ApiBody({
      type: SwaggerUpdateQuestionInputDto,
      description: 'Data for updating',
      required: false,
    }),
    ApiNoContentResponse({
      description: 'No Content',
    }),
    ApiBadRequestResponse({
      description: 'If the inputModel has incorrect values',
      type: SwaggerErrorsMessagesViewDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
    }),
    ApiNotFoundResponse({
      description: 'Not Found',
    }),
  );
};
