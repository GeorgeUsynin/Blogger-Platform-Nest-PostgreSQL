import { Length } from 'class-validator';
import { passwordConstraints } from '../../../infrastructure/entities/constraints';
import { IsStringWithTrim } from '../../../../../../core/decorators';

export class NewPasswordInputDto {
  @Length(passwordConstraints.minLength, passwordConstraints.maxLength)
  @IsStringWithTrim()
  newPassword: string;

  @IsStringWithTrim()
  recoveryCode: string;
}
