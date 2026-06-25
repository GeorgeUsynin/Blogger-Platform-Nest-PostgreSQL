import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotParticipatingInActiveGameError } from '../../../../../core/exceptions';
import { GamesRepository } from '../../infrastructure/repositories/games.repository';
import { CreateAnswerDto } from '../dto';

export class CreateAnswerCommand extends Command<number> {
  constructor(
    public readonly dto: CreateAnswerDto,
    public readonly userId: number,
  ) {
    super();
  }
}

@CommandHandler(CreateAnswerCommand)
export class CreateAnswerUseCase implements ICommandHandler<
  CreateAnswerCommand,
  number
> {
  constructor(private gamesRepository: GamesRepository) {}

  async execute({ dto, userId }: CreateAnswerCommand): Promise<number> {
    const game = await this.gamesRepository.findUserActiveGame(userId);

    if (!game) {
      throw new NotParticipatingInActiveGameError();
    }

    game.addAnswer(dto.answer, userId);

    await this.gamesRepository.saveGameAggregate(game);

    return game.id;
  }
}
