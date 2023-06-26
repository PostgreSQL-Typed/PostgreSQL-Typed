import { Date, DateTime } from "@postgresql-typed/parsers";
import { Client } from "pg";
import { describe, expect, test } from "vitest";

import { pgt, pgTable, sql } from "../../index.js";
import { eq } from "../../operators.js";
import { defineDate } from "./Date";

describe("defineDate", async () => {
	test('defineDate({ mode: "Date" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "date.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("date", {
				date: defineDate("date", { mode: "Date" }).notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists date (
				date date not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				date: Date.from("2023-01-01"),
			})
			.returning();

		expect(Date.isDate(result1[0].date)).toBe(true);

		const result2 = await database.select().from(table).execute();

		expect(Date.isDate(result2[0].date)).toBe(true);

		const result3 = await database
			.select()
			.from(table)
			.where(eq(table.date, Date.from("2023-01-01")))
			.execute();

		expect(Date.isDate(result3[0].date)).toBe(true);

		const result4 = await database
			.select()
			.from(table)
			.where(eq(table.date, Date.from("2024-01-01")))
			.execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table date;
		`);

		expect(table.date.getSQLType()).toBe("date");
	});

	test('defineDate({ mode: "string" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "datestring.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("datestring", {
				date: defineDate("date", { mode: "string" }).notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists datestring (
				date date not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				date: "2023-01-01",
			})
			.returning();

		expect(result1[0].date).toBe("2023-01-01");

		const result2 = await database.select().from(table).execute();

		expect(result2[0].date).toBe("2023-01-01");

		const result3 = await database.select().from(table).where(eq(table.date, "2023-01-01")).execute();

		expect(result3[0].date).toBe("2023-01-01");

		const result4 = await database.select().from(table).where(eq(table.date, "2024-01-01")).execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table datestring;
		`);

		expect(table.date.getSQLType()).toBe("date");
	});

	test('defineDate({ mode: "unix" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "dateunix.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("dateunix", {
				date: defineDate("date", { mode: "unix" }).notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists dateunix (
				date date not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				date: 1_672_531_200_000,
			})
			.returning();

		expect(result1[0].date).toBe(1_672_531_200_000);

		const result2 = await database.select().from(table).execute();

		expect(result2[0].date).toBe(1_672_531_200_000);

		const result3 = await database.select().from(table).where(eq(table.date, 1_672_531_200_000)).execute();

		expect(result3[0].date).toBe(1_672_531_200_000);

		const result4 = await database.select().from(table).where(eq(table.date, 1_704_067_200_000)).execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table dateunix;
		`);

		expect(table.date.getSQLType()).toBe("date");
	});

	test('defineDate({ mode: "luxon" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "dateluxon.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("dateluxon", {
				date: defineDate("date", { mode: "luxon.DateTime" }).notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists dateluxon (
				date date not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				date: DateTime.fromISO("2023-01-01T00:00:00.000Z"),
			})
			.returning();

		expect(result1[0].date.setZone("utc").toMillis()).toBe(1_672_531_200_000);

		const result2 = await database.select().from(table).execute();

		expect(result2[0].date.setZone("utc").toMillis()).toBe(1_672_531_200_000);

		const result3 = await database
			.select()
			.from(table)
			.where(eq(table.date, DateTime.fromMillis(1_672_531_200_000)))
			.execute();

		expect(result3[0].date.setZone("utc").toMillis()).toBe(1_672_531_200_000);

		const result4 = await database
			.select()
			.from(table)
			.where(eq(table.date, DateTime.fromMillis(1_704_067_200_000)))
			.execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table dateluxon;
		`);

		expect(table.date.getSQLType()).toBe("date");
	});

	test('defineDate({ mode: "js" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "datejs.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("datejs", {
				date: defineDate("date", { mode: "globalThis.Date" }).notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists datejs (
				date date not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				date: DateTime.fromISO("2023-01-01T00:00:00.000Z").toJSDate(),
			})
			.returning();

		expect(+result1[0].date).toBe(1_672_531_200_000);

		const result2 = await database.select().from(table).execute();

		expect(+result2[0].date).toBe(1_672_531_200_000);

		const result3 = await database
			.select()
			.from(table)
			.where(eq(table.date, DateTime.fromMillis(1_672_531_200_000).toJSDate()))
			.execute();

		expect(+result3[0].date).toBe(1_672_531_200_000);

		const result4 = await database
			.select()
			.from(table)
			.where(eq(table.date, DateTime.fromMillis(1_704_067_200_000).toJSDate()))
			.execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table datejs;
		`);

		expect(table.date.getSQLType()).toBe("date");
	});
});
