import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EmailConfirmationRequestedEvent } from '../../user-accounts/users/application/events';
import { EmailManager } from '../email.manager';

@Injectable()
export class EmailConfirmationRequestedHandler {
  constructor(private emailManager: EmailManager) {}

  @OnEvent('email.confirmation.requested')
  async handle(event: EmailConfirmationRequestedEvent) {
    await this.emailManager.sendConfirmationEmail(event.email, event.code);
  }
}
