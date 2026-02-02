import { aboutValues } from '~~/server/database/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const id = parseInt(query.id as string);
  const db = useDb();

  if (isNaN(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid ID',
    });
  }

  await db.delete(aboutValues).where(eq(aboutValues.id, id));

  return { success: true };
});
