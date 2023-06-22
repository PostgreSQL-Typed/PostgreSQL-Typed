import { Text } from "@postgresql-typed/parsers";
import { eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { pgTable } from "drizzle-orm/pg-core";
import { Client } from "pg";
import { describe, expect, test } from "vitest";

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
			database = drizzle(postgres),
			table = pgTable("text", {
				text: defineText("text", { mode: "Text" }).notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists text (
				text text not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				text: Text.from("a"),
			})
			.returning();

		expect(Text.isText(result1[0].text)).toBe(true);

		const result2 = await database.select().from(table).execute();

		expect(Text.isText(result2[0].text)).toBe(true);

		const result3 = await database
			.select()
			.from(table)
			.where(eq(table.text, Text.from("a")))
			.execute();

		expect(Text.isText(result3[0].text)).toBe(true);

		const result4 = await database
			.select()
			.from(table)
			.where(eq(table.text, Text.from("b")))
			.execute();

		expect(result4.length).toBe(0);

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
			database = drizzle(postgres),
			table = pgTable("textstring", {
				text: defineText("text", { mode: "string" }).notNull(),
			});

		await postgres.connect();

		await database.execute(sql`
			create table if not exists textstring (
				text text not null
			);
		`);

		const result1 = await database
			.insert(table)
			.values({
				text: "a",
			})
			.returning();

		expect(result1[0].text).toBe("a");

		const result2 = await database.select().from(table).execute();

		expect(result2[0].text).toBe("a");

		const result3 = await database.select().from(table).where(eq(table.text, "a")).execute();

		expect(result3[0].text).toBe("a");

		const result4 = await database.select().from(table).where(eq(table.text, "b")).execute();

		expect(result4.length).toBe(0);

		await database.execute(sql`
			drop table textstring;
		`);

		expect(table.text.getSQLType()).toBe("text");
	});
});
