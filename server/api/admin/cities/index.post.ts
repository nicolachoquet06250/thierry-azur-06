import { cities } from '~~/server/database/schema';

export default defineEventHandler(async (event) => {
  const db = useDb();
  const body = await readBody(event);
  
  if (!body.name) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Le nom de la ville est requis',
    });
  }

  const result = await db.insert(cities).values({
    name: body.name,
    lat: body.lat || 0,
    lng: body.lng || 0,
  });

  return { success: true, id: result[0].insertId };
});
