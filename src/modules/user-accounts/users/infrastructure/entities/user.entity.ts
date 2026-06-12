import { Check, Column, Entity, OneToMany, OneToOne } from 'typeorm';
import {
  loginCheckConstraints,
  emailCheckConstraints,
  loginConstraints,
  emailConstraints,
} from './constraints';
import { DB_TABLE_NAMES } from '../../../../../constants';
import { BaseDBEntity } from '../../../../shared/entities';
import { EmailConfirmationEntity } from './email-confirmation.entity';
import { PasswordRecoveryEntity } from './password-recovery.entity';
import { DeviceEntity } from '../../../devices/infrastructure';

@Check(loginCheckConstraints)
@Check(emailCheckConstraints)
@Entity({ name: DB_TABLE_NAMES.USERS })
export class UserEntity extends BaseDBEntity {
  @Column({ type: 'varchar', length: loginConstraints.maxLength, unique: true })
  login: string;

  @Column({ type: 'varchar', length: emailConstraints.maxLength, unique: true })
  email: string;

  @Column({ type: 'varchar' })
  passwordHash: string;

  @OneToOne(() => EmailConfirmationEntity, (ec) => ec.user, {
    cascade: true,
    eager: true,
  })
  emailConfirmation: EmailConfirmationEntity;

  @OneToOne(() => PasswordRecoveryEntity, (pr) => pr.user, {
    cascade: true,
    eager: true,
  })
  passwordRecovery: PasswordRecoveryEntity | null;

  @OneToMany(() => DeviceEntity, (device) => device.user)
  devices: DeviceEntity[];
}
