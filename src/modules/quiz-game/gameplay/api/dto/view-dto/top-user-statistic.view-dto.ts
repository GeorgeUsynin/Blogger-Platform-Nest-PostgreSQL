import { ApiProperty } from '@nestjs/swagger';
import { StatisticViewDto } from './statistic.view-dto';
import { TopUserStatisticQueryModel } from '../../../infrastructure/repositories/query/model/TopUserStatisticQueryModel';

class Player {
  @ApiProperty()
  id: string;

  @ApiProperty()
  login: string;
}

export class TopUserStatisticViewDto extends StatisticViewDto {
  @ApiProperty({ type: Player })
  player: Player;

  public static mapToView(
    topUserStatistic: TopUserStatisticQueryModel,
  ): TopUserStatisticViewDto {
    const dto = new TopUserStatisticViewDto();

    dto.sumScore = topUserStatistic?.sumScore ?? 0;
    dto.avgScores = StatisticViewDto.roundToTwoDecimalPlaces(
      topUserStatistic?.avgScores ?? 0,
    );
    dto.gamesCount = topUserStatistic?.gamesCount ?? 0;
    dto.winsCount = topUserStatistic?.winsCount ?? 0;
    dto.lossesCount = topUserStatistic?.lossesCount ?? 0;
    dto.drawsCount = topUserStatistic?.drawsCount ?? 0;
    dto.player = {
      id: topUserStatistic.userId.toString(),
      login: topUserStatistic.userLogin,
    };

    return dto;
  }
}
