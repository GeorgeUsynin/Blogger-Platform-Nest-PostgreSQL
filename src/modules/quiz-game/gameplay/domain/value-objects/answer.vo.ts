import {
  AnswerState,
  CreateAnswerInput,
  ReconstructAnswerInput,
} from '../types/answer.types';

export class Answer {
  private constructor(private props: AnswerState) {}

  // ---------- factory ----------

  static create(input: CreateAnswerInput): Answer {
    return new Answer({
      id: undefined,
      questionId: input.questionId,
      answerStatus: input.answerStatus,
      body: input.body,
      createdAt: new Date(),
    });
  }

  static reconstruct(input: ReconstructAnswerInput) {
    return new Answer(input);
  }

  // ---------- domain logic ----------

  // ---------- guards ----------

  // ---------- state queries ----------

  // ---------- state mutation ----------

  // ---------- getters ---------

  public get id(): AnswerState['id'] {
    return this.props.id;
  }

  public get questionId(): AnswerState['questionId'] {
    return this.props.questionId;
  }

  public get answerStatus(): AnswerState['answerStatus'] {
    return this.props.answerStatus;
  }

  public get body(): AnswerState['body'] {
    return this.props.body;
  }

  public get createdAt(): AnswerState['createdAt'] {
    return this.props.createdAt;
  }
}
