export type GameToQuestionState = {
  id?: number;
  questionId: number;
  correctAnswers?: string[];
  order: number;
};

export type CreateGameToQuestionInput = {
  questionId: number;
  order: number;
};

export type ReconstructGameToQuestionInput = Omit<
  GameToQuestionState,
  'id' | 'correctAnswers'
> & {
  id: number;
  correctAnswers: string[];
};
