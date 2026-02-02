import { about } from '~~/server/database/schema';

export default defineEventHandler(async (event): Promise<{
  subtitle: string,
  historySectionTitle: string,
  historySectionContent: string,
  valuesSectionTitle: string,
  imageContent?: string|null
}> => {
  const db = useDb();
  
  const [record] = await db.select().from(about).limit(1);
  
  if (record) {
    return {
      ...record,
      imageContent: record.imageContent ? `data:${record.imageType};base64,${record.imageContent.toString('base64')}` : null,
    };
  }

  return {
    subtitle: 'Notre expertise à votre service',
    historySectionTitle: 'Notre Histoire',
    historySectionContent: 'Contenu par défaut de notre histoire...',
    valuesSectionTitle: 'Nos Valeurs',
  };
});
