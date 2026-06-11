import { Matches } from 'class-validator';
import { emailConstraints } from '../../../infrastructure/entities/constraints';
import { IsStringWithTrim } from '../../../../../../core/decorators';

export class PasswordRecoveryInputDto {
  @Matches(emailConstraints.emailPostgresRegex)
  @IsStringWithTrim()
  email: string;
}
