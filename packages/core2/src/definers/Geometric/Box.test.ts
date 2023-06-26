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
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists box (
				box box not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				box: Box.from("(1,2),(1,2)"),
			})
			.returning();

		expect(Box.isBox(result1[0].box)).toBe(true);

		const result2 = await database.select().from(table).execute();

		expect(Box.isBox(result2[0].box)).toBe(true);

		const result3 = await database
			.select()
			.from(table)
			.where(sameAs(table.box, Box.from("(1,2),(1,2)")))
			.execute();

		expect(Box.isBox(result3[0].box)).toBe(true);

		const result4 = await database
			.select()
			.from(table)
			.where(sameAs(table.box, Box.from("(3,4),(3,4)")))
			.execute();

		expect(result4.length).toBe(0);

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
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists boxstring (
				box box not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				box: "(1,2),(1,2)",
			})
			.returning();

		expect(result1[0].box).toBe("(1,2),(1,2)");

		const result2 = await database.select().from(table).execute();

		expect(result2[0].box).toBe("(1,2),(1,2)");

		const result3 = await database.select().from(table).where(sameAs(table.box, "(1,2),(1,2)")).execute();

		expect(result3[0].box).toBe("(1,2),(1,2)");

		const result4 = await database.select().from(table).where(sameAs(table.box, "(3,4),(3,4)")).execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table boxstring;
		`);

		expect(table.box.getSQLType()).toBe("box");
	});
});
