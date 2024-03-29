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
				application_name: "timestamptz.test.ts",
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			database = pgt(postgres),
			table = pgTable("timestamptz", {
				_timestamptz: defineTimestampTZ("_timestamptz", { mode: "TimestampTZ" }).array().notNull(),
				timestamptz: defineTimestampTZ("timestamptz", { mode: "TimestampTZ" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists timestamptz (
				timestamptz timestamptz not null,
				_timestamptz _timestamptz not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				_timestamptz: [TimestampTZ.from("2023-01-01T00:00:00Z"), TimestampTZ.from("2023-01-01T11:11:11Z")],
				timestamptz: TimestampTZ.from("2023-01-01T00:00:00Z"),
			})
			.returning();

		expect(TimestampTZ.isTimestampTZ(result1[0].timestamptz)).toBe(true);
		expect(result1[0]._timestamptz.length).toBe(2);
		expect(TimestampTZ.isTimestampTZ(result1[0]._timestamptz[0])).toBe(true);
		expect(TimestampTZ.isTimestampTZ(result1[0]._timestamptz[1])).toBe(true);

		const result2 = await database.select().from(table).execute();

		expect(TimestampTZ.isTimestampTZ(result2[0].timestamptz)).toBe(true);
		expect(result2[0]._timestamptz.length).toBe(2);
		expect(TimestampTZ.isTimestampTZ(result2[0]._timestamptz[0])).toBe(true);
		expect(TimestampTZ.isTimestampTZ(result2[0]._timestamptz[1])).toBe(true);

		const result3 = await database
			.select()
			.from(table)
			.where(eq(table.timestamptz, TimestampTZ.from("2023-01-01T00:00:00Z")))
			.execute();

		expect(TimestampTZ.isTimestampTZ(result3[0].timestamptz)).toBe(true);
		expect(result3[0]._timestamptz.length).toBe(2);
		expect(TimestampTZ.isTimestampTZ(result3[0]._timestamptz[0])).toBe(true);
		expect(TimestampTZ.isTimestampTZ(result3[0]._timestamptz[1])).toBe(true);

		const result4 = await database
			.select()
			.from(table)
			.where(eq(table.timestamptz, TimestampTZ.from("2023-01-01T11:11:11Z")))
			.execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.timestamptz, Symbol() as any))
				.execute()
		).toThrowError("Expected 'number' | 'string' | 'object' | 'globalThis.Date' | 'luxon.DateTime', received 'symbol'");

		await database.execute(sql`
			drop table timestamptz;
		`);

		expect(table.timestamptz.getSQLType()).toBe("timestamptz");
	});

	test('defineTimestampTZ({ mode: "string" })', async () => {
		const postgres = new Client({
				application_name: "timestamptzstring.test.ts",
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			database = pgt(postgres),
			table = pgTable("timestamptzstring", {
				_timestamptz: defineTimestampTZ("_timestamptz", { mode: "string" }).array().notNull(),
				timestamptz: defineTimestampTZ("timestamptz", { mode: "string" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists timestamptzstring (
				timestamptz timestamptz not null,
				_timestamptz _timestamptz not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				_timestamptz: ["2023-01-01T00:00:00Z", "2023-01-01T11:11:11Z"],
				timestamptz: "2023-01-01T00:00:00Z",
			})
			.returning();

		expect(result1[0].timestamptz).toBe("2023-01-01T00:00:00Z");
		expect(result1[0]._timestamptz.length).toBe(2);
		expect(result1[0]._timestamptz[0]).toBe("2023-01-01T00:00:00Z");
		expect(result1[0]._timestamptz[1]).toBe("2023-01-01T11:11:11Z");

		const result2 = await database.select().from(table).execute();

		expect(result2[0].timestamptz).toBe("2023-01-01T00:00:00Z");
		expect(result2[0]._timestamptz.length).toBe(2);
		expect(result2[0]._timestamptz[0]).toBe("2023-01-01T00:00:00Z");
		expect(result2[0]._timestamptz[1]).toBe("2023-01-01T11:11:11Z");

		const result3 = await database.select().from(table).where(eq(table.timestamptz, "2023-01-01T00:00:00Z")).execute();

		expect(result3[0].timestamptz).toBe("2023-01-01T00:00:00Z");
		expect(result3[0]._timestamptz.length).toBe(2);
		expect(result3[0]._timestamptz[0]).toBe("2023-01-01T00:00:00Z");
		expect(result3[0]._timestamptz[1]).toBe("2023-01-01T11:11:11Z");

		const result4 = await database.select().from(table).where(eq(table.timestamptz, "2023-01-01T11:11:11Z")).execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.timestamptz, Symbol() as any))
				.execute()
		).toThrowError("Expected 'number' | 'string' | 'object' | 'globalThis.Date' | 'luxon.DateTime', received 'symbol'");

		await database.execute(sql`
			drop table timestamptzstring;
		`);

		expect(table.timestamptz.getSQLType()).toBe("timestamptz");
	});

	test('defineTimestampTZ({ mode: "unix" })', async () => {
		const postgres = new Client({
				application_name: "timestamptzunix.test.ts",
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			database = pgt(postgres),
			table = pgTable("timestamptzunix", {
				_timestamptz: defineTimestampTZ("_timestamptz", { mode: "unix" }).array().notNull(),
				timestamptz: defineTimestampTZ("timestamptz", { mode: "unix" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists timestamptzunix (
				timestamptz timestamptz not null,
				_timestamptz _timestamptz not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				_timestamptz: [TimestampTZ.from("2023-01-01T00:00:00Z").toNumber(), TimestampTZ.from("2023-01-01T11:11:11Z").toNumber()],
				timestamptz: TimestampTZ.from("2023-01-01T00:00:00Z").toNumber(),
			})
			.returning();

		expect(result1[0].timestamptz).toBe(1_672_531_200_000);
		expect(result1[0]._timestamptz.length).toBe(2);
		expect(result1[0]._timestamptz[0]).toBe(1_672_531_200_000);
		expect(result1[0]._timestamptz[1]).toBe(1_672_571_471_000);

		const result2 = await database.select().from(table).execute();

		expect(result2[0].timestamptz).toBe(1_672_531_200_000);
		expect(result2[0]._timestamptz.length).toBe(2);
		expect(result2[0]._timestamptz[0]).toBe(1_672_531_200_000);
		expect(result2[0]._timestamptz[1]).toBe(1_672_571_471_000);

		const result3 = await database.select().from(table).where(eq(table.timestamptz, 1_672_531_200_000)).execute();

		expect(result3[0].timestamptz).toBe(1_672_531_200_000);
		expect(result3[0]._timestamptz.length).toBe(2);
		expect(result3[0]._timestamptz[0]).toBe(1_672_531_200_000);
		expect(result3[0]._timestamptz[1]).toBe(1_672_571_471_000);

		const result4 = await database.select().from(table).where(eq(table.timestamptz, 1_672_531_300_000)).execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.timestamptz, Symbol() as any))
				.execute()
		).toThrowError("Expected 'number' | 'string' | 'object' | 'globalThis.Date' | 'luxon.DateTime', received 'symbol'");

		await database.execute(sql`
			drop table timestamptzunix;
		`);

		expect(table.timestamptz.getSQLType()).toBe("timestamptz");
	});

	test('defineTimestampTZ({ mode: "luxon" })', async () => {
		const postgres = new Client({
				application_name: "timestamptzluxon.test.ts",
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			database = pgt(postgres),
			table = pgTable("timestamptzluxon", {
				_timestamptz: defineTimestampTZ("_timestamptz", { mode: "luxon.DateTime" }).array().notNull(),
				timestamptz: defineTimestampTZ("timestamptz", { mode: "luxon.DateTime" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists timestamptzluxon (
				timestamptz timestamptz not null,
				_timestamptz _timestamptz not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				_timestamptz: [
					DateTime.fromISO("2023-01-01T00:00:00.000Z", {
						setZone: true,
					}),
					DateTime.fromISO("2023-01-01T11:11:11.000Z", {
						setZone: true,
					}),
				],
				timestamptz: DateTime.fromISO("2023-01-01T11:11:11.000Z", {
					setZone: true,
				}),
			})
			.returning();

		expect(result1[0].timestamptz.toString()).includes("2023-01-01T11:11:11");
		expect(result1[0]._timestamptz.length).toBe(2);
		expect(result1[0]._timestamptz[0].toString()).includes("2023-01-01T00:00:00");
		expect(result1[0]._timestamptz[1].toString()).includes("2023-01-01T11:11:11");

		const result2 = await database.select().from(table).execute();

		expect(result2[0].timestamptz.toString()).includes("2023-01-01T11:11:11");
		expect(result2[0]._timestamptz.length).toBe(2);
		expect(result2[0]._timestamptz[0].toString()).includes("2023-01-01T00:00:00");
		expect(result2[0]._timestamptz[1].toString()).includes("2023-01-01T11:11:11");

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
		expect(result3[0]._timestamptz.length).toBe(2);
		expect(result3[0]._timestamptz[0].toString()).includes("2023-01-01T00:00:00");
		expect(result3[0]._timestamptz[1].toString()).includes("2023-01-01T11:11:11");

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

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.timestamptz, Symbol() as any))
				.execute()
		).toThrowError("Expected 'number' | 'string' | 'object' | 'globalThis.Date' | 'luxon.DateTime', received 'symbol'");

		await database.execute(sql`
			drop table timestamptzluxon;
		`);

		expect(table.timestamptz.getSQLType()).toBe("timestamptz");
	});

	test('defineTimestampTZ({ mode: "js" })', async () => {
		const postgres = new Client({
				application_name: "timestamptzjs.test.ts",
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			database = pgt(postgres),
			table = pgTable("timestamptzjs", {
				_timestamptz: defineTimestampTZ("_timestamptz", { mode: "globalThis.Date" }).array().notNull(),
				timestamptz: defineTimestampTZ("timestamptz", { mode: "globalThis.Date" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists timestamptzjs (
				timestamptz timestamptz not null,
				_timestamptz _timestamptz not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				_timestamptz: [
					DateTime.fromISO("2023-01-01T00:00:00.000Z", {
						setZone: true,
					}).toJSDate(),
					DateTime.fromISO("2023-01-01T11:11:11.000Z", {
						setZone: true,
					}).toJSDate(),
				],
				timestamptz: DateTime.fromISO("2023-01-01T11:11:11.000Z", {
					setZone: true,
				}).toJSDate(),
			})
			.returning();

		expect(result1[0].timestamptz.toISOString()).toBe("2023-01-01T11:11:11.000Z");
		expect(result1[0]._timestamptz.length).toBe(2);
		expect(result1[0]._timestamptz[0].toISOString()).toBe("2023-01-01T00:00:00.000Z");
		expect(result1[0]._timestamptz[1].toISOString()).toBe("2023-01-01T11:11:11.000Z");

		const result2 = await database.select().from(table).execute();

		expect(result2[0].timestamptz.toISOString()).toBe("2023-01-01T11:11:11.000Z");
		expect(result2[0]._timestamptz.length).toBe(2);
		expect(result2[0]._timestamptz[0].toISOString()).toBe("2023-01-01T00:00:00.000Z");
		expect(result2[0]._timestamptz[1].toISOString()).toBe("2023-01-01T11:11:11.000Z");

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
		expect(result3[0]._timestamptz.length).toBe(2);
		expect(result3[0]._timestamptz[0].toISOString()).toBe("2023-01-01T00:00:00.000Z");
		expect(result3[0]._timestamptz[1].toISOString()).toBe("2023-01-01T11:11:11.000Z");

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

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.timestamptz, Symbol() as any))
				.execute()
		).toThrowError("Expected 'number' | 'string' | 'object' | 'globalThis.Date' | 'luxon.DateTime', received 'symbol'");

		await database.execute(sql`
			drop table timestamptzjs;
		`);

		expect(table.timestamptz.getSQLType()).toBe("timestamptz");
	});
});
