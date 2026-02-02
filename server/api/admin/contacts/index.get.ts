import { contacts } from '~~/server/database/schema';
import { desc } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const db = useDb();
  
  const results = await db.select()
    .from(contacts)
    .orderBy(desc(contacts.createdAt));

  return results;
});
