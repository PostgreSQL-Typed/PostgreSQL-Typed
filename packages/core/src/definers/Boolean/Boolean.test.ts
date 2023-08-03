import { Boolean } from "@postgresql-typed/parsers";
import { Client } from "pg";
import { describe, expect, test } from "vitest";

import { pgt, pgTable, sql } from "../../index.js";
import { eq } from "../../operators.js";
import { defineBoolean } from "./Boolean";

describe("defineBoolean", async () => {
	test('defineBoolean({ mode: "Boolean" })', async () => {
		const postgres = new Client({
				application_name: "boolean.test.ts",
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			database = pgt(postgres),
			table = pgTable("boolean", {
				_boolean: defineBoolean("_boolean", { mode: "Boolean" }).array().notNull(),
				boolean: defineBoolean("boolean", { mode: "Boolean" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists boolean (
				boolean bool not null,
				_boolean _bool not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				_boolean: [Boolean.from(1), Boolean.from(0)],
				boolean: Boolean.from(1),
			})
			.returning();

		expect(Boolean.isBoolean(result1[0].boolean)).toBe(true);
		expect(result1[0]._boolean.length).toBe(2);
		expect(Boolean.isBoolean(result1[0]._boolean[0])).toBe(true);
		expect(Boolean.isBoolean(result1[0]._boolean[1])).toBe(true);

		const result2 = await database.select().from(table).execute();

		expect(Boolean.isBoolean(result2[0].boolean)).toBe(true);
		expect(result2[0]._boolean.length).toBe(2);
		expect(Boolean.isBoolean(result2[0]._boolean[0])).toBe(true);
		expect(Boolean.isBoolean(result2[0]._boolean[1])).toBe(true);

		const result3 = await database
			.select()
			.from(table)
			.where(eq(table.boolean, Boolean.from(1)))
			.execute();

		expect(Boolean.isBoolean(result3[0].boolean)).toBe(true);
		expect(result3[0]._boolean.length).toBe(2);
		expect(Boolean.isBoolean(result1[0]._boolean[0])).toBe(true);
		expect(Boolean.isBoolean(result1[0]._boolean[1])).toBe(true);

		const result4 = await database
			.select()
			.from(table)
			.where(eq(table.boolean, Boolean.from(0)))
			.execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.boolean, Symbol() as any))
				.execute()
		).toThrowError("Expected 'number' | 'string' | 'object' | 'boolean', received 'symbol'");

		await database.execute(sql`
			drop table boolean;
		`);

		expect(table.boolean.getSQLType()).toBe("boolean");
	});

	test('defineBoolean({ mode: "string" })', async () => {
		const postgres = new Client({
				application_name: "booleanstring.test.ts",
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			database = pgt(postgres),
			table = pgTable("booleanstring", {
				_boolean: defineBoolean("_boolean", { mode: "string" }).array().notNull(),
				boolean: defineBoolean("boolean", { mode: "string" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists booleanstring (
				boolean bool not null,
				_boolean _bool not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				_boolean: ["true", "false"],
				boolean: "true",
			})
			.returning();

		expect(result1[0].boolean).toBe("true");
		expect(result1[0]._boolean.length).toBe(2);
		expect(result1[0]._boolean[0]).toBe("true");
		expect(result1[0]._boolean[1]).toBe("false");

		const result2 = await database.select().from(table).execute();

		expect(result2[0].boolean).toBe("true");
		expect(result2[0]._boolean.length).toBe(2);
		expect(result2[0]._boolean[0]).toBe("true");
		expect(result2[0]._boolean[1]).toBe("false");

		const result3 = await database.select().from(table).where(eq(table.boolean, "true")).execute();

		expect(result3[0].boolean).toBe("true");
		expect(result3[0]._boolean.length).toBe(2);
		expect(result3[0]._boolean[0]).toBe("true");
		expect(result3[0]._boolean[1]).toBe("false");

		const result4 = await database.select().from(table).where(eq(table.boolean, "false")).execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.boolean, Symbol() as any))
				.execute()
		).toThrowError("Expected 'number' | 'string' | 'object' | 'boolean', received 'symbol'");

		await database.execute(sql`
			drop table booleanstring;
		`);

		expect(table.boolean.getSQLType()).toBe("boolean");
	});

	test('defineBoolean({ mode: "number" })', async () => {
		const postgres = new Client({
				application_name: "booleannumber.test.ts",
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			database = pgt(postgres),
			table = pgTable("booleannumber", {
				_boolean: defineBoolean("_boolean", { mode: "number" }).array().notNull(),
				boolean: defineBoolean("boolean", { mode: "number" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists booleannumber (
				boolean bool not null,
				_boolean _bool not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				_boolean: [1, 0],
				boolean: 1,
			})
			.returning();

		expect(result1[0].boolean).toBe(1);
		expect(result1[0]._boolean.length).toBe(2);
		expect(result1[0]._boolean[0]).toBe(1);
		expect(result1[0]._boolean[1]).toBe(0);

		const result2 = await database.select().from(table).execute();

		expect(result2[0].boolean).toBe(1);
		expect(result2[0]._boolean.length).toBe(2);
		expect(result2[0]._boolean[0]).toBe(1);
		expect(result2[0]._boolean[1]).toBe(0);

		const result3 = await database.select().from(table).where(eq(table.boolean, 1)).execute();

		expect(result3[0].boolean).toBe(1);
		expect(result3[0]._boolean.length).toBe(2);
		expect(result3[0]._boolean[0]).toBe(1);
		expect(result3[0]._boolean[1]).toBe(0);

		const result4 = await database.select().from(table).where(eq(table.boolean, 0)).execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.boolean, Symbol() as any))
				.execute()
		).toThrowError("Expected 'number' | 'string' | 'object' | 'boolean', received 'symbol'");

		await database.execute(sql`
			drop table booleannumber;
		`);

		expect(table.boolean.getSQLType()).toBe("boolean");
	});

	test('defineBoolean({ mode: "boolean" })', async () => {
		const postgres = new Client({
				application_name: "booleanboolean.test.ts",
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			database = pgt(postgres),
			table = pgTable("booleanboolean", {
				_boolean: defineBoolean("_boolean", { mode: "boolean" }).array().notNull(),
				boolean: defineBoolean("boolean", { mode: "boolean" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists booleanboolean (
				boolean bool not null,
				_boolean _bool not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				_boolean: [true, false],
				boolean: true,
			})
			.returning();

		expect(result1[0].boolean).toBe(true);
		expect(result1[0]._boolean.length).toBe(2);
		expect(result1[0]._boolean[0]).toBe(true);
		expect(result1[0]._boolean[1]).toBe(false);

		const result2 = await database.select().from(table).execute();

		expect(result2[0].boolean).toBe(true);
		expect(result2[0]._boolean.length).toBe(2);
		expect(result2[0]._boolean[0]).toBe(true);
		expect(result2[0]._boolean[1]).toBe(false);

		const result3 = await database.select().from(table).where(eq(table.boolean, true)).execute();

		expect(result3[0].boolean).toBe(true);
		expect(result3[0]._boolean.length).toBe(2);
		expect(result3[0]._boolean[0]).toBe(true);
		expect(result3[0]._boolean[1]).toBe(false);

		const result4 = await database.select().from(table).where(eq(table.boolean, false)).execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.boolean, Symbol() as any))
				.execute()
		).toThrowError("Expected 'number' | 'string' | 'object' | 'boolean', received 'symbol'");

		await database.execute(sql`
			drop table booleanboolean;
		`);

		expect(table.boolean.getSQLType()).toBe("boolean");
	});
});
