import { createHmac, timingSafeEqual } from 'crypto';

const TTL_MS = 60 * 60 * 1000; // 1 hour

type DeleteAccountPayload = { userId: string; email: string; lang: string; exp: number };

function getSecret(): string {
  const s = process.env.UNSUBSCRIBE_SECRET ?? process.env.AUTH_SECRET;
  if (!s) throw new Error('UNSUBSCRIBE_SECRET is not set');
  return s;
}

export function createDeleteAccountToken(opts: { userId: string; email: string; lang: string }): string {
  const payload: DeleteAccountPayload = { ...opts, exp: Date.now() + TTL_MS };
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = createHmac('sha256', getSecret()).update(data).digest('base64url');
  return `${data}.${sig}`;
}

export function verifyDeleteAccountToken(token: string): DeleteAccountPayload | null {
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
    const parsed = JSON.parse(Buffer.from(data, 'base64url').toString()) as DeleteAccountPayload;
    if (parsed.exp < Date.now()) return null;
    return parsed;
  } catch {
    return null;
  }
}
