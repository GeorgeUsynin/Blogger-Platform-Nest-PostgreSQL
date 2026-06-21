import { BaseDBEntity } from '../../../../shared/entities';
import { DB_TABLE_NAMES } from '../../../../../constants';
import { Check, Column, Entity } from 'typeorm';
import { bodyCheckConstraints, bodyConstraints } from './constraints';

@Check(bodyCheckConstraints)
@Entity({ name: DB_TABLE_NAMES.QUESTIONS })
export class QuestionEntity extends BaseDBEntity {
  @Column({ type: 'varchar', length: bodyConstraints.maxLength })
  body: string;

  @Column({ type: 'jsonb' })
  correctAnswers: string[];

  @Column({ type: 'boolean' })
  isPublished: boolean;
}
