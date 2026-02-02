import { notes } from '~~/server/database/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID manquant' });

  const body = await readBody(event);
  const { approved } = body;

  const db = useDb();
  
  await db.update(notes)
    .set({ approved })
    .where(eq(notes.id, parseInt(id)));

  return { success: true };
});
