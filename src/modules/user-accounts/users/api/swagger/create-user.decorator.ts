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
import { CreateUserInputDto, UserViewDto } from '../dto';
import {
  emailConstraints,
  loginConstraints,
  passwordConstraints,
} from '../../infrastructure/entities/constraints';

export class SwaggerCreateUserInputDto implements CreateUserInputDto {
  @ApiProperty({
    type: String,
    maxLength: loginConstraints.maxLength,
    minLength: loginConstraints.minLength,
    pattern: loginConstraints.loginPostgresRegex,
    description: 'must be unique',
  })
  login: string;

  @ApiProperty({
    type: String,
    maxLength: passwordConstraints.maxLength,
    minLength: passwordConstraints.minLength,
  })
  password: string;

  @ApiProperty({
    type: String,
    pattern: emailConstraints.emailPostgresRegex,
    example: 'example@example.com',
    description: 'must be unique',
  })
  email: string;
}

export const CreateUserApi = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Add new user to the system',
    }),
    ApiBody({
      type: SwaggerCreateUserInputDto,
      description: 'Data for constructing new user',
      required: false,
    }),
    ApiCreatedResponse({
      type: UserViewDto,
      description: 'Returns the newly created user',
    }),
    ApiBadRequestResponse({
      type: SwaggerErrorsMessagesViewDto,
      description:
        'If the inputModel has incorrect values <br/> <br/> <i>Note: If the error should be in the BLL, for example, "the email address is not unique", do not try to mix this error with input validation errors in the middleware, just return one element in the errors array</i>',
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
    }),
  );
};
