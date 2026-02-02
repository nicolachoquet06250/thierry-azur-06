import { cities } from '~~/server/database/schema';

export default defineEventHandler(async () => {
  const db = useDb();
  return db.select().from(cities);
});
