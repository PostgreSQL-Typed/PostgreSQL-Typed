import { Int8Range } from "@postgresql-typed/parsers";
import { Client } from "pg";
import { describe, expect, test } from "vitest";

import { pgt, pgTable, sql } from "../../index.js";
import { eq } from "../../operators.js";
import { defineInt8Range } from "./Int8Range";

describe("defineInt8Range", async () => {
	test('defineInt8Range({ mode: "Int8Range" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "int8range.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("int8range", {
				int8range: defineInt8Range("int8range", { mode: "Int8Range" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists int8range (
				int8range int8range not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				int8range: Int8Range.from("[1,3)"),
			})
			.returning();

		expect(Int8Range.isRange(result1[0].int8range)).toBe(true);

		const result2 = await database.select().from(table).execute();

		expect(Int8Range.isRange(result2[0].int8range)).toBe(true);

		const result3 = await database
			.select()
			.from(table)
			.where(eq(table.int8range, Int8Range.from("[1,3)")))
			.execute();

		expect(Int8Range.isRange(result3[0].int8range)).toBe(true);

		const result4 = await database
			.select()
			.from(table)
			.where(eq(table.int8range, Int8Range.from("[11,13)")))
			.execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table int8range;
		`);

		expect(table.int8range.getSQLType()).toBe("int8range");
	});

	test('defineInt8Range({ mode: "string" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "int8rangestring.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("int8rangestring", {
				int8range: defineInt8Range("int8range", { mode: "string" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists int8rangestring (
				int8range int8range not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				int8range: "[1,3)",
			})
			.returning();

		expect(result1[0].int8range).toBe("[1,3)");

		const result2 = await database.select().from(table).execute();

		expect(result2[0].int8range).toBe("[1,3)");

		const result3 = await database.select().from(table).where(eq(table.int8range, "[1,3)")).execute();

		expect(result3[0].int8range).toBe("[1,3)");

		const result4 = await database.select().from(table).where(eq(table.int8range, "[11,13)")).execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table int8rangestring;
		`);

		expect(table.int8range.getSQLType()).toBe("int8range");
	});
});
