import { DateMultiRange } from "@postgresql-typed/parsers";
import { Client } from "pg";
import { describe, expect, test } from "vitest";

import { pgt, pgTable, sql } from "../../index.js";
import { eq } from "../../operators.js";
import { defineDateMultiRange } from "./DateMultiRange";

describe("defineDateMultiRange", async () => {
	test('defineDateMultiRange({ mode: "DateMultiRange" })', async () => {
		const postgres = new Client({
				application_name: "datemultirange.test.ts",
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			database = pgt(postgres),
			table = pgTable("datemultirange", {
				_datemultirange: defineDateMultiRange("_datemultirange", { mode: "DateMultiRange" }).array().notNull(),
				datemultirange: defineDateMultiRange("datemultirange", { mode: "DateMultiRange" }).notNull(),
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
			create table if not exists datemultirange (
				datemultirange datemultirange not null,
				_datemultirange _datemultirange not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				_datemultirange: [
					DateMultiRange.from("{[2021-01-01,2022-01-01),[2023-01-01,2024-01-01),[2025-01-01,2026-01-01)}"),
					DateMultiRange.from("{[2022-01-01,2023-01-01),[2024-01-01,2025-01-01),[2026-01-01,2027-01-01)}"),
				],
				datemultirange: DateMultiRange.from("{[2021-01-01,2022-01-01),[2023-01-01,2024-01-01),[2025-01-01,2026-01-01)}"),
			})
			.returning();

		expect(DateMultiRange.isMultiRange(result1[0].datemultirange)).toBe(true);
		expect(result1[0]._datemultirange.length).toBe(2);
		expect(DateMultiRange.isMultiRange(result1[0]._datemultirange[0])).toBe(true);
		expect(DateMultiRange.isMultiRange(result1[0]._datemultirange[1])).toBe(true);

		const result2 = await database.select().from(table).execute();

		expect(DateMultiRange.isMultiRange(result2[0].datemultirange)).toBe(true);
		expect(result2[0]._datemultirange.length).toBe(2);
		expect(DateMultiRange.isMultiRange(result2[0]._datemultirange[0])).toBe(true);
		expect(DateMultiRange.isMultiRange(result2[0]._datemultirange[1])).toBe(true);

		const result3 = await database
			.select()
			.from(table)
			.where(eq(table.datemultirange, DateMultiRange.from("{[2021-01-01,2022-01-01),[2023-01-01,2024-01-01),[2025-01-01,2026-01-01)}")))
			.execute();

		expect(DateMultiRange.isMultiRange(result3[0].datemultirange)).toBe(true);
		expect(result3[0]._datemultirange.length).toBe(2);
		expect(DateMultiRange.isMultiRange(result3[0]._datemultirange[0])).toBe(true);
		expect(DateMultiRange.isMultiRange(result3[0]._datemultirange[1])).toBe(true);

		const result4 = await database
			.select()
			.from(table)
			.where(eq(table.datemultirange, DateMultiRange.from("{[2021-01-01,2022-01-01),[2023-01-01,2024-01-01),[2025-01-01,2027-01-01)}")))
			.execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.datemultirange, Symbol() as any))
				.execute()
		).toThrowError("Expected 'string' | 'object' | 'array', received 'symbol'");

		await database.execute(sql`
			drop table datemultirange;
		`);

		expect(table.datemultirange.getSQLType()).toBe("datemultirange");
	});

	test('defineDateMultiRange({ mode: "string" })', async () => {
		const postgres = new Client({
				application_name: "datemultirangestring.test.ts",
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			database = pgt(postgres),
			table = pgTable("datemultirangestring", {
				_datemultirange: defineDateMultiRange("_datemultirange", { mode: "string" }).array().notNull(),
				datemultirange: defineDateMultiRange("datemultirange", { mode: "string" }).notNull(),
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
			create table if not exists datemultirangestring (
				datemultirange datemultirange not null,
				_datemultirange _datemultirange not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				_datemultirange: [
					"{[2021-01-01,2022-01-01),[2023-01-01,2024-01-01),[2025-01-01,2026-01-01)}",
					"{[2022-01-01,2023-01-01),[2024-01-01,2025-01-01),[2026-01-01,2027-01-01)}",
				],
				datemultirange: "{[2021-01-01,2022-01-01),[2023-01-01,2024-01-01),[2025-01-01,2026-01-01)}",
			})
			.returning();

		expect(result1[0].datemultirange).toBe("{[2021-01-01,2022-01-01),[2023-01-01,2024-01-01),[2025-01-01,2026-01-01)}");
		expect(result1[0]._datemultirange.length).toBe(2);
		expect(result1[0]._datemultirange[0]).toBe("{[2021-01-01,2022-01-01),[2023-01-01,2024-01-01),[2025-01-01,2026-01-01)}");
		expect(result1[0]._datemultirange[1]).toBe("{[2022-01-01,2023-01-01),[2024-01-01,2025-01-01),[2026-01-01,2027-01-01)}");

		const result2 = await database.select().from(table).execute();

		expect(result2[0].datemultirange).toBe("{[2021-01-01,2022-01-01),[2023-01-01,2024-01-01),[2025-01-01,2026-01-01)}");
		expect(result2[0]._datemultirange.length).toBe(2);
		expect(result2[0]._datemultirange[0]).toBe("{[2021-01-01,2022-01-01),[2023-01-01,2024-01-01),[2025-01-01,2026-01-01)}");
		expect(result2[0]._datemultirange[1]).toBe("{[2022-01-01,2023-01-01),[2024-01-01,2025-01-01),[2026-01-01,2027-01-01)}");

		const result3 = await database
			.select()
			.from(table)
			.where(eq(table.datemultirange, "{[2021-01-01,2022-01-01),[2023-01-01,2024-01-01),[2025-01-01,2026-01-01)}"))
			.execute();

		expect(result3[0].datemultirange).toBe("{[2021-01-01,2022-01-01),[2023-01-01,2024-01-01),[2025-01-01,2026-01-01)}");
		expect(result3[0]._datemultirange.length).toBe(2);
		expect(result3[0]._datemultirange[0]).toBe("{[2021-01-01,2022-01-01),[2023-01-01,2024-01-01),[2025-01-01,2026-01-01)}");
		expect(result3[0]._datemultirange[1]).toBe("{[2022-01-01,2023-01-01),[2024-01-01,2025-01-01),[2026-01-01,2027-01-01)}");

		const result4 = await database
			.select()
			.from(table)
			.where(eq(table.datemultirange, "{[2021-01-01,2022-01-01),[2023-01-01,2024-01-01),[2025-01-01,2027-01-01)}"))
			.execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.datemultirange, Symbol() as any))
				.execute()
		).toThrowError("Expected 'string' | 'object' | 'array', received 'symbol'");

		await database.execute(sql`
			drop table datemultirangestring;
		`);

		expect(table.datemultirange.getSQLType()).toBe("datemultirange");
	});
});
