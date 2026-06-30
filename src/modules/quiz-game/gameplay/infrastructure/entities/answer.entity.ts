import { DB_TABLE_NAMES } from '../../../../../constants';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { PlayerProgressEntity } from './player-progress.entity';
import { AnswerStatus } from '../../domain/types/game.types';
import type { QuestionEntity } from '../../../questions/infrastructure/entities/question.entity';

@Index('idx_answers_player_progress_id_created_at', [
  'playerProgressId',
  'createdAt',
])
@Index('idx_answers_question_id', ['questionId'])
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

  @Column({ type: 'timestamp with time zone' })
  createdAt: Date;

  @ManyToOne('QuestionEntity', { nullable: false })
  @JoinColumn({ name: 'questionId', referencedColumnName: 'id' })
  question: QuestionEntity;

  @ManyToOne('PlayerProgressEntity', { nullable: false })
  @JoinColumn({ name: 'playerProgressId', referencedColumnName: 'id' })
  playerProgress: PlayerProgressEntity;
}
