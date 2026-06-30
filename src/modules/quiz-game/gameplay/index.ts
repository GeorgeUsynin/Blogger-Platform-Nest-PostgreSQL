import {
  CreateAnswerUseCase,
  CreateGameConnectionUseCase,
  GetGameByIdUseCase,
  GetGameStatisticByUserIdUseCase,
} from './application/use-cases';

export const gameUseCases = [
  CreateGameConnectionUseCase,
  GetGameByIdUseCase,
  CreateAnswerUseCase,
  GetGameStatisticByUserIdUseCase,
];
