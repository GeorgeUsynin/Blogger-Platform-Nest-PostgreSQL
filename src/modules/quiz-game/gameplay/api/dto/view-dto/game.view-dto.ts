import { ApiProperty } from '@nestjs/swagger';
import { AnswerStatus, GameStatus } from '../../../domain/types/game.types';

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

  @ApiProperty({ type: [Question], nullable: true })
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

  public static mapToView(game: any): GameViewDto {
    const dto = new GameViewDto();

    // dto.id = question.id.toString();
    // dto.body = question.body;
    // dto.correctAnswers = question.correctAnswers;
    // dto.published = question.isPublished;
    // dto.createdAt = question.createdAt;
    // dto.updatedAt = question.updatedAt;

    return dto;
  }
}
