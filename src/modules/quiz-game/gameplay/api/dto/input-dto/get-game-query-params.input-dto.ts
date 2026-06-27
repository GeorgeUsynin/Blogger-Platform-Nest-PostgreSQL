import { ApiProperty } from '@nestjs/swagger';
import { BaseQueryParamsInputDto } from '../../../../../../core/dto';
import { GameSortByFields } from './game-sort-by-fields';
import { IsEnum } from 'class-validator';

export class GetGamesQueryParamsInputDto extends BaseQueryParamsInputDto {
  @ApiProperty({
    enum: GameSortByFields,
    required: false,
    default: GameSortByFields.PairCreatedDate,
  })
  @IsEnum(GameSortByFields)
  sortBy: GameSortByFields = GameSortByFields.PairCreatedDate;
}
