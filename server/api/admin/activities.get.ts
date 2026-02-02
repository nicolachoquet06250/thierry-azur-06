import { contacts, devisAsks, notes } from '~~/server/database/schema';
import { desc, sql } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const db = useDb();
  const query = getQuery(event);
  const page = parseInt(query.page as string) || 1;
  const limit = parseInt(query.limit as string) || 10;
  const offset = (page - 1) * limit;
  
  // Pour une pagination correcte de sources mixtes, on récupère un peu plus de chaque 
  // ou on utilise une approche plus robuste. 
  // Ici on va récupérer le total pour chaque table pour renvoyer le total global.
  
  const [
    contactsResults, 
    devisResults, 
    notesResults,
    contactsCount,
    devisCount,
    notesCount
  ] = await Promise.all([
    db.select().from(contacts).orderBy(desc(contacts.createdAt)).limit(offset + limit),
    db.select().from(devisAsks).orderBy(desc(devisAsks.createdAt)).limit(offset + limit),
    db.select().from(notes).orderBy(desc(notes.createdAt)).limit(offset + limit),
    db.select({ count: sql<number>`count(*)` }).from(contacts),
    db.select({ count: sql<number>`count(*)` }).from(devisAsks),
    db.select({ count: sql<number>`count(*)` }).from(notes)
  ]);

  const activities = [
    ...contactsResults.map(c => ({ ...c, type: 'contact' })),
    ...devisResults.map(d => ({ ...d, type: 'devis' })),
    ...notesResults.map(n => ({ ...n, type: 'review', firstName: n.fullName, lastName: '', subject: `Note: ${n.note}/5` }))
  ];

  // Trier par date décroissante
  activities.sort((a, b) => {
    return new Date(b.createdAt as any).getTime() - new Date(a.createdAt as any).getTime();
  });

  const total = (contactsCount[0]?.count || 0) + (devisCount[0]?.count || 0) + (notesCount[0]?.count || 0);

  return {
    activities: activities.slice(offset, offset + limit),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  };
});
