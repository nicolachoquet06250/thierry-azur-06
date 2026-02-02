import { about } from '~~/server/database/schema';

export default defineEventHandler(async () => {
  const db = useDb();
  
  let [record] = await db.select().from(about).limit(1);
  
  if (!record) {
    // Initialiser avec des valeurs par défaut si vide
    await db.insert(about).values({
      subtitle: 'Notre expertise à votre service',
      historySectionTitle: 'Notre Histoire',
      historySectionContent: 'Contenu par défaut de notre histoire...',
      valuesSectionTitle: 'Nos Valeurs',
    });
    [record] = await db.select().from(about).limit(1);
  }

  if (record) {
    return {
      ...record,
      imageContent: record.imageContent ? `data:${record.imageType};base64,${record.imageContent.toString('base64')}` : null,
    };
  }

  return record;
});
