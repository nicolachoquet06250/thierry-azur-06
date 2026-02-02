import { eq } from 'drizzle-orm';
import { users } from '~~/server/database/schema';

export default defineEventHandler(async (event) => {
  // L'utilisateur est déjà vérifié par le middleware server/middleware/auth.ts
  const auth = event.context.auth;

  if (!auth || !auth.userId) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    });
  }

  const db = useDb();
  const [user] = await db.select({
    firstName: users.firstName,
    lastName: users.lastName,
    email: users.email
  })
  .from(users)
  .where(eq(users.id, auth.userId));

  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: 'User not found',
    });
  }

  return user;
});
