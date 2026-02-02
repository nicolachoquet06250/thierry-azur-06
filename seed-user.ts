import { users } from './server/database/schema';
import { hashPassword } from './server/utils/auth';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('DATABASE_URL is not set');
    return;
  }

  const pool = mysql.createPool(databaseUrl);
  const db = drizzle(pool);

  const email = 'admin@example.com';
  const password = 'password123';
  const hashedPassword = await hashPassword(password);

  console.log(`Creating user ${email}...`);
  
  await db.insert(users).values({
    email,
    password: hashedPassword,
  });

  console.log('User created successfully!');
  await pool.end();
}

main().catch(console.error);
