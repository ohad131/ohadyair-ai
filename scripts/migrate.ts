import 'dotenv/config';
import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import { migrate } from 'drizzle-orm/mysql2/migrator';

const pool = mysql.createPool(process.env.DATABASE_URL!);
const db = drizzle(pool);

await migrate(db, { migrationsFolder: 'drizzle' });
await pool.end();
