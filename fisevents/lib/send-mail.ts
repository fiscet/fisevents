'use server';
import nodemailer from 'nodemailer';
import { emailTemplate } from './email-template';

const SMTP_SERVER_HOST = process.env.EMAIL_SERVER_HOST;
const SMTP_SERVER_USERNAME = process.env.EMAIL_SERVER_USER;
const SMTP_SERVER_PASSWORD = process.env.EMAIL_SERVER_PASSWORD;
const SITE_MAIL_RECEIVING = process.env.SITE_MAIL_RECEIVING;
const EMAIL_SERVER_PORT = process.env.EMAIL_SERVER_PORT;
const EMAIL_FROM = process.env.EMAIL_FROM;

const transporter = nodemailer.createTransport({
  host: SMTP_SERVER_HOST,
  port: Number(EMAIL_SERVER_PORT),
  secure: true,
  auth: {
    user: SMTP_SERVER_USERNAME,
    pass: SMTP_SERVER_PASSWORD,
  },
});

export async function sendMail({
  sendTo,
  subject,
  text,
  html,
}: {
  sendTo?: string;
  subject: string;
  text: string;
  html?: string;
}) {
  try {
    const isVerified = await transporter.verify();
  } catch (error) {
    console.error('SMTP connection failed:', error);
    return;
  }

  const wrappedHtml = html
    ? html.trimStart().startsWith('<!DOCTYPE')
      ? html
      : emailTemplate({ content: html, subject })
    : undefined;

  const info = await transporter.sendMail({
    from: EMAIL_FROM,
    to: sendTo || SITE_MAIL_RECEIVING,
    subject: subject,
    text: text,
    html: wrappedHtml ?? '',
  });

  return info;
}
