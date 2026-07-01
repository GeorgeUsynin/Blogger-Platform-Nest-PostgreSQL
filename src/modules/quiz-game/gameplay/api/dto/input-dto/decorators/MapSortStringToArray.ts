import { Transform, TransformFnParams } from 'class-transformer';
import { TopUserStatisticSortFields } from '../top-user-statistic-sort-fields';
import { BadRequestHttpException } from '../../../../../../../core/exceptions';
import { SortDirection } from '../../../../../../../core/dto/base.query-params.input-dto';
import { SortItem } from '../get-top-user-statistic.input-dto';

const errorMessageSortFields = `Please use only ${Object.values(TopUserStatisticSortFields).join(', ')} sort fields`;
const errorMessageSortDirection = `Please use only ${Object.values(SortDirection).join(', ')} sort directions`;
const errorMessageWrongQueryFormat =
  'Wrong query format. Example: "?sort=avgScores desc" or "?sort=avgScores desc&sort=sumScore desc"';

const isTopUserStatisticSortField = (
  value: string,
): value is TopUserStatisticSortFields =>
  Object.values(TopUserStatisticSortFields).includes(
    value as TopUserStatisticSortFields,
  );

const isSortDirection = (value: string): value is SortDirection =>
  Object.values(SortDirection).includes(value as SortDirection);

export const MapSortStringToArray = () =>
  Transform(({ value }: TransformFnParams) => {
    const values = Array.isArray(value) ? value : [value];

    return values.flatMap((item) => {
      if (typeof item !== 'string') return item;

      const [sortField, sortDirection] = item.trim().split(/\s+/);

      if (!sortField || !sortDirection) {
        throw new BadRequestHttpException([
          { field: 'sort', message: errorMessageWrongQueryFormat },
        ]);
      }

      if (!isTopUserStatisticSortField(sortField)) {
        throw new BadRequestHttpException([
          { field: 'sort', message: errorMessageSortFields },
        ]);
      }

      if (!isSortDirection(sortDirection)) {
        throw new BadRequestHttpException([
          { field: 'sort', message: errorMessageSortDirection },
        ]);
      }

      return new SortItem(sortField, sortDirection);
    });
  });
