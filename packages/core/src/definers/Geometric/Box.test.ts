import { Box } from "@postgresql-typed/parsers";
import { Client } from "pg";
import { describe, expect, test } from "vitest";

import { pgt, pgTable, sql } from "../../index.js";
import { sameAs } from "../../operators.js";
import { defineBox } from "./Box";

describe("defineBox", async () => {
	test('defineBox({ mode: "Box" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "box.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("box", {
				box: defineBox("box", { mode: "Box" }).notNull(),
				_box: defineBox("_box", { mode: "Box" }).array().notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists box (
				box box not null,
				_box _box not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				box: Box.from("(1,2),(1,2)"),
				_box: [Box.from("(1,2),(1,2)"), Box.from("(3,4),(3,4)")],
			})
			.returning();

		expect(Box.isBox(result1[0].box)).toBe(true);
		expect(result1[0]._box.length).toBe(2);
		expect(Box.isBox(result1[0]._box[0])).toBe(true);
		expect(Box.isBox(result1[0]._box[1])).toBe(true);

		const result2 = await database.select().from(table).execute();

		expect(Box.isBox(result2[0].box)).toBe(true);
		expect(result2[0]._box.length).toBe(2);
		expect(Box.isBox(result2[0]._box[0])).toBe(true);
		expect(Box.isBox(result2[0]._box[1])).toBe(true);

		const result3 = await database
			.select()
			.from(table)
			.where(sameAs(table.box, Box.from("(1,2),(1,2)")))
			.execute();

		expect(Box.isBox(result3[0].box)).toBe(true);
		expect(result3[0]._box.length).toBe(2);
		expect(Box.isBox(result3[0]._box[0])).toBe(true);
		expect(Box.isBox(result3[0]._box[1])).toBe(true);

		const result4 = await database
			.select()
			.from(table)
			.where(sameAs(table.box, Box.from("(3,4),(3,4)")))
			.execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(sameAs(table.box, Symbol() as any))
				.execute()
		).toThrowError("Expected 'number' | 'string' | 'object', received 'symbol'");

		await database.execute(sql`
			drop table box;
		`);

		expect(table.box.getSQLType()).toBe("box");
	});

	test('defineBox({ mode: "string" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "boxstring.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("boxstring", {
				box: defineBox("box", { mode: "string" }).notNull(),
				_box: defineBox("_box", { mode: "string" }).array().notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists boxstring (
				box box not null,
				_box _box not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				box: "(1,2),(1,2)",
				_box: ["(1,2),(1,2)", "(3,4),(3,4)"],
			})
			.returning();

		expect(result1[0].box).toBe("(1,2),(1,2)");
		expect(result1[0]._box.length).toBe(2);
		expect(result1[0]._box[0]).toBe("(1,2),(1,2)");
		expect(result1[0]._box[1]).toBe("(3,4),(3,4)");

		const result2 = await database.select().from(table).execute();

		expect(result2[0].box).toBe("(1,2),(1,2)");
		expect(result2[0]._box.length).toBe(2);
		expect(result2[0]._box[0]).toBe("(1,2),(1,2)");
		expect(result2[0]._box[1]).toBe("(3,4),(3,4)");

		const result3 = await database.select().from(table).where(sameAs(table.box, "(1,2),(1,2)")).execute();

		expect(result3[0].box).toBe("(1,2),(1,2)");
		expect(result3[0]._box.length).toBe(2);
		expect(result3[0]._box[0]).toBe("(1,2),(1,2)");
		expect(result3[0]._box[1]).toBe("(3,4),(3,4)");

		const result4 = await database.select().from(table).where(sameAs(table.box, "(3,4),(3,4)")).execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(sameAs(table.box, Symbol() as any))
				.execute()
		).toThrowError("Expected 'number' | 'string' | 'object', received 'symbol'");

		await database.execute(sql`
			drop table boxstring;
		`);

		expect(table.box.getSQLType()).toBe("box");
	});
});
