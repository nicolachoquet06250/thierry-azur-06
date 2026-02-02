import { contacts, devisAsks } from '~~/server/database/schema';
import { count } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const db = useDb();
  
  const [contactsCount] = await db.select({ value: count() }).from(contacts);
  const [devisCount] = await db.select({ value: count() }).from(devisAsks);

  return {
    contacts: contactsCount!.value,
    devis: devisCount!.value,
  };
});
