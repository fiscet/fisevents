'use server';

import { sendMail } from '@/lib/send-mail';
import arcjet, { slidingWindow, validateEmail } from '@/lib/arcjet';
import { request } from '@arcjet/next';

const aj = arcjet
  .withRule(
    slidingWindow({
      mode: 'LIVE',
      interval: '1h',
      max: 5,
    })
  )
  .withRule(
    validateEmail({
      mode: 'LIVE',
      deny: ['DISPOSABLE', 'INVALID', 'NO_MX_RECORDS'],
    })
  );

export async function sendContactEmail({
  name,
  email,
  message,
}: {
  name: string;
  email: string;
  message: string;
}) {
  const req = await request();
  const decision = await aj.protect(req, { email });

  if (decision.isDenied()) {
    throw new Error(decision.reason.isRateLimit() ? 'rate_limit' : 'email_invalid');
  }

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
  const req = await request();
  const decision = await aj.protect(req, { email });

  if (decision.isDenied()) {
    throw new Error(decision.reason.isRateLimit() ? 'rate_limit' : 'email_invalid');
  }

  const text = `From: ${email}\n\nPathname: ${pathname}\n\n${description}`;
  const html = `<p><strong>From:</strong> ${email}</p><p><strong>Pathname:</strong> ${pathname}</p><p>${description}</p>`;

  return sendMail({
    subject: `FisEvents - ${type}: ${email}`,
    text,
    html,
  });
}
