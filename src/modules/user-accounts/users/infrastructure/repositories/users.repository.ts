import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { EventPublisher } from '@nestjs/cqrs';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from '../entities';
import { UserMapper } from '../user.mapper';
import { User } from '../../domain/user.aggregate';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(UserEntity) private usersRepo: Repository<UserEntity>,
    private publisher: EventPublisher,
  ) {}

  async findUserById(id: number): Promise<WithId<User> | null> {
    const entity = await this.usersRepo.findOneBy({ id });

    return this.hydrate(entity);
  }

  async findUserByLogin(login: string): Promise<WithId<User> | null> {
    const entity = await this.usersRepo.findOneBy({ login });

    return this.hydrate(entity);
  }

  async findUserByEmail(email: string): Promise<WithId<User> | null> {
    const entity = await this.usersRepo.findOneBy({ email });

    return this.hydrate(entity);
  }

  async findUserByLoginOrEmail(
    loginOrEmail: string,
  ): Promise<WithId<User> | null> {
    const entity = await this.usersRepo.findOne({
      where: [{ login: loginOrEmail }, { email: loginOrEmail }],
    });

    return this.hydrate(entity);
  }

  async findUserByPasswordRecoveryCode(
    code: string,
  ): Promise<WithId<User> | null> {
    const entity = await this.usersRepo.findOne({
      where: { passwordRecovery: { recoveryCode: code } },
    });

    return this.hydrate(entity);
  }

  async findUserByEmailConfirmationCode(
    code: string,
  ): Promise<WithId<User> | null> {
    const entity = await this.usersRepo.findOne({
      where: { emailConfirmation: { confirmationCode: code } },
    });

    return this.hydrate(entity);
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

  private hydrate(entity: UserEntity | null): WithId<User> | null {
    if (!entity) return null;

    const mappedToDomainEntity = UserMapper.toDomain(entity);

    return this.publisher.mergeObjectContext(mappedToDomainEntity);
  }
}
