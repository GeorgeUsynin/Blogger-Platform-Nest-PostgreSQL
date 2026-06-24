import { Injectable } from '@nestjs/common';
import { QuestionsRepository } from '../infrastructure/repositories/questions.repository';

@Injectable()
export class QuestionsService {
  constructor(private questionsRepository: QuestionsRepository) {}

  async getRandomQuestionIds(quantity: number): Promise<number[]> {
    return this.questionsRepository.getRandomQuestionIds(quantity);
  }
}
