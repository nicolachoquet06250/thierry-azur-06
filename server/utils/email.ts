import nodemailer from 'nodemailer';
import { render } from '@vue-email/render';
import VerificationEmail from '../../app/emails/templates/VerificationEmail.vue';

export const send2FACode = async (email: string, code: string) => {
  const config = useRuntimeConfig();

  const transporter = nodemailer.createTransport({
    host: config.smtpHost,
    port: Number(config.smtpPort),
    secure: Number(config.smtpPort) === 465,
    auth: {
      user: config.smtpUser,
      pass: config.smtpPass,
    },
  });

  const html = await render(VerificationEmail, {
    code,
  });

  await transporter.sendMail({
    from: config.smtpFrom,
    to: email,
    subject: 'Votre code de connexion 2FA',
    html,
  });
};
