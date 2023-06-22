import { Int8 } from "@postgresql-typed/parsers";
import { eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { pgTable } from "drizzle-orm/pg-core";
import { Client } from "pg";
import { describe, expect, test } from "vitest";

import { defineInt8 } from "./Int8";

describe("defineInt8", async () => {
	test('defineInt8({ mode: "Int8" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "int8.test.ts",
			}),
			database = drizzle(postgres),
			table = pgTable("int8", {
				int8: defineInt8("int8", { mode: "Int8" }).notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists int8 (
				int8 int8 not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				int8: Int8.from("1"),
			})
			.returning();

		expect(Int8.isInt8(result1[0].int8)).toBe(true);

		const result2 = await database.select().from(table).execute();

		expect(Int8.isInt8(result2[0].int8)).toBe(true);

		const result3 = await database
			.select()
			.from(table)
			.where(eq(table.int8, Int8.from("1")))
			.execute();

		expect(Int8.isInt8(result3[0].int8)).toBe(true);

		const result4 = await database
			.select()
			.from(table)
			.where(eq(table.int8, Int8.from("2")))
			.execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table int8;
		`);

		expect(table.int8.getSQLType()).toBe("int8");
	});

	test('defineInt8({ mode: "string" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "int8string.test.ts",
			}),
			database = drizzle(postgres),
			table = pgTable("int8string", {
				int8: defineInt8("int8", { mode: "string" }).notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists int8string (
				int8 int8 not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				int8: "1",
			})
			.returning();

		expect(result1[0].int8).toBe("1");

		const result2 = await database.select().from(table).execute();

		expect(result2[0].int8).toBe("1");

		const result3 = await database.select().from(table).where(eq(table.int8, "1")).execute();

		expect(result3[0].int8).toBe("1");

		const result4 = await database.select().from(table).where(eq(table.int8, "2")).execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table int8string;
		`);

		expect(table.int8.getSQLType()).toBe("int8");
	});

	test('defineInt8({ mode: "BigInt" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "int8bignumber.test.ts",
			}),
			database = drizzle(postgres),
			table = pgTable("int8bignumber", {
				int8: defineInt8("int8", { mode: "BigInt" }).notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists int8bignumber (
				int8 int8 not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				int8: BigInt(1),
			})
			.returning();

		expect(result1[0].int8).toBe(BigInt(1));

		const result2 = await database.select().from(table).execute();

		expect(result2[0].int8).toBe(BigInt(1));

		const result3 = await database
			.select()
			.from(table)
			.where(eq(table.int8, BigInt(1)))
			.execute();

		expect(result3[0].int8).toBe(BigInt(1));

		const result4 = await database
			.select()
			.from(table)
			.where(eq(table.int8, BigInt(2)))
			.execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table int8bignumber;
		`);

		expect(table.int8.getSQLType()).toBe("int8");
	});

	test('defineInt8({ mode: "number" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "int8number.test.ts",
			}),
			database = drizzle(postgres),
			table = pgTable("int8number", {
				int8: defineInt8("int8", { mode: "number" }).notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists int8number (
				int8 int8 not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				int8: 1,
			})
			.returning();

		expect(result1[0].int8).toBe(1);

		const result2 = await database.select().from(table).execute();

		expect(result2[0].int8).toBe(1);

		const result3 = await database.select().from(table).where(eq(table.int8, 1)).execute();

		expect(result3[0].int8).toBe(1);

		const result4 = await database.select().from(table).where(eq(table.int8, 2)).execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table int8number;
		`);

		expect(table.int8.getSQLType()).toBe("int8");
	});
});
