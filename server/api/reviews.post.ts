import { notes } from '~~/server/database/schema';
import { verifyCode } from '../utils/mail';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { fullName, email, type, cityId, message, note, code } = body;

  if (!fullName || !email || !type || !cityId || !note || !code) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Champs obligatoires manquants (dont le code de vérification)',
    });
  }

  if (!verifyCode(email, code)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Code de vérification invalide ou expiré',
    });
  }

  const db = useDb();

  try {
    await db.insert(notes).values({
      fullName,
      email,
      type,
      cityId,
      message,
      note,
      approved: false, // Toujours désapprouvé par défaut
    });
    return { success: true };
  } catch (error) {
    console.error('Erreur lors de la soumission de l\'avis:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de l\'enregistrement de votre avis',
    });
  }
});
