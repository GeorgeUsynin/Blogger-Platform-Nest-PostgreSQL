import { ApiProperty } from '@nestjs/swagger';
import { StatisticQueryModel } from '../../../infrastructure/repositories/query/model/StatisticQueryModel';

export class StatisticViewDto {
  @ApiProperty({ description: 'Sum scores of all games' })
  sumScore: number;

  @ApiProperty({
    description: 'Average score of all games rounded to 2 decimal places',
  })
  avgScores: number;

  @ApiProperty({
    description: 'All played games count',
  })
  gamesCount: number;

  @ApiProperty()
  winsCount: number;

  @ApiProperty()
  lossesCount: number;

  @ApiProperty()
  drawsCount: number;

  public static mapToView(statistic?: StatisticQueryModel): StatisticViewDto {
    const dto = new StatisticViewDto();

    dto.sumScore = statistic?.sumScore ?? 0;
    dto.avgScores = StatisticViewDto.roundToTwoDecimalPlaces(
      statistic?.avgScores ?? 0,
    );
    dto.gamesCount = statistic?.gamesCount ?? 0;
    dto.winsCount = statistic?.winsCount ?? 0;
    dto.lossesCount = statistic?.lossesCount ?? 0;
    dto.drawsCount = statistic?.drawsCount ?? 0;

    return dto;
  }

  private static roundToTwoDecimalPlaces(value: number): number {
    return Math.round(value * 100) / 100;
  }
}
