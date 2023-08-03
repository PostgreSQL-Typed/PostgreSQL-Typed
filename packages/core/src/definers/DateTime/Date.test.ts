import { Date, DateTime } from "@postgresql-typed/parsers";
import { Client } from "pg";
import { describe, expect, test } from "vitest";

import { pgt, pgTable, sql } from "../../index.js";
import { eq } from "../../operators.js";
import { defineDate } from "./Date";

describe("defineDate", async () => {
	test('defineDate({ mode: "Date" })', async () => {
		const postgres = new Client({
				application_name: "date.test.ts",
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			database = pgt(postgres),
			table = pgTable("date", {
				_date: defineDate("_date", { mode: "Date" }).array().notNull(),
				date: defineDate("date", { mode: "Date" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists date (
				date date not null,
				_date _date not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				_date: [Date.from("2023-01-01"), Date.from("2023-01-02")],
				date: Date.from("2023-01-01"),
			})
			.returning();

		expect(Date.isDate(result1[0].date)).toBe(true);
		expect(result1[0]._date.length).toBe(2);
		expect(Date.isDate(result1[0]._date[0])).toBe(true);
		expect(Date.isDate(result1[0]._date[1])).toBe(true);

		const result2 = await database.select().from(table).execute();

		expect(Date.isDate(result2[0].date)).toBe(true);
		expect(result2[0]._date.length).toBe(2);
		expect(Date.isDate(result2[0]._date[0])).toBe(true);
		expect(Date.isDate(result2[0]._date[1])).toBe(true);

		const result3 = await database
			.select()
			.from(table)
			.where(eq(table.date, Date.from("2023-01-01")))
			.execute();

		expect(Date.isDate(result3[0].date)).toBe(true);
		expect(result3[0]._date.length).toBe(2);
		expect(Date.isDate(result3[0]._date[0])).toBe(true);
		expect(Date.isDate(result3[0]._date[1])).toBe(true);

		const result4 = await database
			.select()
			.from(table)
			.where(eq(table.date, Date.from("2024-01-01")))
			.execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.date, Symbol() as any))
				.execute()
		).toThrowError("Expected 'number' | 'string' | 'object' | 'globalThis.Date' | 'luxon.DateTime', received 'symbol'");

		await database.execute(sql`
			drop table date;
		`);

		expect(table.date.getSQLType()).toBe("date");
	});

	test('defineDate({ mode: "string" })', async () => {
		const postgres = new Client({
				application_name: "datestring.test.ts",
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			database = pgt(postgres),
			table = pgTable("datestring", {
				_date: defineDate("_date", { mode: "string" }).array().notNull(),
				date: defineDate("date", { mode: "string" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists datestring (
				date date not null,
				_date _date not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				_date: ["2023-01-01", "2023-01-02"],
				date: "2023-01-01",
			})
			.returning();

		expect(result1[0].date).toBe("2023-01-01");
		expect(result1[0]._date.length).toBe(2);
		expect(result1[0]._date[0]).toBe("2023-01-01");
		expect(result1[0]._date[1]).toBe("2023-01-02");

		const result2 = await database.select().from(table).execute();

		expect(result2[0].date).toBe("2023-01-01");
		expect(result2[0]._date.length).toBe(2);
		expect(result2[0]._date[0]).toBe("2023-01-01");
		expect(result2[0]._date[1]).toBe("2023-01-02");

		const result3 = await database.select().from(table).where(eq(table.date, "2023-01-01")).execute();

		expect(result3[0].date).toBe("2023-01-01");
		expect(result3[0]._date.length).toBe(2);
		expect(result3[0]._date[0]).toBe("2023-01-01");
		expect(result3[0]._date[1]).toBe("2023-01-02");

		const result4 = await database.select().from(table).where(eq(table.date, "2024-01-01")).execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.date, Symbol() as any))
				.execute()
		).toThrowError("Expected 'number' | 'string' | 'object' | 'globalThis.Date' | 'luxon.DateTime', received 'symbol'");

		await database.execute(sql`
			drop table datestring;
		`);

		expect(table.date.getSQLType()).toBe("date");
	});

	test('defineDate({ mode: "unix" })', async () => {
		const postgres = new Client({
				application_name: "dateunix.test.ts",
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			database = pgt(postgres),
			table = pgTable("dateunix", {
				_date: defineDate("_date", { mode: "unix" }).array().notNull(),
				date: defineDate("date", { mode: "unix" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists dateunix (
				date date not null,
				_date _date not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				_date: [1_672_531_200_000, 1_672_617_600_000],
				date: 1_672_531_200_000,
			})
			.returning();

		expect(result1[0].date).toBe(1_672_531_200_000);
		expect(result1[0]._date.length).toBe(2);
		expect(result1[0]._date[0]).toBe(1_672_531_200_000);
		expect(result1[0]._date[1]).toBe(1_672_617_600_000);

		const result2 = await database.select().from(table).execute();

		expect(result2[0].date).toBe(1_672_531_200_000);
		expect(result2[0]._date.length).toBe(2);
		expect(result2[0]._date[0]).toBe(1_672_531_200_000);
		expect(result2[0]._date[1]).toBe(1_672_617_600_000);

		const result3 = await database.select().from(table).where(eq(table.date, 1_672_531_200_000)).execute();

		expect(result3[0].date).toBe(1_672_531_200_000);
		expect(result3[0]._date.length).toBe(2);
		expect(result3[0]._date[0]).toBe(1_672_531_200_000);
		expect(result3[0]._date[1]).toBe(1_672_617_600_000);

		const result4 = await database.select().from(table).where(eq(table.date, 1_704_067_200_000)).execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.date, Symbol() as any))
				.execute()
		).toThrowError("Expected 'number' | 'string' | 'object' | 'globalThis.Date' | 'luxon.DateTime', received 'symbol'");

		await database.execute(sql`
			drop table dateunix;
		`);

		expect(table.date.getSQLType()).toBe("date");
	});

	test('defineDate({ mode: "luxon" })', async () => {
		const postgres = new Client({
				application_name: "dateluxon.test.ts",
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			database = pgt(postgres),
			table = pgTable("dateluxon", {
				_date: defineDate("_date", { mode: "luxon.DateTime" }).array().notNull(),
				date: defineDate("date", { mode: "luxon.DateTime" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists dateluxon (
				date date not null,
				_date _date not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				_date: [DateTime.fromISO("2023-01-01T00:00:00.000Z"), DateTime.fromISO("2023-01-02T00:00:00.000Z")],
				date: DateTime.fromISO("2023-01-01T00:00:00.000Z"),
			})
			.returning();

		expect(result1[0].date.setZone("utc").toMillis()).toBe(1_672_531_200_000);
		expect(result1[0]._date.length).toBe(2);
		expect(result1[0]._date[0].setZone("utc").toMillis()).toBe(1_672_531_200_000);
		expect(result1[0]._date[1].setZone("utc").toMillis()).toBe(1_672_617_600_000);

		const result2 = await database.select().from(table).execute();

		expect(result2[0].date.setZone("utc").toMillis()).toBe(1_672_531_200_000);
		expect(result2[0]._date.length).toBe(2);
		expect(result2[0]._date[0].setZone("utc").toMillis()).toBe(1_672_531_200_000);
		expect(result2[0]._date[1].setZone("utc").toMillis()).toBe(1_672_617_600_000);

		const result3 = await database
			.select()
			.from(table)
			.where(eq(table.date, DateTime.fromMillis(1_672_531_200_000)))
			.execute();

		expect(result3[0].date.setZone("utc").toMillis()).toBe(1_672_531_200_000);
		expect(result3[0]._date.length).toBe(2);
		expect(result3[0]._date[0].setZone("utc").toMillis()).toBe(1_672_531_200_000);
		expect(result3[0]._date[1].setZone("utc").toMillis()).toBe(1_672_617_600_000);

		const result4 = await database
			.select()
			.from(table)
			.where(eq(table.date, DateTime.fromMillis(1_704_067_200_000)))
			.execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.date, Symbol() as any))
				.execute()
		).toThrowError("Expected 'number' | 'string' | 'object' | 'globalThis.Date' | 'luxon.DateTime', received 'symbol'");

		await database.execute(sql`
			drop table dateluxon;
		`);

		expect(table.date.getSQLType()).toBe("date");
	});

	test('defineDate({ mode: "js" })', async () => {
		const postgres = new Client({
				application_name: "datejs.test.ts",
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			database = pgt(postgres),
			table = pgTable("datejs", {
				_date: defineDate("_date", { mode: "globalThis.Date" }).array().notNull(),
				date: defineDate("date", { mode: "globalThis.Date" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists datejs (
				date date not null,
				_date _date not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				_date: [DateTime.fromISO("2023-01-01T00:00:00.000Z").toJSDate(), DateTime.fromISO("2023-01-02T00:00:00.000Z").toJSDate()],
				date: DateTime.fromISO("2023-01-01T00:00:00.000Z").toJSDate(),
			})
			.returning();

		expect(+result1[0].date).toBe(1_672_531_200_000);
		expect(result1[0]._date.length).toBe(2);
		expect(+result1[0]._date[0]).toBe(1_672_531_200_000);
		expect(+result1[0]._date[1]).toBe(1_672_617_600_000);

		const result2 = await database.select().from(table).execute();

		expect(+result2[0].date).toBe(1_672_531_200_000);
		expect(result2[0]._date.length).toBe(2);
		expect(+result2[0]._date[0]).toBe(1_672_531_200_000);
		expect(+result2[0]._date[1]).toBe(1_672_617_600_000);

		const result3 = await database
			.select()
			.from(table)
			.where(eq(table.date, DateTime.fromMillis(1_672_531_200_000).toJSDate()))
			.execute();

		expect(+result3[0].date).toBe(1_672_531_200_000);
		expect(result3[0]._date.length).toBe(2);
		expect(+result3[0]._date[0]).toBe(1_672_531_200_000);
		expect(+result3[0]._date[1]).toBe(1_672_617_600_000);

		const result4 = await database
			.select()
			.from(table)
			.where(eq(table.date, DateTime.fromMillis(1_704_067_200_000).toJSDate()))
			.execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.date, Symbol() as any))
				.execute()
		).toThrowError("Expected 'number' | 'string' | 'object' | 'globalThis.Date' | 'luxon.DateTime', received 'symbol'");

		await database.execute(sql`
			drop table datejs;
		`);

		expect(table.date.getSQLType()).toBe("date");
	});
});
