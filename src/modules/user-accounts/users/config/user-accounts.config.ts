import { type StringValue } from 'ms';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { ENV_VARIABLE_NAMES } from '../../../../constants';
import { configValidationUtility } from '../../../../core/config';

@Injectable()
export class UserAccountsConfig {
  @IsNumber(
    {},
    {
      message:
        'Env variable CONFIRMATION_CODE_EXPIRATION_TIME_IN_HOURS must be an integer, example: 1',
    },
  )
  @IsNotEmpty({
    message:
      'Set Env variable EMAIL_CONFIRMATION_CODE_EXPIRATION_TIME_IN_HOURS, example: 1',
  })
  [ENV_VARIABLE_NAMES.EMAIL_CONFIRMATION_CODE_EXPIRATION_TIME_IN_HOURS]: number =
    Number(
      this.configService.get(
        ENV_VARIABLE_NAMES.EMAIL_CONFIRMATION_CODE_EXPIRATION_TIME_IN_HOURS,
      ),
    );

  @IsNumber(
    {},
    {
      message:
        'Env variable CONFIRMATION_CODE_EXPIRATION_TIME_IN_HOURS must be an integer, example: 1',
    },
  )
  @IsNotEmpty({
    message:
      'Set Env variable RECOVERY_CODE_EXPIRATION_TIME_IN_HOURS, example: 1',
  })
  [ENV_VARIABLE_NAMES.RECOVERY_CODE_EXPIRATION_TIME_IN_HOURS]: number = Number(
    this.configService.get(
      ENV_VARIABLE_NAMES.RECOVERY_CODE_EXPIRATION_TIME_IN_HOURS,
    ),
  );

  @IsNotEmpty({
    message: 'Set Env variable ACCESS_TOKEN_EXPIRATION_TIME, example: 10m',
  })
  [ENV_VARIABLE_NAMES.ACCESS_TOKEN_EXPIRATION_TIME]: StringValue =
    this.configService.get(
      ENV_VARIABLE_NAMES.ACCESS_TOKEN_EXPIRATION_TIME,
    ) as StringValue;

  @IsNotEmpty({
    message: 'Set Env variable REFRESH_TOKEN_EXPIRATION_TIME, example: 1h',
  })
  [ENV_VARIABLE_NAMES.REFRESH_TOKEN_EXPIRATION_TIME]: StringValue =
    this.configService.get(
      ENV_VARIABLE_NAMES.REFRESH_TOKEN_EXPIRATION_TIME,
    ) as StringValue;

  @IsNotEmpty({
    message: 'Set Env variable JWT_ACCESS_SECRET, example: your-secret',
  })
  [ENV_VARIABLE_NAMES.JWT_ACCESS_SECRET]: string = this.configService.get(
    ENV_VARIABLE_NAMES.JWT_ACCESS_SECRET,
  ) as string;

  @IsNotEmpty({
    message: 'Set Env variable JWT_REFRESH_SECRET, example: your-secret',
  })
  [ENV_VARIABLE_NAMES.JWT_REFRESH_SECRET]: string = this.configService.get(
    ENV_VARIABLE_NAMES.JWT_REFRESH_SECRET,
  ) as string;

  @IsNotEmpty({
    message: 'Set Env variable ADMIN_USERNAME, example: basic auth login',
  })
  [ENV_VARIABLE_NAMES.ADMIN_USERNAME]: string = this.configService.get(
    ENV_VARIABLE_NAMES.ADMIN_USERNAME,
  ) as string;

  @IsNotEmpty({
    message: 'Set Env variable ADMIN_PASSWORD, example: basic auth password',
  })
  [ENV_VARIABLE_NAMES.ADMIN_PASSWORD]: string = this.configService.get(
    ENV_VARIABLE_NAMES.ADMIN_PASSWORD,
  ) as string;

  constructor(private configService: ConfigService) {
    configValidationUtility.validateConfig(this);
  }
}
