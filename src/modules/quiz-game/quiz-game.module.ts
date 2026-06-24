import { Module } from '@nestjs/common';
import { QuizQuestionsController } from './questions/api/quiz-questions.controller';
import { questionUseCases } from './questions';
import { QuestionsQueryRepository } from './questions/infrastructure/repositories/query/questions.query-repository';
import { QuestionsRepository } from './questions/infrastructure/repositories/questions.repository';
import { QuestionEntity } from './questions/infrastructure/entities/question.entity';

import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccountsModule } from '../user-accounts';
import { QuestionsService } from './questions/application/questions.service';
import { GamesController } from './gameplay/api/game.controller';
import { GameEntity } from './gameplay/infrastructure/entities/game.entity';
import { PlayerProgressEntity } from './gameplay/infrastructure/entities/player-progress.entity';
import { GameToQuestionEntity } from './gameplay/infrastructure/entities/game-to-question.entity';
import { AnswerEntity } from './gameplay/infrastructure/entities/answer.entity';
import { gameUseCases } from './gameplay';
import { GamesRepository } from './gameplay/infrastructure/repositories/games.repository';
import { PlayerProgressesRepository } from './gameplay/infrastructure/repositories/player-progresses.repository';
import { GamesQueryRepository } from './gameplay/infrastructure/repositories/query/games.query-repository';

@Module({
  imports: [
    UserAccountsModule,
    TypeOrmModule.forFeature([
      GameEntity,
      PlayerProgressEntity,
      GameToQuestionEntity,
      AnswerEntity,
      QuestionEntity,
    ]),
  ],
  controllers: [QuizQuestionsController, GamesController],
  providers: [
    ...questionUseCases,
    ...gameUseCases,
    GamesRepository,
    GamesQueryRepository,
    PlayerProgressesRepository,
    QuestionsService,
    QuestionsRepository,
    QuestionsQueryRepository,
  ],
})
export class QuizGameModule {}
