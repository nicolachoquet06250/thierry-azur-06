import {contacts} from '~~/server/database/schema';
import {desc} from 'drizzle-orm';

export default defineEventHandler(async () => {
  const db = useDb();

  return db.select()
      .from(contacts)
      .orderBy(desc(contacts.createdAt));
});
