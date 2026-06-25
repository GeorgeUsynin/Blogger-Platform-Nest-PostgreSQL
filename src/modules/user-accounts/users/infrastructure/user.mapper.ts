import { User, EmailConfirmation, PasswordRecovery } from '../domain';
import { UserEntity } from './entities/user.entity';
import { WithId } from '../../../../types/common';

export class UserMapper {
  static toDomain(entity: UserEntity): WithId<User> {
    return User.reconstruct({
      id: entity.id,
      login: entity.login,
      email: entity.email,
      passwordHash: entity.passwordHash,
      emailConfirmation: EmailConfirmation.reconstruct({
        isConfirmed: entity.emailConfirmation.isConfirmed,
        confirmationCode: entity.emailConfirmation.confirmationCode,
        expirationDate: entity.emailConfirmation.expirationDate,
      }),
      passwordRecovery: entity.passwordRecovery
        ? PasswordRecovery.reconstruct({
            recoveryCode: entity.passwordRecovery.recoveryCode,
            expirationDate: entity.passwordRecovery.expirationDate,
          })
        : null,
    }) as WithId<User>;
  }

  static toPersistence(user: User): UserEntity {
    const entity = new UserEntity();

    if (user.id) {
      entity.id = user.id;
    }

    entity.login = user.login;
    entity.email = user.email;
    entity.passwordHash = user.passwordHash;
    entity.emailConfirmation = {
      isConfirmed: user.emailConfirmation.isConfirmed,
      confirmationCode: user.emailConfirmation.confirmationCode,
      expirationDate: user.emailConfirmation.expirationDate,
      user: entity,
      userId: entity.id,
    };
    entity.passwordRecovery = user.passwordRecovery
      ? {
          recoveryCode: user.passwordRecovery.recoveryCode,
          expirationDate: user.passwordRecovery.expirationDate,
          user: entity,
          userId: entity.id,
        }
      : null;

    return entity;
  }
}
