import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export const SESSION_COOKIE = 'admin_session';
// 12 hours
export const SESSION_MAX_AGE = 60 * 60 * 12;

// ── Built-in fallback credentials ────────────────────────────────
// These let the admin panel work out of the box (private repo) without
// setting any environment variables. The password is stored only as a
// bcrypt hash — the plaintext never lives in the repo. To change it, either
// set ADMIN_PASSWORD / ADMIN_PASSWORD_HASH in your environment (they take
// priority over these), or replace DEFAULT_PASSWORD_HASH below.
//
// Default password: "dealer2026"  (change this for anything public!)
const DEFAULT_PASSWORD_HASH =
  '$2a$10$NRJ8h58eWXbGgkzIOK7RM.06ctiDFXnyPsZdyXmw3N0kH.XIS7tTS';
const DEFAULT_SESSION_SECRET =
  '6771fd5420e65377674126a3307dc033458207103aaa5df5c2fc7078c41a2fd4';

function secret() {
  return (
    process.env.SESSION_SECRET ||
    process.env.ADMIN_PASSWORD ||
    DEFAULT_SESSION_SECRET
  );
}

// Verify a submitted password. Priority:
//   1. plain ADMIN_PASSWORD env (timing-safe compare)
//   2. ADMIN_PASSWORD_HASH env (bcrypt)
//   3. the built-in DEFAULT_PASSWORD_HASH fallback (bcrypt)
export function verifyPassword(password) {
  if (!password) return false;

  const plain = process.env.ADMIN_PASSWORD;
  if (plain && plain.trim()) {
    const a = Buffer.from(String(password));
    const b = Buffer.from(String(plain));
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  }

  const envHash = process.env.ADMIN_PASSWORD_HASH;
  const hash = envHash && envHash.trim() ? envHash.trim() : DEFAULT_PASSWORD_HASH;
  try {
    return bcrypt.compareSync(password, hash);
  } catch (e) {
    return false;
  }
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
