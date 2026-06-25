import { ApiProperty } from '@nestjs/swagger';
import { QuestionQueryModel } from '../../../infrastructure/repositories/query/model/QuestionQueryModel';

export class QuestionViewDto {
  @ApiProperty()
  id: string;

  @ApiProperty({
    description:
      'Text of question, for example: How many continents are there?',
  })
  body: string;

  @ApiProperty({
    description:
      "All variants of possible correct answers for current questions Examples: ['6', 'six', 'шесть', 'дофига'] In Postgres save this data in JSON column",
  })
  correctAnswers: string[];

  @ApiProperty({
    default: false,
    description: 'If question is completed and can be used in the Quiz game',
  })
  published: boolean;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  public static mapToView(question: QuestionQueryModel): QuestionViewDto {
    const dto = new QuestionViewDto();

    dto.id = question.id.toString();
    dto.body = question.body;
    dto.correctAnswers = question.correctAnswers;
    dto.published = question.isPublished;
    dto.createdAt = question.createdAt;
    dto.updatedAt = question.updatedAt;

    return dto;
  }
}
