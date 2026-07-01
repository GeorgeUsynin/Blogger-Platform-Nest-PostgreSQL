import { StatisticQueryModel } from './StatisticQueryModel';

type Player = {
  id: string;
  login: string;
};

export type TopUserStatisticQueryModel = StatisticQueryModel & Player;
