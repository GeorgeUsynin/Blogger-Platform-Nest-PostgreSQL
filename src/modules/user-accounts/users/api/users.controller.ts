import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBasicAuth } from '@nestjs/swagger';
import { UsersQueryRepository } from '../infrastructure';
import { PaginatedViewDto } from '../../../../core/dto';
import {
  CreateUserInputDto,
  GetUsersQueryParamsInputDto,
  UserViewDto,
} from './dto';
import {
  CreateUserApi,
  DeleteUserApi,
  GetAllUsersApi,
  GetUserApi,
} from './swagger';
import {
  UserCreationFailedError,
  UserNotFoundError,
} from '../../../../core/exceptions';
import { BasicAuthGuard } from '../guards/basic';
import { Public } from '../guards/decorators';
import {
  CreateConfirmedUserCommand,
  DeleteUserCommand,
} from '../application/use-cases';

@Controller('users')
@UseGuards(BasicAuthGuard)
export class UsersController {
  constructor(
    private commandBus: CommandBus,
    private usersQueryRepository: UsersQueryRepository,
  ) {}

  @Get()
  @ApiBasicAuth()
  @HttpCode(HttpStatus.OK)
  @GetAllUsersApi()
  async getAllUsers(
    @Query() query: GetUsersQueryParamsInputDto,
  ): Promise<PaginatedViewDto<UserViewDto>> {
    const { items, totalCount } =
      await this.usersQueryRepository.getAllUsers(query);

    const mappedItems = items.map(UserViewDto.mapToView);

    return PaginatedViewDto.mapToView({
      items: mappedItems,
      page: query.pageNumber,
      size: query.pageSize,
      totalCount,
    });
  }

  @Public()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @GetUserApi()
  async getUserById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserViewDto> {
    const foundUser = await this.usersQueryRepository.getUserById(id);

    if (!foundUser) {
      throw new UserNotFoundError();
    }

    return UserViewDto.mapToView(foundUser);
  }

  @Post()
  @ApiBasicAuth()
  @HttpCode(HttpStatus.CREATED)
  @CreateUserApi()
  async createUser(@Body() body: CreateUserInputDto): Promise<UserViewDto> {
    const userId = await this.commandBus.execute(
      new CreateConfirmedUserCommand(body),
    );

    const createdUser = await this.usersQueryRepository.getUserById(userId);

    if (!createdUser) {
      throw new UserCreationFailedError();
    }

    return UserViewDto.mapToView(createdUser);
  }

  @Delete(':id')
  @ApiBasicAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @DeleteUserApi()
  async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.commandBus.execute(new DeleteUserCommand(id));
  }
}
