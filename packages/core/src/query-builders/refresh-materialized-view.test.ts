/* eslint-disable unicorn/filename-case */
/* eslint-disable unicorn/no-null */
import { Client } from "pg";
import { describe, expect, test } from "vitest";

import { defineInt2, defineText } from "../definers/index.js";
import { pgt } from "../driver.js";
import { pgMaterializedView, sql, table as pgTable } from "../index.js";

describe("refreshMaterializedView", () => {
	test("refreshMaterializedView()", async () => {
		const postgres = new Client({
				application_name: "refresh_materialized_view_test.test.ts",
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			database = pgt(postgres),
			table = pgTable("refresh_materialized_view_test", {
				int2: defineInt2("int2").notNull(),
				text: defineText("text"),
			}),
			materializedView = pgMaterializedView("refresh_materialized_view_test_materialized_view").as(qb => qb.select().from(table));

		await database.connect();

		await database.execute(sql`
			drop materialized view if exists refresh_materialized_view_test_materialized_view;
			drop table if exists refresh_materialized_view_test;
		`);

		await database.execute(sql`
			create table if not exists refresh_materialized_view_test (
				int2 int2 NOT NULL,
				"text" text NULL
			);
			CREATE MATERIALIZED VIEW "refresh_materialized_view_test_materialized_view" AS SELECT * FROM "refresh_materialized_view_test";
		`);

		let finalError;
		try {
			const result1 = await database.insert(table).values({ int2: 1 }).returning().execute();

			expect(result1).toEqual([{ int2: 1, text: null }]);

			const result2 = await database.refreshMaterializedView(materializedView);

			expect((result2 as { rows: unknown[] }).rows).toEqual([]);

			const result3 = await database.refreshMaterializedView(materializedView).withNoData();

			expect((result3 as { rows: unknown[] }).rows).toEqual([]);

			const result4 = database.refreshMaterializedView(materializedView).concurrently().toSQL();

			expect(result4.sql).toBe('refresh materialized view concurrently "refresh_materialized_view_test_materialized_view"');

			const result5 = await database.refreshMaterializedView(materializedView).prepare("test").all();

			expect(result5).toEqual([]);

			expect(() => database.refreshMaterializedView(materializedView).withNoData().concurrently()).toThrowError(
				"Cannot use concurrently and withNoData together"
			);
			expect(() => database.refreshMaterializedView(materializedView).concurrently().withNoData()).toThrowError(
				"Cannot use concurrently and withNoData together"
			);
		} catch (error) {
			finalError = error;
		}

		await database.execute(sql`
			drop materialized view if exists refresh_materialized_view_test_materialized_view;
			drop table if exists refresh_materialized_view_test;
		`);

		await postgres.end();

		if (finalError) throw finalError;
	});
});
