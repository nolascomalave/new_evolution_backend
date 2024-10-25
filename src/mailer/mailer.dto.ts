import { Address } from "nodemailer/lib/mailer"


export type SendMailDto = {
    from?: Address | string,
    recipients: Address[] | string[],
    subject: string,
    html: string,
    text?: string,
    placeholderReplacements?: Record<string, string>
}