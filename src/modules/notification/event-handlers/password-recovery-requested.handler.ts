import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PasswordRecoveryRequestedEvent } from '../../user-accounts/users/application/events';
import { EmailManager } from '../email.manager';

@Injectable()
export class PasswordRecoveryRequestedHandler {
  constructor(private emailManager: EmailManager) {}

  @OnEvent('password.recovery.requested')
  async handle(event: PasswordRecoveryRequestedEvent) {
    await this.emailManager.sendPasswordRecoveryEmail(event.email, event.code);
  }
}
