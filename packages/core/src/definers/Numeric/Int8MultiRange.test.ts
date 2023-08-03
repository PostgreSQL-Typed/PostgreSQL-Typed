import { Int8MultiRange } from "@postgresql-typed/parsers";
import { Client } from "pg";
import { describe, expect, test } from "vitest";

import { pgt, pgTable, sql } from "../../index.js";
import { eq } from "../../operators.js";
import { defineInt8MultiRange } from "./Int8MultiRange";

describe("defineInt8MultiRange", async () => {
	test('defineInt8MultiRange({ mode: "Int8MultiRange" })', async () => {
		const postgres = new Client({
				application_name: "int8multirange.test.ts",
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			database = pgt(postgres),
			table = pgTable("int8multirange", {
				_int8multirange: defineInt8MultiRange("_int8multirange", { mode: "Int8MultiRange" }).array().notNull(),
				int8multirange: defineInt8MultiRange("int8multirange", { mode: "Int8MultiRange" }).notNull(),
			});

		await database.connect();

		const version = await postgres.query<{
				version: string;
			}>("SELECT version()"),
			versionNumber = Number(version.rows[0].version.toString().split(" ")[1].split(".")[0]);

		// Multirange types were introduced in PostgreSQL 14
		if (versionNumber < 14) {
			await postgres.end();
			return;
		}

		await database.execute(sql`
			create table if not exists int8multirange (
				int8multirange int8multirange not null,
				_int8multirange _int8multirange not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				_int8multirange: [Int8MultiRange.from("{[1,3),[11,13),[21,23)}"), Int8MultiRange.from("{[3,5),[13,15),[23,25)}")],
				int8multirange: Int8MultiRange.from("{[1,3),[11,13),[21,23)}"),
			})
			.returning();

		expect(Int8MultiRange.isMultiRange(result1[0].int8multirange)).toBe(true);
		expect(result1[0]._int8multirange.length).toBe(2);
		expect(Int8MultiRange.isMultiRange(result1[0]._int8multirange[0])).toBe(true);
		expect(Int8MultiRange.isMultiRange(result1[0]._int8multirange[1])).toBe(true);

		const result2 = await database.select().from(table).execute();

		expect(Int8MultiRange.isMultiRange(result2[0].int8multirange)).toBe(true);
		expect(result2[0]._int8multirange.length).toBe(2);
		expect(Int8MultiRange.isMultiRange(result2[0]._int8multirange[0])).toBe(true);
		expect(Int8MultiRange.isMultiRange(result2[0]._int8multirange[1])).toBe(true);

		const result3 = await database
			.select()
			.from(table)
			.where(eq(table.int8multirange, Int8MultiRange.from("{[1,3),[11,13),[21,23)}")))
			.execute();

		expect(Int8MultiRange.isMultiRange(result3[0].int8multirange)).toBe(true);
		expect(result3[0]._int8multirange.length).toBe(2);
		expect(Int8MultiRange.isMultiRange(result3[0]._int8multirange[0])).toBe(true);
		expect(Int8MultiRange.isMultiRange(result3[0]._int8multirange[1])).toBe(true);

		const result4 = await database
			.select()
			.from(table)
			.where(eq(table.int8multirange, Int8MultiRange.from("{[1,3),[11,13),[21,25)}")))
			.execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.int8multirange, Symbol() as any))
				.execute()
		).toThrowError("Expected 'string' | 'object' | 'array', received 'symbol'");

		await database.execute(sql`
			drop table int8multirange;
		`);

		expect(table.int8multirange.getSQLType()).toBe("int8multirange");
	});

	test('defineInt8MultiRange({ mode: "string" })', async () => {
		const postgres = new Client({
				application_name: "int8multirangestring.test.ts",
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			database = pgt(postgres),
			table = pgTable("int8multirangestring", {
				_int8multirange: defineInt8MultiRange("_int8multirange", { mode: "string" }).array().notNull(),
				int8multirange: defineInt8MultiRange("int8multirange", { mode: "string" }).notNull(),
			});

		await database.connect();

		const version = await postgres.query<{
				version: string;
			}>("SELECT version()"),
			versionNumber = Number(version.rows[0].version.toString().split(" ")[1].split(".")[0]);

		// Multirange types were introduced in PostgreSQL 14
		if (versionNumber < 14) {
			await postgres.end();
			return;
		}

		await database.execute(sql`
			create table if not exists int8multirangestring (
				int8multirange int8multirange not null,
				_int8multirange _int8multirange not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				_int8multirange: ["{[1,3),[11,13),[21,23)}", "{[3,5),[13,15),[23,25)}"],
				int8multirange: "{[1,3),[11,13),[21,23)}",
			})
			.returning();

		expect(result1[0].int8multirange).toBe("{[1,3),[11,13),[21,23)}");
		expect(result1[0]._int8multirange.length).toBe(2);
		expect(result1[0]._int8multirange[0]).toBe("{[1,3),[11,13),[21,23)}");
		expect(result1[0]._int8multirange[1]).toBe("{[3,5),[13,15),[23,25)}");

		const result2 = await database.select().from(table).execute();

		expect(result2[0].int8multirange).toBe("{[1,3),[11,13),[21,23)}");
		expect(result2[0]._int8multirange.length).toBe(2);
		expect(result2[0]._int8multirange[0]).toBe("{[1,3),[11,13),[21,23)}");
		expect(result2[0]._int8multirange[1]).toBe("{[3,5),[13,15),[23,25)}");

		const result3 = await database.select().from(table).where(eq(table.int8multirange, "{[1,3),[11,13),[21,23)}")).execute();

		expect(result3[0].int8multirange).toBe("{[1,3),[11,13),[21,23)}");
		expect(result3[0]._int8multirange.length).toBe(2);
		expect(result3[0]._int8multirange[0]).toBe("{[1,3),[11,13),[21,23)}");
		expect(result3[0]._int8multirange[1]).toBe("{[3,5),[13,15),[23,25)}");

		const result4 = await database.select().from(table).where(eq(table.int8multirange, "{[1,3),[11,13),[21,25)}")).execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.int8multirange, Symbol() as any))
				.execute()
		).toThrowError("Expected 'string' | 'object' | 'array', received 'symbol'");

		await database.execute(sql`
			drop table int8multirangestring;
		`);

		expect(table.int8multirange.getSQLType()).toBe("int8multirange");
	});
});
