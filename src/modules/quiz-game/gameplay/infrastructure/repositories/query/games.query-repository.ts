import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameQueryModel } from './model';
import { GameEntity } from '../../entities/game.entity';
import { PlayerProgressEntity } from '../../entities/player-progress.entity';
import { GameScoreCalculator } from '../../../domain/helpers';
import { GameRules } from '../../../domain/constants';

@Injectable()
export class GamesQueryRepository {
  constructor(
    @InjectRepository(GameEntity)
    private gamesRepo: Repository<GameEntity>,
  ) {}

  async getGameById(id: number): Promise<GameQueryModel | null> {
    const game = await this.gamesRepo.findOne({
      relations: {
        gameToQuestions: {
          question: true,
        },
        playersProgresses: {
          answers: true,
          playerAccount: true,
        },
      },
      select: {
        id: true,
        status: true,
        startGameDate: true,
        finishGameDate: true,
        createdAt: true,
        gameToQuestions: {
          id: true,
          question: {
            id: true,
            body: true,
          },
        },
        playersProgresses: {
          id: true,
          createdAt: true,
          answers: {
            id: true,
            questionId: true,
            answerStatus: true,
            createdAt: true,
          },
          playerAccount: {
            id: true,
            login: true,
          },
        },
      },
      where: { id },
    });

    if (!game) return null;

    return this.gameQueryModelMapper(game);
  }

  private gameQueryModelMapper(game: GameEntity): GameQueryModel {
    return {
      id: game.id,
      status: game.status,
      startGameDate: game.startGameDate,
      finishGameDate: game.finishGameDate,
      createdAt: game.createdAt,
      playerProgresses: game.playersProgresses
        .sort(
          (pp1: PlayerProgressEntity, pp2: PlayerProgressEntity) =>
            pp1.createdAt.getTime() - pp2.createdAt.getTime(),
        )
        .map((pp) => {
          return {
            answers: pp.answers.map((answer) => ({
              questionId: answer.id,
              answerStatus: answer.answerStatus,
              createdAt: answer.createdAt,
            })),
            player: pp.playerAccount,
            score:
              GameScoreCalculator.calculate(
                GameRules.QUESTIONS_PER_GAME,
                game.playersProgresses.map((pp) => ({
                  id: pp.id,
                  answers: pp.answers.map((answer) => ({
                    answerStatus: answer.answerStatus,
                    createdAt: answer.createdAt,
                  })),
                })),
              ).find((score) => score.id === pp.id)?.score ?? 0,
          };
        }),
      questions: game.gameToQuestions.map(({ question }) => ({
        id: question.id,
        body: question.body,
      })),
    };
  }
}
