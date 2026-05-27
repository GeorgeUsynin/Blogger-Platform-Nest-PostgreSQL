import { JwtBasePayloadDto } from './jwt-base-payload.dto';

export class JwtHeaderPayloadDto extends JwtBasePayloadDto {
  userId: number;
}
