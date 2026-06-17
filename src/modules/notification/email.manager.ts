import { EmailAdapter } from './email.adapter';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailManager {
  constructor(private emailAdapter: EmailAdapter) {}

  async sendConfirmationEmail(email: string, code: string) {
    const subject = 'Email Confirmation';
    const message = `<h1>Thank for your registration</h1>
        <p>To finish registration please follow the link below:
        <a href='https://some-front.com/confirm-email?code=${code}'>complete registration</a>
        </p>`;

    await this.emailAdapter.sendEmail(email, subject, message);
  }

  async sendPasswordRecoveryEmail(email: string, code: string) {
    const subject = 'Password Recovery';
    const message = `<h1>Password recovery</h1>
        <p>To finish password recovery please follow the link below:
        <a href='https://somesite.com/password-recovery?recoveryCode=${code}'>recovery password</a>
        </p>`;

    await this.emailAdapter.sendEmail(email, subject, message);
  }
}
