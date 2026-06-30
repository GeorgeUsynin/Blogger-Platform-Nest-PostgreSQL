import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import type { UserEntity } from './user.entity';
import { DB_TABLE_NAMES } from '../../../../../constants';

@Index('idx_password_recoveries_recovery_code', ['recoveryCode'])
@Entity({ name: DB_TABLE_NAMES.PASSWORD_RECOVERIES })
export class PasswordRecoveryEntity {
  @PrimaryColumn({ type: 'integer' })
  userId: number;

  @Column({ type: 'uuid', nullable: true })
  recoveryCode: string | null;

  @Column({ type: 'timestamp with time zone', nullable: true })
  expirationDate: Date | null;

  @OneToOne('UserEntity', { nullable: false })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: UserEntity;
}
