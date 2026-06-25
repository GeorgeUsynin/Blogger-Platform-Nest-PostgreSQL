import { Injectable } from '@nestjs/common';
import { GetUsersQueryParamsInputDto } from '../../../api/dto/input-dto/get-users-query-params.input-dto';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSortByFields } from '../../../api/dto/input-dto/user-sort-by-fields';
import { SortDirection } from '../../../../../../core/dto/base.query-params.input-dto';
import { UserEntity } from '../../entities/user.entity';
import { UserQueryModel } from './model/UserQueryModel';

@Injectable()
export class UsersQueryRepository {
  constructor(
    @InjectRepository(UserEntity) private usersRepo: Repository<UserEntity>,
  ) {}

  async getAllUsers(
    query: GetUsersQueryParamsInputDto,
  ): Promise<{ items: UserQueryModel[]; totalCount: number }> {
    const {
      sortBy,
      sortDirection,
      pageSize,
      searchEmailTerm,
      searchLoginTerm,
    } = query;

    const safeSortBy = Object.values(UserSortByFields).includes(sortBy)
      ? sortBy
      : UserSortByFields.CreatedAt;
    const safeSortDirection = Object.values(SortDirection).includes(
      sortDirection,
    )
      ? sortDirection.toUpperCase()
      : SortDirection.Desc.toUpperCase();

    const where: FindOptionsWhere<UserEntity>[] = [];

    if (searchLoginTerm) {
      where.push({ login: ILike(`%${searchLoginTerm}%`) });
    }

    if (searchEmailTerm) {
      where.push({ email: ILike(`%${searchEmailTerm}%`) });
    }

    const [items, totalCount] = await this.usersRepo.findAndCount({
      where,
      select: {
        id: true,
        login: true,
        email: true,
        createdAt: true,
      },
      order: {
        [safeSortBy]: safeSortDirection,
      },
      skip: query.calculateSkip(),
      take: pageSize,
    });

    return {
      items: items.map((user) => ({
        id: user.id,
        login: user.login,
        email: user.email,
        createdAt: user.createdAt,
      })),
      totalCount,
    };
  }

  async getUserById(id: number): Promise<UserQueryModel | null> {
    const user = await this.usersRepo.findOne({
      where: { id },
      select: {
        id: true,
        login: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) return null;

    return {
      id: user.id,
      login: user.login,
      email: user.email,
      createdAt: user.createdAt,
    };
  }
}
