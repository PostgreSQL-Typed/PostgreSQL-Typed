import { BigNumber, Float8 } from "@postgresql-typed/parsers";
import { Client } from "pg";
import { describe, expect, test } from "vitest";

import { pgt, pgTable, sql } from "../../index.js";
import { eq } from "../../operators.js";
import { defineFloat8 } from "./Float8";

describe("defineFloat8", async () => {
	test('defineFloat8({ mode: "Float8" })', async () => {
		const postgres = new Client({
				application_name: "float8.test.ts",
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			database = pgt(postgres),
			table = pgTable("float8", {
				_float8: defineFloat8("_float8", { mode: "Float8" }).array().notNull(),
				float8: defineFloat8("float8", { mode: "Float8" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists float8 (
				float8 float8 not null,
				_float8 _float8 not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				_float8: [Float8.from("1"), Float8.from("2")],
				float8: Float8.from("1"),
			})
			.returning();

		expect(Float8.isFloat8(result1[0].float8)).toBe(true);
		expect(result1[0]._float8.length).toBe(2);
		expect(Float8.isFloat8(result1[0]._float8[0])).toBe(true);
		expect(Float8.isFloat8(result1[0]._float8[1])).toBe(true);

		const result2 = await database.select().from(table).execute();

		expect(Float8.isFloat8(result2[0].float8)).toBe(true);
		expect(result2[0]._float8.length).toBe(2);
		expect(Float8.isFloat8(result2[0]._float8[0])).toBe(true);
		expect(Float8.isFloat8(result2[0]._float8[1])).toBe(true);

		const result3 = await database
			.select()
			.from(table)
			.where(eq(table.float8, Float8.from("1")))
			.execute();

		expect(Float8.isFloat8(result3[0].float8)).toBe(true);
		expect(result3[0]._float8.length).toBe(2);
		expect(Float8.isFloat8(result3[0]._float8[0])).toBe(true);
		expect(Float8.isFloat8(result3[0]._float8[1])).toBe(true);

		const result4 = await database
			.select()
			.from(table)
			.where(eq(table.float8, Float8.from("2")))
			.execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.float8, Symbol() as any))
				.execute()
		).toThrowError("Expected 'number' | 'string' | 'object' | 'nan' | 'infinity' | 'bigNumber' | 'bigint', received 'symbol'");

		await database.execute(sql`
			drop table float8;
		`);

		expect(table.float8.getSQLType()).toBe("float8");
	});

	test('defineFloat8({ mode: "string" })', async () => {
		const postgres = new Client({
				application_name: "float8string.test.ts",
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			database = pgt(postgres),
			table = pgTable("float8string", {
				_float8: defineFloat8("_float8", { mode: "string" }).array().notNull(),
				float8: defineFloat8("float8", { mode: "string" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists float8string (
				float8 float8 not null,
				_float8 _float8 not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				_float8: ["1", "2"],
				float8: "1",
			})
			.returning();

		expect(result1[0].float8).toBe("1");
		expect(result1[0]._float8.length).toBe(2);
		expect(result1[0]._float8[0]).toBe("1");
		expect(result1[0]._float8[1]).toBe("2");

		const result2 = await database.select().from(table).execute();

		expect(result2[0].float8).toBe("1");
		expect(result2[0]._float8.length).toBe(2);
		expect(result2[0]._float8[0]).toBe("1");
		expect(result2[0]._float8[1]).toBe("2");

		const result3 = await database.select().from(table).where(eq(table.float8, "1")).execute();

		expect(result3[0].float8).toBe("1");
		expect(result3[0]._float8.length).toBe(2);
		expect(result3[0]._float8[0]).toBe("1");
		expect(result3[0]._float8[1]).toBe("2");

		const result4 = await database.select().from(table).where(eq(table.float8, "2")).execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.float8, Symbol() as any))
				.execute()
		).toThrowError("Expected 'number' | 'string' | 'object' | 'nan' | 'infinity' | 'bigNumber' | 'bigint', received 'symbol'");

		await database.execute(sql`
			drop table float8string;
		`);

		expect(table.float8.getSQLType()).toBe("float8");
	});

	test('defineFloat8({ mode: "BigNumber" })', async () => {
		const postgres = new Client({
				application_name: "float8bignumber.test.ts",
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			database = pgt(postgres),
			table = pgTable("float8bignumber", {
				_float8: defineFloat8("_float8", { mode: "BigNumber" }).array().notNull(),
				float8: defineFloat8("float8", { mode: "BigNumber" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists float8bignumber (
				float8 float8 not null,
				_float8 _float8 not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				_float8: [BigNumber(1), BigNumber(2)],
				float8: BigNumber(1),
			})
			.returning();

		expect(result1[0].float8.toNumber()).toBe(1);
		expect(result1[0]._float8.length).toBe(2);
		expect(result1[0]._float8[0].toNumber()).toBe(1);
		expect(result1[0]._float8[1].toNumber()).toBe(2);

		const result2 = await database.select().from(table).execute();

		expect(result2[0].float8.toNumber()).toBe(1);
		expect(result2[0]._float8.length).toBe(2);
		expect(result2[0]._float8[0].toNumber()).toBe(1);
		expect(result2[0]._float8[1].toNumber()).toBe(2);

		const result3 = await database
			.select()
			.from(table)
			.where(eq(table.float8, BigNumber(1)))
			.execute();

		expect(result3[0].float8.toNumber()).toBe(1);
		expect(result3[0]._float8.length).toBe(2);
		expect(result3[0]._float8[0].toNumber()).toBe(1);
		expect(result3[0]._float8[1].toNumber()).toBe(2);

		const result4 = await database
			.select()
			.from(table)
			.where(eq(table.float8, BigNumber(2)))
			.execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.float8, Symbol() as any))
				.execute()
		).toThrowError("Expected 'number' | 'string' | 'object' | 'nan' | 'infinity' | 'bigNumber' | 'bigint', received 'symbol'");

		await database.execute(sql`
			drop table float8bignumber;
		`);

		expect(table.float8.getSQLType()).toBe("float8");
	});

	test('defineFloat8({ mode: "number" })', async () => {
		const postgres = new Client({
				application_name: "float8number.test.ts",
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			database = pgt(postgres),
			table = pgTable("float8number", {
				_float8: defineFloat8("_float8", { mode: "number" }).array().notNull(),
				float8: defineFloat8("float8", { mode: "number" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists float8number (
				float8 float8 not null,
				_float8 _float8 not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				_float8: [1, 2],
				float8: 1,
			})
			.returning();

		expect(result1[0].float8).toBe(1);
		expect(result1[0]._float8.length).toBe(2);
		expect(result1[0]._float8[0]).toBe(1);
		expect(result1[0]._float8[1]).toBe(2);

		const result2 = await database.select().from(table).execute();

		expect(result2[0].float8).toBe(1);
		expect(result2[0]._float8.length).toBe(2);
		expect(result2[0]._float8[0]).toBe(1);
		expect(result2[0]._float8[1]).toBe(2);

		const result3 = await database.select().from(table).where(eq(table.float8, 1)).execute();

		expect(result3[0].float8).toBe(1);
		expect(result3[0]._float8.length).toBe(2);
		expect(result3[0]._float8[0]).toBe(1);
		expect(result3[0]._float8[1]).toBe(2);

		const result4 = await database.select().from(table).where(eq(table.float8, 2)).execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.float8, Symbol() as any))
				.execute()
		).toThrowError("Expected 'number' | 'string' | 'object' | 'nan' | 'infinity' | 'bigNumber' | 'bigint', received 'symbol'");

		await database.execute(sql`
			drop table float8number;
		`);

		expect(table.float8.getSQLType()).toBe("float8");
	});
});
