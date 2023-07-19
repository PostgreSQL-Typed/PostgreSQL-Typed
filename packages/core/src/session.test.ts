/* eslint-disable unicorn/no-null */
import { PgTExtensionContext, PostQueryHookData } from "@postgresql-typed/util";
import { Client } from "pg";
import { describe, expect, test } from "vitest";

import { defineInt2, defineText } from "./definers/index.js";
import { pgt } from "./driver.js";
import { sql, table as pgTable } from "./index.js";

describe("session", () => {
	test("extensionContext", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "context_test.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("context_test", {
				int2: defineInt2("int2").notNull(),
				text: defineText("text"),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists context_test (
				int2 int2 NOT NULL,
				"text" text NULL
			);
		`);

		let finalError;
		try {
			let context: PgTExtensionContext | PostQueryHookData = {
				nonce: "test",
			};
			const result1 = await database.insert(table).values({ int2: 1 }).returning().execute({}, context);

			expect(result1).toEqual([{ int2: 1, text: null }]);

			if ("nonce" in context) expect.fail();
			context = context as PostQueryHookData;

			expect(context.context.nonce).toBe("test");
			expect(context).toHaveProperty("input");
			expect(context).toHaveProperty("output");

			context = {
				nonce: "test2",
			};

			const result2 = await database.select().from(table).prepare("name").all({}, context);

			expect(result2).toEqual([{ int2: 1, text: null }]);

			if ("nonce" in context) expect.fail();
			context = context as PostQueryHookData;

			expect(context.context.nonce).toBe("test2");
			expect(context).toHaveProperty("input");
			expect(context).toHaveProperty("output");
		} catch (error) {
			finalError = error;
		}

		await database.execute(sql`
			drop table if exists context_test;
		`);

		await postgres.end();

		if (finalError) throw finalError;
	});
});
