import { GameEntity } from './entities/game.entity';
import { Game } from '../domain/game.aggregate';
import { WithId } from '../../../../types/common';
import {
  Answer,
  GameToQuestion,
  PlayerProgress,
} from '../domain/value-objects';
import { PlayerProgressEntity } from './entities/player-progress.entity';
import { GameToQuestionEntity } from './entities/game-to-question.entity';
import { AnswerEntity } from './entities/answer.entity';

export class GameMapper {
  static toDomain(entity: GameEntity): WithId<Game> {
    return Game.reconstruct({
      id: entity.id,
      status: entity.status,
      startGameDate: entity.startGameDate,
      finishGameDate: entity.finishGameDate,
      playersProgresses: entity.playersProgresses.map((pp) =>
        PlayerProgress.reconstruct({
          id: pp.id,
          userId: pp.userId,
          score: pp.score,
          answers: pp.answers.map((a) =>
            Answer.reconstruct({
              id: a.id,
              questionId: a.questionId,
              body: a.body,
              answerStatus: a.answerStatus,
              createdAt: a.createdAt,
            }),
          ),
        }),
      ),
      questionsOfTheGame: entity.gameToQuestions.map((gtq) =>
        GameToQuestion.reconstruct({
          id: gtq.id,
          questionId: gtq.questionId,
          correctAnswers: gtq.question.correctAnswers,
          order: gtq.order,
        }),
      ),
    }) as WithId<Game>;
  }

  static toPersistence(game: Game): GameEntity {
    const entity = new GameEntity();

    if (game.id) {
      entity.id = game.id;
    }

    entity.status = game.status;
    entity.startGameDate = game.startGameDate;
    entity.finishGameDate = game.finishGameDate;
    entity.playersProgresses = game.playersProgresses.map((pp) => {
      const playerProgressEntity = new PlayerProgressEntity();

      if (pp.id) {
        playerProgressEntity.id = pp.id;
      }

      playerProgressEntity.score = pp.score;
      playerProgressEntity.gameId = entity.id;
      playerProgressEntity.userId = pp.userId;
      playerProgressEntity.answers = pp.answers.map((a) => {
        const answerEntity = new AnswerEntity();
        if (a.id) {
          answerEntity.id = a.id;
        }

        answerEntity.createdAt = a.createdAt;
        answerEntity.questionId = a.questionId;
        answerEntity.body = a.body;
        answerEntity.answerStatus = a.answerStatus;

        return answerEntity;
      });

      return playerProgressEntity;
    });
    entity.gameToQuestions = game.questionsOfTheGame.map((qotg) => {
      const gameToQuestionEntity = new GameToQuestionEntity();

      if (qotg.id) {
        gameToQuestionEntity.id = qotg.id;
      }

      gameToQuestionEntity.gameId = entity.id;
      gameToQuestionEntity.order = qotg.order;
      gameToQuestionEntity.questionId = qotg.questionId;

      return gameToQuestionEntity;
    });

    return entity;
  }
}
