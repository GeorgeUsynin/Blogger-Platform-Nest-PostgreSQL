import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiProperty,
  ApiUnauthorizedResponse,
  OmitType,
} from '@nestjs/swagger';
import { SwaggerErrorsMessagesViewDto } from '../../../../../core/dto';
import { CreatePostInputDto, PostViewDto } from '../dto';
import {
  contentConstraints,
  shortDescriptionConstraints,
  titleConstraints,
} from '../../domain';

export class SwaggerCreatePostInputDto implements CreatePostInputDto {
  @ApiProperty({
    type: String,
    maxLength: titleConstraints.maxLength,
  })
  title: string;

  @ApiProperty({
    type: String,
    maxLength: shortDescriptionConstraints.maxLength,
  })
  shortDescription: string;

  @ApiProperty({
    type: String,
    maxLength: contentConstraints.maxLength,
  })
  content: string;

  @ApiProperty({
    type: String,
  })
  blogId: string;
}

export const CreatePostApi = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Create new post',
    }),
    ApiBody({
      type: SwaggerCreatePostInputDto,
      description: 'Data for constructing new Blog entity',
      required: false,
    }),
    ApiCreatedResponse({
      type: PostViewDto,
      description: 'Returns the newly created post',
    }),
    ApiBadRequestResponse({
      description: 'If the inputModel has incorrect values',
      type: SwaggerErrorsMessagesViewDto,
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
    }),
  );
};
