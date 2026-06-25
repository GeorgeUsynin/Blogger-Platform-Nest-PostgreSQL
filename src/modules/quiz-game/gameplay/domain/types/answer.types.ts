import { AnswerStatus } from './game.types';

export type AnswerState = {
  id?: number;
  questionId: number;
  body: string;
  answerStatus: AnswerStatus;
};

export type ReconstructAnswerInput = Omit<AnswerState, 'id'> & { id: number };

export type CreateAnswerInput = AnswerState;
