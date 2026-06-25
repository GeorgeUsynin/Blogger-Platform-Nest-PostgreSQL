import { Answer } from '../value-objects';

export type PlayerProgressState = {
  id?: number;
  userId: number;
  answers: Answer[];
};

export type ReconstructPlayerProgressInput = Omit<PlayerProgressState, 'id'> & {
  id: number;
};
