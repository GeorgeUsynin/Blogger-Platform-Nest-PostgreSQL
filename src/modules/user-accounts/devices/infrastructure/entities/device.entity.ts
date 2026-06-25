import { DB_TABLE_NAMES } from '../../../../../constants';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { UserEntity } from '../../../users/infrastructure/entities/user.entity';

@Entity({ name: DB_TABLE_NAMES.DEVICES })
export class DeviceEntity {
  @PrimaryColumn({ type: 'uuid' })
  deviceId: string;

  @Index('userId_idx')
  @Column({ name: 'userId', type: 'integer' })
  userId: number;

  @Column({ type: 'timestamp with time zone' })
  issuedAt: Date;

  @Column({ type: 'varchar' })
  deviceName: string;

  @Column({ type: 'varchar' })
  clientIp: string;

  @Column({ type: 'timestamp with time zone' })
  expiresIn: Date;

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: UserEntity;
}
