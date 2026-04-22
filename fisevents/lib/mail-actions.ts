'use server';

import { sendMail } from '@/lib/send-mail';

export async function sendContactEmail({
  name,
  email,
  message,
}: {
  name: string;
  email: string;
  message: string;
}) {
  const text = `From: ${name}\nEmail: ${email}\n\n${message}`;
  const html = `<p><strong>From:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p>${message}</p>`;

  return sendMail({
    subject: `FisEvents - Contact form: ${name}`,
    text,
    html,
  });
}

export async function sendBugReportEmail({
  type,
  email,
  description,
  pathname,
}: {
  type: string;
  email: string;
  description: string;
  pathname: string;
}) {
  const text = `From: ${email}\n\nPathname: ${pathname}\n\n${description}`;
  const html = `<p><strong>From:</strong> ${email}</p><p><strong>Pathname:</strong> ${pathname}</p><p>${description}</p>`;

  return sendMail({
    subject: `FisEvents - ${type}: ${email}`,
    text,
    html,
  });
}
