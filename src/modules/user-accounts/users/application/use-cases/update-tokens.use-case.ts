import { Command, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, UnauthorizedException } from '@nestjs/common';
import {
  ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
  REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
} from '../constants';
import { JwtService } from '@nestjs/jwt';
import { DevicesRepository } from '../../../devices/infrastructure';

type TUpdateTokensCommandOutput = { accessToken: string; refreshToken: string };

export class UpdateTokensCommand extends Command<TUpdateTokensCommandOutput> {
  constructor(
    public readonly deviceId: string,
    public readonly userId: number,
  ) {
    super();
  }
}

@CommandHandler(UpdateTokensCommand)
export class UpdateTokensUseCase implements ICommandHandler<
  UpdateTokensCommand,
  TUpdateTokensCommandOutput
> {
  constructor(
    @Inject(ACCESS_TOKEN_STRATEGY_INJECT_TOKEN)
    private accessTokenContext: JwtService,
    @Inject(REFRESH_TOKEN_STRATEGY_INJECT_TOKEN)
    private refreshTokenContext: JwtService,
    private devicesRepository: DevicesRepository,
  ) {}

  async execute({
    deviceId,
    userId,
  }: UpdateTokensCommand): Promise<TUpdateTokensCommandOutput> {
    const device = await this.devicesRepository.findByDeviceId(deviceId);

    if (!device) {
      throw new UnauthorizedException();
    }

    // creating access token
    const accessTokenPayload = { userId };
    const accessToken = this.accessTokenContext.sign(accessTokenPayload);

    // creating refresh token
    const refreshTokenPayload = { userId, deviceId };
    const refreshToken = this.refreshTokenContext.sign(refreshTokenPayload);

    const { iat, exp } = this.refreshTokenContext.decode(refreshToken);
    const issuedAt = new Date(iat! * 1000);
    const expiresIn = new Date(exp! * 1000);

    device.updateSession({ issuedAt, expiresIn });
    await this.devicesRepository.saveDevice(device);

    return { accessToken, refreshToken };
  }
}
