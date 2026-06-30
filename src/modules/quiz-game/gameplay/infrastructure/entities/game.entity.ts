import { BaseDBEntity } from '../../../../shared/entities';
import { DB_TABLE_NAMES } from '../../../../../constants';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import type { GameToQuestionEntity } from './game-to-question.entity';
import { GameStatus } from '../../domain/types/game.types';
import type { PlayerProgressEntity } from './player-progress.entity';

@Entity({ name: DB_TABLE_NAMES.GAMES })
@Index('idx_games_created_at', ['createdAt'])
@Index('idx_games_status_created_at', ['status', 'createdAt'])
export class GameEntity extends BaseDBEntity {
  @Index('status_idx')
  @Column({
    type: 'enum',
    enum: [
      GameStatus.Active,
      GameStatus.Finished,
      GameStatus.PendingSecondPlayer,
    ],
  })
  status: GameStatus;

  @Column({ type: 'timestamp with time zone', nullable: true })
  finishGameDate: Date | null;

  @Column({ type: 'timestamp with time zone', nullable: true })
  startGameDate: Date | null;

  @OneToMany(
    'GameToQuestionEntity',
    (gameToQuestion: GameToQuestionEntity) => gameToQuestion.game,
    { cascade: true },
  )
  gameToQuestions: GameToQuestionEntity[];

  @OneToMany(
    'PlayerProgressEntity',
    (playerProgress: PlayerProgressEntity) => playerProgress.game,
    { cascade: true },
  )
  playersProgresses: PlayerProgressEntity[];
}
