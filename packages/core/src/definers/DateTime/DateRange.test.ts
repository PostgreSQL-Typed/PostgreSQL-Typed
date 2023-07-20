import { DateRange } from "@postgresql-typed/parsers";
import { Client } from "pg";
import { describe, expect, test } from "vitest";

import { pgt, pgTable, sql } from "../../index.js";
import { eq } from "../../operators.js";
import { defineDateRange } from "./DateRange";

describe("defineDateRange", async () => {
	test('defineDateRange({ mode: "DateRange" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "daterange.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("daterange", {
				daterange: defineDateRange("daterange", { mode: "DateRange" }).notNull(),
				_daterange: defineDateRange("_daterange", { mode: "DateRange" }).array().notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists daterange (
				daterange daterange not null,
				_daterange _daterange not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				daterange: DateRange.from("[2025-01-01,2026-01-01)"),
				_daterange: [DateRange.from("[2025-01-01,2026-01-01)"), DateRange.from("[2026-01-01,2027-01-01)")],
			})
			.returning();

		expect(DateRange.isRange(result1[0].daterange)).toBe(true);
		expect(result1[0]._daterange.length).toBe(2);
		expect(DateRange.isRange(result1[0]._daterange[0])).toBe(true);
		expect(DateRange.isRange(result1[0]._daterange[1])).toBe(true);

		const result2 = await database.select().from(table).execute();

		expect(DateRange.isRange(result2[0].daterange)).toBe(true);
		expect(result2[0]._daterange.length).toBe(2);
		expect(DateRange.isRange(result2[0]._daterange[0])).toBe(true);
		expect(DateRange.isRange(result2[0]._daterange[1])).toBe(true);

		const result3 = await database
			.select()
			.from(table)
			.where(eq(table.daterange, DateRange.from("[2025-01-01,2026-01-01)")))
			.execute();

		expect(DateRange.isRange(result3[0].daterange)).toBe(true);
		expect(result3[0]._daterange.length).toBe(2);
		expect(DateRange.isRange(result3[0]._daterange[0])).toBe(true);
		expect(DateRange.isRange(result3[0]._daterange[1])).toBe(true);

		const result4 = await database
			.select()
			.from(table)
			.where(eq(table.daterange, DateRange.from("[2025-01-01,2027-01-01)")))
			.execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.daterange, Symbol() as any))
				.execute()
		).toThrowError("Expected 'string' | 'object' | 'array', received 'symbol'");

		await database.execute(sql`
			drop table daterange;
		`);

		expect(table.daterange.getSQLType()).toBe("daterange");
	});

	test('defineDateRange({ mode: "string" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "daterangestring.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("daterangestring", {
				daterange: defineDateRange("daterange", { mode: "string" }).notNull(),
				_daterange: defineDateRange("_daterange", { mode: "string" }).array().notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists daterangestring (
				daterange daterange not null,
				_daterange _daterange not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				daterange: "[2025-01-01,2026-01-01)",
				_daterange: ["[2025-01-01,2026-01-01)", "[2026-01-01,2027-01-01)"],
			})
			.returning();

		expect(result1[0].daterange).toBe("[2025-01-01,2026-01-01)");
		expect(result1[0]._daterange.length).toBe(2);
		expect(result1[0]._daterange[0]).toBe("[2025-01-01,2026-01-01)");
		expect(result1[0]._daterange[1]).toBe("[2026-01-01,2027-01-01)");

		const result2 = await database.select().from(table).execute();

		expect(result2[0].daterange).toBe("[2025-01-01,2026-01-01)");
		expect(result2[0]._daterange.length).toBe(2);
		expect(result2[0]._daterange[0]).toBe("[2025-01-01,2026-01-01)");
		expect(result2[0]._daterange[1]).toBe("[2026-01-01,2027-01-01)");

		const result3 = await database.select().from(table).where(eq(table.daterange, "[2025-01-01,2026-01-01)")).execute();

		expect(result3[0].daterange).toBe("[2025-01-01,2026-01-01)");
		expect(result3[0]._daterange.length).toBe(2);
		expect(result3[0]._daterange[0]).toBe("[2025-01-01,2026-01-01)");
		expect(result3[0]._daterange[1]).toBe("[2026-01-01,2027-01-01)");

		const result4 = await database.select().from(table).where(eq(table.daterange, "[2025-01-01,2027-01-01)")).execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.daterange, Symbol() as any))
				.execute()
		).toThrowError("Expected 'string' | 'object' | 'array', received 'symbol'");

		await database.execute(sql`
			drop table daterangestring;
		`);

		expect(table.daterange.getSQLType()).toBe("daterange");
	});
});
