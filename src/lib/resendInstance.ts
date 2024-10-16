import { Resend } from 'resend';

const resendInstance = new Resend(process.env.MAIL_TOKEN);

export default resendInstance;