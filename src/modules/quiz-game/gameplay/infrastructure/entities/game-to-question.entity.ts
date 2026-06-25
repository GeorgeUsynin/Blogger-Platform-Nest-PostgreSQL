import { DB_TABLE_NAMES } from '../../../../../constants';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { QuestionEntity } from '../../../questions/infrastructure/entities/question.entity';
import type { GameEntity } from './game.entity';

@Index(['gameId', 'questionId'], { unique: true })
@Entity({ name: DB_TABLE_NAMES.GAMES_TO_QUESTIONS })
export class GameToQuestionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  gameId: number;

  @Column()
  questionId: number;

  @Column()
  order: number;

  @ManyToOne('QuestionEntity', (question: QuestionEntity) => question.gameToQuestions, {
    nullable: false,
  })
  @JoinColumn({ name: 'questionId', referencedColumnName: 'id' })
  question: QuestionEntity;

  @ManyToOne('GameEntity', (game: GameEntity) => game.gameToQuestions, {
    nullable: false,
  })
  @JoinColumn({ name: 'gameId', referencedColumnName: 'id' })
  game: GameEntity;
}
