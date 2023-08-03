import { Name } from "@postgresql-typed/parsers";
import { Client } from "pg";
import { describe, expect, test } from "vitest";

import { pgt, pgTable, sql } from "../../index.js";
import { eq } from "../../operators.js";
import { defineName } from "./Name";

describe("defineName", async () => {
	test('defineName({ mode: "Name" })', async () => {
		const postgres = new Client({
				application_name: "name.test.ts",
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			database = pgt(postgres),
			table = pgTable("name", {
				_name: defineName("_name", { mode: "Name" }).array().notNull(),
				name: defineName("name", { mode: "Name" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists name (
				name name not null,
				_name _name not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				_name: [Name.from("a"), Name.from("b")],
				name: Name.from("a"),
			})
			.returning();

		expect(Name.isName(result1[0].name)).toBe(true);
		expect(result1[0]._name.length).toBe(2);
		expect(Name.isName(result1[0]._name[0])).toBe(true);
		expect(Name.isName(result1[0]._name[1])).toBe(true);

		const result2 = await database.select().from(table).execute();

		expect(Name.isName(result2[0].name)).toBe(true);
		expect(result2[0]._name.length).toBe(2);
		expect(Name.isName(result2[0]._name[0])).toBe(true);
		expect(Name.isName(result2[0]._name[1])).toBe(true);

		const result3 = await database
			.select()
			.from(table)
			.where(eq(table.name, Name.from("a")))
			.execute();

		expect(Name.isName(result3[0].name)).toBe(true);
		expect(result3[0]._name.length).toBe(2);
		expect(Name.isName(result3[0]._name[0])).toBe(true);
		expect(Name.isName(result3[0]._name[1])).toBe(true);

		const result4 = await database
			.select()
			.from(table)
			.where(eq(table.name, Name.from("b")))
			.execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.name, Symbol() as any))
				.execute()
		).toThrowError("Expected 'string' | 'object', received 'symbol'");

		await database.execute(sql`
			drop table name;
		`);

		expect(table.name.getSQLType()).toBe("name");
	});

	test('defineName({ mode: "string" })', async () => {
		const postgres = new Client({
				application_name: "namestring.test.ts",
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			database = pgt(postgres),
			table = pgTable("namestring", {
				_name: defineName("_name", { mode: "string" }).array().notNull(),
				name: defineName("name", { mode: "string" }).notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists namestring (
				name name not null,
				_name _name not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				_name: ["a", "b"],
				name: "a",
			})
			.returning();

		expect(result1[0].name).toBe("a");
		expect(result1[0]._name.length).toBe(2);
		expect(result1[0]._name[0]).toBe("a");
		expect(result1[0]._name[1]).toBe("b");

		const result2 = await database.select().from(table).execute();

		expect(result2[0].name).toBe("a");
		expect(result2[0]._name.length).toBe(2);
		expect(result2[0]._name[0]).toBe("a");
		expect(result2[0]._name[1]).toBe("b");

		const result3 = await database.select().from(table).where(eq(table.name, "a")).execute();

		expect(result3[0].name).toBe("a");
		expect(result3[0]._name.length).toBe(2);
		expect(result3[0]._name[0]).toBe("a");
		expect(result3[0]._name[1]).toBe("b");

		const result4 = await database.select().from(table).where(eq(table.name, "b")).execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.name, Symbol() as any))
				.execute()
		).toThrowError("Expected 'string' | 'object', received 'symbol'");

		await database.execute(sql`
			drop table namestring;
		`);

		expect(table.name.getSQLType()).toBe("name");
	});
});
