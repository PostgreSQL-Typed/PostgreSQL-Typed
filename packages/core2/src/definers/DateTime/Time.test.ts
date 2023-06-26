import { DateTime, Time } from "@postgresql-typed/parsers";
import { Client } from "pg";
import { describe, expect, test } from "vitest";

import { pgt, pgTable, sql } from "../../index.js";
import { eq } from "../../operators.js";
import { defineTime } from "./Time";

describe("defineTime", async () => {
	test('defineTime({ mode: "Time" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "time.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("time", {
				time: defineTime("time", { mode: "Time" }).notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists time (
				time time not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				time: Time.from("11:11:11"),
			})
			.returning();

		expect(Time.isTime(result1[0].time)).toBe(true);

		const result2 = await database.select().from(table).execute();

		expect(Time.isTime(result2[0].time)).toBe(true);

		const result3 = await database
			.select()
			.from(table)
			.where(eq(table.time, Time.from("11:11:11")))
			.execute();

		expect(Time.isTime(result3[0].time)).toBe(true);

		const result4 = await database
			.select()
			.from(table)
			.where(eq(table.time, Time.from("10:10:10")))
			.execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table time;
		`);

		expect(table.time.getSQLType()).toBe("time");
	});

	test('defineTime({ mode: "string" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "timestring.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("timestring", {
				time: defineTime("time", { mode: "string" }).notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists timestring (
				time time not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				time: "11:11:11",
			})
			.returning();

		expect(result1[0].time).toBe("11:11:11");

		const result2 = await database.select().from(table).execute();

		expect(result2[0].time).toBe("11:11:11");

		const result3 = await database.select().from(table).where(eq(table.time, "11:11:11")).execute();

		expect(result3[0].time).toBe("11:11:11");

		const result4 = await database.select().from(table).where(eq(table.time, "10:10:10")).execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table timestring;
		`);

		expect(table.time.getSQLType()).toBe("time");
	});

	test('defineTime({ mode: "unix" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "timeunix.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("timeunix", {
				time: defineTime("time", { mode: "unix" }).notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists timeunix (
				time time not null
			);
		`);

		const todayInMilliseconds = DateTime.now()
				.set({
					hour: 0,
					minute: 0,
					second: 0,
					millisecond: 0,
				})
				.toMillis(),
			elevenElevenElevenInMilliseconds = 39_600_000 + 666_000 + 11_000,
			result1 = await database
				.insert(table)
				.values({
					time: todayInMilliseconds + elevenElevenElevenInMilliseconds,
				})
				.returning();

		expect(result1[0].time).toBe(elevenElevenElevenInMilliseconds);

		const result2 = await database.select().from(table).execute();

		expect(result2[0].time).toBe(elevenElevenElevenInMilliseconds);

		const result3 = await database.select().from(table).where(eq(table.time, elevenElevenElevenInMilliseconds)).execute();

		expect(result3[0].time).toBe(elevenElevenElevenInMilliseconds);

		const result4 = await database.select().from(table).where(eq(table.time, todayInMilliseconds)).execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table timeunix;
		`);

		expect(table.time.getSQLType()).toBe("time");
	});

	test('defineTime({ mode: "luxon" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "timeluxon.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("timeluxon", {
				time: defineTime("time", { mode: "luxon.DateTime" }).notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists timeluxon (
				time time not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				time: DateTime.fromISO("2023-01-01T11:11:11.000Z", {
					setZone: true,
				}),
			})
			.returning();

		expect(result1[0].time.toString()).includes("11:11:11");

		const result2 = await database.select().from(table).execute();

		expect(result2[0].time.toString()).includes("11:11:11");

		const result3 = await database
			.select()
			.from(table)
			.where(
				eq(
					table.time,
					DateTime.fromISO("2023-01-01T11:11:11.000Z", {
						setZone: true,
					})
				)
			)
			.execute();

		expect(result3[0].time.toString()).includes("11:11:11");

		const result4 = await database
			.select()
			.from(table)
			.where(
				eq(
					table.time,
					DateTime.fromISO("2023-01-01T10:10:10.000Z", {
						setZone: true,
					})
				)
			)
			.execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table timeluxon;
		`);

		expect(table.time.getSQLType()).toBe("time");
	});

	test('defineTime({ mode: "js" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "timejs.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("timejs", {
				time: defineTime("time", { mode: "globalThis.Date" }).notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists timejs (
				time time not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				time: DateTime.fromISO("2023-01-01T11:11:11.000Z", {
					setZone: true,
				}).toJSDate(),
			})
			.returning();

		expect(result1[0].time.toLocaleTimeString()).includes("11:11:11");

		const result2 = await database.select().from(table).execute();

		expect(result2[0].time.toLocaleTimeString()).includes("11:11:11");

		const result3 = await database
			.select()
			.from(table)
			.where(
				eq(
					table.time,
					DateTime.fromISO("2023-01-01T11:11:11.000Z", {
						setZone: true,
					}).toJSDate()
				)
			)
			.execute();

		expect(result3[0].time.toLocaleTimeString()).includes("11:11:11");

		const result4 = await database
			.select()
			.from(table)
			.where(
				eq(
					table.time,
					DateTime.fromISO("2023-01-01T10:10:10.000Z", {
						setZone: true,
					}).toJSDate()
				)
			)
			.execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table timejs;
		`);

		expect(table.time.getSQLType()).toBe("time");
	});
});
