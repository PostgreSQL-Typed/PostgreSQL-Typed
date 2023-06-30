import { Int4MultiRange } from "@postgresql-typed/parsers";
import { Client } from "pg";
import { describe, expect, test } from "vitest";

import { pgt, pgTable, sql } from "../../index.js";
import { eq } from "../../operators.js";
import { defineInt4MultiRange } from "./Int4MultiRange";

describe("defineInt4MultiRange", async () => {
	test('defineInt4MultiRange({ mode: "Int4MultiRange" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "int4multirange.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("int4multirange", {
				int4multirange: defineInt4MultiRange("int4multirange", { mode: "Int4MultiRange" }).notNull(),
				_int4multirange: defineInt4MultiRange("_int4multirange", { mode: "Int4MultiRange" }).array().notNull(),
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
			create table if not exists int4multirange (
				int4multirange int4multirange not null,
				_int4multirange _int4multirange not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				int4multirange: Int4MultiRange.from("{[1,3),[11,13),[21,23)}"),
				_int4multirange: [Int4MultiRange.from("{[1,3),[11,13),[21,23)}"), Int4MultiRange.from("{[3,5),[13,15),[23,25)}")],
			})
			.returning();

		expect(Int4MultiRange.isMultiRange(result1[0].int4multirange)).toBe(true);
		expect(result1[0]._int4multirange.length).toBe(2);
		expect(Int4MultiRange.isMultiRange(result1[0]._int4multirange[0])).toBe(true);
		expect(Int4MultiRange.isMultiRange(result1[0]._int4multirange[1])).toBe(true);

		const result2 = await database.select().from(table).execute();

		expect(Int4MultiRange.isMultiRange(result2[0].int4multirange)).toBe(true);
		expect(result2[0]._int4multirange.length).toBe(2);
		expect(Int4MultiRange.isMultiRange(result2[0]._int4multirange[0])).toBe(true);
		expect(Int4MultiRange.isMultiRange(result2[0]._int4multirange[1])).toBe(true);

		const result3 = await database
			.select()
			.from(table)
			.where(eq(table.int4multirange, Int4MultiRange.from("{[1,3),[11,13),[21,23)}")))
			.execute();

		expect(Int4MultiRange.isMultiRange(result3[0].int4multirange)).toBe(true);
		expect(result3[0]._int4multirange.length).toBe(2);
		expect(Int4MultiRange.isMultiRange(result3[0]._int4multirange[0])).toBe(true);
		expect(Int4MultiRange.isMultiRange(result3[0]._int4multirange[1])).toBe(true);

		const result4 = await database
			.select()
			.from(table)
			.where(eq(table.int4multirange, Int4MultiRange.from("{[1,3),[11,13),[21,25)}")))
			.execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table int4multirange;
		`);

		expect(table.int4multirange.getSQLType()).toBe("int4multirange");
	});

	test('defineInt4MultiRange({ mode: "string" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "int4multirangestring.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("int4multirangestring", {
				int4multirange: defineInt4MultiRange("int4multirange", { mode: "string" }).notNull(),
				_int4multirange: defineInt4MultiRange("_int4multirange", { mode: "string" }).array().notNull(),
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
			create table if not exists int4multirangestring (
				int4multirange int4multirange not null,
				_int4multirange _int4multirange not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				int4multirange: "{[1,3),[11,13),[21,23)}",
				_int4multirange: ["{[1,3),[11,13),[21,23)}", "{[3,5),[13,15),[23,25)}"],
			})
			.returning();

		expect(result1[0].int4multirange).toBe("{[1,3),[11,13),[21,23)}");
		expect(result1[0]._int4multirange.length).toBe(2);
		expect(result1[0]._int4multirange[0]).toBe("{[1,3),[11,13),[21,23)}");
		expect(result1[0]._int4multirange[1]).toBe("{[3,5),[13,15),[23,25)}");

		const result2 = await database.select().from(table).execute();

		expect(result2[0].int4multirange).toBe("{[1,3),[11,13),[21,23)}");
		expect(result2[0]._int4multirange.length).toBe(2);
		expect(result2[0]._int4multirange[0]).toBe("{[1,3),[11,13),[21,23)}");
		expect(result2[0]._int4multirange[1]).toBe("{[3,5),[13,15),[23,25)}");

		const result3 = await database.select().from(table).where(eq(table.int4multirange, "{[1,3),[11,13),[21,23)}")).execute();

		expect(result3[0].int4multirange).toBe("{[1,3),[11,13),[21,23)}");
		expect(result3[0]._int4multirange.length).toBe(2);
		expect(result3[0]._int4multirange[0]).toBe("{[1,3),[11,13),[21,23)}");
		expect(result3[0]._int4multirange[1]).toBe("{[3,5),[13,15),[23,25)}");

		const result4 = await database.select().from(table).where(eq(table.int4multirange, "{[1,3),[11,13),[21,25)}")).execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table int4multirangestring;
		`);

		expect(table.int4multirange.getSQLType()).toBe("int4multirange");
	});
});
