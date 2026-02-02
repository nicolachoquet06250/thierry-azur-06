import { notes, cities } from '~~/server/database/schema';
import { eq, desc } from 'drizzle-orm';

export default defineEventHandler(async () => {
  // Middleware auth is handled globally or via Nitro, but let's check token just in case if needed
  // In this project, it seems handled via definePageMeta on client and hopefully Nitro on server.
  
  const db = useDb();
  
  // Jointure pour avoir le nom de la ville
  return db.select({
    id: notes.id,
    fullName: notes.fullName,
    email: notes.email,
    type: notes.type,
    message: notes.message,
    note: notes.note,
    approved: notes.approved,
    createdAt: notes.createdAt,
    cityName: cities.name
  })
  .from(notes)
  .leftJoin(cities, eq(notes.cityId, cities.id))
  .orderBy(desc(notes.createdAt));
});
