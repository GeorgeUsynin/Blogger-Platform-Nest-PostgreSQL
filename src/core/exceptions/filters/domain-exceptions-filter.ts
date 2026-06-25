import { Catch, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { BaseExceptionFilter } from './base-exception-filter';
import { BaseDomainException } from '../domainExceptions';
import { ErrorCode, ErrorCodes } from '../constants';

@Catch(BaseDomainException)
export class DomainExceptionsFilter extends BaseExceptionFilter {
  onCatch(
    exception: BaseDomainException,
    response: Response,
    request: Request,
  ): void {
    const status = this.domainErrorToHttpStatus(exception.code);
    const errorsMessages = this.createErrorMessages([exception]);

    response
      .status(status)
      .json(this.getDefaultHttpBody(request.url, status, errorsMessages));
  }

  domainErrorToHttpStatus(code: ErrorCode) {
    switch (code) {
      case ErrorCodes.LOGIN_ALREADY_EXISTS:
      case ErrorCodes.EMAIL_ALREADY_EXISTS:
      case ErrorCodes.INVALID_CONFIRMATION_CODE:
      case ErrorCodes.INVALID_PASSWORD_RECOVERY_CODE:
      case ErrorCodes.CONFIRMATION_CODE_EXPIRED:
      case ErrorCodes.PASSWORD_RECOVERY_CODE_EXPIRED:
      case ErrorCodes.PASSWORD_RECOVERY_CODE_EXPIRED:
        return HttpStatus.BAD_REQUEST;
      case ErrorCodes.USER_NOT_FOUND:
      case ErrorCodes.BLOG_NOT_FOUND:
      case ErrorCodes.GAME_NOT_FOUND:
      case ErrorCodes.POST_NOT_FOUND:
      case ErrorCodes.QUESTION_NOT_FOUND:
      case ErrorCodes.COMMENT_NOT_FOUND:
      case ErrorCodes.DEVICE_NOT_FOUND:
        return HttpStatus.NOT_FOUND;
      case ErrorCodes.NOT_AN_OWNER_OF_THIS_DEVICE:
      case ErrorCodes.NOT_AN_OWNER_OF_THIS_COMMENT:
      case ErrorCodes.USER_ALREADY_HAS_ACTIVE_GAME:
      case ErrorCodes.NOT_PARTICIPATING_IN_GAME:
      case ErrorCodes.PLAYER_NOT_IN_GAME:
      case ErrorCodes.GAME_IS_NOT_ACTIVE:
      case ErrorCodes.GAME_NOT_ACCEPTING_PLAYERS:
      case ErrorCodes.ALL_QUESTIONS_ALREADY_ANSWERED:
        return HttpStatus.FORBIDDEN;
      case ErrorCodes.NOT_ENOUGH_PUBLISHED_QUESTIONS:
        return HttpStatus.CONFLICT;
      case ErrorCodes.USER_CREATION_FAILED:
        return HttpStatus.INTERNAL_SERVER_ERROR;
      default:
        return HttpStatus.BAD_REQUEST;
    }
  }
}
