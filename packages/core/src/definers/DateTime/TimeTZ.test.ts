/* eslint-disable unicorn/filename-case */
import { DateTime, TimeTZ } from "@postgresql-typed/parsers";
import { Client } from "pg";
import { describe, expect, test } from "vitest";

import { pgt, pgTable, sql } from "../../index.js";
import { eq } from "../../operators.js";
import { defineTimeTZ } from "./TimeTZ";

describe("defineTimeTZ", async () => {
	test('defineTimeTZ({ mode: "TimeTZ" })', async () => {
		const postgres = new Client({
				application_name: "timetz.test.ts",
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			database = pgt(postgres),
			table = pgTable("timetz", {
				_timetz: defineTimeTZ("_timetz", { mode: "TimeTZ" }).array().notNull(),
				timetz: defineTimeTZ("timetz", { mode: "TimeTZ" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists timetz (
				timetz timetz not null,
				_timetz _timetz not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				_timetz: [TimeTZ.from("11:11:11"), TimeTZ.from("10:10:10")],
				timetz: TimeTZ.from("11:11:11"),
			})
			.returning();

		expect(TimeTZ.isTimeTZ(result1[0].timetz)).toBe(true);
		expect(result1[0]._timetz.length).toBe(2);
		expect(TimeTZ.isTimeTZ(result1[0]._timetz[0])).toBe(true);
		expect(TimeTZ.isTimeTZ(result1[0]._timetz[1])).toBe(true);

		const result2 = await database.select().from(table).execute();

		expect(TimeTZ.isTimeTZ(result2[0].timetz)).toBe(true);
		expect(result2[0]._timetz.length).toBe(2);
		expect(TimeTZ.isTimeTZ(result2[0]._timetz[0])).toBe(true);
		expect(TimeTZ.isTimeTZ(result2[0]._timetz[1])).toBe(true);

		const result3 = await database
			.select()
			.from(table)
			.where(eq(table.timetz, TimeTZ.from("11:11:11")))
			.execute();

		expect(TimeTZ.isTimeTZ(result3[0].timetz)).toBe(true);
		expect(result3[0]._timetz.length).toBe(2);
		expect(TimeTZ.isTimeTZ(result3[0]._timetz[0])).toBe(true);
		expect(TimeTZ.isTimeTZ(result3[0]._timetz[1])).toBe(true);

		const result4 = await database
			.select()
			.from(table)
			.where(eq(table.timetz, TimeTZ.from("10:10:10")))
			.execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.timetz, Symbol() as any))
				.execute()
		).toThrowError("Expected 'number' | 'string' | 'object' | 'globalThis.Date' | 'luxon.DateTime', received 'symbol'");

		await database.execute(sql`
			drop table timetz;
		`);

		expect(table.timetz.getSQLType()).toBe("timetz");
	});

	test('defineTimeTZ({ mode: "string" })', async () => {
		const postgres = new Client({
				application_name: "timetzstring.test.ts",
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			database = pgt(postgres),
			table = pgTable("timetzstring", {
				_timetz: defineTimeTZ("_timetz", { mode: "string" }).array().notNull(),
				timetz: defineTimeTZ("timetz", { mode: "string" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists timetzstring (
				timetz timetz not null,
				_timetz _timetz not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				_timetz: ["11:11:11", "10:10:10"],
				timetz: "11:11:11",
			})
			.returning();

		expect(result1[0].timetz).toBe("11:11:11");
		expect(result1[0]._timetz.length).toBe(2);
		expect(result1[0]._timetz[0]).toBe("11:11:11");
		expect(result1[0]._timetz[1]).toBe("10:10:10");

		const result2 = await database.select().from(table).execute();

		expect(result2[0].timetz).toBe("11:11:11");
		expect(result2[0]._timetz.length).toBe(2);
		expect(result2[0]._timetz[0]).toBe("11:11:11");
		expect(result2[0]._timetz[1]).toBe("10:10:10");

		const result3 = await database.select().from(table).where(eq(table.timetz, "11:11:11")).execute();

		expect(result3[0].timetz).toBe("11:11:11");
		expect(result3[0]._timetz.length).toBe(2);
		expect(result3[0]._timetz[0]).toBe("11:11:11");
		expect(result3[0]._timetz[1]).toBe("10:10:10");

		const result4 = await database.select().from(table).where(eq(table.timetz, "10:10:10")).execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.timetz, Symbol() as any))
				.execute()
		).toThrowError("Expected 'number' | 'string' | 'object' | 'globalThis.Date' | 'luxon.DateTime', received 'symbol'");

		await database.execute(sql`
			drop table timetzstring;
		`);

		expect(table.timetz.getSQLType()).toBe("timetz");
	});

	test('defineTimeTZ({ mode: "unix" })', async () => {
		const postgres = new Client({
				application_name: "timetzunix.test.ts",
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			database = pgt(postgres),
			table = pgTable("timetzunix", {
				_timetz: defineTimeTZ("_timetz", { mode: "unix" }).array().notNull(),
				timetz: defineTimeTZ("timetz", { mode: "unix" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists timetzunix (
				timetz timetz not null,
				_timetz _timetz not null
			);
		`);

		const todayInMilliseconds = DateTime.now()
				.set({
					hour: 0,
					millisecond: 0,
					minute: 0,
					second: 0,
				})
				.toMillis(),
			elevenElevenElevenInMilliseconds = 39_600_000 + 666_000 + 11_000,
			tenTenTenInMilliseconds = 36_600_000 + 600_000 + 10_000,
			result1 = await database
				.insert(table)
				.values({
					_timetz: [todayInMilliseconds + elevenElevenElevenInMilliseconds, todayInMilliseconds + tenTenTenInMilliseconds],
					timetz: todayInMilliseconds + elevenElevenElevenInMilliseconds,
				})
				.returning();

		expect(result1[0].timetz).toBe(elevenElevenElevenInMilliseconds);
		expect(result1[0]._timetz.length).toBe(2);
		expect(result1[0]._timetz[0]).toBe(elevenElevenElevenInMilliseconds);
		expect(result1[0]._timetz[1]).toBe(tenTenTenInMilliseconds);

		const result2 = await database.select().from(table).execute();

		expect(result2[0].timetz).toBe(elevenElevenElevenInMilliseconds);
		expect(result2[0]._timetz.length).toBe(2);
		expect(result2[0]._timetz[0]).toBe(elevenElevenElevenInMilliseconds);
		expect(result2[0]._timetz[1]).toBe(tenTenTenInMilliseconds);

		const result3 = await database.select().from(table).where(eq(table.timetz, elevenElevenElevenInMilliseconds)).execute();

		expect(result3[0].timetz).toBe(elevenElevenElevenInMilliseconds);
		expect(result3[0]._timetz.length).toBe(2);
		expect(result3[0]._timetz[0]).toBe(elevenElevenElevenInMilliseconds);
		expect(result3[0]._timetz[1]).toBe(tenTenTenInMilliseconds);

		const result4 = await database.select().from(table).where(eq(table.timetz, todayInMilliseconds)).execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.timetz, Symbol() as any))
				.execute()
		).toThrowError("Expected 'number' | 'string' | 'object' | 'globalThis.Date' | 'luxon.DateTime', received 'symbol'");

		await database.execute(sql`
			drop table timetzunix;
		`);

		expect(table.timetz.getSQLType()).toBe("timetz");
	});

	test('defineTimeTZ({ mode: "luxon" })', async () => {
		const postgres = new Client({
				application_name: "timetzluxon.test.ts",
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			database = pgt(postgres),
			table = pgTable("timetzluxon", {
				_timetz: defineTimeTZ("_timetz", { mode: "luxon.DateTime" }).array().notNull(),
				timetz: defineTimeTZ("timetz", { mode: "luxon.DateTime" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists timetzluxon (
				timetz timetz not null,
				_timetz _timetz not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				_timetz: [
					DateTime.fromISO("2023-01-01T11:11:11.000Z", {
						setZone: true,
					}),
					DateTime.fromISO("2023-01-01T10:10:10.000Z", {
						setZone: true,
					}),
				],
				timetz: DateTime.fromISO("2023-01-01T11:11:11.000Z", {
					setZone: true,
				}),
			})
			.returning();

		expect(result1[0].timetz.toString()).includes("11:11:11");
		expect(result1[0]._timetz.length).toBe(2);
		expect(result1[0]._timetz[0].toString()).includes("11:11:11");
		expect(result1[0]._timetz[1].toString()).includes("10:10:10");

		const result2 = await database.select().from(table).execute();

		expect(result2[0].timetz.toString()).includes("11:11:11");
		expect(result2[0]._timetz.length).toBe(2);
		expect(result2[0]._timetz[0].toString()).includes("11:11:11");
		expect(result2[0]._timetz[1].toString()).includes("10:10:10");

		const result3 = await database
			.select()
			.from(table)
			.where(
				eq(
					table.timetz,
					DateTime.fromISO("2023-01-01T11:11:11.000Z", {
						setZone: true,
					})
				)
			)
			.execute();

		expect(result3[0].timetz.toString()).includes("11:11:11");
		expect(result3[0]._timetz.length).toBe(2);
		expect(result3[0]._timetz[0].toString()).includes("11:11:11");
		expect(result3[0]._timetz[1].toString()).includes("10:10:10");

		const result4 = await database
			.select()
			.from(table)
			.where(
				eq(
					table.timetz,
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
				.where(eq(table.timetz, Symbol() as any))
				.execute()
		).toThrowError("Expected 'number' | 'string' | 'object' | 'globalThis.Date' | 'luxon.DateTime', received 'symbol'");

		await database.execute(sql`
			drop table timetzluxon;
		`);

		expect(table.timetz.getSQLType()).toBe("timetz");
	});

	test('defineTimeTZ({ mode: "js" })', async () => {
		const postgres = new Client({
				application_name: "timetzjs.test.ts",
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			database = pgt(postgres),
			table = pgTable("timetzjs", {
				_timetz: defineTimeTZ("_timetz", { mode: "globalThis.Date" }).array().notNull(),
				timetz: defineTimeTZ("timetz", { mode: "globalThis.Date" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists timetzjs (
				timetz timetz not null,
				_timetz _timetz not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				_timetz: [
					DateTime.fromISO("2023-01-01T11:11:11.000Z", {
						setZone: true,
					}).toJSDate(),
					DateTime.fromISO("2023-01-01T10:10:10.000Z", {
						setZone: true,
					}).toJSDate(),
				],
				timetz: DateTime.fromISO("2023-01-01T11:11:11.000Z", {
					setZone: true,
				}).toJSDate(),
			})
			.returning();

		expect(result1[0].timetz.toLocaleTimeString()).includes("11:11:11");
		expect(result1[0]._timetz.length).toBe(2);
		expect(result1[0]._timetz[0].toLocaleTimeString()).includes("11:11:11");
		expect(result1[0]._timetz[1].toLocaleTimeString()).includes("10:10:10");

		const result2 = await database.select().from(table).execute();

		expect(result2[0].timetz.toLocaleTimeString()).includes("11:11:11");
		expect(result2[0]._timetz.length).toBe(2);
		expect(result2[0]._timetz[0].toLocaleTimeString()).includes("11:11:11");
		expect(result2[0]._timetz[1].toLocaleTimeString()).includes("10:10:10");

		const result3 = await database
			.select()
			.from(table)
			.where(
				eq(
					table.timetz,
					DateTime.fromISO("2023-01-01T11:11:11.000Z", {
						setZone: true,
					}).toJSDate()
				)
			)
			.execute();

		expect(result3[0].timetz.toLocaleTimeString()).includes("11:11:11");
		expect(result3[0]._timetz.length).toBe(2);
		expect(result3[0]._timetz[0].toLocaleTimeString()).includes("11:11:11");
		expect(result3[0]._timetz[1].toLocaleTimeString()).includes("10:10:10");

		const result4 = await database
			.select()
			.from(table)
			.where(
				eq(
					table.timetz,
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
				.where(eq(table.timetz, Symbol() as any))
				.execute()
		).toThrowError("Expected 'number' | 'string' | 'object' | 'globalThis.Date' | 'luxon.DateTime', received 'symbol'");

		await database.execute(sql`
			drop table timetzjs;
		`);

		expect(table.timetz.getSQLType()).toBe("timetz");
	});
});
