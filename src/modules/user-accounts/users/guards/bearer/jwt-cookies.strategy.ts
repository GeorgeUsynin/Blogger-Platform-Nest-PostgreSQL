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
    private deviceRepository: DevicesRepository,
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

    const foundDevice = await this.deviceRepository.findByDeviceId(deviceId);

    if (!foundDevice) {
      throw new UnauthorizedException();
    }

    if (!foundDevice.isDeviceOwner(userId)) {
      throw new UnauthorizedException();
    }

    if (!foundDevice.isDeviceIssuedAtMatch(new Date(iat * 1000))) {
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
