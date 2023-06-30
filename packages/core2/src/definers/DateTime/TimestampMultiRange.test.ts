import { TimestampMultiRange } from "@postgresql-typed/parsers";
import { Client } from "pg";
import { describe, expect, test } from "vitest";

import { pgt, pgTable, sql } from "../../index.js";
import { eq } from "../../operators.js";
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
			database = pgt(postgres),
			table = pgTable("timestampmultirange", {
				timestampmultirange: defineTimestampMultiRange("timestampmultirange", { mode: "TimestampMultiRange" }).notNull(),
				_timestampmultirange: defineTimestampMultiRange("_timestampmultirange", { mode: "TimestampMultiRange" }).array().notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists timestampmultirange (
				timestampmultirange tsmultirange not null,
				_timestampmultirange _tsmultirange not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				timestampmultirange: TimestampMultiRange.from(
					"{[2021-01-01T00:00:00Z,2022-01-01T00:00:00Z),[2023-01-01T00:00:00Z,2024-01-01T00:00:00Z),[2025-01-01T00:00:00Z,2026-01-01T00:00:00Z)}"
				),
				_timestampmultirange: [
					TimestampMultiRange.from(
						"{[2021-01-01T00:00:00Z,2022-01-01T00:00:00Z),[2023-01-01T00:00:00Z,2024-01-01T00:00:00Z),[2025-01-01T00:00:00Z,2026-01-01T00:00:00Z)}"
					),
					TimestampMultiRange.from(
						"{[2027-01-01T00:00:00Z,2028-01-01T00:00:00Z),[2029-01-01T00:00:00Z,2030-01-01T00:00:00Z),[2031-01-01T00:00:00Z,2032-01-01T00:00:00Z)}"
					),
				],
			})
			.returning();

		expect(TimestampMultiRange.isMultiRange(result1[0].timestampmultirange)).toBe(true);
		expect(result1[0]._timestampmultirange.length).toBe(2);
		expect(TimestampMultiRange.isMultiRange(result1[0]._timestampmultirange[0])).toBe(true);
		expect(TimestampMultiRange.isMultiRange(result1[0]._timestampmultirange[1])).toBe(true);

		const result2 = await database.select().from(table).execute();

		expect(TimestampMultiRange.isMultiRange(result2[0].timestampmultirange)).toBe(true);
		expect(result2[0]._timestampmultirange.length).toBe(2);
		expect(TimestampMultiRange.isMultiRange(result2[0]._timestampmultirange[0])).toBe(true);
		expect(TimestampMultiRange.isMultiRange(result2[0]._timestampmultirange[1])).toBe(true);

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
		expect(result3[0]._timestampmultirange.length).toBe(2);
		expect(TimestampMultiRange.isMultiRange(result3[0]._timestampmultirange[0])).toBe(true);
		expect(TimestampMultiRange.isMultiRange(result3[0]._timestampmultirange[1])).toBe(true);

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
			database = pgt(postgres),
			table = pgTable("timestampmultirangestring", {
				timestampmultirange: defineTimestampMultiRange("timestampmultirange", { mode: "string" }).notNull(),
				_timestampmultirange: defineTimestampMultiRange("_timestampmultirange", { mode: "string" }).array().notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists timestampmultirangestring (
				timestampmultirange tsmultirange not null,
				_timestampmultirange _tsmultirange not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				timestampmultirange:
					"{[2021-01-01T00:00:00Z,2022-01-01T00:00:00Z),[2023-01-01T00:00:00Z,2024-01-01T00:00:00Z),[2025-01-01T00:00:00Z,2026-01-01T00:00:00Z)}",
				_timestampmultirange: [
					"{[2027-01-01T00:00:00Z,2028-01-01T00:00:00Z),[2029-01-01T00:00:00Z,2030-01-01T00:00:00Z),[2031-01-01T00:00:00Z,2032-01-01T00:00:00Z)}",
					"{[2033-01-01T00:00:00Z,2034-01-01T00:00:00Z),[2035-01-01T00:00:00Z,2036-01-01T00:00:00Z),[2037-01-01T00:00:00Z,2038-01-01T00:00:00Z)}",
				],
			})
			.returning();

		expect(result1[0].timestampmultirange).toBe(
			"{[2021-01-01T00:00:00Z,2022-01-01T00:00:00Z),[2023-01-01T00:00:00Z,2024-01-01T00:00:00Z),[2025-01-01T00:00:00Z,2026-01-01T00:00:00Z)}"
		);
		expect(result1[0]._timestampmultirange.length).toBe(2);
		expect(result1[0]._timestampmultirange[0]).toBe(
			"{[2027-01-01T00:00:00Z,2028-01-01T00:00:00Z),[2029-01-01T00:00:00Z,2030-01-01T00:00:00Z),[2031-01-01T00:00:00Z,2032-01-01T00:00:00Z)}"
		);
		expect(result1[0]._timestampmultirange[1]).toBe(
			"{[2033-01-01T00:00:00Z,2034-01-01T00:00:00Z),[2035-01-01T00:00:00Z,2036-01-01T00:00:00Z),[2037-01-01T00:00:00Z,2038-01-01T00:00:00Z)}"
		);

		const result2 = await database.select().from(table).execute();

		expect(result2[0].timestampmultirange).toBe(
			"{[2021-01-01T00:00:00Z,2022-01-01T00:00:00Z),[2023-01-01T00:00:00Z,2024-01-01T00:00:00Z),[2025-01-01T00:00:00Z,2026-01-01T00:00:00Z)}"
		);
		expect(result2[0]._timestampmultirange.length).toBe(2);
		expect(result2[0]._timestampmultirange[0]).toBe(
			"{[2027-01-01T00:00:00Z,2028-01-01T00:00:00Z),[2029-01-01T00:00:00Z,2030-01-01T00:00:00Z),[2031-01-01T00:00:00Z,2032-01-01T00:00:00Z)}"
		);
		expect(result2[0]._timestampmultirange[1]).toBe(
			"{[2033-01-01T00:00:00Z,2034-01-01T00:00:00Z),[2035-01-01T00:00:00Z,2036-01-01T00:00:00Z),[2037-01-01T00:00:00Z,2038-01-01T00:00:00Z)}"
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
		expect(result3[0]._timestampmultirange.length).toBe(2);
		expect(result3[0]._timestampmultirange[0]).toBe(
			"{[2027-01-01T00:00:00Z,2028-01-01T00:00:00Z),[2029-01-01T00:00:00Z,2030-01-01T00:00:00Z),[2031-01-01T00:00:00Z,2032-01-01T00:00:00Z)}"
		);
		expect(result3[0]._timestampmultirange[1]).toBe(
			"{[2033-01-01T00:00:00Z,2034-01-01T00:00:00Z),[2035-01-01T00:00:00Z,2036-01-01T00:00:00Z),[2037-01-01T00:00:00Z,2038-01-01T00:00:00Z)}"
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
