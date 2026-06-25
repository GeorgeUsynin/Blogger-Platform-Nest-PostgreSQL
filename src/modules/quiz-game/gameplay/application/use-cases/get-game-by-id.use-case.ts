import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import {
  GameNotFoundError,
  NotParticipatingInGameError,
} from '../../../../../core/exceptions';
import { GamesQueryRepository } from '../../infrastructure/repositories/query/games.query-repository';
import { GameQueryModel } from '../../infrastructure/repositories/query/model/GameQueryModel';

export class GetGameByIdQuery extends Query<GameQueryModel> {
  constructor(
    public readonly gameId: number,
    public readonly userId: number,
  ) {
    super();
  }
}

@QueryHandler(GetGameByIdQuery)
export class GetGameByIdUseCase
  implements IQueryHandler<GetGameByIdQuery, GameQueryModel>
{
  constructor(private gamesQueryRepository: GamesQueryRepository) {}

  async execute({ gameId, userId }: GetGameByIdQuery): Promise<GameQueryModel> {
    const game = await this.gamesQueryRepository.getGameById(gameId);

    if (!game) {
      throw new GameNotFoundError();
    }

    const isUsersGame = game.playerProgresses.some(
      (pp) => pp.player.id === userId,
    );

    if (!isUsersGame) {
      throw new NotParticipatingInGameError();
    }

    return game;
  }
}
