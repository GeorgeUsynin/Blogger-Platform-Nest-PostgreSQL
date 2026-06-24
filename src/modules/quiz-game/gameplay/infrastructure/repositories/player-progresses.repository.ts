import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlayerProgressEntity } from '../entities/player-progress.entity';
import { GameStatus } from '../../domain/types/game.types';

export class PlayerProgressesRepository {
  constructor(
    @InjectRepository(PlayerProgressEntity)
    private playerProgressesRepo: Repository<PlayerProgressEntity>,
  ) {}

  async hasActiveGame(userId: number): Promise<boolean> {
    return this.playerProgressesRepo
      .createQueryBuilder('pp')
      .innerJoin('pp.game', 'g')
      .where('pp.userId = :userId', { userId })
      .andWhere('g.status = :status', { status: GameStatus.Active })
      .getExists();
  }
}
