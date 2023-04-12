import { describe, expect, expectTypeOf, test } from "vitest";

import { Client } from "../__mocks__/client";
import type { BaseClient } from "./BaseClient";
import type { Database } from "./Database";
import type { Schema } from "./Schema";
import type { Table } from "./Table";
import { type TestData, testData } from "./testData";

describe("Schema", () => {
	test("get name()", () => {
		const schema = new Client<TestData>(testData).schema("db1.schema1");

		expectTypeOf(schema.name).toEqualTypeOf<"schema1">();
		expect(schema.name).toBe("schema1");
	});

	test("get location()", () => {
		const schema = new Client<TestData>(testData).schema("db1.schema1");

		expectTypeOf(schema.location).toEqualTypeOf<"db1.schema1">();
		expect(schema.location).toBe("db1.schema1");
	});

	test("get client()", () => {
		const client = new Client<TestData>(testData),
			schema = client.schema("db1.schema1");

		expectTypeOf(schema).toMatchTypeOf<Schema<TestData, TestData["db1"], false, "db1.schema1">>();

		expectTypeOf(schema.client).toEqualTypeOf<BaseClient<TestData, false>>();
		expect(schema.client).toBe(client);
	});

	test("get database()", () => {
		const database = new Client<TestData>(testData).database("db1"),
			schema = database.schema("schema1");

		expectTypeOf(schema).toMatchTypeOf<Schema<TestData, TestData["db1"], false, "db1.schema1">>();

		expectTypeOf(schema.database).toEqualTypeOf<Database<TestData, TestData["db1"], false>>();
		expect(schema.database).toEqual(database);

		//* Expect the shortcut method `db()` to work the same as `database()`
		expectTypeOf(schema.db).toEqualTypeOf<Database<TestData, TestData["db1"], false>>();
		expect(schema.db).toEqual(database);
	});

	test("get tableNames()", () => {
		const schema = new Client<TestData>(testData).schema("db1.schema1");

		expectTypeOf(schema.tableNames).toEqualTypeOf<("table1" | "table2")[]>();
		expect(schema.tableNames).toEqual(["table1", "table2"]);
	});

	test("table(...)", () => {
		const schema = new Client<TestData>(testData).schema("db1.schema1");

		expectTypeOf(schema.table).toBeFunction();
		expectTypeOf(schema.table).parameter(0).toEqualTypeOf<"table1" | "table2">();
		expectTypeOf(schema.table("table1")).toMatchTypeOf<Table<TestData, TestData["db1"], false, "db1.schema1", "db1.schema1.table1">>();
		expectTypeOf(schema.table("table2")).toMatchTypeOf<Table<TestData, TestData["db1"], false, "db1.schema1", "db1.schema1.table2">>();

		// Should throw an error if the table name is not valid
		// @ts-expect-error - Should throw an error
		expect(() => schema.table("table3")).toThrowError();

		//* Expect the shortcut method `tbl(...)` to work the same as `table(...)`
		expectTypeOf(schema.tbl).toBeFunction();
		expectTypeOf(schema.tbl).parameter(0).toEqualTypeOf<"table1" | "table2">();
		expectTypeOf(schema.tbl("table1")).toMatchTypeOf<Table<TestData, TestData["db1"], false, "db1.schema1", "db1.schema1.table1">>();
		expectTypeOf(schema.tbl("table2")).toMatchTypeOf<Table<TestData, TestData["db1"], false, "db1.schema1", "db1.schema1.table2">>();

		// Should throw an error if the table name is not valid
		// @ts-expect-error - Should throw an error
		expect(() => schema.tbl("table3")).toThrowError();
	});

	test("get tables()", () => {
		const schema = new Client<TestData>(testData).schema("db1.schema1");

		expectTypeOf(schema.tables).toEqualTypeOf<{
			table1: Table<TestData, TestData["db1"], false, "db1.schema1", "db1.schema1.table1">;
			table2: Table<TestData, TestData["db1"], false, "db1.schema1", "db1.schema1.table2">;
		}>();
		expect(schema.tables).toEqual({
			table1: schema.table("table1"),
			table2: schema.table("table2"),
		});
	});
});
