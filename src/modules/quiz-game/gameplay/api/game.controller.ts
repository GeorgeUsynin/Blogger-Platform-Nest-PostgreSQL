import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ROUTES } from '../../../../constants';
import { JwtHeaderAuthGuard } from '../../../user-accounts/users/guards/bearer';
import { ExtractUserFromRequest } from '../../../user-accounts/users/guards/decorators';
import { UserContextDto } from '../../../user-accounts/users/guards/dto';
import { AnswerViewDto, CreateAnswerInputDto, GameViewDto } from './dto';
import {
  AnswerCreationFailedError,
  GameConnectionCreationFailedError,
  GameNotFoundError,
} from '../../../../core/exceptions';
import {
  CreateAnswerCommand,
  CreateGameConnectionCommand,
  GetGameByIdQuery,
} from '../application/use-cases';
import { GamesQueryRepository } from '../infrastructure/repositories/query/games.query-repository';
import {
  CreateAnswerApi,
  CreateGameConnectionApi,
  GetCurrentGameApi,
  GetGameApi,
} from './swagger';

@Controller(`${ROUTES.PAIR_GAME_QUIZ}/${ROUTES.PAIRS}`)
@UseGuards(JwtHeaderAuthGuard)
export class GamesController {
  constructor(
    private gamesQueryRepository: GamesQueryRepository,
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @ApiBearerAuth()
  @Get(`${ROUTES.MY_CURRENT}`)
  @HttpCode(HttpStatus.OK)
  @GetCurrentGameApi()
  async getUserActiveGame(
    @ExtractUserFromRequest() user: UserContextDto,
  ): Promise<GameViewDto> {
    const game = await this.gamesQueryRepository.getUserActiveGame(user.userId);

    if (!game) {
      throw new GameNotFoundError();
    }

    return GameViewDto.mapToView(game);
  }

  @ApiBearerAuth()
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @GetGameApi()
  async getGameById(
    @Param('id', ParseIntPipe) id: number,
    @ExtractUserFromRequest() user: UserContextDto,
  ): Promise<GameViewDto> {
    const game = await this.queryBus.execute(
      new GetGameByIdQuery(id, user.userId),
    );

    return GameViewDto.mapToView(game);
  }

  @Post(`${ROUTES.MY_CURRENT}/${ROUTES.ANSWERS}`)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @CreateAnswerApi()
  async createAnswer(
    @Body() body: CreateAnswerInputDto,
    @ExtractUserFromRequest() user: UserContextDto,
  ): Promise<AnswerViewDto> {
    const gameId = await this.commandBus.execute(
      new CreateAnswerCommand(body, user.userId),
    );

    const createdAnswer =
      await this.gamesQueryRepository.getLastAnswerForUserInGame(
        gameId,
        user.userId,
      );

    if (!createdAnswer) {
      throw new AnswerCreationFailedError();
    }

    return AnswerViewDto.mapToView(createdAnswer);
  }

  @ApiBearerAuth()
  @Post(`${ROUTES.CONNECTION}`)
  @HttpCode(HttpStatus.OK)
  @CreateGameConnectionApi()
  async createGameConnection(
    @ExtractUserFromRequest() user: UserContextDto,
  ): Promise<GameViewDto> {
    const gameConnectionId = await this.commandBus.execute(
      new CreateGameConnectionCommand(user.userId),
    );

    const createdGameConnection =
      await this.gamesQueryRepository.getGameById(gameConnectionId);

    if (!createdGameConnection) {
      throw new GameConnectionCreationFailedError();
    }

    return GameViewDto.mapToView(createdGameConnection);
  }
}
