import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { UserMapper } from '../user.mapper';
import { User } from '../../domain';
import { WithId } from '../../../../../types/common';

@Injectable()
export class UsersExternalRepository {
  constructor(
    @InjectRepository(UserEntity) private usersRepo: Repository<UserEntity>,
  ) {}

  async findById(id: number): Promise<WithId<User> | null> {
    const entity = await this.usersRepo.findOneBy({ id });

    return entity ? UserMapper.toDomain(entity) : null;
  }
}
