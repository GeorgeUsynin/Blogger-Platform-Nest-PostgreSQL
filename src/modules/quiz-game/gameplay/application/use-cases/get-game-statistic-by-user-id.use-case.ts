import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { GamesQueryRepository } from '../../infrastructure/repositories/query/games.query-repository';
import { StatisticQueryModel } from '../../infrastructure/repositories/query/model/StatisticQueryModel';

export class GetGameStatisticByUserIdQuery extends Query<
  StatisticQueryModel | undefined
> {
  constructor(public readonly userId: number) {
    super();
  }
}

@QueryHandler(GetGameStatisticByUserIdQuery)
export class GetGameStatisticByUserIdUseCase implements IQueryHandler<
  GetGameStatisticByUserIdQuery,
  StatisticQueryModel | undefined
> {
  constructor(private gamesQueryRepository: GamesQueryRepository) {}

  async execute({
    userId,
  }: GetGameStatisticByUserIdQuery): Promise<StatisticQueryModel | undefined> {
    return this.gamesQueryRepository.getGameStatisticByUserId(userId);
  }
}
