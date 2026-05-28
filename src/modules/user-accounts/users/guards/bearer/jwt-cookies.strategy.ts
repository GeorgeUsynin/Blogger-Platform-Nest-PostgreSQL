import { type Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtCookiesPayloadDto, UserContextWithDeviceIdDto } from '../dto';
import { UserAccountsConfig } from '../../config';
import { DevicesRepository } from '../../../devices/infrastructure';

@Injectable()
export class JwtCookiesStrategy extends PassportStrategy(
  Strategy,
  'jwt-cookies',
) {
  constructor(
    protected userAccountsConfig: UserAccountsConfig,
    private devicesRepository: DevicesRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtCookiesStrategy.cookieExtractor,
      ]),
      ignoreExpiration: false,
      secretOrKey: userAccountsConfig.JWT_REFRESH_SECRET,
    });
  }

  async validate(
    payload: JwtCookiesPayloadDto,
  ): Promise<UserContextWithDeviceIdDto> {
    const { deviceId, userId, iat } = payload;

    const device = await this.devicesRepository.findByDeviceId(deviceId);

    if (!device) {
      throw new UnauthorizedException();
    }

    const isDeviceOwner = device.userId === userId;

    if (!isDeviceOwner) {
      throw new UnauthorizedException();
    }

    const isIssuedAtMatch =
      device.issuedAt.toISOString() === new Date(iat * 1000).toISOString();

    if (!isIssuedAtMatch) {
      throw new UnauthorizedException();
    }

    return { userId: payload.userId, deviceId: payload.deviceId };
  }

  private static cookieExtractor(req: Request) {
    let token = null;
    if (req && req.cookies) {
      token = req.cookies['refreshToken'];
    }
    return token;
  }
}
