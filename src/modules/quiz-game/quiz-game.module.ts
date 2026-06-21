import { Module } from '@nestjs/common';
import { QuizQuestionsController } from './questions/api/quiz-questions.controller';
import { questionUseCases } from './questions';
import { QuestionsQueryRepository } from './questions/infrastructure/repositories/query/questions.query-repository';
import { QuestionsRepository } from './questions/infrastructure/repositories/questions.repository';
import { QuestionEntity } from './questions/infrastructure/entities/question.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccountsModule } from '../user-accounts';

@Module({
  imports: [UserAccountsModule, TypeOrmModule.forFeature([QuestionEntity])],
  controllers: [QuizQuestionsController],
  providers: [
    ...questionUseCases,
    QuestionsRepository,
    QuestionsQueryRepository,
  ],
})
export class QuizGameModule {}
