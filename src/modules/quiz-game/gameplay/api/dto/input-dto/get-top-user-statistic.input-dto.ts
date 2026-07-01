import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { BaseQueryParamsInputDto } from '../../../../../../core/dto';
import { SortDirection } from '../../../../../../core/dto/base.query-params.input-dto';
import { TopUserStatisticSortFields } from './top-user-statistic-sort-fields';
import { MapSortStringToArray } from './decorators';

const TOP_USERS_STATISTIC_DEFAULT_SORT =
  'sort=avgScores desc&sort=sumScore desc';

export class SortItem {
  constructor(
    sortField: TopUserStatisticSortFields,
    sortDirection: SortDirection,
  ) {
    this.sortField = sortField;
    this.sortDirection = sortDirection;
  }

  @IsEnum(TopUserStatisticSortFields)
  sortField: TopUserStatisticSortFields;

  @IsEnum(SortDirection)
  sortDirection: SortDirection;
}

export class GetTopUserStatisticInputDto extends OmitType(
  BaseQueryParamsInputDto,
  ['sortDirection'] as const,
) {
  @ApiProperty({
    type: String,
    description: `Default value : ${TOP_USERS_STATISTIC_DEFAULT_SORT}`,
    required: false,
  })
  // parsing sort field into array
  @MapSortStringToArray()
  sort: SortItem[] = [
    new SortItem(TopUserStatisticSortFields.AvgScores, SortDirection.Desc),
    new SortItem(TopUserStatisticSortFields.SumScore, SortDirection.Desc),
  ];

  calculateSkip = () => {
    return (this.pageNumber - 1) * this.pageSize;
  };
}
