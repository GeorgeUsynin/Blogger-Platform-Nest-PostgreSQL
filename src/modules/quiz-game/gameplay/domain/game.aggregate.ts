import { AggregateRoot } from '@nestjs/cqrs';
import { GameState, GameStatus, ReconstructGameInput } from './types';
import { GameToQuestion, PlayerProgress } from './value-objects';
import { GameRules } from './constants';
import { NotEnoughPublishedQuestions } from '../../../../core/exceptions';

export class Game extends AggregateRoot {
  private constructor(private props: GameState) {
    super();
  }

  // ---------- factory ----------

  static createPending(): Game {
    const game = new Game({
      id: undefined,
      status: GameStatus.PendingSecondPlayer,
      startGameDate: null,
      finishGameDate: null,
      playersProgresses: [],
      questionsOfTheGame: [],
    });

    return game;
  }

  static reconstruct(input: ReconstructGameInput): Game {
    return new Game(input);
  }

  // ---------- player progress use-cases ----------

  public addPlayer(userId: number): void {
    this.props.playersProgresses.push(PlayerProgress.create(userId));
  }

  // ---------- game questions use-cases ----------

  private addQuestions(questionIds: number[]): void {
    if (questionIds.length !== GameRules.QUESTIONS_PER_GAME) {
      throw new NotEnoughPublishedQuestions();
    }

    questionIds.forEach((id: number, idx: number) => {
      this.questionsOfTheGame.push(
        GameToQuestion.create({
          questionId: id,
          order: idx + 1,
        }),
      );
    });
  }

  // ---------- domain logic ----------

  public start(questionIds: number[]): void {
    this.addQuestions(questionIds);
    this.setStatus(GameStatus.Active);
    this.setStartGameDate(new Date());
  }

  // ---------- guards ----------

  public isReadyToStart(): boolean {
    return (
      this.playersProgresses.length > 1 &&
      this.status === GameStatus.PendingSecondPlayer
    );
  }

  // ---------- state mutation ----------

  private setStatus(status: GameStatus): void {
    this.props.status = status;
  }

  private setStartGameDate(date: Date): void {
    this.props.startGameDate = date;
  }

  private setFinishGameDate(date: Date): void {
    this.props.finishGameDate = date;
  }

  // ---------- getters ---------

  public get id(): GameState['id'] {
    return this.props.id;
  }

  public get status(): GameState['status'] {
    return this.props.status;
  }

  public get startGameDate(): GameState['startGameDate'] {
    return this.props.startGameDate;
  }

  public get finishGameDate(): GameState['finishGameDate'] {
    return this.props.finishGameDate;
  }

  public get playersProgresses(): GameState['playersProgresses'] {
    return this.props.playersProgresses;
  }

  public get questionsOfTheGame(): GameState['questionsOfTheGame'] {
    return this.props.questionsOfTheGame;
  }
}
