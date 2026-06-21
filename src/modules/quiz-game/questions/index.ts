import {
  CreateQuestionUseCase,
  DeleteQuestionUseCase,
  UpdateQuestionUseCase,
  UpdateQuestionPublishedStatusUseCase,
} from './application/use-cases';

export const questionUseCases = [
  CreateQuestionUseCase,
  DeleteQuestionUseCase,
  UpdateQuestionUseCase,
  UpdateQuestionPublishedStatusUseCase,
];
