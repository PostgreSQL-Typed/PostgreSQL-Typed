import { BigNumber, Float4 } from "@postgresql-typed/parsers";
import { Client } from "pg";
import { describe, expect, test } from "vitest";

import { pgt, pgTable, sql } from "../../index.js";
import { eq } from "../../operators.js";
import { defineFloat4 } from "./Float4";

describe("defineFloat4", async () => {
	test('defineFloat4({ mode: "Float4" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "float4.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("float4", {
				float4: defineFloat4("float4", { mode: "Float4" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists float4 (
				float4 float4 not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				float4: Float4.from("1"),
			})
			.returning();

		expect(Float4.isFloat4(result1[0].float4)).toBe(true);

		const result2 = await database.select().from(table).execute();

		expect(Float4.isFloat4(result2[0].float4)).toBe(true);

		const result3 = await database
			.select()
			.from(table)
			.where(eq(table.float4, Float4.from("1")))
			.execute();

		expect(Float4.isFloat4(result3[0].float4)).toBe(true);

		const result4 = await database
			.select()
			.from(table)
			.where(eq(table.float4, Float4.from("2")))
			.execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table float4;
		`);

		expect(table.float4.getSQLType()).toBe("float4");
	});

	test('defineFloat4({ mode: "string" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "float4string.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("float4string", {
				float4: defineFloat4("float4", { mode: "string" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists float4string (
				float4 float4 not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				float4: "1",
			})
			.returning();

		expect(result1[0].float4).toBe("1");

		const result2 = await database.select().from(table).execute();

		expect(result2[0].float4).toBe("1");

		const result3 = await database.select().from(table).where(eq(table.float4, "1")).execute();

		expect(result3[0].float4).toBe("1");

		const result4 = await database.select().from(table).where(eq(table.float4, "2")).execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table float4string;
		`);

		expect(table.float4.getSQLType()).toBe("float4");
	});

	test('defineFloat4({ mode: "BigNumber" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "float4bignumber.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("float4bignumber", {
				float4: defineFloat4("float4", { mode: "BigNumber" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists float4bignumber (
				float4 float4 not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				float4: BigNumber(1),
			})
			.returning();

		expect(result1[0].float4.toNumber()).toBe(1);

		const result2 = await database.select().from(table).execute();

		expect(result2[0].float4.toNumber()).toBe(1);

		const result3 = await database
			.select()
			.from(table)
			.where(eq(table.float4, BigNumber(1)))
			.execute();

		expect(result3[0].float4.toNumber()).toBe(1);

		const result4 = await database
			.select()
			.from(table)
			.where(eq(table.float4, BigNumber(2)))
			.execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table float4bignumber;
		`);

		expect(table.float4.getSQLType()).toBe("float4");
	});

	test('defineFloat4({ mode: "number" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "float4number.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("float4number", {
				float4: defineFloat4("float4", { mode: "number" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists float4number (
				float4 float4 not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				float4: 1,
			})
			.returning();

		expect(result1[0].float4).toBe(1);

		const result2 = await database.select().from(table).execute();

		expect(result2[0].float4).toBe(1);

		const result3 = await database.select().from(table).where(eq(table.float4, 1)).execute();

		expect(result3[0].float4).toBe(1);

		const result4 = await database.select().from(table).where(eq(table.float4, 2)).execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table float4number;
		`);

		expect(table.float4.getSQLType()).toBe("float4");
	});
});