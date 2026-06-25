import {
  CreateGameToQuestionInput,
  GameToQuestionState,
  ReconstructGameToQuestionInput,
} from '../types/game-to-question.types';

export class GameToQuestion {
  private constructor(private props: GameToQuestionState) {}

  // ---------- factory ----------

  static create(input: CreateGameToQuestionInput): GameToQuestion {
    return new GameToQuestion({
      id: undefined,
      questionId: input.questionId,
      order: input.order,
    });
  }

  static reconstruct(input: ReconstructGameToQuestionInput) {
    return new GameToQuestion(input);
  }

  // ---------- domain logic ----------

  // ---------- state mutation ----------

  // ---------- guards ----------

  // ---------- queries ----------

  // ---------- getters ---------

  public get id(): GameToQuestionState['id'] {
    return this.props.id;
  }

  public get questionId(): GameToQuestionState['questionId'] {
    return this.props.questionId;
  }

  public get order(): GameToQuestionState['order'] {
    return this.props.order;
  }
}
