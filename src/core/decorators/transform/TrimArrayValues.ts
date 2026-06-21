import { Transform, TransformFnParams } from 'class-transformer';

export const TrimArrayValues = () =>
  Transform(({ value }: TransformFnParams) => {
    if (!Array.isArray(value)) return value;

    return value.map((el) => (typeof el === 'string' ? el.trim() : el));
  });
