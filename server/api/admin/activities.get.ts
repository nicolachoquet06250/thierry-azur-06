import { contacts, devisAsks } from '~~/server/database/schema';
import { desc } from 'drizzle-orm';

export default defineEventHandler(async () => {
  const db = useDb();
  
  const [contactsResults, devisResults] = await Promise.all([
    db.select().from(contacts).orderBy(desc(contacts.createdAt)).limit(10),
    db.select().from(devisAsks).orderBy(desc(devisAsks.createdAt)).limit(10)
  ]);

  const activities = [
    ...contactsResults.map(c => ({ ...c, type: 'contact' })),
    ...devisResults.map(d => ({ ...d, type: 'devis' }))
  ];

  // Trier par date décroissante
  activities.sort((a, b) => {
    return new Date(b.createdAt as any).getTime() - new Date(a.createdAt as any).getTime();
  });

  // Retourner les 10 dernières activités au total
  return activities.slice(0, 10);
});
