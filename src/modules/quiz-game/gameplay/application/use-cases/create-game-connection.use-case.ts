import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AlreadyParticipatingInActiveGame } from '../../../../../core/exceptions';
import { PlayerProgressesRepository } from '../../infrastructure/repositories/player-progresses.repository';
import { GamesRepository } from '../../infrastructure/repositories/game.repository';
import { Game } from '../../domain/game.aggregate';
import { QuestionsService } from '../../../questions/application/questions.service';
import { GameRules } from '../../domain/constants';
import { WithOptionalId } from '../../../../../types/common';

export class CreateGameConnectionCommand extends Command<number> {
  constructor(public readonly userId: number) {
    super();
  }
}

@CommandHandler(CreateGameConnectionCommand)
export class CreateGameConnectionUseCase implements ICommandHandler<
  CreateGameConnectionCommand,
  number
> {
  constructor(
    private questionsService: QuestionsService,
    private playerProgressesRepository: PlayerProgressesRepository,
    private gamesRepository: GamesRepository,
  ) {}

  async execute({ userId }: CreateGameConnectionCommand): Promise<number> {
    const hasActiveGame =
      await this.playerProgressesRepository.hasActiveGame(userId);

    if (hasActiveGame) {
      throw new AlreadyParticipatingInActiveGame();
    }

    let game: WithOptionalId<Game> | null =
      await this.gamesRepository.findPendingGame();

    game = game ?? Game.createPending();

    game.addPlayer(userId);

    if (game.isReadyToStart()) {
      const questionIds = await this.questionsService.getRandomQuestionIds(
        GameRules.QUESTIONS_PER_GAME,
      );
      game.start(questionIds);
    }

    const gameId = await this.gamesRepository.saveGameAggregate(game);

    return gameId;
  }
}
