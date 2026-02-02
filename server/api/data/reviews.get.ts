import { notes } from '~~/server/database/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (): Promise<{
  id: number;
  fullName: string;
  email: string;
  type: "particulier" | "professionnel" | "immeuble" | "copropriete";
  cityId: number;
  message: string | null;
  note: number;
  approved: boolean;
  createdAt: Date | null;
}[]> => {
  const db = useDb();
  return db.select()
    .from(notes)
    .where(eq(notes.approved, true))
    .orderBy(notes.createdAt);
});
