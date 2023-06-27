/* eslint-disable unicorn/filename-case */
import { DateTime, TimestampTZ } from "@postgresql-typed/parsers";
import { Client } from "pg";
import { describe, expect, test } from "vitest";

import { pgt, pgTable, sql } from "../../index.js";
import { eq } from "../../operators.js";
import { defineTimestampTZ } from "./TimestampTZ";

describe("defineTimestampTZ", async () => {
	test('defineTimestampTZ({ mode: "TimestampTZ" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "timestamptz.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("timestamptz", {
				timestamptz: defineTimestampTZ("timestamptz", { mode: "TimestampTZ" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists timestamptz (
				timestamptz timestamptz not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				timestamptz: TimestampTZ.from("2023-01-01T00:00:00Z"),
			})
			.returning();

		expect(TimestampTZ.isTimestampTZ(result1[0].timestamptz)).toBe(true);

		const result2 = await database.select().from(table).execute();

		expect(TimestampTZ.isTimestampTZ(result2[0].timestamptz)).toBe(true);

		const result3 = await database
			.select()
			.from(table)
			.where(eq(table.timestamptz, TimestampTZ.from("2023-01-01T00:00:00Z")))
			.execute();

		expect(TimestampTZ.isTimestampTZ(result3[0].timestamptz)).toBe(true);

		const result4 = await database
			.select()
			.from(table)
			.where(eq(table.timestamptz, TimestampTZ.from("2023-01-01T11:11:11Z")))
			.execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table timestamptz;
		`);

		expect(table.timestamptz.getSQLType()).toBe("timestamptz");
	});

	test('defineTimestampTZ({ mode: "string" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "timestamptzstring.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("timestamptzstring", {
				timestamptz: defineTimestampTZ("timestamptz", { mode: "string" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists timestamptzstring (
				timestamptz timestamptz not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				timestamptz: "2023-01-01T00:00:00Z",
			})
			.returning();

		expect(result1[0].timestamptz).toBe("2023-01-01T00:00:00Z");

		const result2 = await database.select().from(table).execute();

		expect(result2[0].timestamptz).toBe("2023-01-01T00:00:00Z");

		const result3 = await database.select().from(table).where(eq(table.timestamptz, "2023-01-01T00:00:00Z")).execute();

		expect(result3[0].timestamptz).toBe("2023-01-01T00:00:00Z");

		const result4 = await database.select().from(table).where(eq(table.timestamptz, "2023-01-01T11:11:11Z")).execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table timestamptzstring;
		`);

		expect(table.timestamptz.getSQLType()).toBe("timestamptz");
	});

	test('defineTimestampTZ({ mode: "unix" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "timestamptzunix.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("timestamptzunix", {
				timestamptz: defineTimestampTZ("timestamptz", { mode: "unix" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists timestamptzunix (
				timestamptz timestamptz not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				timestamptz: TimestampTZ.from("2023-01-01T00:00:00Z").value,
			})
			.returning();

		expect(result1[0].timestamptz).toBe(1_672_531_200_000);

		const result2 = await database.select().from(table).execute();

		expect(result2[0].timestamptz).toBe(1_672_531_200_000);

		const result3 = await database.select().from(table).where(eq(table.timestamptz, 1_672_531_200_000)).execute();

		expect(result3[0].timestamptz).toBe(1_672_531_200_000);

		const result4 = await database.select().from(table).where(eq(table.timestamptz, 1_672_531_300_000)).execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table timestamptzunix;
		`);

		expect(table.timestamptz.getSQLType()).toBe("timestamptz");
	});

	test('defineTimestampTZ({ mode: "luxon" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "timestamptzluxon.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("timestamptzluxon", {
				timestamptz: defineTimestampTZ("timestamptz", { mode: "luxon.DateTime" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists timestamptzluxon (
				timestamptz timestamptz not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				timestamptz: DateTime.fromISO("2023-01-01T11:11:11.000Z", {
					setZone: true,
				}),
			})
			.returning();

		expect(result1[0].timestamptz.toString()).includes("2023-01-01T11:11:11");

		const result2 = await database.select().from(table).execute();

		expect(result2[0].timestamptz.toString()).includes("2023-01-01T11:11:11");

		const result3 = await database
			.select()
			.from(table)
			.where(
				eq(
					table.timestamptz,
					DateTime.fromISO("2023-01-01T11:11:11.000Z", {
						setZone: true,
					})
				)
			)
			.execute();

		expect(result3[0].timestamptz.toString()).includes("2023-01-01T11:11:11");

		const result4 = await database
			.select()
			.from(table)
			.where(
				eq(
					table.timestamptz,
					DateTime.fromISO("2023-01-01T10:10:10.000Z", {
						setZone: true,
					})
				)
			)
			.execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table timestamptzluxon;
		`);

		expect(table.timestamptz.getSQLType()).toBe("timestamptz");
	});

	test('defineTimestampTZ({ mode: "js" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "timestamptzjs.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("timestamptzjs", {
				timestamptz: defineTimestampTZ("timestamptz", { mode: "globalThis.Date" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists timestamptzjs (
				timestamptz timestamptz not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				timestamptz: DateTime.fromISO("2023-01-01T11:11:11.000Z", {
					setZone: true,
				}).toJSDate(),
			})
			.returning();

		expect(result1[0].timestamptz.toISOString()).toBe("2023-01-01T11:11:11.000Z");

		const result2 = await database.select().from(table).execute();

		expect(result2[0].timestamptz.toISOString()).toBe("2023-01-01T11:11:11.000Z");

		const result3 = await database
			.select()
			.from(table)
			.where(
				eq(
					table.timestamptz,
					DateTime.fromISO("2023-01-01T11:11:11.000Z", {
						setZone: true,
					}).toJSDate()
				)
			)
			.execute();

		expect(result3[0].timestamptz.toISOString()).toBe("2023-01-01T11:11:11.000Z");

		const result4 = await database
			.select()
			.from(table)
			.where(
				eq(
					table.timestamptz,
					DateTime.fromISO("2023-01-01T10:10:10.000Z", {
						setZone: true,
					}).toJSDate()
				)
			)
			.execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table timestamptzjs;
		`);

		expect(table.timestamptz.getSQLType()).toBe("timestamptz");
	});
});
