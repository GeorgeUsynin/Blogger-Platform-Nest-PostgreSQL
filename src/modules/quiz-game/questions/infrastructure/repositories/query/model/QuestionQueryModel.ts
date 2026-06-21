export type QuestionQueryModel = {
  id: number;
  body: string;
  correctAnswers: string[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
};
