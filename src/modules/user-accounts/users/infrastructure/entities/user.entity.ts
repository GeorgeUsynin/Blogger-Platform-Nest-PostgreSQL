import { Check, Column, Entity, OneToMany, OneToOne } from 'typeorm';
import {
  loginCheckConstraints,
  emailCheckConstraints,
  loginConstraints,
  emailConstraints,
} from './constraints';
import { DB_TABLE_NAMES } from '../../../../../constants';
import { BaseDBEntity } from '../../../../shared/entities';
import type { EmailConfirmationEntity } from './email-confirmation.entity';
import type { PasswordRecoveryEntity } from './password-recovery.entity';
import type { PlayerProgressEntity } from '../../../../quiz-game/gameplay/infrastructure/entities/player-progress.entity';

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

  @OneToOne('EmailConfirmationEntity', (ec: EmailConfirmationEntity) => ec.user, {
    cascade: true,
    eager: true,
  })
  emailConfirmation: EmailConfirmationEntity;

  @OneToOne('PasswordRecoveryEntity', (pr: PasswordRecoveryEntity) => pr.user, {
    cascade: true,
    eager: true,
  })
  passwordRecovery: PasswordRecoveryEntity | null;

  @OneToMany('PlayerProgressEntity', (pp: PlayerProgressEntity) => pp.playerAccount)
  playerProgresses: PlayerProgressEntity[];
}
