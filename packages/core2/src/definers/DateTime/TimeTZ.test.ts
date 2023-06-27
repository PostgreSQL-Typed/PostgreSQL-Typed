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
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "timetz.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("timetz", {
				timetz: defineTimeTZ("timetz", { mode: "TimeTZ" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists timetz (
				timetz timetz not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				timetz: TimeTZ.from("11:11:11"),
			})
			.returning();

		expect(TimeTZ.isTimeTZ(result1[0].timetz)).toBe(true);

		const result2 = await database.select().from(table).execute();

		expect(TimeTZ.isTimeTZ(result2[0].timetz)).toBe(true);

		const result3 = await database
			.select()
			.from(table)
			.where(eq(table.timetz, TimeTZ.from("11:11:11")))
			.execute();

		expect(TimeTZ.isTimeTZ(result3[0].timetz)).toBe(true);

		const result4 = await database
			.select()
			.from(table)
			.where(eq(table.timetz, TimeTZ.from("10:10:10")))
			.execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table timetz;
		`);

		expect(table.timetz.getSQLType()).toBe("timetz");
	});

	test('defineTimeTZ({ mode: "string" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "timetzstring.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("timetzstring", {
				timetz: defineTimeTZ("timetz", { mode: "string" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists timetzstring (
				timetz timetz not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				timetz: "11:11:11",
			})
			.returning();

		expect(result1[0].timetz).toBe("11:11:11");

		const result2 = await database.select().from(table).execute();

		expect(result2[0].timetz).toBe("11:11:11");

		const result3 = await database.select().from(table).where(eq(table.timetz, "11:11:11")).execute();

		expect(result3[0].timetz).toBe("11:11:11");

		const result4 = await database.select().from(table).where(eq(table.timetz, "10:10:10")).execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table timetzstring;
		`);

		expect(table.timetz.getSQLType()).toBe("timetz");
	});

	test('defineTimeTZ({ mode: "unix" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "timetzunix.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("timetzunix", {
				timetz: defineTimeTZ("timetz", { mode: "unix" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists timetzunix (
				timetz timetz not null
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
					timetz: todayInMilliseconds + elevenElevenElevenInMilliseconds,
				})
				.returning();

		expect(result1[0].timetz).toBe(elevenElevenElevenInMilliseconds);

		const result2 = await database.select().from(table).execute();

		expect(result2[0].timetz).toBe(elevenElevenElevenInMilliseconds);

		const result3 = await database.select().from(table).where(eq(table.timetz, elevenElevenElevenInMilliseconds)).execute();

		expect(result3[0].timetz).toBe(elevenElevenElevenInMilliseconds);

		const result4 = await database.select().from(table).where(eq(table.timetz, todayInMilliseconds)).execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table timetzunix;
		`);

		expect(table.timetz.getSQLType()).toBe("timetz");
	});

	test('defineTimeTZ({ mode: "luxon" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "timetzluxon.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("timetzluxon", {
				timetz: defineTimeTZ("timetz", { mode: "luxon.DateTime" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists timetzluxon (
				timetz timetz not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				timetz: DateTime.fromISO("2023-01-01T11:11:11.000Z", {
					setZone: true,
				}),
			})
			.returning();

		expect(result1[0].timetz.toString()).includes("11:11:11");

		const result2 = await database.select().from(table).execute();

		expect(result2[0].timetz.toString()).includes("11:11:11");

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

		await database.execute(sql`
			drop table timetzluxon;
		`);

		expect(table.timetz.getSQLType()).toBe("timetz");
	});

	test('defineTimeTZ({ mode: "js" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "timetzjs.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("timetzjs", {
				timetz: defineTimeTZ("timetz", { mode: "globalThis.Date" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists timetzjs (
				timetz timetz not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				timetz: DateTime.fromISO("2023-01-01T11:11:11.000Z", {
					setZone: true,
				}).toJSDate(),
			})
			.returning();

		expect(result1[0].timetz.toLocaleTimeString()).includes("11:11:11");

		const result2 = await database.select().from(table).execute();

		expect(result2[0].timetz.toLocaleTimeString()).includes("11:11:11");

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

		await database.execute(sql`
			drop table timetzjs;
		`);

		expect(table.timetz.getSQLType()).toBe("timetz");
	});
});
