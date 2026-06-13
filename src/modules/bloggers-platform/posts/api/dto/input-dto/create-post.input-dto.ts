import { MaxLength } from 'class-validator';
import {
  IsNumberStringWithTrim,
  IsStringWithTrim,
} from '../../../../../../core/decorators';
import {
  contentConstraints,
  shortDescriptionConstraints,
  titleConstraints,
} from '../../../infrastructure/entities/constraints';

export class CreatePostInputDto {
  @MaxLength(titleConstraints.maxLength)
  @IsStringWithTrim()
  title: string;

  @MaxLength(shortDescriptionConstraints.maxLength)
  @IsStringWithTrim()
  shortDescription: string;

  @MaxLength(contentConstraints.maxLength)
  @IsStringWithTrim()
  content: string;

  @IsNumberStringWithTrim()
  blogId: string;
}
