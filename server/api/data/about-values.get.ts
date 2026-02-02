import { aboutValues } from '~~/server/database/schema';

export default defineEventHandler(async (event) => {
  const db = useDb();
  return await db.select().from(aboutValues);
});
