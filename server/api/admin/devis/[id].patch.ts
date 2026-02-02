import { devisAsks } from '~~/server/database/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const db = useDb();
  const id = parseInt(event.context.params?.id || '');
  const body = await readBody(event);
  const { replied } = body;

  if (isNaN(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID invalide',
    });
  }

  await db.update(devisAsks)
    .set({ replied: !!replied })
    .where(eq(devisAsks.id, id));

  return { success: true };
});
