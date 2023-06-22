import { Name } from "@postgresql-typed/parsers";
import { eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { pgTable } from "drizzle-orm/pg-core";
import { Client } from "pg";
import { describe, expect, test } from "vitest";

import { defineName } from "./Name";

describe("defineName", async () => {
	test('defineName({ mode: "Name" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "name.test.ts",
			}),
			database = drizzle(postgres),
			table = pgTable("name", {
				name: defineName("name", { mode: "Name" }).notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists name (
				name name not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				name: Name.from("a"),
			})
			.returning();

		expect(Name.isName(result1[0].name)).toBe(true);

		const result2 = await database.select().from(table).execute();

		expect(Name.isName(result2[0].name)).toBe(true);

		const result3 = await database
			.select()
			.from(table)
			.where(eq(table.name, Name.from("a")))
			.execute();

		expect(Name.isName(result3[0].name)).toBe(true);

		const result4 = await database
			.select()
			.from(table)
			.where(eq(table.name, Name.from("b")))
			.execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table name;
		`);

		expect(table.name.getSQLType()).toBe("name");
	});

	test('defineName({ mode: "string" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "namestring.test.ts",
			}),
			database = drizzle(postgres),
			table = pgTable("namestring", {
				name: defineName("name", { mode: "string" }).notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists namestring (
				name name not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				name: "a",
			})
			.returning();

		expect(result1[0].name).toBe("a");

		const result2 = await database.select().from(table).execute();

		expect(result2[0].name).toBe("a");

		const result3 = await database.select().from(table).where(eq(table.name, "a")).execute();

		expect(result3[0].name).toBe("a");

		const result4 = await database.select().from(table).where(eq(table.name, "b")).execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table namestring;
		`);

		expect(table.name.getSQLType()).toBe("name");
	});
});
