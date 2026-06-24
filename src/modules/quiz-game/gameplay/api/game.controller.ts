import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ROUTES } from '../../../../constants';
import { JwtHeaderAuthGuard } from '../../../user-accounts/users/guards/bearer';
import { ExtractUserFromRequest } from '../../../user-accounts/users/guards/decorators';
import { UserContextDto } from '../../../user-accounts/users/guards/dto';
import { GameViewDto } from './dto';
import { GameConnectionCreationFailedError } from '../../../../core/exceptions';
import { CreateGameConnectionCommand } from '../application/use-cases';
import { GamesQueryRepository } from '../infrastructure/repositories/query/games.query-repository';

@Controller(`${ROUTES.PAIR_GAME_QUIZ}/${ROUTES.PAIRS}`)
@UseGuards(JwtHeaderAuthGuard)
export class GamesController {
  constructor(
    private gamesQueryRepository: GamesQueryRepository,
    private commandBus: CommandBus,
  ) {}

  @ApiBearerAuth()
  @Post(`${ROUTES.CONNECTION}`)
  @HttpCode(HttpStatus.OK)
  // @CreateQuestionApi()
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
