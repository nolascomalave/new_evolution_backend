import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { SendMailDto } from './mailer.dto';
import Mail from 'nodemailer/lib/mailer';

@Injectable()
export class MailerService {
    constructor(private configService: ConfigService) {}

    mailTransport() {
        const transporterOptions = {
                host: this.configService.get<string>('SMTP_GMAIL_HOST'),
                port: this.configService.get<number>('SMTP_GMAIL_PORT'),
                secure: true, // true for port 465, false for other ports
                auth: {
                    user: this.configService.get<string>('SMTP_GMAIL_USER'),
                    pass: this.configService.get<string>('SMTP_GMAIL_PASSWORD')
                },
            },
            transporter = nodemailer.createTransport(transporterOptions);

        return transporter;
    }

    async sendMail({ from, recipients, subject, html, text, placeholderReplacements }: SendMailDto) {
        const transport = this.mailTransport();

        const options: Mail.Options = {
            from: from ?? this.configService.get<string>('FROM_MAIL_ADDRESS'),
            to: recipients,
            subject,
            html,
            text,
            // placeholderReplacements
        };

        const result = await transport.sendMail(options);

        return result;
    }
}
