import { AnswerStatus } from './game.types';

export type AnswerState = {
  id?: number;
  questionId: number;
  body: string;
  answerStatus: AnswerStatus;
  createdAt: Date;
};

export type ReconstructAnswerInput = Omit<AnswerState, 'id'> & {
  id: number;
};

export type CreateAnswerInput = Omit<AnswerState, 'createdAt'>;
