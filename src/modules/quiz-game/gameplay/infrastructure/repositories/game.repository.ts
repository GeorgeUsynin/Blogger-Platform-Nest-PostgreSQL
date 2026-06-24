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
    });

    return this.mapToDomain(entity);
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
