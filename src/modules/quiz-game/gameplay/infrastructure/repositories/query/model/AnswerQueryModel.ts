import { AnswerStatus } from '../../../../domain/types/game.types';

export type AnswerQueryModel = {
  questionId: number;
  answerStatus: AnswerStatus;
  createdAt: Date;
};
