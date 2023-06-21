import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { pgTable } from "drizzle-orm/pg-core";
import { Client } from "pg";
import { describe, test } from "vitest";

import { defineName, defineTimestamp, defineUUID } from "./definers";

describe("lockscreen", async () => {
	test("lockscreen", async () => {
		const pg = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "testing_drizzle_orm.test.ts",
			}),
			database = drizzle(pg),
			testingDrizzleOrm = pgTable("testing_drizzle_orm", {
				id: defineUUID("id").defaultRandom().notNull(),
				id2: defineUUID("id2").defaultRandom().notNull(),
				name: defineName("name"),
				created_at: defineTimestamp("created_at").defaultNow().notNull(),
			});

		await pg.connect();

		await database.execute(sql`
			create table if not exists testing_drizzle_orm (
				id uuid primary key default gen_random_uuid(),
				id2 uuid not null default gen_random_uuid(),
				name text not null,
				created_at timestamp not null default now()
			);
		`);

		const result = await database
			.insert(testingDrizzleOrm)
			.values({
				name: "foo",
			})
			.returning();

		console.log(result[0]);
	});
});
