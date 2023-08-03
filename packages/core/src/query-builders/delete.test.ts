/* eslint-disable unicorn/no-null */
import { Client } from "pg";
import { describe, expect, test } from "vitest";

import { defineInt2, defineText } from "../definers/index.js";
import { pgt } from "../driver.js";
import { sql, table as pgTable } from "../index.js";
import { eq } from "../operators.js";

describe("delete", () => {
	test("delete()", async () => {
		const postgres = new Client({
				application_name: "delete_test.test.ts",
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			database = pgt(postgres),
			table = pgTable("delete_test", {
				int2: defineInt2("int2").notNull(),
				text: defineText("text"),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists delete_test (
				int2 int2 NOT NULL,
				"text" text NULL
			);
		`);

		let finalError;
		try {
			const result1 = await database.insert(table).values({ int2: 1 }).returning().execute();

			expect(result1).toEqual([{ int2: 1, text: null }]);

			const result2 = await database.delete(table);

			expect((result2 as { rows: unknown[] }).rows).toEqual([]);

			const result3 = await database.select().from(table).execute();

			expect(result3).toEqual([]);

			const result4 = await database.insert(table).values({ int2: 1 }).returning().execute();

			expect(result4).toEqual([{ int2: 1, text: null }]);

			const result5 = await database.delete(table).where(eq(table.int2, 1));

			expect((result5 as { rows: unknown[] }).rows).toEqual([]);

			const result6 = await database.select().from(table).execute();

			expect(result6).toEqual([]);

			const result7 = await database.insert(table).values({ int2: 1 }).returning().execute();

			expect(result7).toEqual([{ int2: 1, text: null }]);

			const result8 = await database.delete(table).where(eq(table.int2, 1)).returning();

			expect(result8).toEqual([{ int2: 1, text: null }]);

			const result9 = await database.select().from(table).execute();

			expect(result9).toEqual([]);

			const result10 = await database.insert(table).values({ int2: 1 }).returning().execute();

			expect(result10).toEqual([{ int2: 1, text: null }]);

			const result11 = await database
				.delete(table)
				.where(eq(table.int2, 1))
				.returning({
					int2: table.int2,
				})
				.execute();

			expect(result11).toEqual([{ int2: 1 }]);

			const result12 = await database.select().from(table).execute();

			expect(result12).toEqual([]);

			const result13 = await database.insert(table).values({ int2: 1 }).returning().execute();

			expect(result13).toEqual([{ int2: 1, text: null }]);

			const result14 = await database.delete(table).where(eq(table.int2, 1)).returning().prepare("delete_test").all();

			expect(result14).toEqual([{ int2: 1, text: null }]);

			const result15 = await database.select().from(table).execute();

			expect(result15).toEqual([]);

			const result16 = database.delete(table).where(eq(table.int2, 1)).returning().toSQL();

			expect(result16.sql).toBe('delete from "delete_test" where "delete_test"."int2" = $1 returning "int2", "text"');
		} catch (error) {
			finalError = error;
		}

		await database.execute(sql`
			drop table if exists delete_test;
		`);

		await postgres.end();

		if (finalError) throw finalError;
	});
});
