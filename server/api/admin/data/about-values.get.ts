import { aboutValues } from '~~/server/database/schema';

export default defineEventHandler(async () => {
  const db = useDb();
  return db.select().from(aboutValues);
});
