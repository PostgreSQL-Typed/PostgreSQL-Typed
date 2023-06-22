import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { pgTable } from "drizzle-orm/pg-core";
import { Client } from "pg";
import { describe, expect, test } from "vitest";

import { defineInt2 } from "./definers/index.js";
import { avg, count, divide, max, min, minus, neq, plus, sum, times } from "./operators.js";

describe("Operators", async () => {
	test("plus", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "plus.test.ts",
			}),
			database = drizzle(postgres),
			table = pgTable("plus", {
				int2: defineInt2("int2").notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists plus (
				int2 int2 not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				int2: 1,
			})
			.returning();

		expect(result1[0].int2).toBe(1);

		const result2 = await database
			.select()
			.from(table)
			.where(neq(table.int2, plus(table.int2, 2)))
			.execute();

		expect(result2[0].int2).toBe(1);

		await database.execute(sql`
			drop table plus;
		`);
	});

	test("minus", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "minus.test.ts",
			}),
			database = drizzle(postgres),
			table = pgTable("minus", {
				int2: defineInt2("int2").notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists minus (
				int2 int2 not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				int2: 1,
			})
			.returning();

		expect(result1[0].int2).toBe(1);

		const result2 = await database
			.select()
			.from(table)
			.where(neq(table.int2, minus(table.int2, 2)))
			.execute();

		expect(result2[0].int2).toBe(1);

		await database.execute(sql`
			drop table minus;
		`);
	});

	test("times", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "times.test.ts",
			}),
			database = drizzle(postgres),
			table = pgTable("times", {
				int2: defineInt2("int2").notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists times (
				int2 int2 not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				int2: 1,
			})
			.returning();

		expect(result1[0].int2).toBe(1);

		const result2 = await database
			.select()
			.from(table)
			.where(neq(table.int2, times(table.int2, 2)))
			.execute();

		expect(result2[0].int2).toBe(1);

		await database.execute(sql`
			drop table times;
		`);
	});

	test("divide", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "divide.test.ts",
			}),
			database = drizzle(postgres),
			table = pgTable("divide", {
				int2: defineInt2("int2").notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists divide (
				int2 int2 not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				int2: 1,
			})
			.returning();

		expect(result1[0].int2).toBe(1);

		const result2 = await database
			.select()
			.from(table)
			.where(neq(table.int2, divide(table.int2, 2)))
			.execute();

		expect(result2[0].int2).toBe(1);

		await database.execute(sql`
			drop table divide;
		`);
	});

	test("count", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "count.test.ts",
			}),
			database = drizzle(postgres),
			table = pgTable("count", {
				int2: defineInt2("int2").notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists count (
				int2 int2 not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				int2: 1,
			})
			.returning();

		expect(result1[0].int2).toBe(1);

		const result2 = await database
			.select({
				count: count(table.int2),
			})
			.from(table);

		expect(result2[0].count).toBe(1);

		await database.execute(sql`
			drop table count;
		`);
	});

	test("sum", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "sum.test.ts",
			}),
			database = drizzle(postgres),
			table = pgTable("sum", {
				int2: defineInt2("int2").notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists sum (
				int2 int2 not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				int2: 1,
			})
			.returning();

		expect(result1[0].int2).toBe(1);

		const result2 = await database
			.select({
				sum: sum(table.int2),
			})
			.from(table);

		expect(result2[0].sum).toBe(1);

		await database.execute(sql`
			drop table sum;
		`);
	});

	test("avg", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "avg.test.ts",
			}),
			database = drizzle(postgres),
			table = pgTable("avg", {
				int2: defineInt2("int2").notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists avg (
				int2 int2 not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				int2: 1,
			})
			.returning();

		expect(result1[0].int2).toBe(1);

		const result2 = await database
			.select({
				avg: avg(table.int2),
			})
			.from(table);

		expect(result2[0].avg).toBe(1);

		await database.execute(sql`
			drop table avg;
		`);
	});

	test("min", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "min.test.ts",
			}),
			database = drizzle(postgres),
			table = pgTable("min", {
				int2: defineInt2("int2").notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists min (
				int2 int2 not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				int2: 1,
			})
			.returning();

		expect(result1[0].int2).toBe(1);

		const result2 = await database
			.select({
				min: min(table.int2),
			})
			.from(table);

		expect(result2[0].min).toBe(1);

		await database.execute(sql`
			drop table min;
		`);
	});

	test("max", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "max.test.ts",
			}),
			database = drizzle(postgres),
			table = pgTable("max", {
				int2: defineInt2("int2").notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists max (
				int2 int2 not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				int2: 1,
			})
			.returning();

		expect(result1[0].int2).toBe(1);

		const result2 = await database
			.select({
				max: max(table.int2),
			})
			.from(table);

		expect(result2[0].max).toBe(1);

		await database.execute(sql`
			drop table max;
		`);
	});
});
