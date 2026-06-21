export type QuestionState = {
  id?: number;
  body: string;
  correctAnswers: string[];
  isPublished: boolean;
};

export type CreateQuestionInput = {
  body: string;
  correctAnswers: string[];
};

export type ReconstructQuestionInput = Omit<QuestionState, 'id'> & {
  id: number;
};

export type UpdateQuestionInput = CreateQuestionInput;
