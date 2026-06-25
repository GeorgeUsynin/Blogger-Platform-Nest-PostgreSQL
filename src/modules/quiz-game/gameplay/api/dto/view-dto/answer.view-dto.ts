import { ApiProperty } from '@nestjs/swagger';
import { AnswerStatus } from '../../../domain/types/game.types';
import { AnswerQueryModel } from '../../../infrastructure/repositories/query/model/AnswerQueryModel';

export class AnswerViewDto {
  @ApiProperty()
  questionId: string;

  @ApiProperty({
    enum: AnswerStatus,
  })
  answerStatus: AnswerStatus;

  @ApiProperty({ type: Date })
  addedAt: Date;

  public static mapToView(answer: AnswerQueryModel): AnswerViewDto {
    const dto = new AnswerViewDto();

    dto.questionId = answer.questionId.toString();
    dto.answerStatus = answer.answerStatus;
    dto.addedAt = answer.createdAt;

    return dto;
  }
}
