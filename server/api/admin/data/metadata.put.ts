import { metadata } from '~~/server/database/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const db = useDb();

  const [record] = await db.select().from(metadata).limit(1);

  if (!record) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Metadata not found',
    });
  }

  const formData = await readMultipartFormData(event);
  
  if (!formData) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing form data',
    });
  }

  const updateData: any = {};

  for (const field of formData) {
    if (field.name === 'phone') updateData.phone = field.data.toString();
    if (field.name === 'contactEmail') updateData.contactEmail = field.data.toString();
    if (field.name === 'devisEmail') updateData.devisEmail = field.data.toString();
    if (field.name === 'schedules') updateData.schedules = field.data.toString();

    if (field.name === 'imageHero' && field.filename) {
      updateData.imageHeroName = field.filename;
      updateData.imageHeroType = field.type;
      updateData.imageHeroSize = field.data.length;
      updateData.imageHeroContent = field.data;
    }

    if (field.name === 'imageZones' && field.filename) {
      updateData.imageZonesName = field.filename;
      updateData.imageZonesType = field.type;
      updateData.imageZonesSize = field.data.length;
      updateData.imageZonesContent = field.data;
    }
  }

  await db.update(metadata)
    .set(updateData)
    .where(eq(metadata.id, record.id));

  return { success: true };
});
