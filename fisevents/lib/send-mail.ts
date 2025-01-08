'use server';
import nodemailer from 'nodemailer';

const SMTP_SERVER_HOST = process.env.EMAIL_SERVER_HOST;
const SMTP_SERVER_USERNAME = process.env.EMAIL_SERVER_USER;
const SMTP_SERVER_PASSWORD = process.env.EMAIL_SERVER_PASSWORD;
const SITE_MAIL_RECEIVING = process.env.SITE_MAIL_RECEIVING;
const EMAIL_SERVER_PORT = process.env.EMAIL_SERVER_PORT;
const EMAIL_FROM = process.env.EMAIL_FROM;
const BUG_EMAIL_TO = process.env.BUG_EMAIL_TO;

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
    console.error('Something Went Wrong', SMTP_SERVER_USERNAME, SMTP_SERVER_PASSWORD, error);

    return;
  }

  const info = await transporter.sendMail({
    from: EMAIL_FROM,
    to: sendTo || SITE_MAIL_RECEIVING,
    subject: subject,
    text: text,
    html: html ? html : '',
  });

  return info;
}