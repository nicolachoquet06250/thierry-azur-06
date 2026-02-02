import { about } from '~~/server/database/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const formData = await readMultipartFormData(event);
  
  if (!formData) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing form data',
    });
  }

  const db = useDb();

  const [record] = await db.select().from(about).limit(1);

  if (!record) {
    throw createError({
      statusCode: 404,
      statusMessage: 'About record not found',
    });
  }

  const updateData: any = {};

  for (const field of formData) {
    if (field.name === 'subtitle') updateData.subtitle = field.data.toString();
    if (field.name === 'historySectionTitle') updateData.historySectionTitle = field.data.toString();
    if (field.name === 'historySectionContent') updateData.historySectionContent = field.data.toString();
    if (field.name === 'valuesSectionTitle') updateData.valuesSectionTitle = field.data.toString();
    if (field.name === 'reviewsSectionTitle') updateData.reviewsSectionTitle = field.data.toString();
    if (field.name === 'reviewsSectionSubtitle') updateData.reviewsSectionSubtitle = field.data.toString();

    if (field.name === 'imageAbout' && field.filename) {
      updateData.imageName = field.filename;
      updateData.imageType = field.type;
      updateData.imageSize = field.data.length;
      updateData.imageContent = field.data;
    }
  }

  await db.update(about)
    .set(updateData)
    .where(eq(about.id, record.id));

  return { success: true };
});
