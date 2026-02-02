import { eq, and, gt } from 'drizzle-orm';
import { users, verificationCodes } from '~~/server/database/schema';
import { hashPassword, comparePassword } from '~~/server/utils/auth';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { userId, newPassword, oldPassword, code } = body;

  if (!userId || !newPassword || !code) {
    throw createError({
      statusCode: 400,
      statusMessage: 'userId, newPassword and code are required',
    });
  }

  const db = useDb();

  // Vérification du code 2FA
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
      statusMessage: 'Code de vérification invalide ou expiré',
    });
  }

  // Vérification de l'utilisateur
  const [user] = await db.select().from(users).where(eq(users.id, userId));
  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Utilisateur non trouvé',
    });
  }

  // Si l'utilisateur n'est pas forcé de changer son mot de passe, 
  // on exige l'ancien mot de passe pour plus de sécurité
  if (!user.mustChangePassword) {
    if (!oldPassword) {
      throw createError({
        statusCode: 400,
        statusMessage: "L'ancien mot de passe est requis",
      });
    }

    const isMatch = await comparePassword(oldPassword, user.password);
    if (!isMatch) {
      throw createError({
        statusCode: 401,
        statusMessage: "L'ancien mot de passe est incorrect",
      });
    }
  }
  
  const hashedPassword = await hashPassword(newPassword);

  // Supprimer le code utilisé
  await db.delete(verificationCodes).where(eq(verificationCodes.id, verificationRecord.id));

  await db.update(users)
    .set({ 
      password: hashedPassword,
      mustChangePassword: false
    })
    .where(eq(users.id, userId));

  return { message: 'Password updated successfully' };
});
