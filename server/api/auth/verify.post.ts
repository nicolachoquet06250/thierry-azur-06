import { eq, and, gt } from 'drizzle-orm';
import { users, verificationCodes } from '~~/server/database/schema';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { userId, code } = body;

  if (!userId || !code) {
    throw createError({
      statusCode: 400,
      statusMessage: 'User ID and code are required',
    });
  }

  const db = useDb();
  
  // Find valid code
  const [verificationRecord] = await db.select()
    .from(verificationCodes)
    .where(
      and(
        eq(verificationCodes.userId, userId),
        eq(verificationCodes.code, code),
        gt(verificationCodes.expiresAt, new Date())
      )
    );

  if (!verificationRecord) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid or expired code',
    });
  }

  // Code is valid, delete it so it can't be reused
  await db.delete(verificationCodes).where(eq(verificationCodes.id, verificationRecord.id));

  const [user] = await db.select().from(users).where(eq(users.id, userId));

  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: 'User not found',
    });
  }

  const token = generateToken({
    userId: user.id,
    email: user.email,
  });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      mustChangePassword: user.mustChangePassword,
    }
  };
});
