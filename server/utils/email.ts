import nodemailer from 'nodemailer';
import { render } from '@vue-email/render';
import VerificationEmail from '../../app/emails/templates/VerificationEmail.vue';
import WelcomeAdminEmail from '../../app/emails/templates/WelcomeAdminEmail.vue';
import ResetPasswordEmail from '../../app/emails/templates/ResetPasswordEmail.vue';

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
    debug: true
  });

  const html = await render(VerificationEmail, {
    code,
  });

  const text = await render(VerificationEmail, {
    code,
  }, {plainText: true});

  await transporter.sendMail({
    from: config.smtpFrom,
    to: email,
    subject: 'Votre code de connexion 2FA',
    html, text
  });
};

export const sendWelcomeAdminEmail = async (email: string, firstName: string, password: string) => {
  const config = useRuntimeConfig();

  const transporter = nodemailer.createTransport({
    host: config.smtpHost,
    port: Number(config.smtpPort),
    secure: Number(config.smtpPort) === 465,
    auth: {
      user: config.smtpUser,
      pass: config.smtpPass,
    },
    debug: true,
  });

  const html = await render(WelcomeAdminEmail, {
    firstName,
    email,
    password,
  });

  const text = await render(WelcomeAdminEmail, {
    firstName,
    email,
    password,
  }, {plainText: true});

  await transporter.sendMail({
    from: config.smtpFrom,
    to: email,
    subject: 'Bienvenue sur l\'administration Thierry Azur 06',
    html, text
  });
};

export const sendResetPasswordCode = async (email: string, code: string) => {
  const config = useRuntimeConfig();

  const transporter = nodemailer.createTransport({
    host: config.smtpHost,
    port: Number(config.smtpPort),
    secure: Number(config.smtpPort) === 465,
    auth: {
      user: config.smtpUser,
      pass: config.smtpPass,
    },
    debug: true,
  });

  const html = await render(ResetPasswordEmail, {
    code,
  });

  const text = await render(ResetPasswordEmail, {
    code,
  }, {plainText: true});

  await transporter.sendMail({
    from: config.smtpFrom,
    to: email,
    subject: 'Code de réinitialisation de mot de passe',
    html, text
  });
};
