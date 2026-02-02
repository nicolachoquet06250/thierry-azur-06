import { eq, and, gt } from 'drizzle-orm';
import { users, verificationCodes } from '~~/server/database/schema';
import { hashPassword } from '~~/server/utils/auth';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { userId, code, newPassword } = body;

  if (!userId || !code || !newPassword) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Tous les champs sont requis',
    });
  }

  if (newPassword.length < 8) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Le mot de passe doit contenir au moins 8 caractères',
    });
  }

  const db = useDb();

  // Vérifier si le code est valide
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

  // Mettre à jour le mot de passe
  const hashedPassword = await hashPassword(newPassword);
  
  await db.update(users)
    .set({ 
      password: hashedPassword,
      mustChangePassword: false // On désactive aussi le changement forcé s'il y en avait un
    })
    .where(eq(users.id, userId));

  // Supprimer le code utilisé
  await db.delete(verificationCodes).where(eq(verificationCodes.id, verificationRecord.id));

  return {
    message: 'Mot de passe réinitialisé avec succès',
  };
});
