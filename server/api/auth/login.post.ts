import { eq } from 'drizzle-orm';
import { users, verificationCodes } from '~~/server/database/schema';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, password } = body;

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email and password are required',
    });
  }

  const db = useDb();
  const [user] = await db.select().from(users).where(eq(users.email, email));

  if (!user || !(await comparePassword(password, user.password))) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid credentials',
    });
  }

  // Generate 6 digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await db.insert(verificationCodes).values({
    userId: user.id,
    code,
    expiresAt,
  });

  try {
    await send2FACode(user.email, code);
  } catch (error) {
    console.error('Failed to send 2FA email:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to send 2FA code',
    });
  }

  return {
    message: 'Verification code sent to email',
    userId: user.id,
  };
});
