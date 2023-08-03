import { Int8Range } from "@postgresql-typed/parsers";
import { Client } from "pg";
import { describe, expect, test } from "vitest";

import { pgt, pgTable, sql } from "../../index.js";
import { eq } from "../../operators.js";
import { defineInt8Range } from "./Int8Range";

describe("defineInt8Range", async () => {
	test('defineInt8Range({ mode: "Int8Range" })', async () => {
		const postgres = new Client({
				application_name: "int8range.test.ts",
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			database = pgt(postgres),
			table = pgTable("int8range", {
				_int8range: defineInt8Range("_int8range", { mode: "Int8Range" }).array().notNull(),
				int8range: defineInt8Range("int8range", { mode: "Int8Range" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists int8range (
				int8range int8range not null,
				_int8range _int8range not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				_int8range: [Int8Range.from("[1,3)"), Int8Range.from("[3,5)")],
				int8range: Int8Range.from("[1,3)"),
			})
			.returning();

		expect(Int8Range.isRange(result1[0].int8range)).toBe(true);
		expect(result1[0]._int8range.length).toBe(2);
		expect(Int8Range.isRange(result1[0]._int8range[0])).toBe(true);
		expect(Int8Range.isRange(result1[0]._int8range[1])).toBe(true);

		const result2 = await database.select().from(table).execute();

		expect(Int8Range.isRange(result2[0].int8range)).toBe(true);
		expect(result2[0]._int8range.length).toBe(2);
		expect(Int8Range.isRange(result2[0]._int8range[0])).toBe(true);
		expect(Int8Range.isRange(result2[0]._int8range[1])).toBe(true);

		const result3 = await database
			.select()
			.from(table)
			.where(eq(table.int8range, Int8Range.from("[1,3)")))
			.execute();

		expect(Int8Range.isRange(result3[0].int8range)).toBe(true);
		expect(result3[0]._int8range.length).toBe(2);
		expect(Int8Range.isRange(result3[0]._int8range[0])).toBe(true);
		expect(Int8Range.isRange(result3[0]._int8range[1])).toBe(true);

		const result4 = await database
			.select()
			.from(table)
			.where(eq(table.int8range, Int8Range.from("[11,13)")))
			.execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.int8range, Symbol() as any))
				.execute()
		).toThrowError("Expected 'string' | 'object' | 'array', received 'symbol'");

		await database.execute(sql`
			drop table int8range;
		`);

		expect(table.int8range.getSQLType()).toBe("int8range");
	});

	test('defineInt8Range({ mode: "string" })', async () => {
		const postgres = new Client({
				application_name: "int8rangestring.test.ts",
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			database = pgt(postgres),
			table = pgTable("int8rangestring", {
				_int8range: defineInt8Range("_int8range", { mode: "string" }).array().notNull(),
				int8range: defineInt8Range("int8range", { mode: "string" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists int8rangestring (
				int8range int8range not null,
				_int8range _int8range not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				_int8range: ["[1,3)", "[3,5)"],
				int8range: "[1,3)",
			})
			.returning();

		expect(result1[0].int8range).toBe("[1,3)");
		expect(result1[0]._int8range.length).toBe(2);
		expect(result1[0]._int8range[0]).toBe("[1,3)");
		expect(result1[0]._int8range[1]).toBe("[3,5)");

		const result2 = await database.select().from(table).execute();

		expect(result2[0].int8range).toBe("[1,3)");
		expect(result2[0]._int8range.length).toBe(2);
		expect(result2[0]._int8range[0]).toBe("[1,3)");
		expect(result2[0]._int8range[1]).toBe("[3,5)");

		const result3 = await database.select().from(table).where(eq(table.int8range, "[1,3)")).execute();

		expect(result3[0].int8range).toBe("[1,3)");
		expect(result3[0]._int8range.length).toBe(2);
		expect(result3[0]._int8range[0]).toBe("[1,3)");
		expect(result3[0]._int8range[1]).toBe("[3,5)");

		const result4 = await database.select().from(table).where(eq(table.int8range, "[11,13)")).execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.int8range, Symbol() as any))
				.execute()
		).toThrowError("Expected 'string' | 'object' | 'array', received 'symbol'");

		await database.execute(sql`
			drop table int8rangestring;
		`);

		expect(table.int8range.getSQLType()).toBe("int8range");
	});
});
