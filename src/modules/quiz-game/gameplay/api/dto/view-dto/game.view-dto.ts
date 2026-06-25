import { ApiProperty } from '@nestjs/swagger';
import { AnswerStatus, GameStatus } from '../../../domain/types/game.types';
import { GameQueryModel } from '../../../infrastructure/repositories/query/model';

class Answer {
  @ApiProperty()
  questionId: string;

  @ApiProperty({ enum: AnswerStatus })
  answerStatus: AnswerStatus;

  @ApiProperty({ type: Date })
  addedAt: Date;
}

class Question {
  @ApiProperty()
  id: string;

  @ApiProperty({ description: 'Here is the question itself' })
  body: string;
}

class Player {
  @ApiProperty()
  id: string;

  @ApiProperty()
  login: string;
}

class PlayerProgress {
  @ApiProperty({ type: [Answer] })
  answers: Answer[];

  @ApiProperty({ type: Player })
  player: Player;

  @ApiProperty({ description: 'Player score' })
  score: number;
}

export class GameViewDto {
  @ApiProperty({ description: 'Id of pair' })
  id: string;

  @ApiProperty({ type: PlayerProgress })
  firstPlayerProgress: PlayerProgress;

  @ApiProperty({ type: PlayerProgress, nullable: true })
  secondPlayerProgress: PlayerProgress | null;

  @ApiProperty({
    type: [Question],
    nullable: true,
    description:
      "Questions for both players (can be null if second player haven't connected yet)",
  })
  questions: Question[] | null;

  @ApiProperty({ enum: GameStatus })
  status: GameStatus;

  @ApiProperty({
    type: Date,
    description: 'Date when first player initialized the pair',
  })
  pairCreatedDate: Date;

  @ApiProperty({
    type: Date,
    nullable: true,
    description:
      'Game starts immediately after second player connection to this pair',
  })
  startGameDate: Date | null;

  @ApiProperty({
    type: Date,
    nullable: true,
    description:
      'Game finishes immediately after both players have answered all the questions',
  })
  finishGameDate: Date | null;

  public static mapToView(game: GameQueryModel): GameViewDto {
    const dto = new GameViewDto();

    dto.id = game.id.toString();
    dto.status = game.status;
    dto.pairCreatedDate = game.createdAt;
    dto.startGameDate = game.startGameDate;
    dto.finishGameDate = game.finishGameDate;
    dto.firstPlayerProgress = {
      answers: game.playerProgresses[0].answers.map((a) => ({
        questionId: a.questionId.toString(),
        answerStatus: a.answerStatus,
        addedAt: a.createdAt,
      })),
      player: {
        id: game.playerProgresses[0].player.id.toString(),
        login: game.playerProgresses[0].player.login,
      },
      score: game.playerProgresses[0].score,
    };
    dto.secondPlayerProgress = game.playerProgresses[1]
      ? {
          answers: game.playerProgresses[1].answers.map((a) => ({
            questionId: a.questionId.toString(),
            answerStatus: a.answerStatus,
            addedAt: a.createdAt,
          })),
          player: {
            id: game.playerProgresses[1].player.id.toString(),
            login: game.playerProgresses[1].player.login,
          },
          score: game.playerProgresses[1].score,
        }
      : null;
    dto.questions =
      game.status === GameStatus.PendingSecondPlayer
        ? null
        : game.questions.map((q) => ({
            id: q.id.toString(),
            body: q.body,
          }));

    return dto;
  }
}
