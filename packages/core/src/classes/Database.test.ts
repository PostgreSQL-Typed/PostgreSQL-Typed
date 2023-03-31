import { describe, expect, expectTypeOf, test } from "vitest";

import { Client } from "./Client";
import { Database } from "./Database";
import { Schema } from "./Schema";
import { Table } from "./Table";
import { TestData, testData } from "./testData";

describe("Database", () => {
	test("get name()", () => {
		const database = new Client<TestData>(testData).database("db1");

		expectTypeOf(database.name).toEqualTypeOf<"db1">();
		expect(database.name).toBe("db1");
	});

	test("get client()", () => {
		const client = new Client<TestData>(testData),
			database = client.database("db1");

		expectTypeOf(database).toMatchTypeOf<Database<TestData, TestData["db1"], false>>();

		expectTypeOf(database.client).toEqualTypeOf<Client<TestData, false>>();
		expect(database.client).toBe(client);
	});

	test("get schemaNames()", () => {
		const database = new Client<TestData>(testData).database("db1");

		expectTypeOf(database.schemaNames).toEqualTypeOf<("schema1" | "schema2")[]>();
		expect(database.schemaNames).toEqual(["schema1", "schema2"]);
	});

	test("schema(...)", () => {
		const database = new Client<TestData>(testData).database("db1");

		expectTypeOf(database.schema).toBeFunction();
		expectTypeOf(database.schema).parameter(0).toEqualTypeOf<"schema1" | "schema2">();
		expectTypeOf(database.schema("schema1")).toMatchTypeOf<Schema<TestData, TestData["db1"], false, "db1.schema1">>();
		expectTypeOf(database.schema("schema2")).toMatchTypeOf<Schema<TestData, TestData["db1"], false, "db1.schema2">>();

		// Should throw an error if the schema name is not valid
		// @ts-expect-error - Should throw an error
		expect(() => database.schema("schema3")).toThrowError();
	});

	test("get schemas()", () => {
		const database = new Client<TestData>(testData).database("db1");

		expectTypeOf(database.schemas).toEqualTypeOf<{
			schema1: Schema<TestData, TestData["db1"], false, "db1.schema1">;
			schema2: Schema<TestData, TestData["db1"], false, "db1.schema2">;
		}>();

		expect(database.schemas).toEqual({
			schema1: database.schema("schema1"),
			schema2: database.schema("schema2"),
		});
	});

	test("get tableLocations()", () => {
		const database = new Client<TestData>(testData).database("db1");

		expectTypeOf(database.tableLocations).toEqualTypeOf<("schema1.table1" | "schema1.table2" | "schema2.table3")[]>();
		expect(database.tableLocations).toEqual(["schema1.table1", "schema1.table2", "schema2.table3"]);
	});

	test("table(...)", () => {
		const database = new Client<TestData>(testData).database("db1");

		expectTypeOf(database.table).toBeFunction();
		expectTypeOf(database.table).parameter(0).toEqualTypeOf<"schema1.table1" | "schema1.table2" | "schema2.table3">();
		expectTypeOf(database.table("schema1.table1")).toMatchTypeOf<Table<TestData, TestData["db1"], false, "db1.schema1", "db1.schema1.table1">>();
		expectTypeOf(database.table("schema1.table2")).toMatchTypeOf<Table<TestData, TestData["db1"], false, "db1.schema1", "db1.schema1.table2">>();
		expectTypeOf(database.table("schema2.table3")).toMatchTypeOf<Table<TestData, TestData["db1"], false, "db1.schema2", "db1.schema2.table3">>();

		// Should throw an error if the table location is not valid
		// @ts-expect-error - Should throw an error
		expect(() => database.table("schema1.table3")).toThrowError();
	});

	test("get tables()", () => {
		const database = new Client<TestData>(testData).database("db1");

		expectTypeOf(database.tables).toEqualTypeOf<{
			schema1: {
				table1: Table<TestData, TestData["db1"], false, "db1.schema1", "db1.schema1.table1">;
				table2: Table<TestData, TestData["db1"], false, "db1.schema1", "db1.schema1.table2">;
			};
			schema2: {
				table3: Table<TestData, TestData["db1"], false, "db1.schema2", "db1.schema2.table3">;
			};
		}>();

		expect(database.tables).toEqual({
			schema1: {
				table1: database.table("schema1.table1"),
				table2: database.table("schema1.table2"),
			},
			schema2: {
				table3: database.table("schema2.table3"),
			},
		});
	});
});
