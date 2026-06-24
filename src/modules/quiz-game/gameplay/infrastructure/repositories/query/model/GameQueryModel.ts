import { AnswerStatus, GameStatus } from '../../../../domain/types';

type Answer = {
  questionId: number;
  answerStatus: AnswerStatus;
  createdAt: Date;
};

type Player = {
  id: number;
  login: string;
};

type PlayerProgress = {
  answers: Answer[];
  player: Player;
  score: number;
};

type Question = {
  id: number;
  body: string;
};

export type GameQueryModel = {
  id: number;
  playerProgresses: PlayerProgress[];
  questions: Question[];
  status: GameStatus;
  createdAt: Date;
  startGameDate: Date | null;
  finishGameDate: Date | null;
};
