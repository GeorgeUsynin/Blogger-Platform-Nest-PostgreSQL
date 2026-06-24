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
import { UserEntity } from '../../../../user-accounts/users/infrastructure';
import { GameEntity } from './game.entity';
import { AnswerEntity } from './answer.entity';

@Entity({ name: DB_TABLE_NAMES.PLAYER_PROGRESSES })
export class PlayerProgressEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  userId: number;

  @Column({ type: 'integer' })
  gameId: number;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.playerProgresses, {
    nullable: false,
  })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  playerAccount: UserEntity;

  @ManyToOne(() => GameEntity, (game) => game.playersProgresses, {
    nullable: false,
  })
  @JoinColumn({ name: 'gameId', referencedColumnName: 'id' })
  game: GameEntity;

  @OneToMany(() => AnswerEntity, (answer) => answer.playerProgress, {
    cascade: true,
  })
  answers: AnswerEntity[];
}
