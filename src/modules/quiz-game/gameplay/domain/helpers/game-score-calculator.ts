import { AnswerStatus } from '../types/game.types';
import { AnswerCreatedDateIsMissingDomainError } from '../domainErrors';

type Answer = {
  answerStatus: AnswerStatus;
  createdAt: Date;
};

type PlayerProgress = {
  id: number;
  answers: Answer[];
};

type PlayerScore = {
  id: number;
  score: number;
};

type Stats = {
  id: number;
  answersCount: number;
  correctAnswersCount: number;
  lastAnswerDate?: Date;
};

export class GameScoreCalculator {
  static calculate(
    questionsCount: number,
    playerProgresses: PlayerProgress[],
  ): PlayerScore[] {
    if (questionsCount <= 0) {
      return playerProgresses.map((pp) => ({
        id: pp.id,
        score: 0,
      }));
    }

    const playersStats: Stats[] = [];

    playerProgresses.forEach((pp) => {
      const stats = {
        id: pp.id,
        answersCount: pp.answers.length,
        correctAnswersCount: pp.answers.filter(
          (answer) => answer.answerStatus === AnswerStatus.Correct,
        ).length,
        lastAnswerDate: pp.answers.reduce<Date | undefined>(
          (latest, answer) => {
            if (!latest || answer.createdAt.getTime() > latest.getTime()) {
              return answer.createdAt;
            }
            return latest;
          },
          undefined,
        ),
      };

      playersStats.push(stats);
    });

    if (playersStats.every((stat) => stat.answersCount === questionsCount)) {
      return [...playersStats]
        .sort((ps1, ps2) => {
          if (!ps1.lastAnswerDate || !ps2.lastAnswerDate) {
            throw new AnswerCreatedDateIsMissingDomainError();
          }

          return ps1.lastAnswerDate.getTime() - ps2.lastAnswerDate.getTime();
        })
        .map((ps: Stats, idx: number) => {
          const hasSpeedBonus = idx === 0 && ps.correctAnswersCount > 0;

          return {
            id: ps.id,
            score: ps.correctAnswersCount + (hasSpeedBonus ? 1 : 0),
          };
        });
    } else {
      return playersStats.map((stat) => ({
        id: stat.id,
        score: stat.correctAnswersCount,
      }));
    }
  }
}
