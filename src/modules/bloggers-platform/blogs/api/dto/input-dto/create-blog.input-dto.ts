import { Matches, MaxLength } from 'class-validator';
import {
  descriptionConstraints,
  nameConstraints,
  websiteUrlConstraints,
} from '../../../infrastructure/entities/constraints';
import { IsStringWithTrim } from '../../../../../../core/decorators';

export class CreateBlogInputDto {
  @MaxLength(nameConstraints.maxLength)
  @IsStringWithTrim()
  name: string;

  @MaxLength(descriptionConstraints.maxLength)
  @IsStringWithTrim()
  description: string;

  @Matches(websiteUrlConstraints.websiteUrlPostgresRegex)
  @MaxLength(websiteUrlConstraints.maxLength)
  @IsStringWithTrim()
  websiteUrl: string;
}
