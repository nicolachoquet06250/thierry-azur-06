import { devisAsks } from '~~/server/database/schema';
import { desc, eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const db = useDb();
  const query = getQuery(event);
  const replied = query.replied;

  let baseQuery = db.select().from(devisAsks);

  if (replied !== undefined) {
    const isReplied = replied === 'true' || replied === '1';
    // @ts-ignore
    baseQuery = baseQuery.where(eq(devisAsks.replied, isReplied));
  }

  const results = await baseQuery.orderBy(desc(devisAsks.createdAt));

  return results;
});
