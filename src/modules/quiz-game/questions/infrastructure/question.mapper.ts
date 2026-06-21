import { Question } from '../domain/question.aggregate';
import { QuestionEntity } from './entities/question.entity';
import { WithId } from '../../../../types/common';

export class QuestionMapper {
  static toDomain(entity: QuestionEntity): WithId<Question> {
    return Question.reconstruct({
      id: entity.id,
      body: entity.body,
      correctAnswers: entity.correctAnswers,
      isPublished: entity.isPublished,
    }) as WithId<Question>;
  }

  static toPersistence(question: Question): QuestionEntity {
    const entity = new QuestionEntity();

    if (question.id) {
      entity.id = question.id;
    }

    entity.body = question.body;
    entity.correctAnswers = question.correctAnswers;
    entity.isPublished = question.isPublished;

    return entity;
  }
}
