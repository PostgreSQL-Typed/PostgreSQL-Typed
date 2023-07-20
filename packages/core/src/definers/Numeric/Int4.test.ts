import { Int4 } from "@postgresql-typed/parsers";
import { Client } from "pg";
import { describe, expect, test } from "vitest";

import { pgt, pgTable, sql } from "../../index.js";
import { eq } from "../../operators.js";
import { defineInt4 } from "./Int4";

describe("defineInt4", async () => {
	test('defineInt4({ mode: "Int4" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "int4.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("int4", {
				int4: defineInt4("int4", { mode: "Int4" }).notNull(),
				_int4: defineInt4("_int4", { mode: "Int4" }).array().notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists int4 (
				int4 int4 not null,
				_int4 _int4 not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				int4: Int4.from("1"),
				_int4: [Int4.from("1"), Int4.from("2")],
			})
			.returning();

		expect(Int4.isInt4(result1[0].int4)).toBe(true);
		expect(result1[0]._int4.length).toBe(2);
		expect(Int4.isInt4(result1[0]._int4[0])).toBe(true);
		expect(Int4.isInt4(result1[0]._int4[1])).toBe(true);

		const result2 = await database.select().from(table).execute();

		expect(Int4.isInt4(result2[0].int4)).toBe(true);
		expect(result2[0]._int4.length).toBe(2);
		expect(Int4.isInt4(result2[0]._int4[0])).toBe(true);
		expect(Int4.isInt4(result2[0]._int4[1])).toBe(true);

		const result3 = await database
			.select()
			.from(table)
			.where(eq(table.int4, Int4.from("1")))
			.execute();

		expect(Int4.isInt4(result3[0].int4)).toBe(true);
		expect(result3[0]._int4.length).toBe(2);
		expect(Int4.isInt4(result3[0]._int4[0])).toBe(true);
		expect(Int4.isInt4(result3[0]._int4[1])).toBe(true);

		const result4 = await database
			.select()
			.from(table)
			.where(eq(table.int4, Int4.from("2")))
			.execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.int4, Symbol() as any))
				.execute()
		).toThrowError("Expected 'number' | 'string' | 'object', received 'symbol'");

		await database.execute(sql`
			drop table int4;
		`);

		expect(table.int4.getSQLType()).toBe("int4");
	});

	test('defineInt4({ mode: "string" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "int4string.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("int4string", {
				int4: defineInt4("int4", { mode: "string" }).notNull(),
				_int4: defineInt4("_int4", { mode: "string" }).array().notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists int4string (
				int4 int4 not null,
				_int4 _int4 not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				int4: "1",
				_int4: ["1", "2"],
			})
			.returning();

		expect(result1[0].int4).toBe("1");
		expect(result1[0]._int4.length).toBe(2);
		expect(result1[0]._int4[0]).toBe("1");
		expect(result1[0]._int4[1]).toBe("2");

		const result2 = await database.select().from(table).execute();

		expect(result2[0].int4).toBe("1");
		expect(result2[0]._int4.length).toBe(2);
		expect(result2[0]._int4[0]).toBe("1");
		expect(result2[0]._int4[1]).toBe("2");

		const result3 = await database.select().from(table).where(eq(table.int4, "1")).execute();

		expect(result3[0].int4).toBe("1");
		expect(result3[0]._int4.length).toBe(2);
		expect(result3[0]._int4[0]).toBe("1");
		expect(result3[0]._int4[1]).toBe("2");

		const result4 = await database.select().from(table).where(eq(table.int4, "2")).execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.int4, Symbol() as any))
				.execute()
		).toThrowError("Expected 'number' | 'string' | 'object', received 'symbol'");

		await database.execute(sql`
			drop table int4string;
		`);

		expect(table.int4.getSQLType()).toBe("int4");
	});

	test('defineInt4({ mode: "number" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "int4number.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("int4number", {
				int4: defineInt4("int4", { mode: "number" }).notNull(),
				_int4: defineInt4("_int4", { mode: "number" }).array().notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists int4number (
				int4 int4 not null,
				_int4 _int4 not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				int4: 1,
				_int4: [1, 2],
			})
			.returning();

		expect(result1[0].int4).toBe(1);
		expect(result1[0]._int4.length).toBe(2);
		expect(result1[0]._int4[0]).toBe(1);
		expect(result1[0]._int4[1]).toBe(2);

		const result2 = await database.select().from(table).execute();

		expect(result2[0].int4).toBe(1);
		expect(result2[0]._int4.length).toBe(2);
		expect(result2[0]._int4[0]).toBe(1);
		expect(result2[0]._int4[1]).toBe(2);

		const result3 = await database.select().from(table).where(eq(table.int4, 1)).execute();

		expect(result3[0].int4).toBe(1);
		expect(result3[0]._int4.length).toBe(2);
		expect(result3[0]._int4[0]).toBe(1);
		expect(result3[0]._int4[1]).toBe(2);

		const result4 = await database.select().from(table).where(eq(table.int4, 2)).execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.int4, Symbol() as any))
				.execute()
		).toThrowError("Expected 'number' | 'string' | 'object', received 'symbol'");

		await database.execute(sql`
			drop table int4number;
		`);

		expect(table.int4.getSQLType()).toBe("int4");
	});
});
