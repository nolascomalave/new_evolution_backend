import { Resend } from 'resend';

const resendInstance = new Resend(process.env.RESEND_TOKEN);

export default resendInstance;