import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotParticipatingInGameError } from '../../../../../core/exceptions';
import { GamesRepository } from '../../infrastructure/repositories/games.repository';
import { CreateAnswerDto } from '../dto';

export class CreateAnswerCommand {
  constructor(
    public readonly dto: CreateAnswerDto,
    public readonly userId: number,
  ) {}
}

@CommandHandler(CreateAnswerCommand)
export class CreateAnswerUseCase implements ICommandHandler<CreateAnswerCommand> {
  constructor(private gamesRepository: GamesRepository) {}

  async execute({ dto, userId }: CreateAnswerCommand): Promise<void> {
    const game = await this.gamesRepository.findUserActiveGame(userId);

    if (!game) {
      throw new NotParticipatingInGameError();
    }

    game.addAnswer(dto.answer, userId);

    await this.gamesRepository.saveGameAggregate(game);
  }
}
