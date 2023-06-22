import { TimestampMultiRange } from "@postgresql-typed/parsers";
import { eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { pgTable } from "drizzle-orm/pg-core";
import { Client } from "pg";
import { describe, expect, test } from "vitest";

import { defineTimestampMultiRange } from "./TimestampMultiRange";

describe("defineTimestampMultiRange", async () => {
	test('defineTimestampMultiRange({ mode: "TimestampMultiRange" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "timestampmultirange.test.ts",
			}),
			database = drizzle(postgres),
			table = pgTable("timestampmultirange", {
				timestampmultirange: defineTimestampMultiRange("timestampmultirange", { mode: "TimestampMultiRange" }).notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists timestampmultirange (
				timestampmultirange tsmultirange not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				timestampmultirange: TimestampMultiRange.from(
					"{[2021-01-01T00:00:00Z,2022-01-01T00:00:00Z),[2023-01-01T00:00:00Z,2024-01-01T00:00:00Z),[2025-01-01T00:00:00Z,2026-01-01T00:00:00Z)}"
				),
			})
			.returning();

		expect(TimestampMultiRange.isMultiRange(result1[0].timestampmultirange)).toBe(true);

		const result2 = await database.select().from(table).execute();

		expect(TimestampMultiRange.isMultiRange(result2[0].timestampmultirange)).toBe(true);

		const result3 = await database
			.select()
			.from(table)
			.where(
				eq(
					table.timestampmultirange,
					TimestampMultiRange.from(
						"{[2021-01-01T00:00:00Z,2022-01-01T00:00:00Z),[2023-01-01T00:00:00Z,2024-01-01T00:00:00Z),[2025-01-01T00:00:00Z,2026-01-01T00:00:00Z)}"
					)
				)
			)
			.execute();

		expect(TimestampMultiRange.isMultiRange(result3[0].timestampmultirange)).toBe(true);

		const result4 = await database
			.select()
			.from(table)
			.where(
				eq(
					table.timestampmultirange,
					TimestampMultiRange.from(
						"{[2021-01-01T00:00:00Z,2022-01-01T00:00:00Z),[2023-01-01T00:00:00Z,2024-01-01T00:00:00Z),[2025-01-01T00:00:00Z,2027-01-01T00:00:00Z)}"
					)
				)
			)
			.execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table timestampmultirange;
		`);

		expect(table.timestampmultirange.getSQLType()).toBe("tsmultirange");
	});

	test('defineTimestampMultiRange({ mode: "string" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "timestampmultirangestring.test.ts",
			}),
			database = drizzle(postgres),
			table = pgTable("timestampmultirangestring", {
				timestampmultirange: defineTimestampMultiRange("timestampmultirange", { mode: "string" }).notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists timestampmultirangestring (
				timestampmultirange tsmultirange not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				timestampmultirange:
					"{[2021-01-01T00:00:00Z,2022-01-01T00:00:00Z),[2023-01-01T00:00:00Z,2024-01-01T00:00:00Z),[2025-01-01T00:00:00Z,2026-01-01T00:00:00Z)}",
			})
			.returning();

		expect(result1[0].timestampmultirange).toBe(
			"{[2021-01-01T00:00:00Z,2022-01-01T00:00:00Z),[2023-01-01T00:00:00Z,2024-01-01T00:00:00Z),[2025-01-01T00:00:00Z,2026-01-01T00:00:00Z)}"
		);

		const result2 = await database.select().from(table).execute();

		expect(result2[0].timestampmultirange).toBe(
			"{[2021-01-01T00:00:00Z,2022-01-01T00:00:00Z),[2023-01-01T00:00:00Z,2024-01-01T00:00:00Z),[2025-01-01T00:00:00Z,2026-01-01T00:00:00Z)}"
		);

		const result3 = await database
			.select()
			.from(table)
			.where(
				eq(
					table.timestampmultirange,
					"{[2021-01-01T00:00:00Z,2022-01-01T00:00:00Z),[2023-01-01T00:00:00Z,2024-01-01T00:00:00Z),[2025-01-01T00:00:00Z,2026-01-01T00:00:00Z)}"
				)
			)
			.execute();

		expect(result3[0].timestampmultirange).toBe(
			"{[2021-01-01T00:00:00Z,2022-01-01T00:00:00Z),[2023-01-01T00:00:00Z,2024-01-01T00:00:00Z),[2025-01-01T00:00:00Z,2026-01-01T00:00:00Z)}"
		);

		const result4 = await database
			.select()
			.from(table)
			.where(
				eq(
					table.timestampmultirange,
					"{[2021-01-01T00:00:00Z,2022-01-01T00:00:00Z),[2023-01-01T00:00:00Z,2024-01-01T00:00:00Z),[2025-01-01T00:00:00Z,2027-01-01T00:00:00Z)}"
				)
			)
			.execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table timestampmultirangestring;
		`);

		expect(table.timestampmultirange.getSQLType()).toBe("tsmultirange");
	});
});
