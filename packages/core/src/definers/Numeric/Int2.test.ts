import { Int2 } from "@postgresql-typed/parsers";
import { Client } from "pg";
import { describe, expect, test } from "vitest";

import { pgt, pgTable, sql } from "../../index.js";
import { eq } from "../../operators.js";
import { defineInt2 } from "./Int2";

describe("defineInt2", async () => {
	test('defineInt2({ mode: "Int2" })', async () => {
		const postgres = new Client({
				application_name: "int2.test.ts",
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			database = pgt(postgres),
			table = pgTable("int2", {
				_int2: defineInt2("_int2", { mode: "Int2" }).array().notNull(),
				int2: defineInt2("int2", { mode: "Int2" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists int2 (
				int2 int2 not null,
				_int2 _int2 not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				_int2: [Int2.from("1"), Int2.from("2")],
				int2: Int2.from("1"),
			})
			.returning();

		expect(Int2.isInt2(result1[0].int2)).toBe(true);
		expect(result1[0]._int2.length).toBe(2);
		expect(Int2.isInt2(result1[0]._int2[0])).toBe(true);
		expect(Int2.isInt2(result1[0]._int2[1])).toBe(true);

		const result2 = await database.select().from(table).execute();

		expect(Int2.isInt2(result2[0].int2)).toBe(true);
		expect(result2[0]._int2.length).toBe(2);
		expect(Int2.isInt2(result2[0]._int2[0])).toBe(true);
		expect(Int2.isInt2(result2[0]._int2[1])).toBe(true);

		const result3 = await database
			.select()
			.from(table)
			.where(eq(table.int2, Int2.from("1")))
			.execute();

		expect(Int2.isInt2(result3[0].int2)).toBe(true);
		expect(result3[0]._int2.length).toBe(2);
		expect(Int2.isInt2(result3[0]._int2[0])).toBe(true);
		expect(Int2.isInt2(result3[0]._int2[1])).toBe(true);

		const result4 = await database
			.select()
			.from(table)
			.where(eq(table.int2, Int2.from("2")))
			.execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.int2, Symbol() as any))
				.execute()
		).toThrowError("Expected 'number' | 'string' | 'object', received 'symbol'");

		await database.execute(sql`
			drop table int2;
		`);

		expect(table.int2.getSQLType()).toBe("int2");
	});

	test('defineInt2({ mode: "string" })', async () => {
		const postgres = new Client({
				application_name: "int2string.test.ts",
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			database = pgt(postgres),
			table = pgTable("int2string", {
				_int2: defineInt2("_int2", { mode: "string" }).array().notNull(),
				int2: defineInt2("int2", { mode: "string" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists int2string (
				int2 int2 not null,
				_int2 _int2 not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				_int2: ["1", "2"],
				int2: "1",
			})
			.returning();

		expect(result1[0].int2).toBe("1");
		expect(result1[0]._int2.length).toBe(2);
		expect(result1[0]._int2[0]).toBe("1");
		expect(result1[0]._int2[1]).toBe("2");

		const result2 = await database.select().from(table).execute();

		expect(result2[0].int2).toBe("1");
		expect(result2[0]._int2.length).toBe(2);
		expect(result2[0]._int2[0]).toBe("1");
		expect(result2[0]._int2[1]).toBe("2");

		const result3 = await database.select().from(table).where(eq(table.int2, "1")).execute();

		expect(result3[0].int2).toBe("1");
		expect(result3[0]._int2.length).toBe(2);
		expect(result3[0]._int2[0]).toBe("1");
		expect(result3[0]._int2[1]).toBe("2");

		const result4 = await database.select().from(table).where(eq(table.int2, "2")).execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.int2, Symbol() as any))
				.execute()
		).toThrowError("Expected 'number' | 'string' | 'object', received 'symbol'");

		await database.execute(sql`
			drop table int2string;
		`);

		expect(table.int2.getSQLType()).toBe("int2");
	});

	test('defineInt2({ mode: "number" })', async () => {
		const postgres = new Client({
				application_name: "int2number.test.ts",
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			database = pgt(postgres),
			table = pgTable("int2number", {
				_int2: defineInt2("_int2", { mode: "number" }).array().notNull(),
				int2: defineInt2("int2", { mode: "number" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists int2number (
				int2 int2 not null,
				_int2 _int2 not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				_int2: [1, 2],
				int2: 1,
			})
			.returning();

		expect(result1[0].int2).toBe(1);
		expect(result1[0]._int2.length).toBe(2);
		expect(result1[0]._int2[0]).toBe(1);
		expect(result1[0]._int2[1]).toBe(2);

		const result2 = await database.select().from(table).execute();

		expect(result2[0].int2).toBe(1);
		expect(result2[0]._int2.length).toBe(2);
		expect(result2[0]._int2[0]).toBe(1);
		expect(result2[0]._int2[1]).toBe(2);

		const result3 = await database.select().from(table).where(eq(table.int2, 1)).execute();

		expect(result3[0].int2).toBe(1);
		expect(result3[0]._int2.length).toBe(2);
		expect(result3[0]._int2[0]).toBe(1);
		expect(result3[0]._int2[1]).toBe(2);

		const result4 = await database.select().from(table).where(eq(table.int2, 2)).execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.int2, Symbol() as any))
				.execute()
		).toThrowError("Expected 'number' | 'string' | 'object', received 'symbol'");

		await database.execute(sql`
			drop table int2number;
		`);

		expect(table.int2.getSQLType()).toBe("int2");
	});
});
