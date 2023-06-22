/**
 * const db = pgt('postgres://user:pass@localhost:5432/dbname');
 *
 * const autoflexCloud = schema('autoflex_cloud');
 *
 * const autoflexCloudUsers = cloud.table('users', {
 *  id: defineUUID('user_id').defaultRandom().notNull(),
 *  name: defineCharacterVarying('user_name', { length: 32 }),
 *  created_at: defineTimestamp('created_at').defaultNow().notNull(),
 *  email: defineCharacterVarying('email', { length: 64 }).default("foo@gmail.com").notNull(),
 * });
 *
 * type AutoflexCloudUser = InferTableType<typeof users>;
 * type AutoflexCloudNewUser = InferTableType<typeof users, 'insert'>;
 *
 * await db.select().from(users).where(eq(user.id, 123)).returning();
 * await db.select({
 *  id: users.id,
 * }).from(users);
 * await db.insert(users, { name: 'foo' }).returning();
 * await db.update(users, { name: 'foo' }).where(eq(user.id, 123)).returning();
 * await db.delete(users).where(eq(user.id, 123)).returning();
 *
 * -----------
 *
 * import { pgt, eq } from 'pgt/pg';
 * import { autoflexCloudUsers } from "./generated/autoflex_cloud"
 *
 * const db = pgt('postgres://user:pass@localhost:5432/dbname');
 *
 * await db.select().from(autoflexCloudUsers).where(eq(autoflexCloudUsers.id, 123)).returning();
 *
 */
export const foo = "bar";
