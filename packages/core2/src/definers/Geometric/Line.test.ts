import { Line } from "@postgresql-typed/parsers";
import { eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { pgTable } from "drizzle-orm/pg-core";
import { Client } from "pg";
import { describe, expect, test } from "vitest";

import { defineLine } from "./Line";

describe("defineLine", async () => {
	test('defineLine({ mode: "Line" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "line.test.ts",
			}),
			database = drizzle(postgres),
			table = pgTable("line", {
				line: defineLine("line", { mode: "Line" }).notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists line (
				line line not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				line: Line.from("{1,2,3}"),
			})
			.returning();

		expect(Line.isLine(result1[0].line)).toBe(true);

		const result2 = await database.select().from(table).execute();

		expect(Line.isLine(result2[0].line)).toBe(true);

		const result3 = await database
			.select()
			.from(table)
			.where(eq(table.line, Line.from("{1,2,3}")))
			.execute();

		expect(Line.isLine(result3[0].line)).toBe(true);

		const result4 = await database
			.select()
			.from(table)
			.where(eq(table.line, Line.from("{1,2,4}")))
			.execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table line;
		`);

		expect(table.line.getSQLType()).toBe("line");
	});

	test('defineLine({ mode: "string" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "linestring.test.ts",
			}),
			database = drizzle(postgres),
			table = pgTable("linestring", {
				line: defineLine("line", { mode: "string" }).notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists linestring (
				line line not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				line: "{1,2,3}",
			})
			.returning();

		expect(result1[0].line).toBe("{1,2,3}");

		const result2 = await database.select().from(table).execute();

		expect(result2[0].line).toBe("{1,2,3}");

		const result3 = await database.select().from(table).where(eq(table.line, "{1,2,3}")).execute();

		expect(result3[0].line).toBe("{1,2,3}");

		const result4 = await database.select().from(table).where(eq(table.line, "{1,2,4}")).execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table linestring;
		`);

		expect(table.line.getSQLType()).toBe("line");
	});
});
