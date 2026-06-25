import {
  CreateAnswerUseCase,
  CreateGameConnectionUseCase,
  GetGameByIdUseCase,
} from './application/use-cases';

export const gameUseCases = [
  CreateGameConnectionUseCase,
  GetGameByIdUseCase,
  CreateAnswerUseCase,
];
