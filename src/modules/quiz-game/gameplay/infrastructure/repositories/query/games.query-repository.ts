import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { GameQueryModel } from './model/GameQueryModel';
import { GameEntity } from '../../entities/game.entity';
import { PlayerProgressEntity } from '../../entities/player-progress.entity';
import { GameScoreCalculator } from '../../../domain/helpers';
import { GameRules } from '../../../domain/constants';
import { GameStatus } from '../../../domain/types/game.types';
import { AnswerQueryModel } from './model/AnswerQueryModel';

@Injectable()
export class GamesQueryRepository {
  constructor(
    @InjectRepository(GameEntity)
    private gamesRepo: Repository<GameEntity>,
  ) {}

  async getGameById(id: number): Promise<GameQueryModel | null> {
    const game = await this.applyGameViewSelect(
      this.gamesRepo.createQueryBuilder('g'),
    )
      .where('g.id = :id', { id })
      .getOne();

    return game ? this.gameQueryModelMapper(game) : null;
  }

  async getUserActiveGame(userId: number): Promise<GameQueryModel | null> {
    const game = await this.applyGameViewSelect(
      this.gamesRepo
        .createQueryBuilder('g')
        .innerJoin('g.playersProgresses', 'userProgress')
        .innerJoin('userProgress.playerAccount', 'userPlayer'),
    )
      .where('g.status = :status', { status: GameStatus.Active })
      .andWhere('userPlayer.id = :userId', { userId })
      .getOne();

    return game ? this.gameQueryModelMapper(game) : null;
  }

  async getLastAnswerForUserInActiveGame(
    userId: number,
  ): Promise<AnswerQueryModel | null> {
    const answer = await this.gamesRepo
      .createQueryBuilder('g')
      .leftJoin('g.playersProgresses', 'pp')
      .leftJoin('pp.answers', 'a')
      .select([
        'a.questionId AS "questionId"',
        'a.answerStatus AS "answerStatus"',
        'a.createdAt AS "createdAt"',
      ])
      .where('g.status = :status', { status: GameStatus.Active })
      .andWhere('pp.userId = :userId', { userId })
      .orderBy('a.createdAt', 'DESC')
      .getRawOne<AnswerQueryModel>();

    return answer ?? null;
  }

  private applyGameViewSelect(
    qb: SelectQueryBuilder<GameEntity>,
  ): SelectQueryBuilder<GameEntity> {
    return qb
      .leftJoin('g.playersProgresses', 'pp')
      .leftJoin('pp.playerAccount', 'p')
      .leftJoin('pp.answers', 'a')
      .leftJoin('g.gameToQuestions', 'gtq')
      .leftJoin('gtq.question', 'q')
      .select([
        'g.id',
        'g.status',
        'g.createdAt',
        'g.startGameDate',
        'g.finishGameDate',

        'pp.id',
        'pp.createdAt',

        'p.id',
        'p.login',

        'a.id',
        'a.questionId',
        'a.answerStatus',
        'a.createdAt',

        'gtq.id',

        'q.id',
        'q.body',
      ]);
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
