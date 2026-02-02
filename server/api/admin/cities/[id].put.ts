import { cities } from '~~/server/database/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const db = useDb();
  const id = getRouterParam(event, 'id');
  const body = await readBody(event);
  
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID manquant',
    });
  }

  if (!body.name) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Le nom de la ville est requis',
    });
  }

  await db.update(cities)
    .set({ 
      name: body.name,
      lat: body.lat ?? 0,
      lng: body.lng ?? 0,
    })
    .where(eq(cities.id, parseInt(id)));

  return { success: true };
});
