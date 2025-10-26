import "dotenv/config";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { users } from "../src/db/schema";

async function main() {
  const email = process.argv[2];

  if (!email) {
    console.error("Usage: pnpm make:admin <email>");
    process.exit(1);
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("DATABASE_URL environment variable is required.");
    process.exit(1);
  }

  const pool = mysql.createPool(databaseUrl);
  const db = drizzle(pool);

  try {
    const [existing] = await db
      .select({ id: users.id, role: users.role })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!existing) {
      console.error(`No user found for email: ${email}`);
      process.exit(1);
    }

    if (existing.role === "admin") {
      console.log(`${email} is already an admin.`);
      return;
    }

    await db.update(users).set({ role: "admin" }).where(eq(users.email, email));
    console.log(`✅ Updated ${email} to admin role.`);
  } finally {
    await pool.end();
  }
}

main().catch(error => {
  console.error("Failed to promote user:", error);
  process.exit(1);
});
