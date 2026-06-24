export type GameToQuestionState = {
  id?: number;
  questionId: number;
  order: number;
};

export type CreateGameToQuestionInput = {
  questionId: number;
  order: number;
};

export type ReconstructGameToQuestionInput = GameToQuestionState;
