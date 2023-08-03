/* eslint-disable unicorn/filename-case */
import { JSON } from "@postgresql-typed/parsers";
import { Client } from "pg";
import { describe, expect, test } from "vitest";

import { pgt, pgTable, sql } from "../../index.js";
import { eq } from "../../operators.js";
import { defineJSONB } from "./JSON-B";

describe("defineJSONB", async () => {
	test('defineJSONB({ mode: "JSONB" })', async () => {
		const postgres = new Client({
				application_name: "jsonb.test.ts",
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			database = pgt(postgres),
			table = pgTable("jsonb", {
				_jsonb: defineJSONB("_jsonb", { mode: "JSON" }).array().notNull(),
				jsonb: defineJSONB("jsonb", { mode: "JSON" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists jsonb (
				jsonb jsonb not null,
				_jsonb _jsonb not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				_jsonb: [JSON.from("1"), JSON.from("2")],
				jsonb: JSON.from("1"),
			})
			.returning();

		expect(JSON.isJSON(result1[0].jsonb)).toBe(true);
		expect(result1[0]._jsonb.length).toBe(2);
		expect(JSON.isJSON(result1[0]._jsonb[0])).toBe(true);
		expect(JSON.isJSON(result1[0]._jsonb[1])).toBe(true);

		const result2 = await database.select().from(table).execute();

		expect(JSON.isJSON(result2[0].jsonb)).toBe(true);
		expect(result2[0]._jsonb.length).toBe(2);
		expect(JSON.isJSON(result2[0]._jsonb[0])).toBe(true);
		expect(JSON.isJSON(result2[0]._jsonb[1])).toBe(true);

		const result3 = await database
			.select()
			.from(table)
			.where(eq(sql`${table.jsonb}::jsonb::text`, sql`${JSON.from("1")}::jsonb::text`))
			.execute();

		expect(JSON.isJSON(result3[0].jsonb)).toBe(true);
		expect(result3[0]._jsonb.length).toBe(2);
		expect(JSON.isJSON(result3[0]._jsonb[0])).toBe(true);
		expect(JSON.isJSON(result3[0]._jsonb[1])).toBe(true);

		const result4 = await database
			.select()
			.from(table)
			.where(eq(sql`${table.jsonb}::jsonb::text`, sql`${JSON.from("2")}::jsonb::text`))
			.execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.jsonb, Symbol() as any))
				.execute()
		).toThrowError("Expected 'number' | 'string' | 'object' | 'null' | 'array' | 'boolean', received 'symbol'");

		await database.execute(sql`
			drop table jsonb;
		`);

		expect(table.jsonb.getSQLType()).toBe("jsonb");
	});

	test('defineJSONB({ mode: "string" })', async () => {
		const postgres = new Client({
				application_name: "jsonbstring.test.ts",
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			database = pgt(postgres),
			table = pgTable("jsonbstring", {
				_jsonb: defineJSONB("_jsonb", { mode: "string" }).array().notNull(),
				jsonb: defineJSONB("jsonb", { mode: "string" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists jsonbstring (
				jsonb jsonb not null,
				_jsonb _jsonb not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				_jsonb: ["1", "2"],
				jsonb: "1",
			})
			.returning();

		expect(result1[0].jsonb).toBe("1");
		expect(result1[0]._jsonb.length).toBe(2);
		expect(result1[0]._jsonb[0]).toBe("1");
		expect(result1[0]._jsonb[1]).toBe("2");

		const result2 = await database.select().from(table).execute();

		expect(result2[0].jsonb).toBe("1");
		expect(result2[0]._jsonb.length).toBe(2);
		expect(result2[0]._jsonb[0]).toBe("1");
		expect(result2[0]._jsonb[1]).toBe("2");

		const result3 = await database
			.select()
			.from(table)
			.where(eq(sql`${table.jsonb}::jsonb::text`, sql`${JSON.from("1")}::jsonb::text`))
			.execute();

		expect(result3[0].jsonb).toBe("1");
		expect(result3[0]._jsonb.length).toBe(2);
		expect(result3[0]._jsonb[0]).toBe("1");
		expect(result3[0]._jsonb[1]).toBe("2");

		const result4 = await database
			.select()
			.from(table)
			.where(eq(sql`${table.jsonb}::jsonb::text`, sql`${JSON.from("2")}::jsonb::text`))
			.execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.jsonb, Symbol() as any))
				.execute()
		).toThrowError("Expected 'number' | 'string' | 'object' | 'null' | 'array' | 'boolean', received 'symbol'");

		await database.execute(sql`
			drop table jsonbstring;
		`);

		expect(table.jsonb.getSQLType()).toBe("jsonb");
	});

	test('defineJSONB({ mode: "value" })', async () => {
		const postgres = new Client({
				application_name: "jsonbvalue.test.ts",
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			database = pgt(postgres),
			table = pgTable("jsonbvalue", {
				_jsonb: defineJSONB("_jsonb", { mode: "value" }).array().notNull(),
				jsonb: defineJSONB("jsonb", { mode: "value" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists jsonbvalue (
				jsonb jsonb not null,
				_jsonb _jsonb not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				_jsonb: [1, 2],
				jsonb: 1,
			})
			.returning();

		expect(result1[0].jsonb).toBe(1);
		expect(result1[0]._jsonb.length).toBe(2);
		expect(result1[0]._jsonb[0]).toBe(1);
		expect(result1[0]._jsonb[1]).toBe(2);

		const result2 = await database.select().from(table).execute();

		expect(result2[0].jsonb).toBe(1);
		expect(result2[0]._jsonb.length).toBe(2);
		expect(result2[0]._jsonb[0]).toBe(1);
		expect(result2[0]._jsonb[1]).toBe(2);

		const result3 = await database
			.select()
			.from(table)
			.where(eq(sql`${table.jsonb}::jsonb::text`, sql`${JSON.from("1")}::jsonb::text`))
			.execute();

		expect(result3[0].jsonb).toBe(1);
		expect(result3[0]._jsonb.length).toBe(2);
		expect(result3[0]._jsonb[0]).toBe(1);
		expect(result3[0]._jsonb[1]).toBe(2);

		const result4 = await database
			.select()
			.from(table)
			.where(eq(sql`${table.jsonb}::jsonb::text`, sql`${JSON.from("2")}::jsonb::text`))
			.execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.jsonb, Symbol() as any))
				.execute()
		).toThrowError("Expected 'number' | 'string' | 'object' | 'null' | 'array' | 'boolean', received 'symbol'");

		await database.execute(sql`
			drop table jsonbvalue;
		`);

		expect(table.jsonb.getSQLType()).toBe("jsonb");
	});
});
