import { Int4Range } from "@postgresql-typed/parsers";
import { Client } from "pg";
import { describe, expect, test } from "vitest";

import { pgt, pgTable, sql } from "../../index.js";
import { eq } from "../../operators.js";
import { defineInt4Range } from "./Int4Range";

describe("defineInt4Range", async () => {
	test('defineInt4Range({ mode: "Int4Range" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "int4range.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("int4range", {
				int4range: defineInt4Range("int4range", { mode: "Int4Range" }).notNull(),
				_int4range: defineInt4Range("_int4range", { mode: "Int4Range" }).array().notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists int4range (
				int4range int4range not null,
				_int4range _int4range not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				int4range: Int4Range.from("[1,3)"),
				_int4range: [Int4Range.from("[1,3)"), Int4Range.from("[4,6)")],
			})
			.returning();

		expect(Int4Range.isRange(result1[0].int4range)).toBe(true);
		expect(result1[0]._int4range.length).toBe(2);
		expect(Int4Range.isRange(result1[0]._int4range[0])).toBe(true);
		expect(Int4Range.isRange(result1[0]._int4range[1])).toBe(true);

		const result2 = await database.select().from(table).execute();

		expect(Int4Range.isRange(result2[0].int4range)).toBe(true);
		expect(result2[0]._int4range.length).toBe(2);
		expect(Int4Range.isRange(result2[0]._int4range[0])).toBe(true);
		expect(Int4Range.isRange(result2[0]._int4range[1])).toBe(true);

		const result3 = await database
			.select()
			.from(table)
			.where(eq(table.int4range, Int4Range.from("[1,3)")))
			.execute();

		expect(Int4Range.isRange(result3[0].int4range)).toBe(true);
		expect(result3[0]._int4range.length).toBe(2);
		expect(Int4Range.isRange(result3[0]._int4range[0])).toBe(true);
		expect(Int4Range.isRange(result3[0]._int4range[1])).toBe(true);

		const result4 = await database
			.select()
			.from(table)
			.where(eq(table.int4range, Int4Range.from("[11,13)")))
			.execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.int4range, Symbol() as any))
				.execute()
		).toThrowError("Expected 'string' | 'object' | 'array', received 'symbol'");

		await database.execute(sql`
			drop table int4range;
		`);

		expect(table.int4range.getSQLType()).toBe("int4range");
	});

	test('defineInt4Range({ mode: "string" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "int4rangestring.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("int4rangestring", {
				int4range: defineInt4Range("int4range", { mode: "string" }).notNull(),
				_int4range: defineInt4Range("_int4range", { mode: "string" }).array().notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists int4rangestring (
				int4range int4range not null,
				_int4range _int4range not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				int4range: "[1,3)",
				_int4range: ["[1,3)", "[4,6)"],
			})
			.returning();

		expect(result1[0].int4range).toBe("[1,3)");
		expect(result1[0]._int4range.length).toBe(2);
		expect(result1[0]._int4range[0]).toBe("[1,3)");
		expect(result1[0]._int4range[1]).toBe("[4,6)");

		const result2 = await database.select().from(table).execute();

		expect(result2[0].int4range).toBe("[1,3)");
		expect(result2[0]._int4range.length).toBe(2);
		expect(result2[0]._int4range[0]).toBe("[1,3)");
		expect(result2[0]._int4range[1]).toBe("[4,6)");

		const result3 = await database.select().from(table).where(eq(table.int4range, "[1,3)")).execute();

		expect(result3[0].int4range).toBe("[1,3)");
		expect(result3[0]._int4range.length).toBe(2);
		expect(result3[0]._int4range[0]).toBe("[1,3)");
		expect(result3[0]._int4range[1]).toBe("[4,6)");

		const result4 = await database.select().from(table).where(eq(table.int4range, "[11,13)")).execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.int4range, Symbol() as any))
				.execute()
		).toThrowError("Expected 'string' | 'object' | 'array', received 'symbol'");

		await database.execute(sql`
			drop table int4rangestring;
		`);

		expect(table.int4range.getSQLType()).toBe("int4range");
	});
});
