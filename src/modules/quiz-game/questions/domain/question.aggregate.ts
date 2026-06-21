import { AggregateRoot } from '@nestjs/cqrs';
import {
  QuestionState,
  CreateQuestionInput,
  ReconstructQuestionInput,
  UpdateQuestionInput,
} from './types';

export class Question extends AggregateRoot {
  private constructor(private props: QuestionState) {
    super();
  }

  // ---------- factory ----------

  static create(input: CreateQuestionInput): Question {
    return new Question({
      id: undefined,
      body: input.body,
      correctAnswers: input.correctAnswers,
      isPublished: false,
    });
  }

  static reconstruct(input: ReconstructQuestionInput): Question {
    return new Question(input);
  }

  // ---------- domain logic ----------

  public update(input: UpdateQuestionInput): void {
    this.props.body = input.body;
    this.props.correctAnswers = input.correctAnswers;
  }

  public updatePublishedStatus(isPublished: boolean): void {
    this.props.isPublished = isPublished;
  }

  // ---------- getters ---------

  public get id(): QuestionState['id'] {
    return this.props.id;
  }

  public get body(): QuestionState['body'] {
    return this.props.body;
  }

  public get correctAnswers(): QuestionState['correctAnswers'] {
    return this.props.correctAnswers;
  }

  public get isPublished(): QuestionState['isPublished'] {
    return this.props.isPublished;
  }
}
