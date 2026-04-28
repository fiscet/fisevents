import { createHmac, timingSafeEqual } from 'crypto';

type UnsubscribePayload = { eventId: string; uuid: string; email: string };

function getSecret(): string {
  const s = process.env.UNSUBSCRIBE_SECRET ?? process.env.AUTH_SECRET;
  if (!s) throw new Error('UNSUBSCRIBE_SECRET is not set');
  return s;
}

export function createUnsubscribeToken(payload: UnsubscribePayload): string {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = createHmac('sha256', getSecret()).update(data).digest('base64url');
  return `${data}.${sig}`;
}

export function verifyUnsubscribeToken(token: string): UnsubscribePayload | null {
  const dot = token.lastIndexOf('.');
  if (dot === -1) return null;
  const data = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = createHmac('sha256', getSecret()).update(data).digest('base64url');
  try {
    const a = Buffer.from(sig, 'base64url');
    const b = Buffer.from(expected, 'base64url');
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }
  try {
    return JSON.parse(Buffer.from(data, 'base64url').toString()) as UnsubscribePayload;
  } catch {
    return null;
  }
}
