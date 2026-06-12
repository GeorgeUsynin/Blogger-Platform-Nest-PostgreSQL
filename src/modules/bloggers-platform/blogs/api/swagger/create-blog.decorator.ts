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
import { BlogViewDto, CreateBlogInputDto } from '../dto';
import {
  descriptionConstraints,
  nameConstraints,
  websiteUrlConstraints,
} from '../../infrastructure/entities/constraints';

export class SwaggerCreateBlogInputDto implements CreateBlogInputDto {
  @ApiProperty({
    type: String,
    maxLength: nameConstraints.maxLength,
  })
  name: string;

  @ApiProperty({
    type: String,
    maxLength: descriptionConstraints.maxLength,
  })
  description: string;

  @ApiProperty({
    type: String,
    maxLength: websiteUrlConstraints.maxLength,
    pattern: websiteUrlConstraints.websiteUrlPostgresRegex,
    example: 'https://example.com',
  })
  websiteUrl: string;
}

export const CreateBlogApi = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Create new blog',
    }),
    ApiBody({
      type: SwaggerCreateBlogInputDto,
      description: 'Data for constructing new Blog entity',
      required: false,
    }),
    ApiCreatedResponse({
      type: BlogViewDto,
      description: 'Returns the newly created blog',
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
