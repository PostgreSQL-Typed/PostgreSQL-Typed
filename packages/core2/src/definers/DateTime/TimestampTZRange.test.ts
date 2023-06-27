/* eslint-disable unicorn/filename-case */
import { TimestampTZRange } from "@postgresql-typed/parsers";
import { Client } from "pg";
import { describe, expect, test } from "vitest";

import { pgt, pgTable, sql } from "../../index.js";
import { eq } from "../../operators.js";
import { defineTimestampTZRange } from "./TimestampTZRange";

describe("defineTimestampTZRange", async () => {
	test('defineTimestampTZRange({ mode: "TimestampTZRange" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "timestamptzrange.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("timestamptzrange", {
				timestamptzrange: defineTimestampTZRange("timestamptzrange", { mode: "TimestampTZRange" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists timestamptzrange (
				timestamptzrange tstzrange not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				timestamptzrange: TimestampTZRange.from("[2025-01-01T00:00:00Z,2026-01-01T00:00:00Z)"),
			})
			.returning();

		expect(TimestampTZRange.isRange(result1[0].timestamptzrange)).toBe(true);

		const result2 = await database.select().from(table).execute();

		expect(TimestampTZRange.isRange(result2[0].timestamptzrange)).toBe(true);

		const result3 = await database
			.select()
			.from(table)
			.where(eq(table.timestamptzrange, TimestampTZRange.from("[2025-01-01T00:00:00Z,2026-01-01T00:00:00Z)")))
			.execute();

		expect(TimestampTZRange.isRange(result3[0].timestamptzrange)).toBe(true);

		const result4 = await database
			.select()
			.from(table)
			.where(eq(table.timestamptzrange, TimestampTZRange.from("[2025-01-01T00:00:00Z,2027-01-01T00:00:00Z)")))
			.execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table timestamptzrange;
		`);

		expect(table.timestamptzrange.getSQLType()).toBe("tstzrange");
	});

	test('defineTimestampTZRange({ mode: "string" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "timestamptzrangestring.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("timestamptzrangestring", {
				timestamptzrange: defineTimestampTZRange("timestamptzrange", { mode: "string" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists timestamptzrangestring (
				timestamptzrange tstzrange not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				timestamptzrange: "[2025-01-01T00:00:00Z,2026-01-01T00:00:00Z)",
			})
			.returning();

		expect(result1[0].timestamptzrange).toBe("[2025-01-01T00:00:00Z,2026-01-01T00:00:00Z)");

		const result2 = await database.select().from(table).execute();

		expect(result2[0].timestamptzrange).toBe("[2025-01-01T00:00:00Z,2026-01-01T00:00:00Z)");

		const result3 = await database.select().from(table).where(eq(table.timestamptzrange, "[2025-01-01T00:00:00Z,2026-01-01T00:00:00Z)")).execute();

		expect(result3[0].timestamptzrange).toBe("[2025-01-01T00:00:00Z,2026-01-01T00:00:00Z)");

		const result4 = await database.select().from(table).where(eq(table.timestamptzrange, "[2025-01-01T00:00:00Z,2027-01-01T00:00:00Z)")).execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table timestamptzrangestring;
		`);

		expect(table.timestamptzrange.getSQLType()).toBe("tstzrange");
	});
});
