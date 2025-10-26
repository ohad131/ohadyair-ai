import { hashPassword } from '../server/_core/password';

const password = process.argv[2];

if (!password) {
  console.error('Usage: pnpm tsx scripts/hash-password.ts <password>');
  process.exit(1);
}

console.log(hashPassword(password));
