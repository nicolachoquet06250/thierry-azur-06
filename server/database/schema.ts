import {
  mysqlTable,
  varchar,
  timestamp,
  mysqlEnum,
  text,
  float,
  longtext,
  customType,
  int,
  boolean
} from 'drizzle-orm/mysql-core';

// Définition d'un type personnalisé pour longblob car il n'est pas exporté directement de la même manière que text
const longblob = customType<{ data: Buffer }>({
  dataType: () => 'longblob'
});

export const cities = mysqlTable('cities', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  lat: float('lat').default(0).notNull(),
  lng: float('lng').default(0).notNull(),
});

export const notes = mysqlTable('notes', {
  id: int('id').autoincrement().primaryKey(),
  fullName: varchar('fullname', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  type: mysqlEnum('type', ['particulier', 'professionnel', 'immeuble', 'copropriete']).notNull(),
  cityId: int('city_id').notNull().references(() => cities.id),
  message: text('message'),
  note: float('note').notNull(),
  approved: boolean('approved').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const metadata = mysqlTable('metadata', {
  id: int('id').autoincrement().primaryKey(),
  phone: varchar('phone', { length: 20 }).notNull(),
  contactEmail: varchar('contact_email', { length: 255 }).notNull(),
  devisEmail: varchar('devis_email', { length: 255 }).notNull(),
  schedules: varchar('schedules', { length: 255 }).notNull(),
  imageHeroName: varchar('image_hero_name', { length: 255 }),
  imageHeroSize: float('image_hero_size'),
  imageHeroType: varchar('image_hero_type', { length: 50 }),
  imageHeroContent: longblob('image_hero_content'),
  description: text('description'),
  imageZonesName: varchar('image_zones_name', { length: 255 }),
  imageZonesSize: float('image_zones_size'),
  imageZonesType: varchar('image_zones_type', { length: 50 }),
  imageZonesContent: longblob('image_zones_content'),
});

export const about = mysqlTable('about', {
  id: int('id').autoincrement().primaryKey(),
  subtitle: varchar('subtitle', { length: 255 }).notNull(),
  historySectionTitle: varchar('history_section_title', { length: 255 }).notNull(),
  historySectionContent: longtext('history_section_content').notNull(),
  valuesSectionTitle: varchar('values_section_title', { length: 255 }).notNull(),
  reviewsSectionTitle: varchar('reviews_section_title', { length: 255 }).default('Ils recommandent Thierry Azur 06').notNull(),
  reviewsSectionSubtitle: varchar('reviews_section_subtitle', { length: 255 }).default('Avis clients sur Google').notNull(),
  imageName: varchar('image_name', { length: 255 }),
  imageSize: float('image_size'),
  imageType: varchar('image_type', { length: 50 }),
  imageContent: longblob('image_content'),
});

export const aboutValues = mysqlTable('about_values', {
  id: int('id').autoincrement().primaryKey(),
  about_id: int('about_id').notNull()
      .references(() => about.id),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
});

export const devisAsks = mysqlTable('devis_asks', {
  id: int('id').autoincrement().primaryKey(),
  firstName: varchar('firstname', { length: 255 }).notNull(),
  lastName: varchar('lastname', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  subject: varchar('subject', { length: 255 }).notNull(),
  message: longtext('message').notNull(),
  replied: boolean('replied').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const contacts = mysqlTable('contacts', {
  id: int('id').autoincrement().primaryKey(),
  firstName: varchar('firstname', { length: 255 }).notNull(),
  lastName: varchar('lastname', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  subject: varchar('subject', { length: 255 }).notNull(),
  message: longtext('message').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const users = mysqlTable('users', {
  id: int('id').autoincrement().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  firstName: varchar('firstname', { length: 255 }).notNull(),
  lastName: varchar('lastname', { length: 255 }).notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  mustChangePassword: boolean('must_change_password').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const verificationCodes = mysqlTable('verification_codes', {
  id: int('id').autoincrement().primaryKey(),
  userId: int('user_id').notNull().references(() => users.id),
  code: varchar('code', { length: 6 }).notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
