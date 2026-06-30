import { DB_TABLE_NAMES } from '../../../../../constants';
import {
  BeforeUpdate,
  Check,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { bodyCheckConstraints, bodyConstraints } from './constraints';
import type { GameToQuestionEntity } from '../../../gameplay/infrastructure/entities/game-to-question.entity';

@Check(bodyCheckConstraints)
@Index('idx_questions_created_at', ['createdAt'])
@Index('idx_questions_is_published', ['isPublished'])
@Index('idx_questions_body_trgm', { synchronize: false })
@Entity({ name: DB_TABLE_NAMES.QUESTIONS })
export class QuestionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: bodyConstraints.maxLength })
  body: string;

  @Column({ type: 'jsonb' })
  correctAnswers: string[];

  @Column({ type: 'boolean' })
  isPublished: boolean;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @Column({
    type: 'timestamp with time zone',
    nullable: true,
    default: null,
  })
  updatedAt: Date | null;

  @DeleteDateColumn({ type: 'timestamp with time zone' })
  deletedAt: Date | null;

  @BeforeUpdate()
  setUpdatedAt() {
    this.updatedAt = new Date();
  }

  @OneToMany(
    'GameToQuestionEntity',
    (gameToQuestion: GameToQuestionEntity) => gameToQuestion.question,
  )
  gameToQuestions: GameToQuestionEntity[];
}
