/* eslint-disable unicorn/filename-case */
import { DateTime, Timestamp } from "@postgresql-typed/parsers";
import { Client } from "pg";
import { describe, expect, test } from "vitest";

import { pgt, pgTable, sql } from "../../index.js";
import { eq } from "../../operators.js";
import { defineTimestamp } from "./Timestamp";

describe("defineTimestamp", async () => {
	test('defineTimestamp({ mode: "Timestamp" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "timestamp.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("timestamp", {
				timestamp: defineTimestamp("timestamp", { mode: "Timestamp" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists timestamp (
				timestamp timestamp not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				timestamp: Timestamp.from("2023-01-01T00:00:00Z"),
			})
			.returning();

		expect(Timestamp.isTimestamp(result1[0].timestamp)).toBe(true);

		const result2 = await database.select().from(table).execute();

		expect(Timestamp.isTimestamp(result2[0].timestamp)).toBe(true);

		const result3 = await database
			.select()
			.from(table)
			.where(eq(table.timestamp, Timestamp.from("2023-01-01T00:00:00Z")))
			.execute();

		expect(Timestamp.isTimestamp(result3[0].timestamp)).toBe(true);

		const result4 = await database
			.select()
			.from(table)
			.where(eq(table.timestamp, Timestamp.from("2023-01-01T11:11:11Z")))
			.execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table timestamp;
		`);

		expect(table.timestamp.getSQLType()).toBe("timestamp");
	});

	test('defineTimestamp({ mode: "string" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "timestampstring.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("timestampstring", {
				timestamp: defineTimestamp("timestamp", { mode: "string" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists timestampstring (
				timestamp timestamp not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				timestamp: "2023-01-01T00:00:00Z",
			})
			.returning();

		expect(result1[0].timestamp).toBe("2023-01-01T00:00:00Z");

		const result2 = await database.select().from(table).execute();

		expect(result2[0].timestamp).toBe("2023-01-01T00:00:00Z");

		const result3 = await database.select().from(table).where(eq(table.timestamp, "2023-01-01T00:00:00Z")).execute();

		expect(result3[0].timestamp).toBe("2023-01-01T00:00:00Z");

		const result4 = await database.select().from(table).where(eq(table.timestamp, "2023-01-01T11:11:11Z")).execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table timestampstring;
		`);

		expect(table.timestamp.getSQLType()).toBe("timestamp");
	});

	test('defineTimestamp({ mode: "unix" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "timestampunix.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("timestampunix", {
				timestamp: defineTimestamp("timestamp", { mode: "unix" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists timestampunix (
				timestamp timestamp not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				timestamp: Timestamp.from("2023-01-01T00:00:00Z").value,
			})
			.returning();

		expect(result1[0].timestamp).toBe(1_672_531_200_000);

		const result2 = await database.select().from(table).execute();

		expect(result2[0].timestamp).toBe(1_672_531_200_000);

		const result3 = await database.select().from(table).where(eq(table.timestamp, 1_672_531_200_000)).execute();

		expect(result3[0].timestamp).toBe(1_672_531_200_000);

		const result4 = await database.select().from(table).where(eq(table.timestamp, 1_672_531_300_000)).execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table timestampunix;
		`);

		expect(table.timestamp.getSQLType()).toBe("timestamp");
	});

	test('defineTimestamp({ mode: "luxon" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "timestampluxon.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("timestampluxon", {
				timestamp: defineTimestamp("timestamp", { mode: "luxon.DateTime" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists timestampluxon (
				timestamp timestamp not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				timestamp: DateTime.fromISO("2023-01-01T11:11:11.000Z", {
					setZone: true,
				}),
			})
			.returning();

		expect(result1[0].timestamp.toString()).includes("2023-01-01T11:11:11");

		const result2 = await database.select().from(table).execute();

		expect(result2[0].timestamp.toString()).includes("2023-01-01T11:11:11");

		const result3 = await database
			.select()
			.from(table)
			.where(
				eq(
					table.timestamp,
					DateTime.fromISO("2023-01-01T11:11:11.000Z", {
						setZone: true,
					})
				)
			)
			.execute();

		expect(result3[0].timestamp.toString()).includes("2023-01-01T11:11:11");

		const result4 = await database
			.select()
			.from(table)
			.where(
				eq(
					table.timestamp,
					DateTime.fromISO("2023-01-01T10:10:10.000Z", {
						setZone: true,
					})
				)
			)
			.execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table timestampluxon;
		`);

		expect(table.timestamp.getSQLType()).toBe("timestamp");
	});

	test('defineTimestamp({ mode: "js" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "timestampjs.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("timestampjs", {
				timestamp: defineTimestamp("timestamp", { mode: "globalThis.Date" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists timestampjs (
				timestamp timestamp not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				timestamp: DateTime.fromISO("2023-01-01T11:11:11.000Z", {
					setZone: true,
				}).toJSDate(),
			})
			.returning();

		expect(result1[0].timestamp.toISOString()).toBe("2023-01-01T11:11:11.000Z");

		const result2 = await database.select().from(table).execute();

		expect(result2[0].timestamp.toISOString()).toBe("2023-01-01T11:11:11.000Z");

		const result3 = await database
			.select()
			.from(table)
			.where(
				eq(
					table.timestamp,
					DateTime.fromISO("2023-01-01T11:11:11.000Z", {
						setZone: true,
					}).toJSDate()
				)
			)
			.execute();

		expect(result3[0].timestamp.toISOString()).toBe("2023-01-01T11:11:11.000Z");

		const result4 = await database
			.select()
			.from(table)
			.where(
				eq(
					table.timestamp,
					DateTime.fromISO("2023-01-01T10:10:10.000Z", {
						setZone: true,
					}).toJSDate()
				)
			)
			.execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table timestampjs;
		`);

		expect(table.timestamp.getSQLType()).toBe("timestamp");
	});
});