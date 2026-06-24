import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WithId } from '../../../../../types/common';
import { QuestionEntity } from '../entities/question.entity';
import { Question } from '../../domain/question.aggregate';
import { QuestionMapper } from '../question.mapper';

@Injectable()
export class QuestionsRepository {
  constructor(
    @InjectRepository(QuestionEntity)
    private questionsRepo: Repository<QuestionEntity>,
  ) {}

  async getRandomQuestionIds(quantity: number): Promise<number[]> {
    const rows = await this.questionsRepo
      .createQueryBuilder('q')
      .select('q.id', 'id')
      .where('q.isPublished = :isPublished', {
        isPublished: true,
      })
      .orderBy('RANDOM()')
      .limit(quantity)
      .getRawMany();

    return rows.map((r) => r.id);
  }

  async findById(id: number): Promise<WithId<Question> | null> {
    const entity = await this.questionsRepo.findOneBy({ id });

    return this.mapToDomain(entity);
  }

  async softDeleteQuestionById(id: number): Promise<void> {
    await this.questionsRepo.softDelete(id);
  }

  async saveQuestionAggregate(question: Question): Promise<number> {
    const entity = QuestionMapper.toPersistence(question);

    const result = await this.questionsRepo.save(entity);

    return result.id;
  }

  private mapToDomain(entity: QuestionEntity | null): WithId<Question> | null {
    if (!entity) return null;

    return QuestionMapper.toDomain(entity);
  }
}
