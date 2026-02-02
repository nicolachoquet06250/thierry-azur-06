import { metadata } from '~~/server/database/schema';

export default defineEventHandler(async (): Promise<{
  phone: string,
  contactEmail: string,
  devisEmail: string,
  schedules: string,
  imageHeroContent?: string|null,
  imageZonesContent?: string|null
}> => {
  const db = useDb();
  
  const [record] = await db.select().from(metadata).limit(1);
  
  if (record) {
    return {
      ...record,
      imageHeroContent: record.imageHeroContent ? `data:${record.imageHeroType};base64,${record.imageHeroContent.toString('base64')}` : null,
      imageZonesContent: record.imageZonesContent ? `data:${record.imageZonesType};base64,${record.imageZonesContent.toString('base64')}` : null,
    };
  }

  return {
    phone: '00 00 00 00 00',
    contactEmail: 'contact@example.com',
    devisEmail: 'devis@example.com',
    schedules: 'Lundi - Vendredi: 9h - 18h'
  };
});
