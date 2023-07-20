import { Text } from "@postgresql-typed/parsers";
import { Client } from "pg";
import { describe, expect, test } from "vitest";

import { pgt, pgTable, sql } from "../../index.js";
import { eq } from "../../operators.js";
import { defineText } from "./Text";

describe("defineText", async () => {
	test('defineText({ mode: "Text" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "text.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("text", {
				text: defineText("text", { mode: "Text" }).notNull(),
				_text: defineText("_text", { mode: "Text" }).array().notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists text (
				text text not null,
				_text _text not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				text: Text.from("a"),
				_text: [Text.from("a"), Text.from("b")],
			})
			.returning();

		expect(Text.isText(result1[0].text)).toBe(true);
		expect(result1[0]._text.length).toBe(2);
		expect(Text.isText(result1[0]._text[0])).toBe(true);
		expect(Text.isText(result1[0]._text[1])).toBe(true);

		const result2 = await database.select().from(table).execute();

		expect(Text.isText(result2[0].text)).toBe(true);
		expect(result2[0]._text.length).toBe(2);
		expect(Text.isText(result2[0]._text[0])).toBe(true);
		expect(Text.isText(result2[0]._text[1])).toBe(true);

		const result3 = await database
			.select()
			.from(table)
			.where(eq(table.text, Text.from("a")))
			.execute();

		expect(Text.isText(result3[0].text)).toBe(true);
		expect(result3[0]._text.length).toBe(2);
		expect(Text.isText(result3[0]._text[0])).toBe(true);
		expect(Text.isText(result3[0]._text[1])).toBe(true);

		const result4 = await database
			.select()
			.from(table)
			.where(eq(table.text, Text.from("b")))
			.execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.text, Symbol() as any))
				.execute()
		).toThrowError("Expected 'string' | 'object', received 'symbol'");

		await database.execute(sql`
			drop table text;
		`);

		expect(table.text.getSQLType()).toBe("text");
	});

	test('defineText({ mode: "string" })', async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "textstring.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("textstring", {
				text: defineText("text", { mode: "string" }).notNull(),
				_text: defineText("_text", { mode: "string" }).array().notNull(),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists textstring (
				text text not null,
				_text _text not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				text: "a",
				_text: ["a", "b"],
			})
			.returning();

		expect(result1[0].text).toBe("a");
		expect(result1[0]._text.length).toBe(2);
		expect(result1[0]._text[0]).toBe("a");
		expect(result1[0]._text[1]).toBe("b");

		const result2 = await database.select().from(table).execute();

		expect(result2[0].text).toBe("a");
		expect(result2[0]._text.length).toBe(2);
		expect(result2[0]._text[0]).toBe("a");
		expect(result2[0]._text[1]).toBe("b");

		const result3 = await database.select().from(table).where(eq(table.text, "a")).execute();

		expect(result3[0].text).toBe("a");
		expect(result3[0]._text.length).toBe(2);
		expect(result3[0]._text[0]).toBe("a");
		expect(result3[0]._text[1]).toBe("b");

		const result4 = await database.select().from(table).where(eq(table.text, "b")).execute();

		expect(result4.length).toBe(0);

		expect(() =>
			database
				.select()
				.from(table)
				.where(eq(table.text, Symbol() as any))
				.execute()
		).toThrowError("Expected 'string' | 'object', received 'symbol'");

		await database.execute(sql`
			drop table textstring;
		`);

		expect(table.text.getSQLType()).toBe("text");
	});
});
