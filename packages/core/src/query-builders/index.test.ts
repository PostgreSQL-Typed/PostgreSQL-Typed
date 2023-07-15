/* eslint-disable unicorn/no-null */
import { Client } from "pg";
import { describe, expect, test } from "vitest";

import { defineInt2, defineText } from "../definers/index.js";
import { pgt } from "../driver.js";
import { sql, table as pgTable } from "../index.js";

describe("query-builders", () => {
	test("insert", async () => {
		const postgres = new Client({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				application_name: "insert_test.test.ts",
			}),
			database = pgt(postgres),
			table = pgTable("insert_test", {
				int2: defineInt2("int2").notNull(),
				text: defineText("text"),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists insert_test (
				int2 int2 NOT NULL UNIQUE,
				"text" text NULL UNIQUE
			);
		`);

		let finalError;
		try {
			const result1 = await database.insert(table).values({ int2: 1 }).returning().execute();

			expect(result1).toEqual([{ int2: 1, text: null }]);

			const result2 = await database
				.insert(table)
				.values([{ int2: 2 }, { int2: 3 }])
				.returning()
				.execute();

			expect(result2).toEqual([
				{ int2: 2, text: null },
				{ int2: 3, text: null },
			]);

			expect(async () => await database.insert(table).values([]).execute()).rejects.toThrowError("values() must be called with at least one value");

			const result3 = await database.insert(table).values({ int2: 4 }).returning().execute();
			expect(result3).toEqual([{ int2: 4, text: null }]);

			expect(async () => await database.insert(table).values({ int2: 1, text: "test" }).execute()).rejects.toThrowError(
				'duplicate key value violates unique constraint "insert_test_un1"'
			);

			const result4 = await database.insert(table).values({ int2: 1, text: "test" }).onConflictDoNothing().returning().execute();
			expect(result4).toEqual([]);

			const result5 = await database.insert(table).values({ int2: 1, text: "test" }).onConflictDoNothing({ target: table.int2 }).returning().execute();
			expect(result5).toEqual([]);

			const result6 = await database
				.insert(table)
				.values({ int2: 1, text: "test" })
				.onConflictDoNothing({ target: [table.int2] })
				.returning()
				.execute();

			expect(result6).toEqual([]);

			const result7 = database
				.insert(table)
				.values({ int2: 1, text: sql`${"test"}` })
				.onConflictDoNothing({ target: table.int2, where: sql`${table.int2} < 10` })
				.returning()
				.toSQL();

			expect(result7.sql).toEqual(
				'insert into "insert_test" ("int2", "text") values ($1, $2) on conflict ("int2") do nothing where "insert_test"."int2" < 10 returning "int2", "text"'
			);

			const result8 = await database
				.insert(table)
				.values({ int2: 1, text: "test" })
				.onConflictDoUpdate({
					target: table.int2,
					set: { text: "test" },
					where: sql`${table.int2} < 10`,
				})
				.returning()
				.execute();

			expect(result8).toEqual([{ int2: 1, text: "test" }]);

			const result9 = await database
				.insert(table)
				.values({ int2: 1, text: "test" })
				.onConflictDoUpdate({
					target: [table.int2],
					set: { text: "test2" },
				})
				.returning()
				.execute();

			expect(result9).toEqual([{ int2: 1, text: "test2" }]);

			const result10 = database.insert(table).values({ int2: 5, text: "test123" }).toSQL();

			expect(result10.sql).toBe('insert into "insert_test" ("int2", "text") values ($1, $2)');

			const result11 = database.insert(table).values({ int2: 5, text: "test123" }).returning().prepare("prepare_insert_test"),
				result12 = await result11.all();

			expect(result12).toEqual([{ int2: 5, text: "test123" }]);

			const result13 = database.insert(table).values({ int2: 6, text: "test1234" }).returning().prepare("prepare_insert_test"),
				result14 = await result13.execute();

			expect(result14).toEqual([{ int2: 6, text: "test1234" }]);
		} catch (error) {
			finalError = error;
		}

		await database.execute(sql`
			drop table if exists insert_test;
		`);

		await postgres.end();

		if (finalError) throw finalError;
	});
});
