import { DB_TABLE_NAMES } from '../../../../../constants';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { UserEntity } from '../../../../user-accounts/users/infrastructure/entities/user.entity';
import type { GameEntity } from './game.entity';
import type { AnswerEntity } from './answer.entity';

@Entity({ name: DB_TABLE_NAMES.PLAYER_PROGRESSES })
export class PlayerProgressEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  userId: number;

  @Column({ type: 'integer' })
  gameId: number;

  @Column({ type: 'integer', default: 0 })
  score: number;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @ManyToOne('UserEntity', (user: UserEntity) => user.playerProgresses, {
    nullable: false,
  })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  playerAccount: UserEntity;

  @ManyToOne('GameEntity', (game: GameEntity) => game.playersProgresses, {
    nullable: false,
  })
  @JoinColumn({ name: 'gameId', referencedColumnName: 'id' })
  game: GameEntity;

  @OneToMany('AnswerEntity', (answer: AnswerEntity) => answer.playerProgress, {
    cascade: true,
  })
  answers: AnswerEntity[];
}
