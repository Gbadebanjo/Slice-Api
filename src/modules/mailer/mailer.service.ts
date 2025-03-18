import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerService {
  private nodemailerTransport: Mail;

  constructor(private readonly configService: ConfigService) {
    this.nodemailerTransport = createTransport({
      host: this.configService.get<string>('emailHost'),
      port: this.configService.get<number>('emailPort'),
      auth: {
        user: this.configService.get<string>('emailUser'),
        pass: this.configService.get<string>('emailPassword'),
      },
      debug: this.configService.get<boolean>('emailDebug'),
      logger: false,
      service: this.configService.get<string>('emailService'),
    });
  }

  sendMail(options: { from?: string; to: string; subject: string; text?: string; html: string }) {
    options.from = `${this.configService.get<string>('emailFromName')} <${this.configService.get<string>('emailUser')}>`;
    return this.nodemailerTransport.sendMail(options);
  }
}
