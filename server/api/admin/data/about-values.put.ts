import { aboutValues } from '~~/server/database/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const db = useDb();

  if (!body.id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing ID',
    });
  }

  await db.update(aboutValues)
    .set({
      title: body.title,
      description: body.description,
    })
    .where(eq(aboutValues.id, body.id));

  return { success: true };
});
