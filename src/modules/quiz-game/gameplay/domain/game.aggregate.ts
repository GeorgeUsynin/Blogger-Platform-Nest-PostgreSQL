import { AggregateRoot } from '@nestjs/cqrs';
import {
  GameState,
  GameStatus,
  ReconstructGameInput,
} from './types/game.types';
import { GameToQuestion, PlayerProgress } from './value-objects';
import { GameRules } from './constants';
import {
  GameIsNotActiveDomainError,
  GameNotAcceptingPlayersDomainError,
  NotEnoughPublishedQuestionsDomainError,
  PlayerNotInGameDomainError,
} from './domainErrors';
import { GameScoreCalculator } from './helpers';

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
    this.ensureCanAcceptPlayers();
    this.props.playersProgresses.push(PlayerProgress.create(userId));
  }

  public addAnswer(body: string, userId: number) {
    this.ensureActiveGame();

    const playerProgress = this.playersProgresses.find(
      (pp) => pp.userId === userId,
    );

    if (!playerProgress) {
      throw new PlayerNotInGameDomainError();
    }

    playerProgress.addAnswer(body, this.questionsOfTheGame);
    this.updatePlayersScores();

    if (
      this.playersProgresses.every((pp) =>
        pp.isLastAnswer(GameRules.QUESTIONS_PER_GAME),
      )
    ) {
      this.finish();
    }
  }

  // ---------- game questions use-cases ----------

  private addQuestions(questionIds: number[]): void {
    if (questionIds.length !== GameRules.QUESTIONS_PER_GAME) {
      throw new NotEnoughPublishedQuestionsDomainError();
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

  private updatePlayersScores(): void {
    const scores = GameScoreCalculator.calculate(
      GameRules.QUESTIONS_PER_GAME,
      this.playersProgresses.map((pp, idx) => ({
        id: idx,
        answers: pp.answers.map((answer) => ({
          answerStatus: answer.answerStatus,
          createdAt: answer.createdAt,
        })),
      })),
    );

    this.playersProgresses.forEach((pp, idx) => {
      const playerScore = scores.find((score) => score.id === idx);
      pp.setScore(playerScore?.score ?? 0);
    });
  }

  // ---------- guards ----------

  public isReadyToStart(): boolean {
    return (
      this.playersProgresses.length > 1 &&
      this.status === GameStatus.PendingSecondPlayer
    );
  }

  public ensureActiveGame(): void {
    if (this.status !== GameStatus.Active) {
      throw new GameIsNotActiveDomainError();
    }
  }

  public ensureCanAcceptPlayers(): void {
    if (this.status !== GameStatus.PendingSecondPlayer) {
      throw new GameNotAcceptingPlayersDomainError();
    }
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

  private finish(): void {
    this.setStatus(GameStatus.Finished);
    this.setFinishGameDate(new Date());
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
