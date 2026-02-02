import { eq } from 'drizzle-orm';
import { users } from '~~/server/database/schema';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID is required',
    });
  }

  const db = useDb();
  
  // Prevent deleting self
  const auth = event.context.auth;
  if (auth && parseInt(id) === auth.userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Vous ne pouvez pas supprimer votre propre compte',
    });
  }

  await db.delete(users).where(eq(users.id, parseInt(id)));

  return { message: 'Admin deleted successfully' };
});
