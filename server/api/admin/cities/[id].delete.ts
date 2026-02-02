import { cities } from '~~/server/database/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const db = useDb();
  const id = getRouterParam(event, 'id');
  
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID manquant',
    });
  }

  await db.delete(cities).where(eq(cities.id, parseInt(id)));

  return { success: true };
});
