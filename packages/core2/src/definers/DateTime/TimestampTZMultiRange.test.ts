/* eslint-disable unicorn/filename-case */
import { TimestampTZMultiRange } from "@postgresql-typed/parsers";
import { eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { pgTable } from "drizzle-orm/pg-core";
import { Client } from "pg";
import { describe, expect, test } from "vitest";

import { defineTimestampTZMultiRange } from "./TimestampTZMultiRange";

describe("defineTimestampTZMultiRange", async () => {
	test('defineTimestampTZMultiRange({ mode: "TimestampTZMultiRange" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "timestamptzmultirange.test.ts",
			}),
			database = drizzle(postgres),
			table = pgTable("timestamptzmultirange", {
				timestamptzmultirange: defineTimestampTZMultiRange("timestamptzmultirange", { mode: "TimestampTZMultiRange" }).notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists timestamptzmultirange (
				timestamptzmultirange tstzmultirange not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				timestamptzmultirange: TimestampTZMultiRange.from(
					"{[2021-01-01T00:00:00Z,2022-01-01T00:00:00Z),[2023-01-01T00:00:00Z,2024-01-01T00:00:00Z),[2025-01-01T00:00:00Z,2026-01-01T00:00:00Z)}"
				),
			})
			.returning();

		expect(TimestampTZMultiRange.isMultiRange(result1[0].timestamptzmultirange)).toBe(true);

		const result2 = await database.select().from(table).execute();

		expect(TimestampTZMultiRange.isMultiRange(result2[0].timestamptzmultirange)).toBe(true);

		const result3 = await database
			.select()
			.from(table)
			.where(
				eq(
					table.timestamptzmultirange,
					TimestampTZMultiRange.from(
						"{[2021-01-01T00:00:00Z,2022-01-01T00:00:00Z),[2023-01-01T00:00:00Z,2024-01-01T00:00:00Z),[2025-01-01T00:00:00Z,2026-01-01T00:00:00Z)}"
					)
				)
			)
			.execute();

		expect(TimestampTZMultiRange.isMultiRange(result3[0].timestamptzmultirange)).toBe(true);

		const result4 = await database
			.select()
			.from(table)
			.where(
				eq(
					table.timestamptzmultirange,
					TimestampTZMultiRange.from(
						"{[2021-01-01T00:00:00Z,2022-01-01T00:00:00Z),[2023-01-01T00:00:00Z,2024-01-01T00:00:00Z),[2025-01-01T00:00:00Z,2027-01-01T00:00:00Z)}"
					)
				)
			)
			.execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table timestamptzmultirange;
		`);

		expect(table.timestamptzmultirange.getSQLType()).toBe("tstzmultirange");
	});

	test('defineTimestampTZMultiRange({ mode: "string" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "timestamptzmultirangestring.test.ts",
			}),
			database = drizzle(postgres),
			table = pgTable("timestamptzmultirangestring", {
				timestamptzmultirange: defineTimestampTZMultiRange("timestamptzmultirange", { mode: "string" }).notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists timestamptzmultirangestring (
				timestamptzmultirange tstzmultirange not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				timestamptzmultirange:
					"{[2021-01-01T00:00:00Z,2022-01-01T00:00:00Z),[2023-01-01T00:00:00Z,2024-01-01T00:00:00Z),[2025-01-01T00:00:00Z,2026-01-01T00:00:00Z)}",
			})
			.returning();

		expect(result1[0].timestamptzmultirange).toBe(
			"{[2021-01-01T00:00:00Z,2022-01-01T00:00:00Z),[2023-01-01T00:00:00Z,2024-01-01T00:00:00Z),[2025-01-01T00:00:00Z,2026-01-01T00:00:00Z)}"
		);

		const result2 = await database.select().from(table).execute();

		expect(result2[0].timestamptzmultirange).toBe(
			"{[2021-01-01T00:00:00Z,2022-01-01T00:00:00Z),[2023-01-01T00:00:00Z,2024-01-01T00:00:00Z),[2025-01-01T00:00:00Z,2026-01-01T00:00:00Z)}"
		);

		const result3 = await database
			.select()
			.from(table)
			.where(
				eq(
					table.timestamptzmultirange,
					"{[2021-01-01T00:00:00Z,2022-01-01T00:00:00Z),[2023-01-01T00:00:00Z,2024-01-01T00:00:00Z),[2025-01-01T00:00:00Z,2026-01-01T00:00:00Z)}"
				)
			)
			.execute();

		expect(result3[0].timestamptzmultirange).toBe(
			"{[2021-01-01T00:00:00Z,2022-01-01T00:00:00Z),[2023-01-01T00:00:00Z,2024-01-01T00:00:00Z),[2025-01-01T00:00:00Z,2026-01-01T00:00:00Z)}"
		);

		const result4 = await database
			.select()
			.from(table)
			.where(
				eq(
					table.timestamptzmultirange,
					"{[2021-01-01T00:00:00Z,2022-01-01T00:00:00Z),[2023-01-01T00:00:00Z,2024-01-01T00:00:00Z),[2025-01-01T00:00:00Z,2027-01-01T00:00:00Z)}"
				)
			)
			.execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table timestamptzmultirangestring;
		`);

		expect(table.timestamptzmultirange.getSQLType()).toBe("tstzmultirange");
	});
});
