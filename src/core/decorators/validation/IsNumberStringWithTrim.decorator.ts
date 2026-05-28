import { applyDecorators } from '@nestjs/common';
import { IsDefined, IsNotEmpty, IsNumberString } from 'class-validator';

import { Trim } from '../transform';

export const IsNumberStringWithTrim = () =>
  // Combines decorators
  applyDecorators(
    // Trim transform decorator applied first, before validation decorators !!!
    Trim(),
    // Call order: @IsDefined() -> @IsNumberString() -> @IsNotEmpty()
    IsDefined(),
    IsNumberString(),
    IsNotEmpty(),
  );
