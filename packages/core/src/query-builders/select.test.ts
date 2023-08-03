/* eslint-disable unicorn/no-null */
import { Client } from "pg";
import { describe, expect, test } from "vitest";

import { defineInt2, defineText } from "../definers/index.js";
import { pgt } from "../driver.js";
import { pgView, sql, table as pgTable } from "../index.js";
import { eq, gte } from "../operators.js";

describe("select", () => {
	test("select()", async () => {
		const postgres = new Client({
				application_name: "select_test.test.ts",
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			database = pgt(postgres),
			table = pgTable("select_test", {
				int2: defineInt2("int2").notNull(),
				text: defineText("text"),
			}),
			table2 = pgTable("select_test2", {
				int2: defineInt2("int2").notNull(),
				text: defineText("text"),
			}),
			view = pgView("select_test_view").as(qb => qb.select().from(table));

		await database.connect();

		await database.execute(sql`
			create table if not exists select_test (
				int2 int2 NOT NULL,
				"text" text NULL
			);
			create table if not exists select_test2 (
				int2 int2 NOT NULL,
				"text" text NULL
			);
		`);

		let finalError;
		try {
			const result1 = await database.insert(table).values({ int2: 1 }).returning().execute();

			expect(result1).toEqual([{ int2: 1, text: null }]);

			const result2 = await database.select().from(table);

			expect(result2).toEqual([{ int2: 1, text: null }]);

			const result3 = await database.select().from(table).where(eq(table.int2, 1));

			expect(result3).toEqual([{ int2: 1, text: null }]);

			const result4 = await database.select().from(table).where(eq(table.int2, 2));

			expect(result4).toEqual([]);

			const result5 = await database.select().from(table).execute();

			expect(result5).toEqual([{ int2: 1, text: null }]);

			const result6 = await database.select().from(table).where(eq(table.int2, 1)).prepare("select_test").all();

			expect(result6).toEqual([{ int2: 1, text: null }]);

			const result7 = database.select().from(table).where(eq(table.int2, 1)).toSQL();

			expect(result7.sql).toBe('select "int2", "text" from "select_test" where "select_test"."int2" = $1');

			const result8 = await database
				.select({
					int2: table.int2,
					text: table.text,
				})
				.from(table)
				.where(eq(table.int2, 1))
				.execute();

			expect(result8).toEqual([{ int2: 1, text: null }]);

			const result9 = await database
				.select({
					int2: sql`int2`,
					text: sql`text`,
				})
				.from(sql`${table}`)
				.where(eq(table.int2, 1))
				.execute();

			expect(result9).toEqual([{ int2: 1, text: null }]);

			const result10 = await database
				.select()
				.from(sql`${table}`)
				.where(eq(table.int2, 1))
				.execute();

			expect(result10).toEqual([{}]);

			const result11 = database.select().from(table).where(eq(table.int2, 1)).as("sq"),
				result12 = await database.select().from(result11).execute();

			expect(result12).toEqual([{ int2: 1, text: null }]);

			const result13 = database.$with("sq").as(database.select().from(table).where(eq(table.int2, 1))),
				result14 = await database.with(result13).select().from(result13);

			expect(result14).toEqual([{ int2: 1, text: null }]);

			const result13b = database.$with("sq").as(qb => qb.select().from(table).where(eq(table.int2, 1))),
				result14b = await database.with(result13b).select().from(result13b);

			expect(result14b).toEqual([{ int2: 1, text: null }]);

			const result13c = database.$with("sq").as(qb => qb.selectDistinct().from(table).where(eq(table.int2, 1))),
				result14c = await database.with(result13c).select().from(result13c);

			expect(result14c).toEqual([{ int2: 1, text: null }]);

			const result13d = database.$with("sq").as(qb => qb.selectDistinctOn([table.int2]).from(table).where(eq(table.int2, 1))),
				result14d = await database.with(result13d).select().from(result13d);

			expect(result14d).toEqual([{ int2: 1, text: null }]);

			// eslint-disable-next-line unicorn/prevent-abbreviations
			const result13e = database.$with("sq").as(qb => {
					const sq = qb.$with("sq2").as(qb2 => qb2.select().from(table));
					return qb.with(sq).select().from(sq);
				}),
				// eslint-disable-next-line unicorn/prevent-abbreviations
				result14e = await database.with(result13e).select().from(result13e);

			expect(result14e).toEqual([{ int2: 1, text: null }]);

			const result13f = database.$with("sq").as(qb => {
					const sq = qb.$with("sq2").as(qb2 => qb2.select().from(table));
					return qb.with(sq).selectDistinct().from(table);
				}),
				result14f = await database.with(result13f).select().from(result13f);

			expect(result14f).toEqual([{ int2: 1, text: null }]);

			const result13g = database.$with("sq").as(qb => {
					const sq = qb.$with("sq2").as(qb2 => qb2.select().from(table));
					return qb.with(sq).selectDistinctOn([table.int2]).from(table);
				}),
				result14g = await database.with(result13g).select().from(result13g);

			expect(result14g).toEqual([{ int2: 1, text: null }]);

			const result15 = await database
				.select()
				.from(table)
				.where(() => eq(table.int2, 1))
				.execute();

			expect(result15).toEqual([{ int2: 1, text: null }]);

			const result16 = await database
				.select({
					int2: table.int2,
				})
				.from(table)
				.groupBy(table.int2)
				.having(gte(sql`count(${table.int2})`, 1))
				.execute();

			expect(result16).toEqual([{ int2: 1 }]);

			const result17 = await database
				.select({
					int2: table.int2,
				})
				.from(table)
				.groupBy(() => table.int2)
				.having(() => gte(sql`count(${table.int2})`, 1))
				.execute();

			expect(result17).toEqual([{ int2: 1 }]);

			const result18 = await database
				.select({
					int2: table.int2,
				})
				.from(table)
				.groupBy(() => [table.int2])
				.having(() => gte(sql`count(${table.int2})`, 1))
				.execute();

			expect(result18).toEqual([{ int2: 1 }]);

			const result19 = await database.select().from(table).where(eq(table.int2, 1)).orderBy(table.int2).execute();

			expect(result19).toEqual([{ int2: 1, text: null }]);

			const result20 = await database
				.select()
				.from(table)
				.where(eq(table.int2, 1))
				.orderBy(() => table.int2)
				.execute();

			expect(result20).toEqual([{ int2: 1, text: null }]);

			const result21 = await database
				.select()
				.from(table)
				.where(eq(table.int2, 1))
				.orderBy(() => [table.int2])
				.limit(1)
				.execute();

			expect(result21).toEqual([{ int2: 1, text: null }]);

			const result22 = await database.select().from(table).limit(1).offset(1).execute();

			expect(result22).toEqual([]);

			const result23 = database.select().from(table).for("update").toSQL();

			expect(result23.sql).toBe('select "int2", "text" from "select_test" for update');

			const result24 = await database.insert(table2).values({ int2: 1 }).returning().execute();

			expect(result24).toEqual([{ int2: 1, text: null }]);

			const result25 = await database.select().from(table).leftJoin(table2, eq(table.int2, table2.int2)).execute();

			expect(result25).toEqual([
				{
					select_test: {
						int2: 1,
						text: null,
					},
					select_test2: {
						int2: 1,
						text: null,
					},
				},
			]);

			const result26 = await database.select().from(table).rightJoin(table2, eq(table.int2, table2.int2)).execute();

			expect(result26).toEqual([
				{
					select_test: {
						int2: 1,
						text: null,
					},
					select_test2: {
						int2: 1,
						text: null,
					},
				},
			]);

			const result27 = await database.select().from(table).fullJoin(table2, eq(table.int2, table2.int2)).execute();

			expect(result27).toEqual([
				{
					select_test: {
						int2: 1,
						text: null,
					},
					select_test2: {
						int2: 1,
						text: null,
					},
				},
			]);

			const result28 = await database.select().from(table).innerJoin(table2, eq(table.int2, table2.int2)).execute();

			expect(result28).toEqual([
				{
					select_test: {
						int2: 1,
						text: null,
					},
					select_test2: {
						int2: 1,
						text: null,
					},
				},
			]);

			expect(() => database.select().from(table).leftJoin(table2, eq(table.int2, table2.int2)).leftJoin(table2, eq(table.int2, table2.int2))).toThrowError(
				'Alias "select_test2" is already used in this query'
			);

			const result29 = await database
				.select()
				.from(table)
				.leftJoin(table2, () => eq(table.int2, table2.int2))
				.execute();

			expect(result29).toEqual([
				{
					select_test: {
						int2: 1,
						text: null,
					},
					select_test2: {
						int2: 1,
						text: null,
					},
				},
			]);

			const result30 = database.select().from(view).toSQL();

			expect(result30.sql).toBe('select "int2", "text" from "select_test_view"');

			const result31 = database.select().from(table2).leftJoin(view, eq(table2.int2, view.int2)).toSQL();

			expect(result31.sql).toBe(
				'select "select_test2"."int2", "select_test2"."text", "select_test_view"."int2", "select_test_view"."text" from "select_test2" left join "select_test_view" on "select_test2"."int2" = "select_test_view"."int2"'
			);

			const result32 = await database
				.select()
				.from(table)
				.leftJoin(database.select().from(table2).as("sq"), eq(table.int2, sql`sq.int2`));

			expect(result32).toEqual([
				{
					select_test: {
						int2: 1,
						text: null,
					},
					sq: {
						int2: 1,
						text: null,
					},
				},
			]);
		} catch (error) {
			finalError = error;
		}

		await database.execute(sql`
			drop table if exists select_test;
			drop table if exists select_test2;
		`);

		await postgres.end();

		if (finalError) throw finalError;
	});

	test("selectDistinct()", async () => {
		const postgres = new Client({
				application_name: "selectdistinct_test.test.ts",
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			database = pgt(postgres),
			table = pgTable("selectdistinct_test", {
				int2: defineInt2("int2").notNull(),
				text: defineText("text"),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists selectdistinct_test (
				int2 int2 NOT NULL,
				"text" text NULL
			);
		`);

		let finalError;
		try {
			const result1 = await database.insert(table).values({ int2: 1 }).returning().execute();

			expect(result1).toEqual([{ int2: 1, text: null }]);

			const result2 = await database.selectDistinct().from(table);

			expect(result2).toEqual([{ int2: 1, text: null }]);

			const result3 = await database.selectDistinct().from(table).where(eq(table.int2, 1));

			expect(result3).toEqual([{ int2: 1, text: null }]);
		} catch (error) {
			finalError = error;
		}

		await database.execute(sql`
			drop table if exists selectdistinct_test;
		`);

		await postgres.end();

		if (finalError) throw finalError;
	});

	test("selectDistinctOn()", async () => {
		const postgres = new Client({
				application_name: "selectdistincton_test.test.ts",
				database: "postgres",
				host: "localhost",
				password: "password",
				port: 5432,
				user: "postgres",
			}),
			database = pgt(postgres),
			table = pgTable("selectdistincton_test", {
				int2: defineInt2("int2").notNull(),
				text: defineText("text"),
			});

		await database.connect();

		await database.execute(sql`
			create table if not exists selectdistincton_test (
				int2 int2 NOT NULL,
				"text" text NULL
			);
		`);

		let finalError;
		try {
			const result1 = await database.insert(table).values({ int2: 1 }).returning().execute();

			expect(result1).toEqual([{ int2: 1, text: null }]);

			const result2 = await database.selectDistinctOn([table.int2]).from(table);

			expect(result2).toEqual([{ int2: 1, text: null }]);
		} catch (error) {
			finalError = error;
		}

		await database.execute(sql`
			drop table if exists selectdistincton_test;
		`);

		await postgres.end();

		if (finalError) throw finalError;
	});
});
