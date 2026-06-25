import { DB_TABLE_NAMES } from '../../../../../constants';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import type { UserEntity } from './user.entity';

@Entity({ name: DB_TABLE_NAMES.EMAIL_CONFIRMATIONS })
export class EmailConfirmationEntity {
  @PrimaryColumn({ type: 'integer' })
  userId: number;

  @Column({ type: 'boolean' })
  isConfirmed: boolean;

  @Column({ type: 'uuid', nullable: true })
  confirmationCode: string | null;

  @Column({ type: 'timestamp with time zone', nullable: true })
  expirationDate: Date | null;

  @OneToOne('UserEntity', { nullable: false })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: UserEntity;
}
