import { GameRules } from '../constants';
import {
  PlayerProgressState,
  ReconstructPlayerProgressInput,
} from '../types/player-progress.types';
import {
  AllQuestionsAlreadyAnsweredDomainError,
  CorrectAnswersNotDefinedDomainError,
  QuestionIdNotDefinedDomainError,
  QuestionNotFoundDomainError,
} from '../domainErrors';
import { GameToQuestion } from './game-to-question.vo';
import { AnswerStatus } from '../types/game.types';
import { Answer } from './answer.vo';

export class PlayerProgress {
  private constructor(private props: PlayerProgressState) {}

  // ---------- factory ----------

  static create(userId: number): PlayerProgress {
    return new PlayerProgress({
      id: undefined,
      userId,
      answers: [],
      score: 0,
    });
  }

  static reconstruct(input: ReconstructPlayerProgressInput) {
    return new PlayerProgress(input);
  }

  // ---------- domain logic ----------

  public addAnswer(body: string, questions: GameToQuestion[]) {
    this.ensureCaAnswerNewQuestion(GameRules.QUESTIONS_PER_GAME);

    const question = questions.find((q) => q.order === this.nextAnswerOrder);

    if (!question) {
      throw new QuestionNotFoundDomainError();
    }

    if (!question.correctAnswers) {
      throw new CorrectAnswersNotDefinedDomainError();
    }

    const answerStatus = question.correctAnswers.includes(body.toLowerCase())
      ? AnswerStatus.Correct
      : AnswerStatus.Incorrect;

    if (!question.id) {
      throw new QuestionIdNotDefinedDomainError();
    }

    this.answers.push(
      Answer.create({
        questionId: question.questionId,
        answerStatus,
        body,
      }),
    );
  }

  // ---------- guards ----------

  private ensureCaAnswerNewQuestion(questionsPerGame: number): void {
    const playerAnswersCount = this.answers.length;

    if (playerAnswersCount === questionsPerGame) {
      throw new AllQuestionsAlreadyAnsweredDomainError();
    }
  }

  // ---------- state queries ----------

  public isLastAnswer(questionsPerGame: number): boolean {
    return this.answers.length === questionsPerGame;
  }

  // ---------- state mutation ----------

  public setScore(score: number): void {
    this.props.score = score;
  }

  // ---------- getters ---------

  public get id(): PlayerProgressState['id'] {
    return this.props.id;
  }

  public get userId(): PlayerProgressState['userId'] {
    return this.props.userId;
  }

  public get answers(): PlayerProgressState['answers'] {
    return this.props.answers;
  }

  public get score(): PlayerProgressState['score'] {
    return this.props.score;
  }

  public get nextAnswerOrder(): number {
    return this.answers.length + 1;
  }
}
