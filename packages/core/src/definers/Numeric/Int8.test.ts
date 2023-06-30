import { Int8 } from "@postgresql-typed/parsers";
import { Client } from "pg";
import { describe, expect, test } from "vitest";

import { pgt, pgTable, sql } from "../../index.js";
import { eq } from "../../operators.js";
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
			database = pgt(postgres),
			table = pgTable("int8", {
				int8: defineInt8("int8", { mode: "Int8" }).notNull(),
				_int8: defineInt8("_int8", { mode: "Int8" }).array().notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists int8 (
				int8 int8 not null,
				_int8 _int8 not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				int8: Int8.from("1"),
				_int8: [Int8.from("1"), Int8.from("2")],
			})
			.returning();

		expect(Int8.isInt8(result1[0].int8)).toBe(true);
		expect(result1[0]._int8.length).toBe(2);
		expect(Int8.isInt8(result1[0]._int8[0])).toBe(true);
		expect(Int8.isInt8(result1[0]._int8[1])).toBe(true);

		const result2 = await database.select().from(table).execute();

		expect(Int8.isInt8(result2[0].int8)).toBe(true);
		expect(result2[0]._int8.length).toBe(2);
		expect(Int8.isInt8(result2[0]._int8[0])).toBe(true);
		expect(Int8.isInt8(result2[0]._int8[1])).toBe(true);

		const result3 = await database
			.select()
			.from(table)
			.where(eq(table.int8, Int8.from("1")))
			.execute();

		expect(Int8.isInt8(result3[0].int8)).toBe(true);
		expect(result3[0]._int8.length).toBe(2);
		expect(Int8.isInt8(result3[0]._int8[0])).toBe(true);
		expect(Int8.isInt8(result3[0]._int8[1])).toBe(true);

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
			database = pgt(postgres),
			table = pgTable("int8string", {
				int8: defineInt8("int8", { mode: "string" }).notNull(),
				_int8: defineInt8("_int8", { mode: "string" }).array().notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists int8string (
				int8 int8 not null,
				_int8 _int8 not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				int8: "1",
				_int8: ["1", "2"],
			})
			.returning();

		expect(result1[0].int8).toBe("1");
		expect(result1[0]._int8.length).toBe(2);
		expect(result1[0]._int8[0]).toBe("1");
		expect(result1[0]._int8[1]).toBe("2");

		const result2 = await database.select().from(table).execute();

		expect(result2[0].int8).toBe("1");
		expect(result2[0]._int8.length).toBe(2);
		expect(result2[0]._int8[0]).toBe("1");
		expect(result2[0]._int8[1]).toBe("2");

		const result3 = await database.select().from(table).where(eq(table.int8, "1")).execute();

		expect(result3[0].int8).toBe("1");
		expect(result3[0]._int8.length).toBe(2);
		expect(result3[0]._int8[0]).toBe("1");
		expect(result3[0]._int8[1]).toBe("2");

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
			database = pgt(postgres),
			table = pgTable("int8bignumber", {
				int8: defineInt8("int8", { mode: "BigInt" }).notNull(),
				_int8: defineInt8("_int8", { mode: "BigInt" }).array().notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists int8bignumber (
				int8 int8 not null,
				_int8 _int8 not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				int8: BigInt(1),
				_int8: [BigInt(1), BigInt(2)],
			})
			.returning();

		expect(result1[0].int8).toBe(BigInt(1));
		expect(result1[0]._int8.length).toBe(2);
		expect(result1[0]._int8[0]).toBe(BigInt(1));
		expect(result1[0]._int8[1]).toBe(BigInt(2));

		const result2 = await database.select().from(table).execute();

		expect(result2[0].int8).toBe(BigInt(1));
		expect(result2[0]._int8.length).toBe(2);
		expect(result2[0]._int8[0]).toBe(BigInt(1));
		expect(result2[0]._int8[1]).toBe(BigInt(2));

		const result3 = await database
			.select()
			.from(table)
			.where(eq(table.int8, BigInt(1)))
			.execute();

		expect(result3[0].int8).toBe(BigInt(1));
		expect(result3[0]._int8.length).toBe(2);
		expect(result3[0]._int8[0]).toBe(BigInt(1));
		expect(result3[0]._int8[1]).toBe(BigInt(2));

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
			database = pgt(postgres),
			table = pgTable("int8number", {
				int8: defineInt8("int8", { mode: "number" }).notNull(),
				_int8: defineInt8("_int8", { mode: "number" }).array().notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists int8number (
				int8 int8 not null,
				_int8 _int8 not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				int8: 1,
				_int8: [1, 2],
			})
			.returning();

		expect(result1[0].int8).toBe(1);
		expect(result1[0]._int8.length).toBe(2);
		expect(result1[0]._int8[0]).toBe(1);
		expect(result1[0]._int8[1]).toBe(2);

		const result2 = await database.select().from(table).execute();

		expect(result2[0].int8).toBe(1);
		expect(result2[0]._int8.length).toBe(2);
		expect(result2[0]._int8[0]).toBe(1);
		expect(result2[0]._int8[1]).toBe(2);

		const result3 = await database.select().from(table).where(eq(table.int8, 1)).execute();

		expect(result3[0].int8).toBe(1);
		expect(result3[0]._int8.length).toBe(2);
		expect(result3[0]._int8[0]).toBe(1);
		expect(result3[0]._int8[1]).toBe(2);

		const result4 = await database.select().from(table).where(eq(table.int8, 2)).execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table int8number;
		`);

		expect(table.int8.getSQLType()).toBe("int8");
	});
});
