import { Int8MultiRange } from "@postgresql-typed/parsers";
import { eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { pgTable } from "drizzle-orm/pg-core";
import { Client } from "pg";
import { describe, expect, test } from "vitest";

import { defineInt8MultiRange } from "./Int8MultiRange";

describe("defineInt8MultiRange", async () => {
	test('defineInt8MultiRange({ mode: "Int8MultiRange" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "int8multirange.test.ts",
			}),
			database = drizzle(postgres),
			table = pgTable("int8multirange", {
				int8multirange: defineInt8MultiRange("int8multirange", { mode: "Int8MultiRange" }).notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists int8multirange (
				int8multirange int8multirange not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				int8multirange: Int8MultiRange.from("{[1,3),[11,13),[21,23)}"),
			})
			.returning();

		expect(Int8MultiRange.isMultiRange(result1[0].int8multirange)).toBe(true);

		const result2 = await database.select().from(table).execute();

		expect(Int8MultiRange.isMultiRange(result2[0].int8multirange)).toBe(true);

		const result3 = await database
			.select()
			.from(table)
			.where(eq(table.int8multirange, Int8MultiRange.from("{[1,3),[11,13),[21,23)}")))
			.execute();

		expect(Int8MultiRange.isMultiRange(result3[0].int8multirange)).toBe(true);

		const result4 = await database
			.select()
			.from(table)
			.where(eq(table.int8multirange, Int8MultiRange.from("{[1,3),[11,13),[21,25)}")))
			.execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table int8multirange;
		`);

		expect(table.int8multirange.getSQLType()).toBe("int8multirange");
	});

	test('defineInt8MultiRange({ mode: "string" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "int8multirangestring.test.ts",
			}),
			database = drizzle(postgres),
			table = pgTable("int8multirangestring", {
				int8multirange: defineInt8MultiRange("int8multirange", { mode: "string" }).notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists int8multirangestring (
				int8multirange int8multirange not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				int8multirange: "{[1,3),[11,13),[21,23)}",
			})
			.returning();

		expect(result1[0].int8multirange).toBe("{[1,3),[11,13),[21,23)}");

		const result2 = await database.select().from(table).execute();

		expect(result2[0].int8multirange).toBe("{[1,3),[11,13),[21,23)}");

		const result3 = await database.select().from(table).where(eq(table.int8multirange, "{[1,3),[11,13),[21,23)}")).execute();

		expect(result3[0].int8multirange).toBe("{[1,3),[11,13),[21,23)}");

		const result4 = await database.select().from(table).where(eq(table.int8multirange, "{[1,3),[11,13),[21,25)}")).execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table int8multirangestring;
		`);

		expect(table.int8multirange.getSQLType()).toBe("int8multirange");
	});
});
