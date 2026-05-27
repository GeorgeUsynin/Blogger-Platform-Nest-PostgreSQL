import { JwtBasePayloadDto } from './jwt-base-payload.dto';

export class JwtCookiesPayloadDto extends JwtBasePayloadDto {
  userId: number;
  deviceId: string;
}
