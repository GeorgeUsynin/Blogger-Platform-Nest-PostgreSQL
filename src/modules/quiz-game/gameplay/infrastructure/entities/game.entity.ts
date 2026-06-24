import { BaseDBEntity } from '../../../../shared/entities';
import { DB_TABLE_NAMES } from '../../../../../constants';
import { Column, Entity, OneToMany } from 'typeorm';
import { GameToQuestionEntity } from './game-to-question.entity';
import { GameStatus } from '../../domain/types/game.types';
import { PlayerProgressEntity } from './player-progress.entity';

@Entity({ name: DB_TABLE_NAMES.GAMES })
export class GameEntity extends BaseDBEntity {
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
    () => GameToQuestionEntity,
    (gameToQuestion) => gameToQuestion.game,
    { cascade: true, eager: true },
  )
  gameToQuestions: GameToQuestionEntity[];

  @OneToMany(
    () => PlayerProgressEntity,
    (playerProgress) => playerProgress.game,
    { cascade: true, eager: true },
  )
  playersProgresses: PlayerProgressEntity[];
}
