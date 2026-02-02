import { aboutValues, about } from '~~/server/database/schema';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const db = useDb();

  // On s'assure qu'il y a un record 'about' pour l'ID
  const [aboutRecord] = await db.select().from(about).limit(1);
  if (!aboutRecord) {
     throw createError({
      statusCode: 400,
      statusMessage: 'About record must exist before adding values',
    });
  }

  await db.insert(aboutValues).values({
    about_id: aboutRecord.id,
    title: body.title,
    description: body.description,
  });

  return { success: true };
});
