import { IsBoolean, IsDefined } from 'class-validator';

export class UpdateQuestionPublishedStatusInputDto {
  @IsDefined()
  @IsBoolean()
  published: boolean;
}
