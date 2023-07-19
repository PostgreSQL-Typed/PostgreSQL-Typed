/* eslint-disable unicorn/no-null */
import { Client } from "pg";
import { describe, expect, test } from "vitest";

import { defineInt2, defineText } from "../definers/index.js";
import { pgt } from "../driver.js";
import { sql, table as pgTable } from "../index.js";
import { eq } from "../operators.js";

describe("update", () => {
	test("update()", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "update_test.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("update_test", {
				int2: defineInt2("int2").notNull(),
				text: defineText("text"),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists update_test (
				int2 int2 NOT NULL,
				"text" text NULL
			);
		`);

		let finalError;
		try {
			const result1 = await database.insert(table).values({ int2: 1 }).returning().execute();

			expect(result1).toEqual([{ int2: 1, text: null }]);

			const result2 = await database.update(table).set({ text: "test" });

			expect((result2 as { rows: unknown[] }).rows).toEqual([]);

			const result3 = await database.select().from(table).execute();

			expect(result3).toEqual([{ int2: 1, text: "test" }]);

			const result4 = await database.update(table).set({ text: "test2" }).where(eq(table.int2, 1));

			expect((result4 as { rows: unknown[] }).rows).toEqual([]);

			const result5 = await database.select().from(table).execute();

			expect(result5).toEqual([{ int2: 1, text: "test2" }]);

			const result6 = await database.update(table).set({ text: "test3" }).where(eq(table.int2, 1)).returning();

			expect(result6).toEqual([{ int2: 1, text: "test3" }]);

			const result7 = await database
				.update(table)
				.set({ text: "test4" })
				.where(eq(table.int2, 1))
				.returning({
					int2: table.int2,
				})
				.execute();

			expect(result7).toEqual([{ int2: 1 }]);

			const result8 = await database.update(table).set({ text: "test5" }).where(eq(table.int2, 1)).returning().prepare("update_test").all();

			expect(result8).toEqual([{ int2: 1, text: "test5" }]);

			const result9 = database.update(table).set({ text: "test6" }).where(eq(table.int2, 1)).returning().toSQL();

			expect(result9.sql).toEqual('update "update_test" set "text" = $1 where "update_test"."int2" = $2 returning "int2", "text"');
		} catch (error) {
			finalError = error;
		}

		await database.execute(sql`
			drop table if exists update_test;
		`);

		await postgres.end();

		if (finalError) throw finalError;
	});
});
