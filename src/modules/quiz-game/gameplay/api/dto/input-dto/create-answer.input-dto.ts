import { IsStringWithTrim } from '../../../../../../core/decorators';

export class CreateAnswerInputDto {
  @IsStringWithTrim()
  answer: string;
}
