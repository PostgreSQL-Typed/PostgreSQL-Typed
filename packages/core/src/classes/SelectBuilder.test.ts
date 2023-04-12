import { describe, expect, expectTypeOf, test } from "vitest";

import { Client } from "../__mocks__/client";
import { type TestData, testData } from "./testData";

describe("SelectBuilder", () => {
	test("join(...)", () => {
		const table1 = new Client<TestData>(testData).table("db1.schema1.table1"),
			table2 = new Client<TestData>(testData).table("db1.schema1.table2"),
			query = table1.select
				.join(table2, {
					$ON: {
						"schema1.table2.id": "schema1.table1.id",
					},
				})
				.execute("*", {
					raw: true,
				});

		expectTypeOf(query).toEqualTypeOf<string>();
		expect(query).toBe("SELECT *\nFROM schema1.table1 t\nINNER JOIN schema1.table2 t1\nON t1.id = t.id");

		//* Make sure you can't join the same table twice
		expect(
			table1.select
				.join(table2, {
					$ON: {
						"schema1.table2.id": "schema1.table1.id",
					},
				})
				.join(table2, {
					$ON: {
						"schema1.table2.id": "schema1.table1.id",
					},
				})
				.execute("*")
		).toEqual({
			success: false,
			error: new Error("Cannot join the same table twice"),
		});

		//* Make sure you can't join from a different database
		expect(
			(() => {
				const table3 = new Client<TestData>(testData).table("db2.schema3.table4");
				return table1.select
					.join(table3 as any, {
						$ON: {
							"schema3.table4.id": "schema1.table1.id",
						},
					})
					.execute("*");
			})()
		).toEqual({
			success: false,
			error: new Error("Cannot join a table from a different database"),
		});
	});

	test("where(...)", () => {
		const table = new Client<TestData>(testData).table("db1.schema1.table1"),
			query = table.select
				.where({
					"schema1.table1.id": {
						$ILIKE: "test",
					},
				})
				.execute("*", {
					raw: true,
				});

		expectTypeOf(query).toEqualTypeOf<string>();
		expect(query).toBe("SELECT *\nFROM schema1.table1 t\nWHERE t.id ILIKE $1");
	});

	test("groupBy(...)", () => {
		const table = new Client<TestData>(testData).table("db1.schema1.table1"),
			query = table.select.groupBy("schema1.table1.id").execute("*", { raw: true });

		expectTypeOf(query).toEqualTypeOf<string>();
		expect(query).toBe("SELECT *\nFROM schema1.table1 t\nGROUP BY t.id");

		//* With multiple columns
		const table2 = new Client<TestData>(testData).table("db1.schema1.table2"),
			query2 = table.select
				.join(table2, {
					$ON: {
						"schema1.table2.id": "schema1.table1.id",
					},
				})
				.groupBy(["schema1.table1.id", "schema1.table2.id"])
				.execute("*", {
					raw: true,
				});

		expectTypeOf(query2).toEqualTypeOf<string>();
		expect(query2).toBe("SELECT *\nFROM schema1.table1 t\nINNER JOIN schema1.table2 t1\nON t1.id = t.id\nGROUP BY t.id, t1.id");
	});

	test("orderBy(...)", () => {
		const table = new Client<TestData>(testData).table("db1.schema1.table1"),
			query = table.select
				.orderBy({
					columns: {
						"schema1.table1.id": "ASC",
					},
				})
				.execute("*", {
					raw: true,
				});

		expectTypeOf(query).toEqualTypeOf<string>();
		expect(query).toBe("SELECT *\nFROM schema1.table1 t\nORDER BY t.id ASC");

		//* With multiple columns
		const table2 = new Client<TestData>(testData).table("db1.schema1.table2"),
			query2 = table.select
				.join(table2, {
					$ON: {
						"schema1.table2.id": "schema1.table1.id",
					},
				})
				.orderBy({
					columns: {
						"schema1.table1.id": "ASC",
						"schema1.table2.id": "DESC",
					},
				})
				.execute("*", {
					raw: true,
				});

		expectTypeOf(query2).toEqualTypeOf<string>();
		expect(query2).toBe("SELECT *\nFROM schema1.table1 t\nINNER JOIN schema1.table2 t1\nON t1.id = t.id\nORDER BY t.id ASC, t1.id DESC");

		//* With nulls first
		const query3 = table.select
			.orderBy({
				nulls: "NULLS FIRST",
			})
			.execute("*", {
				raw: true,
			});

		expectTypeOf(query3).toEqualTypeOf<string>();
		expect(query3).toBe("SELECT *\nFROM schema1.table1 t\nORDER BY NULLS FIRST");

		//* With nulls first with column(s)
		const query4 = table.select
			.orderBy({
				columns: {
					"schema1.table1.id": "ASC",
				},
				nulls: "NULLS FIRST",
			})
			.execute("*", {
				raw: true,
			});

		expectTypeOf(query4).toEqualTypeOf<string>();
		expect(query4).toBe("SELECT *\nFROM schema1.table1 t\nORDER BY t.id ASC NULLS FIRST");

		//* With nulls last
		const query5 = table.select
			.orderBy({
				nulls: "NULLS LAST",
			})
			.execute("*", {
				raw: true,
			});

		expectTypeOf(query5).toEqualTypeOf<string>();
		expect(query5).toBe("SELECT *\nFROM schema1.table1 t\nORDER BY NULLS LAST");

		//* With nulls last with column(s)
		const query6 = table.select
			.orderBy({
				columns: {
					"schema1.table1.id": "ASC",
				},
				nulls: "NULLS LAST",
			})
			.execute("*", {
				raw: true,
			});

		expectTypeOf(query6).toEqualTypeOf<string>();
		expect(query6).toBe("SELECT *\nFROM schema1.table1 t\nORDER BY t.id ASC NULLS LAST");
	});

	test("limit(...)", () => {
		const table = new Client<TestData>(testData).table("db1.schema1.table1"),
			query = table.select.limit(10).execute("*", {
				raw: true,
			});

		expectTypeOf(query).toEqualTypeOf<string>();
		expect(query).toBe("SELECT *\nFROM schema1.table1 t\nLIMIT 10");

		//* With offset
		const query2 = table.select.limit(10, 5).execute("*", {
			raw: true,
		});

		expectTypeOf(query2).toEqualTypeOf<string>();
		expect(query2).toBe("SELECT *\nFROM schema1.table1 t\nLIMIT 10\nOFFSET 5");
	});

	test("fetch(...)", () => {
		const table = new Client<TestData>(testData).table("db1.schema1.table1"),
			query = table.select
				.fetch({
					fetch: 10,
				})
				.execute("*", {
					raw: true,
				});

		expectTypeOf(query).toEqualTypeOf<string>();
		expect(query).toBe("SELECT *\nFROM schema1.table1 t\nFETCH FIRST 10 ROWS ONLY");

		//* With offset
		const query2 = table.select
			.fetch({
				fetch: 10,
				offset: 5,
			})
			.execute("*", {
				raw: true,
			});

		expectTypeOf(query2).toEqualTypeOf<string>();
		expect(query2).toBe("SELECT *\nFROM schema1.table1 t\nOFFSET 5 ROWS\nFETCH FIRST 10 ROWS ONLY");

		//* With NEXT
		const query3 = table.select
			.fetch({
				fetch: 10,
				offset: 5,
				type: "NEXT",
			})
			.execute("*", {
				raw: true,
			});

		expectTypeOf(query3).toEqualTypeOf<string>();
		expect(query3).toBe("SELECT *\nFROM schema1.table1 t\nOFFSET 5 ROWS\nFETCH NEXT 10 ROWS ONLY");

		//* If the value is 1 then it should be ROW instead of ROWS
		const query4 = table.select
			.fetch({
				fetch: 1,
				offset: 1,
			})
			.execute("*", {
				raw: true,
			});

		expectTypeOf(query4).toEqualTypeOf<string>();
		expect(query4).toBe("SELECT *\nFROM schema1.table1 t\nOFFSET 1 ROW\nFETCH FIRST 1 ROW ONLY");
	});

	test("execute(...)", async () => {
		const table = new Client<TestData>(testData, {
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
			}).table("db1.schema1.table1"),
			query = table.select.execute("*");

		expectTypeOf(query).not.toEqualTypeOf<string>();

		await expect(query).resolves.toEqual({
			success: false,
			error: new Error("The client is not ready yet, please make sure you ran the 'testConnection' method before querying the database."),
		});
	});
});
