import { Length, Matches } from 'class-validator';
import {
  emailConstraints,
  loginConstraints,
  passwordConstraints,
} from '../../../infrastructure/entities/constraints';
import { IsStringWithTrim } from '../../../../../../core/decorators';

export class CreateUserInputDto {
  // Call order: @IsStringWithTrim() -> @Matches() -> @Length()
  @Matches(loginConstraints.loginPostgresRegex)
  @Length(loginConstraints.minLength, loginConstraints.maxLength)
  @IsStringWithTrim()
  login: string;

  @Matches(emailConstraints.emailPostgresRegex)
  @IsStringWithTrim()
  email: string;

  @Length(passwordConstraints.minLength, passwordConstraints.maxLength)
  @IsStringWithTrim()
  password: string;
}
