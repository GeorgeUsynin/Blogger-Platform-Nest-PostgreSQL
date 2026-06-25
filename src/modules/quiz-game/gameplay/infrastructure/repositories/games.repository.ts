import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { GameStatus } from '../../domain/types/game.types';
import { GameEntity } from '../entities/game.entity';
import { WithId } from '../../../../../types/common';
import { Game } from '../../domain/game.aggregate';
import { GameMapper } from '../game.mapper';

export class GamesRepository {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(GameEntity)
    private gamesRepo: Repository<GameEntity>,
  ) {}

  async findPendingGame(): Promise<WithId<Game> | null> {
    const entity = await this.gamesRepo.findOne({
      where: { status: GameStatus.PendingSecondPlayer },
      relations: {
        playersProgresses: true,
        gameToQuestions: true,
      },
      select: {
        id: true,
        status: true,
        startGameDate: true,
        finishGameDate: true,
        playersProgresses: {
          id: true,
          userId: true,
        },
        gameToQuestions: {
          id: true,
          questionId: true,
          order: true,
        },
      },
    });

    return this.mapToDomain(entity);
  }

  async findUserActiveGame(userId: number): Promise<WithId<Game> | null> {
    const game = await this.gamesRepo
      .createQueryBuilder('g')
      .innerJoin('g.playersProgresses', 'userProgress')
      .innerJoin('userProgress.playerAccount', 'userPlayer')
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
      ])
      .where('g.status = :status', { status: GameStatus.Active })
      .andWhere('userPlayer.id = :userId', { userId })
      .getOne();

    return game ? this.mapToDomain(game) : null;
  }

  async saveGameAggregate(game: Game): Promise<number> {
    const entity = GameMapper.toPersistence(game);

    return this.dataSource.transaction(async (manager) => {
      const result = await manager.save(GameEntity, entity);
      return result.id;
    });
  }

  private mapToDomain(entity: GameEntity | null): WithId<Game> | null {
    if (!entity) return null;

    return GameMapper.toDomain(entity);
  }
}
