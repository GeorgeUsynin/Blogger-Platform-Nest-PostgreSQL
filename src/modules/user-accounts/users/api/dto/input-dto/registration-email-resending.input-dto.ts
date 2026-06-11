import { Matches } from 'class-validator';
import { IsStringWithTrim } from '../../../../../../core/decorators/validation';
import { emailConstraints } from '../../../infrastructure/entities/constraints';

export class RegistrationEmailResendingInputDto {
  @Matches(emailConstraints.emailPostgresRegex)
  @IsStringWithTrim()
  email: string;
}
