import { TimestampRange } from "@postgresql-typed/parsers";
import { eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { pgTable } from "drizzle-orm/pg-core";
import { Client } from "pg";
import { describe, expect, test } from "vitest";

import { defineTimestampRange } from "./TimestampRange";

describe("defineTimestampRange", async () => {
	test('defineTimestampRange({ mode: "TimestampRange" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "timestamprange.test.ts",
			}),
			database = drizzle(postgres),
			table = pgTable("timestamprange", {
				timestamprange: defineTimestampRange("timestamprange", { mode: "TimestampRange" }).notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists timestamprange (
				timestamprange tsrange not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				timestamprange: TimestampRange.from("[2025-01-01T00:00:00Z,2026-01-01T00:00:00Z)"),
			})
			.returning();

		expect(TimestampRange.isRange(result1[0].timestamprange)).toBe(true);

		const result2 = await database.select().from(table).execute();

		expect(TimestampRange.isRange(result2[0].timestamprange)).toBe(true);

		const result3 = await database
			.select()
			.from(table)
			.where(eq(table.timestamprange, TimestampRange.from("[2025-01-01T00:00:00Z,2026-01-01T00:00:00Z)")))
			.execute();

		expect(TimestampRange.isRange(result3[0].timestamprange)).toBe(true);

		const result4 = await database
			.select()
			.from(table)
			.where(eq(table.timestamprange, TimestampRange.from("[2025-01-01T00:00:00Z,2027-01-01T00:00:00Z)")))
			.execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table timestamprange;
		`);

		expect(table.timestamprange.getSQLType()).toBe("tsrange");
	});

	test('defineTimestampRange({ mode: "string" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "timestamprangestring.test.ts",
			}),
			database = drizzle(postgres),
			table = pgTable("timestamprangestring", {
				timestamprange: defineTimestampRange("timestamprange", { mode: "string" }).notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists timestamprangestring (
				timestamprange tsrange not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				timestamprange: "[2025-01-01T00:00:00Z,2026-01-01T00:00:00Z)",
			})
			.returning();

		expect(result1[0].timestamprange).toBe("[2025-01-01T00:00:00Z,2026-01-01T00:00:00Z)");

		const result2 = await database.select().from(table).execute();

		expect(result2[0].timestamprange).toBe("[2025-01-01T00:00:00Z,2026-01-01T00:00:00Z)");

		const result3 = await database.select().from(table).where(eq(table.timestamprange, "[2025-01-01T00:00:00Z,2026-01-01T00:00:00Z)")).execute();

		expect(result3[0].timestamprange).toBe("[2025-01-01T00:00:00Z,2026-01-01T00:00:00Z)");

		const result4 = await database.select().from(table).where(eq(table.timestamprange, "[2025-01-01T00:00:00Z,2027-01-01T00:00:00Z)")).execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table timestamprangestring;
		`);

		expect(table.timestamprange.getSQLType()).toBe("tsrange");
	});
});
