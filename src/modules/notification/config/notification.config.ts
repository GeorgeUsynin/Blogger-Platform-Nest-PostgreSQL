import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsBoolean, IsNotEmpty } from 'class-validator';
import { ENV_VARIABLE_NAMES } from '../../../constants';
import { configValidationUtility } from '../../../core/config';

@Injectable()
export class NotificationConfig {
  @IsNotEmpty({
    message: 'Set Env variable EMAIL_BLOG_PLATFORM, example: example@mail.com',
  })
  [ENV_VARIABLE_NAMES.EMAIL_BLOG_PLATFORM]: string = this.configService.get(
    ENV_VARIABLE_NAMES.EMAIL_BLOG_PLATFORM,
  ) as string;

  @IsNotEmpty({
    message: 'Set Env variable EMAIL_BLOG_PLATFORM_PASSWORD',
  })
  [ENV_VARIABLE_NAMES.EMAIL_BLOG_PLATFORM_PASSWORD]: string =
    this.configService.get(
      ENV_VARIABLE_NAMES.EMAIL_BLOG_PLATFORM_PASSWORD,
    ) as string;

  @IsNotEmpty({
    message: 'Set Env variable EMAIL_SERVICE, example: gmail',
  })
  [ENV_VARIABLE_NAMES.EMAIL_SERVICE]: string = this.configService.get(
    ENV_VARIABLE_NAMES.EMAIL_SERVICE,
  ) as string;

  @IsBoolean({
    message:
      'Set Env variable SHOULD_SEND_EMAIL to send confirmation/recovery emails, example: true, available values: true, false',
  })
  [ENV_VARIABLE_NAMES.SHOULD_SEND_EMAIL]: boolean =
    configValidationUtility.convertToBoolean(
      this.configService.get(ENV_VARIABLE_NAMES.SHOULD_SEND_EMAIL) as string,
    ) as boolean;

  constructor(private configService: ConfigService) {
    configValidationUtility.validateConfig(this);
  }
}
