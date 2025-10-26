import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';

const SALT_LENGTH = 16;
const KEY_LENGTH = 64;
const PREFIX = 'scrypt';

export function hashPassword(password: string, salt?: Buffer) {
  const resolvedSalt = salt ?? randomBytes(SALT_LENGTH);
  const derived = scryptSync(password, resolvedSalt, KEY_LENGTH);
  return `${PREFIX}:${resolvedSalt.toString('hex')}:${derived.toString('hex')}`;
}

export function verifyPassword(storedHash: string, password: string) {
  const [prefix, saltHex, hashHex] = storedHash.split(':');
  if (prefix !== PREFIX || !saltHex || !hashHex) {
    return false;
  }

  const salt = Buffer.from(saltHex, 'hex');
  const expected = Buffer.from(hashHex, 'hex');
  const actual = scryptSync(password, salt, KEY_LENGTH);

  if (expected.length !== actual.length) {
    return false;
  }

  return timingSafeEqual(expected, actual);
}
