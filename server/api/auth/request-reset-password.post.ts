import { eq } from 'drizzle-orm';
import { users, verificationCodes } from '~~/server/database/schema';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email } = body;

  if (!email) {
    throw createError({
      statusCode: 400,
      statusMessage: 'L\'adresse email est requise',
    });
  }

  const db = useDb();
  const [user] = await db.select().from(users).where(eq(users.email, email));

  // Pour des raisons de sécurité, on ne dit pas si l'email existe ou non
  if (!user) {
    return {
      message: 'Si un compte existe pour cet email, un code de réinitialisation a été envoyé',
    };
  }

  // Générer un code à 6 chiffres
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await db.insert(verificationCodes).values({
    userId: user.id,
    code,
    expiresAt,
  });

  try {
    await sendResetPasswordCode(user.email, code);
  } catch (error) {
    console.error('Failed to send reset password email:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de l\'envoi de l\'email',
    });
  }

  return {
    message: 'Si un compte existe pour cet email, un code de réinitialisation a été envoyé',
    userId: user.id, // On retourne quand même le userId pour faciliter la suite côté front
  };
});
