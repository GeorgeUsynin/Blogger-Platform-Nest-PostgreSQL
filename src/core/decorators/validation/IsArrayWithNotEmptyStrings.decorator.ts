import {
  IsArray,
  IsString,
  ArrayMinSize,
  IsNotEmpty,
  IsDefined,
} from 'class-validator';
import { applyDecorators } from '@nestjs/common';
import { TrimArrayValues } from '../transform';

export function IsArrayWithNotEmptyStrings(minSize: number = 1) {
  return applyDecorators(
    TrimArrayValues(),
    IsArray(),
    IsDefined({ each: true }),
    IsString({ each: true }),
    IsNotEmpty({ each: true }),
    ArrayMinSize(minSize),
  );
}
