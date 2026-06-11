import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { SkipThrottle, ThrottlerGuard } from '@nestjs/throttler';
import { type Response, type Request } from 'express';
import { ExtractUserFromRequest } from '../guards/decorators';
import { UserContextDto, UserContextWithDeviceIdDto } from '../guards/dto';
import { LocalAuthGuard } from '../guards/local';
import {
  LoginApi,
  LogoutApi,
  MeApi,
  NewPasswordApi,
  PasswordRecoveryApi,
  RefreshTokenApi,
  RegistrationApi,
  RegistrationConfirmationApi,
  RegistrationEmailResendingApi,
} from './swagger';
import {
  CreateUserInputDto,
  LoginSuccessViewDto,
  MeViewDto,
  NewPasswordInputDto,
  PasswordRecoveryInputDto,
  RefreshTokenViewDto,
  RegistrationConfirmationInputDto,
  RegistrationEmailResendingInputDto,
} from './dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtCookiesAuthGuard, JwtHeaderAuthGuard } from '../guards/bearer';
import { UsersQueryRepository } from '../infrastructure';
import { UserNotFoundError } from '../../../../core/exceptions';
import {
  ConfirmRegistrationCommand,
  LoginUserCommand,
  LogoutUserCommand,
  NewPasswordCommand,
  RecoverPasswordCommand,
  RegisterUserCommand,
  ResendEmailConfirmationCommand,
  UpdateTokensCommand,
} from '../application/use-cases';
import { parseUserAgent } from './helpers';
import { ROUTES } from '../../../../constants';

@UseGuards(ThrottlerGuard)
@Controller(ROUTES.AUTH)
export class AuthController {
  constructor(
    private usersQueryRepository: UsersQueryRepository,
    private commandBus: CommandBus,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtHeaderAuthGuard)
  @Get(ROUTES.ME)
  @HttpCode(HttpStatus.OK)
  @MeApi()
  @SkipThrottle()
  async me(@ExtractUserFromRequest() user: UserContextDto): Promise<MeViewDto> {
    const foundUser = await this.usersQueryRepository.getUserById(user.userId);

    if (!foundUser) {
      throw new UserNotFoundError();
    }

    return MeViewDto.mapToView(foundUser);
  }

  @UseGuards(LocalAuthGuard)
  @Post(ROUTES.LOGIN)
  @HttpCode(HttpStatus.OK)
  @LoginApi()
  async login(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
    @ExtractUserFromRequest() user: UserContextDto,
    @Ip() clientIp: string,
  ): Promise<LoginSuccessViewDto> {
    const deviceName = parseUserAgent(request.headers['user-agent']);

    const { accessToken, refreshToken } = await this.commandBus.execute(
      new LoginUserCommand({ userId: user.userId, deviceName, clientIp }),
    );

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
    });

    return { accessToken };
  }

  @ApiBearerAuth()
  @UseGuards(JwtCookiesAuthGuard)
  @Post(ROUTES.LOGOUT)
  @HttpCode(HttpStatus.NO_CONTENT)
  @LogoutApi()
  @SkipThrottle()
  async logout(@ExtractUserFromRequest() user: UserContextWithDeviceIdDto) {
    await this.commandBus.execute(new LogoutUserCommand(user.deviceId));
  }

  @ApiBearerAuth()
  @UseGuards(JwtCookiesAuthGuard)
  @Post(ROUTES.REFRESH_TOKEN)
  @HttpCode(HttpStatus.OK)
  @RefreshTokenApi()
  @SkipThrottle()
  async refreshToken(
    @Res({ passthrough: true }) response: Response,
    @ExtractUserFromRequest() user: UserContextWithDeviceIdDto,
  ): Promise<RefreshTokenViewDto> {
    const { accessToken, refreshToken } = await this.commandBus.execute(
      new UpdateTokensCommand(user.deviceId, user.userId),
    );

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
    });

    return { accessToken };
  }

  @Post(ROUTES.PASSWORD_RECOVERY)
  @HttpCode(HttpStatus.NO_CONTENT)
  @PasswordRecoveryApi()
  async passwordRecovery(
    @Body() body: PasswordRecoveryInputDto,
  ): Promise<void> {
    const { email } = body;

    await this.commandBus.execute(new RecoverPasswordCommand(email));
  }

  @Post(ROUTES.NEW_PASSWORD)
  @HttpCode(HttpStatus.NO_CONTENT)
  @NewPasswordApi()
  async newPassword(@Body() body: NewPasswordInputDto): Promise<void> {
    const { newPassword, recoveryCode } = body;

    await this.commandBus.execute(
      new NewPasswordCommand(newPassword, recoveryCode),
    );
  }

  @Post(ROUTES.REGISTRATION_CONFIRMATION)
  @HttpCode(HttpStatus.NO_CONTENT)
  @RegistrationConfirmationApi()
  async registrationConfirmation(
    @Body() body: RegistrationConfirmationInputDto,
  ): Promise<void> {
    const { code } = body;

    await this.commandBus.execute(new ConfirmRegistrationCommand(code));
  }

  @Post(ROUTES.REGISTRATION)
  @HttpCode(HttpStatus.NO_CONTENT)
  @RegistrationApi()
  async registration(@Body() body: CreateUserInputDto): Promise<void> {
    await this.commandBus.execute(new RegisterUserCommand(body));
  }

  @Post(ROUTES.REGISTRATION_EMAIL_RESENDING)
  @HttpCode(HttpStatus.NO_CONTENT)
  @RegistrationEmailResendingApi()
  async registrationEmailResending(
    @Body() body: RegistrationEmailResendingInputDto,
  ): Promise<void> {
    const { email } = body;

    await this.commandBus.execute(new ResendEmailConfirmationCommand(email));
  }
}
