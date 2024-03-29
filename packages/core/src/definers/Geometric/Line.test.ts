import { Line } from "@postgresql-typed/parsers";
import { Client } from "pg";
import { describe, expect, test } from "vitest";

import { pgt, pgTable, sql } from "../../index.js";
import { eq } from "../../operators.js";
import { defineLine } from "./Line";

describe("defineLine", async () => {
	test('defineLine({ mode: "Line" })', async () => {
		const postgres = new Client({
				application_name: "line.test.ts",
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			database = pgt(postgres),
			table = pgTable("line", {
				_line: defineLine("_line", { mode: "Line" }).array().notNull(),
				line: defineLine("line", { mode: "Line" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists line (
				line line not null,
				_line _line not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				_line: [Line.from("{1,2,3}"), Line.from("{1,2,4}")],
				line: Line.from("{1,2,3}"),
			})
			.returning();

		expect(Line.isLine(result1[0].line)).toBe(true);
		expect(result1[0]._line.length).toBe(2);
		expect(Line.isLine(result1[0]._line[0])).toBe(true);
		expect(Line.isLine(result1[0]._line[1])).toBe(true);

		const result2 = await database.select().from(table).execute();

		expect(Line.isLine(result2[0].line)).toBe(true);
		expect(result2[0]._line.length).toBe(2);
		expect(Line.isLine(result2[0]._line[0])).toBe(true);
		expect(Line.isLine(result2[0]._line[1])).toBe(true);

		const result3 = await database
			.select()
			.from(table)
			.where(eq(table.line, Line.from("{1,2,3}")))
			.execute();

		expect(Line.isLine(result3[0].line)).toBe(true);
		expect(result3[0]._line.length).toBe(2);
		expect(Line.isLine(result3[0]._line[0])).toBe(true);
		expect(Line.isLine(result3[0]._line[1])).toBe(true);

		const result4 = await database
			.select()
			.from(table)
			.where(eq(table.line, Line.from("{1,2,4}")))
			.execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.line, Symbol() as any))
				.execute()
		).toThrowError("Expected 'number' | 'string' | 'object', received 'symbol'");

		await database.execute(sql`
			drop table line;
		`);

		expect(table.line.getSQLType()).toBe("line");
	});

	test('defineLine({ mode: "string" })', async () => {
		const postgres = new Client({
				application_name: "linestring.test.ts",
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			database = pgt(postgres),
			table = pgTable("linestring", {
				_line: defineLine("_line", { mode: "string" }).array().notNull(),
				line: defineLine("line", { mode: "string" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists linestring (
				line line not null,
				_line _line not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				_line: ["{1,2,3}", "{1,2,4}"],
				line: "{1,2,3}",
			})
			.returning();

		expect(result1[0].line).toBe("{1,2,3}");
		expect(result1[0]._line.length).toBe(2);
		expect(result1[0]._line[0]).toBe("{1,2,3}");
		expect(result1[0]._line[1]).toBe("{1,2,4}");

		const result2 = await database.select().from(table).execute();

		expect(result2[0].line).toBe("{1,2,3}");
		expect(result2[0]._line.length).toBe(2);
		expect(result2[0]._line[0]).toBe("{1,2,3}");
		expect(result2[0]._line[1]).toBe("{1,2,4}");

		const result3 = await database.select().from(table).where(eq(table.line, "{1,2,3}")).execute();

		expect(result3[0].line).toBe("{1,2,3}");
		expect(result3[0]._line.length).toBe(2);
		expect(result3[0]._line[0]).toBe("{1,2,3}");
		expect(result3[0]._line[1]).toBe("{1,2,4}");

		const result4 = await database.select().from(table).where(eq(table.line, "{1,2,4}")).execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.line, Symbol() as any))
				.execute()
		).toThrowError("Expected 'number' | 'string' | 'object', received 'symbol'");

		await database.execute(sql`
			drop table linestring;
		`);

		expect(table.line.getSQLType()).toBe("line");
	});
});
