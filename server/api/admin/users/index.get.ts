import {users} from '~~/server/database/schema';

export default defineEventHandler(async () => {
  const db = useDb();

  return db.select({
    id: users.id,
    email: users.email,
    firstName: users.firstName,
    lastName: users.lastName,
    mustChangePassword: users.mustChangePassword,
    createdAt: users.createdAt,
  }).from(users);
});
