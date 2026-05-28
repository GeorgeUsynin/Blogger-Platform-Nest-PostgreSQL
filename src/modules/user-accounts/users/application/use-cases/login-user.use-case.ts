import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'node:crypto';
import {
  ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
  REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
} from '../constants';
import { LoginUserDto } from '../dto';
import { DevicesRepository } from '../../../devices/infrastructure';

type TLoginCommandOutput = { accessToken: string; refreshToken: string };

export class LoginUserCommand extends Command<TLoginCommandOutput> {
  constructor(public readonly dto: LoginUserDto) {
    super();
  }
}

@CommandHandler(LoginUserCommand)
export class LoginUserUseCase implements ICommandHandler<
  LoginUserCommand,
  TLoginCommandOutput
> {
  constructor(
    @Inject(ACCESS_TOKEN_STRATEGY_INJECT_TOKEN)
    private accessTokenContext: JwtService,
    @Inject(REFRESH_TOKEN_STRATEGY_INJECT_TOKEN)
    private refreshTokenContext: JwtService,
    private devicesRepository: DevicesRepository,
  ) {}

  async execute({ dto }: LoginUserCommand): Promise<TLoginCommandOutput> {
    const { userId, clientIp, deviceName } = dto;

    // creating access token
    const accessTokenPayload = { userId };
    const accessToken = this.accessTokenContext.sign(accessTokenPayload);

    // creating refresh token
    const uniqueDeviceId = randomUUID();
    const refreshTokenPayload = { userId, deviceId: uniqueDeviceId };
    const refreshToken = this.refreshTokenContext.sign(refreshTokenPayload);

    const { iat, exp } = this.refreshTokenContext.decode(refreshToken);
    const issuedAt = new Date(iat! * 1000);
    const expiresIn = new Date(exp! * 1000);

    await this.devicesRepository.createDevice({
      userId,
      deviceId: uniqueDeviceId,
      clientIp,
      deviceName,
      issuedAt,
      expiresIn,
    });

    return { accessToken, refreshToken };
  }
}
