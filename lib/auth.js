import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export const SESSION_COOKIE = 'admin_session';
// 12 hours
export const SESSION_MAX_AGE = 60 * 60 * 12;

function secret() {
  return (
    process.env.SESSION_SECRET ||
    process.env.ADMIN_PASSWORD ||
    'insecure-dev-secret-change-me'
  );
}

// Verify a submitted password against ADMIN_PASSWORD_HASH (bcrypt) if present,
// otherwise against the plain ADMIN_PASSWORD. Uses timing-safe comparison for
// the plain path.
export function verifyPassword(password) {
  if (!password) return false;

  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (hash && hash.trim()) {
    try {
      return bcrypt.compareSync(password, hash);
    } catch (e) {
      return false;
    }
  }

  const expected = process.env.ADMIN_PASSWORD || '';
  if (!expected) return false;

  const a = Buffer.from(String(password));
  const b = Buffer.from(String(expected));
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

// Create a signed, expiring session token: "<expiry>.<hmac>".
export function createSessionToken() {
  const expiry = Date.now() + SESSION_MAX_AGE * 1000;
  const payload = String(expiry);
  const sig = crypto
    .createHmac('sha256', secret())
    .update(payload)
    .digest('hex');
  return `${payload}.${sig}`;
}

// Validate a session token: signature must match and it must not be expired.
export function verifySessionToken(token) {
  if (!token || typeof token !== 'string' || !token.includes('.')) return false;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return false;

  const expected = crypto
    .createHmac('sha256', secret())
    .update(payload)
    .digest('hex');

  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  if (!crypto.timingSafeEqual(a, b)) return false;

  const expiry = Number(payload);
  if (!Number.isFinite(expiry) || Date.now() > expiry) return false;
  return true;
}
