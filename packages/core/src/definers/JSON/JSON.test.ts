/* eslint-disable unicorn/filename-case */
import { JSON } from "@postgresql-typed/parsers";
import { Client } from "pg";
import { describe, expect, test } from "vitest";

import { pgt, pgTable, sql } from "../../index.js";
import { eq } from "../../operators.js";
import { defineJSON } from "./JSON";

describe("defineJSON", async () => {
	test('defineJSON({ mode: "JSON" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "json.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("json", {
				json: defineJSON("json", { mode: "JSON" }).notNull(),
				_json: defineJSON("_json", { mode: "JSON" }).array().notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists json (
				json json not null,
				_json _json not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				json: JSON.from("1"),
				_json: [JSON.from("1"), JSON.from("2")],
			})
			.returning();

		expect(JSON.isJSON(result1[0].json)).toBe(true);
		expect(result1[0]._json.length).toBe(2);
		expect(JSON.isJSON(result1[0]._json[0])).toBe(true);
		expect(JSON.isJSON(result1[0]._json[1])).toBe(true);

		const result2 = await database.select().from(table).execute();

		expect(JSON.isJSON(result2[0].json)).toBe(true);
		expect(result2[0]._json.length).toBe(2);
		expect(JSON.isJSON(result2[0]._json[0])).toBe(true);
		expect(JSON.isJSON(result2[0]._json[1])).toBe(true);

		const result3 = await database
			.select()
			.from(table)
			//@ts-expect-error - Workaround
			.where(eq(sql`${table.json}::json::text`, sql`${JSON.from("1")}::json::text`))
			.execute();

		expect(JSON.isJSON(result3[0].json)).toBe(true);
		expect(result3[0]._json.length).toBe(2);
		expect(JSON.isJSON(result3[0]._json[0])).toBe(true);
		expect(JSON.isJSON(result3[0]._json[1])).toBe(true);

		const result4 = await database
			.select()
			.from(table)
			//@ts-expect-error - Workaround
			.where(eq(sql`${table.json}::json::text`, sql`${JSON.from("2")}::json::text`))
			.execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table json;
		`);

		expect(table.json.getSQLType()).toBe("json");
	});

	test('defineJSON({ mode: "string" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "jsonstring.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("jsonstring", {
				json: defineJSON("json", { mode: "string" }).notNull(),
				_json: defineJSON("_json", { mode: "string" }).array().notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists jsonstring (
				json json not null,
				_json _json not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				json: "1",
				_json: ["1", "2"],
			})
			.returning();

		expect(result1[0].json).toBe("1");
		expect(result1[0]._json.length).toBe(2);
		expect(result1[0]._json[0]).toBe("1");
		expect(result1[0]._json[1]).toBe("2");

		const result2 = await database.select().from(table).execute();

		expect(result2[0].json).toBe("1");
		expect(result2[0]._json.length).toBe(2);
		expect(result2[0]._json[0]).toBe("1");
		expect(result2[0]._json[1]).toBe("2");

		const result3 = await database
			.select()
			.from(table)
			//@ts-expect-error - Workaround
			.where(eq(sql`${table.json}::json::text`, sql`${JSON.from("1")}::json::text`))
			.execute();

		expect(result3[0].json).toBe("1");
		expect(result3[0]._json.length).toBe(2);
		expect(result3[0]._json[0]).toBe("1");
		expect(result3[0]._json[1]).toBe("2");

		const result4 = await database
			.select()
			.from(table)
			//@ts-expect-error - Workaround
			.where(eq(sql`${table.json}::json::text`, sql`${JSON.from("2")}::json::text`))
			.execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table jsonstring;
		`);

		expect(table.json.getSQLType()).toBe("json");
	});

	test('defineJSON({ mode: "value" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "jsonvalue.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("jsonvalue", {
				json: defineJSON("json", { mode: "value" }).notNull(),
				_json: defineJSON("_json", { mode: "value" }).array().notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists jsonvalue (
				json json not null,
				_json _json not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				json: 1,
				_json: [1, 2],
			})
			.returning();

		expect(result1[0].json).toBe(1);
		expect(result1[0]._json.length).toBe(2);
		expect(result1[0]._json[0]).toBe(1);
		expect(result1[0]._json[1]).toBe(2);

		const result2 = await database.select().from(table).execute();

		expect(result2[0].json).toBe(1);
		expect(result2[0]._json.length).toBe(2);
		expect(result2[0]._json[0]).toBe(1);
		expect(result2[0]._json[1]).toBe(2);

		const result3 = await database
			.select()
			.from(table)
			//@ts-expect-error - Workaround
			.where(eq(sql`${table.json}::json::text`, sql`${JSON.from("1")}::json::text`))
			.execute();

		expect(result3[0].json).toBe(1);
		expect(result3[0]._json.length).toBe(2);
		expect(result3[0]._json[0]).toBe(1);
		expect(result3[0]._json[1]).toBe(2);

		const result4 = await database
			.select()
			.from(table)
			//@ts-expect-error - Workaround
			.where(eq(sql`${table.json}::json::text`, sql`${JSON.from("2")}::json::text`))
			.execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table jsonvalue;
		`);

		expect(table.json.getSQLType()).toBe("json");
	});
});
