import { Length } from 'class-validator';
import { bodyConstraints } from '../../../infrastructure/entities/constraints';
import {
  IsArrayWithNotEmptyStrings,
  IsStringWithTrim,
} from '../../../../../../core/decorators';

export class CreateQuestionInputDto {
  @Length(bodyConstraints.minLength, bodyConstraints.maxLength)
  @IsStringWithTrim()
  body: string;

  @IsArrayWithNotEmptyStrings()
  correctAnswers: string[];
}
