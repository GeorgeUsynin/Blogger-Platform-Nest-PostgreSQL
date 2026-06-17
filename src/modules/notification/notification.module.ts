import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailAdapter } from './email.adapter';
import { EmailManager } from './email.manager';
import {
  EmailConfirmationRequestedHandler,
  PasswordRecoveryRequestedHandler,
} from './event-handlers';
import { NotificationConfig, NotificationConfigModule } from './config';

@Module({
  imports: [
    // Using forRootAsync for proper environment variables loading
    MailerModule.forRootAsync({
      imports: [NotificationConfigModule],
      useFactory: async (notificationConfig: NotificationConfig) => ({
        transport: {
          host: '://gmail.com',
          service: notificationConfig.EMAIL_SERVICE,
          port: 465,
          secure: true,
          auth: {
            user: notificationConfig.EMAIL_BLOG_PLATFORM,
            pass: notificationConfig.EMAIL_BLOG_PLATFORM_PASSWORD,
          },
        },
        defaults: {
          from: `Blog Platform <${notificationConfig.EMAIL_BLOG_PLATFORM}>`,
        },
      }),
      inject: [NotificationConfig],
    }),
  ],
  providers: [
    EmailAdapter,
    EmailManager,
    EmailConfirmationRequestedHandler,
    PasswordRecoveryRequestedHandler,
    NotificationConfig,
  ],
  exports: [EmailManager],
})
export class NotificationsModule {}
