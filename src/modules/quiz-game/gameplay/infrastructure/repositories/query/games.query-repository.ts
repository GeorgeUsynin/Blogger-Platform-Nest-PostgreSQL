import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { GameQueryModel } from './model/GameQueryModel';
import { GameEntity } from '../../entities/game.entity';
import { PlayerProgressEntity } from '../../entities/player-progress.entity';
import { GameStatus } from '../../../domain/types/game.types';
import { AnswerQueryModel } from './model/AnswerQueryModel';
import {
  GameSortByFields,
  GetGamesQueryParamsInputDto,
  GetTopUserStatisticInputDto,
} from '../../../api/dto';
import { SortDirection } from '../../../../../../core/dto/base.query-params.input-dto';
import { StatisticQueryModel } from './model/StatisticQueryModel';
import { TopUserStatisticQueryModel } from './model/TopUserStatisticQueryModel';

const PLAYER_GAME_RESULT_CTE = 'player_game_result';
const PLAYER_GAME_RESULT_ALIAS = 'pgr';

@Injectable()
export class GamesQueryRepository {
  constructor(
    @InjectRepository(GameEntity)
    private gamesRepo: Repository<GameEntity>,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  async getGameById(id: number): Promise<GameQueryModel | null> {
    const game = await this.applyGameViewSelect(
      this.gamesRepo.createQueryBuilder('g'),
    )
      .where('g.id = :id', { id })
      .orderBy('gtq.order', 'ASC')
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
      .where('g.status IN (:...statuses)', {
        statuses: [GameStatus.PendingSecondPlayer, GameStatus.Active],
      })
      .andWhere('userPlayer.id = :userId', { userId })
      .orderBy('gtq.order', 'ASC')
      .getOne();

    return game ? this.gameQueryModelMapper(game) : null;
  }

  async getLastAnswerForUserInGame(
    gameId: number,
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
      .where('g.id = :gameId', { gameId })
      .andWhere('pp.userId = :userId', { userId })
      .orderBy('a.createdAt', 'DESC')
      .getRawOne<AnswerQueryModel>();

    return answer ?? null;
  }

  async getUserActiveAndFinishedGames(
    userId: number,
    query: GetGamesQueryParamsInputDto,
  ): Promise<{
    items: GameQueryModel[];
    totalCount: number;
  }> {
    const { sortBy, sortDirection, pageSize } = query;

    const safeSortBy = Object.values(GameSortByFields).includes(sortBy)
      ? sortBy
      : GameSortByFields.CreatedAt;
    const safeSortDirection = Object.values(SortDirection).includes(
      sortDirection,
    )
      ? sortDirection.toUpperCase()
      : SortDirection.Desc.toUpperCase();

    const sortColumnByField = Object.values(GameSortByFields).reduce(
      (acc, field) => {
        acc[field] = `g.${field}`;
        return acc;
      },
      {} as Record<GameSortByFields, string>,
    );

    const filteredGamesQb = this.gamesRepo
      .createQueryBuilder('g')
      .innerJoin('g.playersProgresses', 'userProgress')
      .innerJoin('userProgress.playerAccount', 'userPlayer')
      .where('g.status IN (:...statuses)', {
        statuses: [GameStatus.Active, GameStatus.Finished],
      })
      .andWhere('userPlayer.id = :userId', { userId })
      .orderBy(
        sortColumnByField[safeSortBy],
        safeSortDirection as 'ASC' | 'DESC',
      );

    if (safeSortBy === GameSortByFields.Status) {
      filteredGamesQb.addOrderBy(
        sortColumnByField[GameSortByFields.CreatedAt],
        'DESC',
      );
    }

    const [gameIdRows, totalCount] = await Promise.all([
      filteredGamesQb
        .clone()
        .select('g.id', 'id')
        .offset(query.calculateSkip())
        .limit(pageSize)
        .getRawMany<{ id: number }>(),
      filteredGamesQb.getCount(),
    ]);

    const gameIds = gameIdRows.map(({ id }) => id);

    if (!gameIds.length) {
      return {
        items: [],
        totalCount,
      };
    }

    const gameItems = await this.applyGameViewSelect(
      this.gamesRepo.createQueryBuilder('g'),
    )
      .where('g.id IN (:...gameIds)', { gameIds })
      .orderBy('gtq.order', 'ASC')
      .getMany();

    const gameById = new Map(gameItems.map((game) => [game.id, game]));

    return {
      items: gameIds
        .map((id) => gameById.get(id))
        .filter((game) => Boolean(game))
        .map(this.gameQueryModelMapper),
      totalCount,
    };
  }

  async getGameStatisticByUserId(
    userId: number,
  ): Promise<StatisticQueryModel | undefined> {
    return this.createStatisticsAggregationQb()
      .where(`${PLAYER_GAME_RESULT_ALIAS}."userId" = :userId`, { userId })
      .getRawOne<StatisticQueryModel>();
  }

  async getTopUsersStatistic(query: GetTopUserStatisticInputDto) {
    const { sort, pageSize } = query;

    const topUsersStatisticsQb = this.createStatisticsAggregationQb()
      .addSelect([
        `${PLAYER_GAME_RESULT_ALIAS}."userId"`,
        `${PLAYER_GAME_RESULT_ALIAS}."login" AS "userLogin"`,
      ])
      .groupBy(`${PLAYER_GAME_RESULT_ALIAS}."userId"`)
      .addGroupBy(`${PLAYER_GAME_RESULT_ALIAS}."login"`);

    this.applyTopUsersSort(topUsersStatisticsQb, sort);

    const [topUserSatsRows, totalCountRow] = await Promise.all([
      topUsersStatisticsQb
        .clone()
        .offset(query.calculateSkip())
        .limit(pageSize)
        .getRawMany<TopUserStatisticQueryModel>(),
      this.countUsersWithFinishedGames(),
    ]);

    const totalCount = totalCountRow?.count ?? 0;

    if (!topUserSatsRows.length) {
      return {
        items: [],
        totalCount,
      };
    }

    return {
      items: topUserSatsRows,
      totalCount,
    };
  }

  private createStatisticsAggregationQb(): SelectQueryBuilder<GameEntity> {
    return this.applyStatisticsSelect(this.createPlayerGameResultsCteQb());
  }

  private createPlayerGameResultsCteQb(): SelectQueryBuilder<GameEntity> {
    const playerGameResultsQb = this.gamesRepo
      .createQueryBuilder('g')
      .innerJoin('g.playersProgresses', 'pp')
      .innerJoin('pp.playerAccount', 'pa')
      .select([
        'pp.gameId AS "gameId"',
        'pp.userId AS "userId"',
        'pp.score AS "score"',
        'pa.login AS "login"',
      ])
      .addSelect(
        `
        CASE
          WHEN MAX(pp.score) OVER (PARTITION BY pp."gameId") = MIN(pp.score) OVER (PARTITION BY pp."gameId") THEN 'draw'
          WHEN pp.score = MAX(pp.score) OVER (PARTITION BY pp."gameId") THEN 'win'
          ELSE 'loss'
        END
        `,
        'result',
      )
      .where('g.status = :status', { status: GameStatus.Finished });

    return this.dataSource
      .createQueryBuilder()
      .addCommonTableExpression(playerGameResultsQb, PLAYER_GAME_RESULT_CTE);
  }

  private applyStatisticsSelect(
    qb: SelectQueryBuilder<GameEntity>,
  ): SelectQueryBuilder<GameEntity> {
    const alias = PLAYER_GAME_RESULT_ALIAS;

    return qb
      .addSelect(`COALESCE(SUM(${alias}.score), 0)::int`, 'sumScore')
      .addSelect(`COALESCE(AVG(${alias}.score), 0)::float`, 'avgScores')
      .addSelect('COUNT(*)::int', 'gamesCount')
      .addSelect(
        `COUNT(*) FILTER (WHERE ${alias}.result = 'win')::int`,
        'winsCount',
      )
      .addSelect(
        `COUNT(*) FILTER (WHERE ${alias}.result = 'loss')::int`,
        'lossesCount',
      )
      .addSelect(
        `COUNT(*) FILTER (WHERE ${alias}.result = 'draw')::int`,
        'drawsCount',
      )
      .from(PLAYER_GAME_RESULT_CTE, alias);
  }

  private applyTopUsersSort(
    qb: SelectQueryBuilder<GameEntity>,
    sort: GetTopUserStatisticInputDto['sort'],
  ): void {
    for (const sortItem of sort) {
      qb.addOrderBy(
        sortItem.sortField,
        sortItem.sortDirection.toUpperCase() as 'ASC' | 'DESC',
      );
    }
  }

  private countUsersWithFinishedGames(): Promise<
    { count: number } | undefined
  > {
    return this.gamesRepo
      .createQueryBuilder('g')
      .innerJoin('g.playersProgresses', 'pp')
      .select('COUNT(DISTINCT pp.userId)::int', 'count')
      .where('g.status = :status', { status: GameStatus.Finished })
      .getRawOne<{ count: number }>();
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
        'pp.score',
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
            answers: pp.answers
              .sort((a1, a2) => a1.createdAt.getTime() - a2.createdAt.getTime())
              .map((answer) => ({
                questionId: answer.questionId,
                answerStatus: answer.answerStatus,
                createdAt: answer.createdAt,
              })),
            player: pp.playerAccount,
            score: pp.score,
          };
        }),
      questions: game.gameToQuestions.map(({ question }) => ({
        id: question.id,
        body: question.body,
      })),
    };
  }
}
