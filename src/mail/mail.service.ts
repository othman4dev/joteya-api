import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendUserConfirmation(email: string, code: number, name: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to our app! Confirm your Email',
      template: './verify',
      context: {
        code,
        name,
        company: process.env.COMPANY_NAME,
      },
    });
  }

  async sendResetPassword(email: string, code: number, name: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Password Reset',
      template: './reset',
      context: {
        code,
        name,
        company: process.env.COMPANY_NAME,
      },
    });
  }

  async sendWelcomeEmail(email: string, name: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to our app!',
      template: './welcome',
      context: {
        name,
        company: process.env.COMPANY_NAME,
      },
    });
  }

  // Add other email sending methods as needed
}
