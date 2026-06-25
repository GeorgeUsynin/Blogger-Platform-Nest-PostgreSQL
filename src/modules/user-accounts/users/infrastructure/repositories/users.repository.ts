import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { UserMapper } from '../user.mapper';
import { User } from '../../domain';
import { WithId } from '../../../../../types/common';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(UserEntity) private usersRepo: Repository<UserEntity>,
  ) {}

  async findUserById(id: number): Promise<WithId<User> | null> {
    const entity = await this.usersRepo.findOneBy({ id });

    return this.mapToDomain(entity);
  }

  async findUserByLogin(login: string): Promise<WithId<User> | null> {
    const entity = await this.usersRepo.findOneBy({ login });

    return this.mapToDomain(entity);
  }

  async findUserByEmail(email: string): Promise<WithId<User> | null> {
    const entity = await this.usersRepo.findOneBy({ email });

    return this.mapToDomain(entity);
  }

  async findUserByLoginOrEmail(
    loginOrEmail: string,
  ): Promise<WithId<User> | null> {
    const entity = await this.usersRepo.findOne({
      where: [{ login: loginOrEmail }, { email: loginOrEmail }],
    });

    return this.mapToDomain(entity);
  }

  async findUserByPasswordRecoveryCode(
    code: string,
  ): Promise<WithId<User> | null> {
    const entity = await this.usersRepo.findOne({
      where: { passwordRecovery: { recoveryCode: code } },
    });

    return this.mapToDomain(entity);
  }

  async findUserByEmailConfirmationCode(
    code: string,
  ): Promise<WithId<User> | null> {
    const entity = await this.usersRepo.findOne({
      where: { emailConfirmation: { confirmationCode: code } },
    });

    return this.mapToDomain(entity);
  }

  async softDeleteUserById(id: number): Promise<void> {
    await this.usersRepo.softDelete(id);
  }

  async saveUserAggregate(user: User): Promise<number> {
    const entity = UserMapper.toPersistence(user);

    return this.dataSource.transaction(async (manager) => {
      const result = await manager.save(UserEntity, entity);
      return result.id;
    });
  }

  private mapToDomain(entity: UserEntity | null): WithId<User> | null {
    if (!entity) return null;

    return UserMapper.toDomain(entity);
  }
}
