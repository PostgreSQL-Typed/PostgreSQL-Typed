/* eslint-disable unicorn/filename-case */
import { TimestampTZMultiRange } from "@postgresql-typed/parsers";
import { Client } from "pg";
import { describe, expect, test } from "vitest";

import { pgt, pgTable, sql } from "../../index.js";
import { eq } from "../../operators.js";
import { defineTimestampTZMultiRange } from "./TimestampTZMultiRange";

describe("defineTimestampTZMultiRange", async () => {
	test('defineTimestampTZMultiRange({ mode: "TimestampTZMultiRange" })', async () => {
		const postgres = new Client({
				application_name: "timestamptzmultirange.test.ts",
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			database = pgt(postgres),
			table = pgTable("timestamptzmultirange", {
				_timestamptzmultirange: defineTimestampTZMultiRange("_timestamptzmultirange", { mode: "TimestampTZMultiRange" }).array().notNull(),
				timestamptzmultirange: defineTimestampTZMultiRange("timestamptzmultirange", { mode: "TimestampTZMultiRange" }).notNull(),
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
			create table if not exists timestamptzmultirange (
				timestamptzmultirange tstzmultirange not null,
				_timestamptzmultirange _tstzmultirange not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				_timestamptzmultirange: [
					TimestampTZMultiRange.from(
						"{[2021-01-01T00:00:00Z,2022-01-01T00:00:00Z),[2023-01-01T00:00:00Z,2024-01-01T00:00:00Z),[2025-01-01T00:00:00Z,2026-01-01T00:00:00Z)}"
					),
					TimestampTZMultiRange.from(
						"{[2027-01-01T00:00:00Z,2028-01-01T00:00:00Z),[2029-01-01T00:00:00Z,2030-01-01T00:00:00Z),[2031-01-01T00:00:00Z,2032-01-01T00:00:00Z)}"
					),
				],
				timestamptzmultirange: TimestampTZMultiRange.from(
					"{[2021-01-01T00:00:00Z,2022-01-01T00:00:00Z),[2023-01-01T00:00:00Z,2024-01-01T00:00:00Z),[2025-01-01T00:00:00Z,2026-01-01T00:00:00Z)}"
				),
			})
			.returning();

		expect(TimestampTZMultiRange.isMultiRange(result1[0].timestamptzmultirange)).toBe(true);
		expect(result1[0]._timestamptzmultirange.length).toBe(2);
		expect(TimestampTZMultiRange.isMultiRange(result1[0]._timestamptzmultirange[0])).toBe(true);
		expect(TimestampTZMultiRange.isMultiRange(result1[0]._timestamptzmultirange[1])).toBe(true);

		const result2 = await database.select().from(table).execute();

		expect(TimestampTZMultiRange.isMultiRange(result2[0].timestamptzmultirange)).toBe(true);
		expect(result2[0]._timestamptzmultirange.length).toBe(2);
		expect(TimestampTZMultiRange.isMultiRange(result2[0]._timestamptzmultirange[0])).toBe(true);
		expect(TimestampTZMultiRange.isMultiRange(result2[0]._timestamptzmultirange[1])).toBe(true);

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
		expect(result3[0]._timestamptzmultirange.length).toBe(2);
		expect(TimestampTZMultiRange.isMultiRange(result3[0]._timestamptzmultirange[0])).toBe(true);
		expect(TimestampTZMultiRange.isMultiRange(result3[0]._timestamptzmultirange[1])).toBe(true);

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

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.timestamptzmultirange, Symbol() as any))
				.execute()
		).toThrowError("Expected 'string' | 'object' | 'array', received 'symbol'");

		await database.execute(sql`
			drop table timestamptzmultirange;
		`);

		expect(table.timestamptzmultirange.getSQLType()).toBe("tstzmultirange");
	});

	test('defineTimestampTZMultiRange({ mode: "string" })', async () => {
		const postgres = new Client({
				application_name: "timestamptzmultirangestring.test.ts",
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			database = pgt(postgres),
			table = pgTable("timestamptzmultirangestring", {
				_timestamptzmultirange: defineTimestampTZMultiRange("_timestamptzmultirange", { mode: "string" }).array().notNull(),
				timestamptzmultirange: defineTimestampTZMultiRange("timestamptzmultirange", { mode: "string" }).notNull(),
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
			create table if not exists timestamptzmultirangestring (
				timestamptzmultirange tstzmultirange not null,
				_timestamptzmultirange _tstzmultirange not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				_timestamptzmultirange: [
					"{[2021-01-01T00:00:00Z,2022-01-01T00:00:00Z),[2023-01-01T00:00:00Z,2024-01-01T00:00:00Z),[2025-01-01T00:00:00Z,2026-01-01T00:00:00Z)}",
					"{[2027-01-01T00:00:00Z,2028-01-01T00:00:00Z),[2029-01-01T00:00:00Z,2030-01-01T00:00:00Z),[2031-01-01T00:00:00Z,2032-01-01T00:00:00Z)}",
				],
				timestamptzmultirange:
					"{[2021-01-01T00:00:00Z,2022-01-01T00:00:00Z),[2023-01-01T00:00:00Z,2024-01-01T00:00:00Z),[2025-01-01T00:00:00Z,2026-01-01T00:00:00Z)}",
			})
			.returning();

		expect(result1[0].timestamptzmultirange).toBe(
			"{[2021-01-01T00:00:00Z,2022-01-01T00:00:00Z),[2023-01-01T00:00:00Z,2024-01-01T00:00:00Z),[2025-01-01T00:00:00Z,2026-01-01T00:00:00Z)}"
		);
		expect(result1[0]._timestamptzmultirange.length).toBe(2);
		expect(result1[0]._timestamptzmultirange[0]).toBe(
			"{[2021-01-01T00:00:00Z,2022-01-01T00:00:00Z),[2023-01-01T00:00:00Z,2024-01-01T00:00:00Z),[2025-01-01T00:00:00Z,2026-01-01T00:00:00Z)}"
		);
		expect(result1[0]._timestamptzmultirange[1]).toBe(
			"{[2027-01-01T00:00:00Z,2028-01-01T00:00:00Z),[2029-01-01T00:00:00Z,2030-01-01T00:00:00Z),[2031-01-01T00:00:00Z,2032-01-01T00:00:00Z)}"
		);

		const result2 = await database.select().from(table).execute();

		expect(result2[0].timestamptzmultirange).toBe(
			"{[2021-01-01T00:00:00Z,2022-01-01T00:00:00Z),[2023-01-01T00:00:00Z,2024-01-01T00:00:00Z),[2025-01-01T00:00:00Z,2026-01-01T00:00:00Z)}"
		);
		expect(result2[0]._timestamptzmultirange.length).toBe(2);
		expect(result2[0]._timestamptzmultirange[0]).toBe(
			"{[2021-01-01T00:00:00Z,2022-01-01T00:00:00Z),[2023-01-01T00:00:00Z,2024-01-01T00:00:00Z),[2025-01-01T00:00:00Z,2026-01-01T00:00:00Z)}"
		);
		expect(result2[0]._timestamptzmultirange[1]).toBe(
			"{[2027-01-01T00:00:00Z,2028-01-01T00:00:00Z),[2029-01-01T00:00:00Z,2030-01-01T00:00:00Z),[2031-01-01T00:00:00Z,2032-01-01T00:00:00Z)}"
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
		expect(result3[0]._timestamptzmultirange.length).toBe(2);
		expect(result3[0]._timestamptzmultirange[0]).toBe(
			"{[2021-01-01T00:00:00Z,2022-01-01T00:00:00Z),[2023-01-01T00:00:00Z,2024-01-01T00:00:00Z),[2025-01-01T00:00:00Z,2026-01-01T00:00:00Z)}"
		);
		expect(result3[0]._timestamptzmultirange[1]).toBe(
			"{[2027-01-01T00:00:00Z,2028-01-01T00:00:00Z),[2029-01-01T00:00:00Z,2030-01-01T00:00:00Z),[2031-01-01T00:00:00Z,2032-01-01T00:00:00Z)}"
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

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.timestamptzmultirange, Symbol() as any))
				.execute()
		).toThrowError("Expected 'string' | 'object' | 'array', received 'symbol'");

		await database.execute(sql`
			drop table timestamptzmultirangestring;
		`);

		expect(table.timestamptzmultirange.getSQLType()).toBe("tstzmultirange");
	});
});
