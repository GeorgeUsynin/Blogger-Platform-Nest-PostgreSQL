import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { NotificationConfig } from './config';

@Injectable()
export class EmailAdapter {
  constructor(
    private mailerService: MailerService,
    private notificationConfig: NotificationConfig,
  ) {}

  async sendEmail(email: string, subject: string, message: string) {
    if (!this.notificationConfig.SHOULD_SEND_EMAIL) return;

    return this.mailerService
      .sendMail({
        to: email,
        subject: subject,
        html: message,
      })
      .catch((err) => {
        console.error(err);
        throw new Error('Email adapter send error');
      });
  }
}
