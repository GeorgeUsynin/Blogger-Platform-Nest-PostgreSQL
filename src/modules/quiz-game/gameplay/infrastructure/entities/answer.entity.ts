import { DB_TABLE_NAMES } from '../../../../../constants';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PlayerProgressEntity } from './player-progress.entity';
import { AnswerStatus } from '../../domain/types/game.types';
import { QuestionEntity } from '../../../questions/infrastructure/entities/question.entity';

@Entity({ name: DB_TABLE_NAMES.ANSWERS })
export class AnswerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  questionId: number;

  @Column({ type: 'integer' })
  playerProgressId: number;

  @Column({ type: 'varchar' })
  body: string;

  @Column({
    type: 'enum',
    enum: [AnswerStatus.Correct, AnswerStatus.Incorrect],
  })
  answerStatus: AnswerStatus;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @ManyToOne(() => QuestionEntity, { nullable: false })
  @JoinColumn({ name: 'questionId', referencedColumnName: 'id' })
  question: QuestionEntity;

  @ManyToOne(() => PlayerProgressEntity, { nullable: false })
  @JoinColumn({ name: 'playerProgressId', referencedColumnName: 'id' })
  playerProgress: PlayerProgressEntity;
}
