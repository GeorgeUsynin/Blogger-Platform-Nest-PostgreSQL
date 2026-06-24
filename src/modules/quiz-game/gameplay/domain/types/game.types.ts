import { GameToQuestion } from '../value-objects/game-to-question.vo';
import { PlayerProgress } from '../value-objects/player-progress.vo';

export enum GameStatus {
  PendingSecondPlayer = 'PendingSecondPlayer',
  Active = 'Active',
  Finished = 'Finished',
}

export enum AnswerStatus {
  Correct = 'Correct',
  Incorrect = 'Incorrect',
}

export type GameState = {
  id?: number;
  status: GameStatus;
  finishGameDate: Date | null;
  startGameDate: Date | null;
  playersProgresses: PlayerProgress[];
  questionsOfTheGame: GameToQuestion[];
};

export type ReconstructGameInput = GameState;
