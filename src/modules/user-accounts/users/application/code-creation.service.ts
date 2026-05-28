import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { add } from 'date-fns/add';

@Injectable()
export class CodeCreationService {
  generateCodeWithExpirationDate(ttlHours: number): {
    code: string;
    expirationDate: Date;
  } {
    const code = randomUUID();
    const expirationDate = add(new Date(), {
      hours: ttlHours,
    });

    return { code, expirationDate };
  }
}
