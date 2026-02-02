import { users } from '~~/server/database/schema';
import { hashPassword } from '~~/server/utils/auth';
import { sendWelcomeAdminEmail } from '~~/server/utils/email';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, firstName, lastName } = body;

  if (!email || !firstName || !lastName) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email, firstName and lastName are required',
    });
  }

  const db = useDb();

  // Generate random password
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
  let randomPassword = "";
  for (let i = 0; i < 12; i++) {
    randomPassword += charset.charAt(Math.floor(Math.random() * charset.length));
  }

  const hashedPassword = await hashPassword(randomPassword);

  try {
    await db.insert(users).values({
      email,
      firstName,
      lastName,
      password: hashedPassword,
      mustChangePassword: true,
    });

    // Send email
    await sendWelcomeAdminEmail(email, firstName, randomPassword);

    return { message: 'Admin created successfully' };
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw createError({
        statusCode: 409,
        statusMessage: 'User with this email already exists',
      });
    }
    throw error;
  }
});
