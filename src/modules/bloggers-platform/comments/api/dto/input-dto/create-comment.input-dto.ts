import { Length } from 'class-validator';
import { IsStringWithTrim } from '../../../../../../core/decorators';
import { contentConstraints } from '../../../infrastructure/entities/constraints';

export class CreateCommentInputDto {
  @Length(contentConstraints.minLength, contentConstraints.maxLength)
  @IsStringWithTrim()
  content: string;
}
