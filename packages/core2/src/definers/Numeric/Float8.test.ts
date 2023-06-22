import { BigNumber, Float8 } from "@postgresql-typed/parsers";
import { eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { pgTable } from "drizzle-orm/pg-core";
import { Client } from "pg";
import { describe, expect, test } from "vitest";

import { defineFloat8 } from "./Float8";

describe("defineFloat8", async () => {
	test('defineFloat8({ mode: "Float8" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "float8.test.ts",
			}),
			database = drizzle(postgres),
			table = pgTable("float8", {
				float8: defineFloat8("float8", { mode: "Float8" }).notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists float8 (
				float8 float8 not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				float8: Float8.from("1"),
			})
			.returning();

		expect(Float8.isFloat8(result1[0].float8)).toBe(true);

		const result2 = await database.select().from(table).execute();

		expect(Float8.isFloat8(result2[0].float8)).toBe(true);

		const result3 = await database
			.select()
			.from(table)
			.where(eq(table.float8, Float8.from("1")))
			.execute();

		expect(Float8.isFloat8(result3[0].float8)).toBe(true);

		const result4 = await database
			.select()
			.from(table)
			.where(eq(table.float8, Float8.from("2")))
			.execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table float8;
		`);

		expect(table.float8.getSQLType()).toBe("float8");
	});

	test('defineFloat8({ mode: "string" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "float8string.test.ts",
			}),
			database = drizzle(postgres),
			table = pgTable("float8string", {
				float8: defineFloat8("float8", { mode: "string" }).notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists float8string (
				float8 float8 not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				float8: "1",
			})
			.returning();

		expect(result1[0].float8).toBe("1");

		const result2 = await database.select().from(table).execute();

		expect(result2[0].float8).toBe("1");

		const result3 = await database.select().from(table).where(eq(table.float8, "1")).execute();

		expect(result3[0].float8).toBe("1");

		const result4 = await database.select().from(table).where(eq(table.float8, "2")).execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table float8string;
		`);

		expect(table.float8.getSQLType()).toBe("float8");
	});

	test('defineFloat8({ mode: "BigNumber" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "float8bignumber.test.ts",
			}),
			database = drizzle(postgres),
			table = pgTable("float8bignumber", {
				float8: defineFloat8("float8", { mode: "BigNumber" }).notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists float8bignumber (
				float8 float8 not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				float8: BigNumber(1),
			})
			.returning();

		expect(result1[0].float8.toNumber()).toBe(1);

		const result2 = await database.select().from(table).execute();

		expect(result2[0].float8.toNumber()).toBe(1);

		const result3 = await database
			.select()
			.from(table)
			.where(eq(table.float8, BigNumber(1)))
			.execute();

		expect(result3[0].float8.toNumber()).toBe(1);

		const result4 = await database
			.select()
			.from(table)
			.where(eq(table.float8, BigNumber(2)))
			.execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table float8bignumber;
		`);

		expect(table.float8.getSQLType()).toBe("float8");
	});

	test('defineFloat8({ mode: "number" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "float8number.test.ts",
			}),
			database = drizzle(postgres),
			table = pgTable("float8number", {
				float8: defineFloat8("float8", { mode: "number" }).notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists float8number (
				float8 float8 not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				float8: 1,
			})
			.returning();

		expect(result1[0].float8).toBe(1);

		const result2 = await database.select().from(table).execute();

		expect(result2[0].float8).toBe(1);

		const result3 = await database.select().from(table).where(eq(table.float8, 1)).execute();

		expect(result3[0].float8).toBe(1);

		const result4 = await database.select().from(table).where(eq(table.float8, 2)).execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table float8number;
		`);

		expect(table.float8.getSQLType()).toBe("float8");
	});
});
