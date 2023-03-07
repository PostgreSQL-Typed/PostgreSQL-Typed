import { describe, expect, expectTypeOf, test } from "vitest";

import { Client } from "./Client";
import type { Database } from "./Database";
import { QueryBuilder } from "./QueryBuilder";
import type { Schema } from "./Schema";
import type { Table } from "./Table";
import { type TestData, testData } from "./testData";

describe("Table", () => {
	test("get name()", () => {
		const table = new Client<TestData>(testData).table("db1.schema1.table1");

		expectTypeOf(table.name).toEqualTypeOf<"table1">();
		expect(table.name).toBe("table1");
	});

	test("get location()", () => {
		const table = new Client<TestData>(testData).table("db1.schema1.table1");

		expectTypeOf(table.location).toEqualTypeOf<"db1.schema1.table1">();
		expect(table.location).toBe("db1.schema1.table1");
	});

	test("get client()", () => {
		const client = new Client<TestData>(testData),
			table = client.table("db1.schema1.table1");

		expectTypeOf(table).toMatchTypeOf<Table<TestData, TestData["db1"], false, "db1.schema1", "db1.schema1.table1">>();

		expectTypeOf(table.client).toEqualTypeOf<Client<TestData, false>>();
		expect(table.client).toBe(client);
	});

	test("get schema()", () => {
		const schema = new Client<TestData>(testData).schema("db1.schema1"),
			table = schema.table("table1");

		expectTypeOf(table).toMatchTypeOf<Table<TestData, TestData["db1"], false, "db1.schema1", "db1.schema1.table1">>();

		expectTypeOf(table.schema).toEqualTypeOf<Schema<TestData, TestData["db1"], false, "db1.schema1">>();
		expect(table.schema).toEqual(schema);
	});

	test("get database()", () => {
		const database = new Client<TestData>(testData).database("db1"),
			table = database.table("schema1.table1");

		expectTypeOf(table).toMatchTypeOf<Table<TestData, TestData["db1"], false, "db1.schema1", "db1.schema1.table1">>();

		expectTypeOf(table.database).toEqualTypeOf<Database<TestData, TestData["db1"], false>>();
		expect(table.database).toEqual(database);
	});

	test("get primaryKey()", () => {
		const table = new Client<TestData>(testData).table("db1.schema1.table1");

		expectTypeOf(table.primaryKey).toEqualTypeOf<"id">();
		expect(table.primaryKey).toBe("id");
	});

	test("get query()", () => {
		const table = new Client<TestData>(testData).table("db1.schema1.table1");

		expectTypeOf(table.query).toEqualTypeOf<
			QueryBuilder<TestData, TestData["db1"], false, Table<TestData, TestData["db1"], false, "db1.schema1", "db1.schema1.table1">>
		>();
		expect(table.query).toBeInstanceOf(QueryBuilder);
	});
});
