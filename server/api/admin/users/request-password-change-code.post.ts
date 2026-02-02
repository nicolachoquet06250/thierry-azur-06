import { eq } from 'drizzle-orm';
import { users, verificationCodes } from '~~/server/database/schema';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { userId } = body;

  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'userId est requis',
    });
  }

  const db = useDb();
  const [user] = await db.select().from(users).where(eq(users.id, userId));

  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Utilisateur non trouvé',
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
      statusMessage: 'Échec de l\'envoi du code de vérification',
    });
  }

  return {
    message: 'Code de vérification envoyé par email',
  };
});
