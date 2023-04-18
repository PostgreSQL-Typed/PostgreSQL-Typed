import { PGTPParserClass, UUIDConstructor } from "@postgresql-typed/parsers";
import { describe, expect, expectTypeOf, test } from "vitest";

import { Client } from "../__mocks__/client";
import { type TestData, testData } from "../__mocks__/testData";
import type { BaseClient } from "./BaseClient";
import type { Database } from "./Database";
import type { Schema } from "./Schema";
import { SelectBuilder } from "./SelectBuilder";
import type { Table } from "./Table";

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

		expectTypeOf(table.client).toEqualTypeOf<BaseClient<TestData, false>>();
		expect(table.client).toBe(client);
	});

	test("get schema()", () => {
		const schema = new Client<TestData>(testData).schema("db1.schema1"),
			table = schema.table("table1");

		expectTypeOf(table).toMatchTypeOf<Table<TestData, TestData["db1"], false, "db1.schema1", "db1.schema1.table1">>();

		expectTypeOf(table.schema).toEqualTypeOf<Schema<TestData, TestData["db1"], false, "db1.schema1">>();
		expect(table.schema).toEqual(schema);

		//* Expect the shortcut method `sch()` to work the same as `schema()`
		expectTypeOf(table.sch).toEqualTypeOf<Schema<TestData, TestData["db1"], false, "db1.schema1">>();
		expect(table.sch).toEqual(schema);
	});

	test("get database()", () => {
		const database = new Client<TestData>(testData).database("db1"),
			table = database.table("schema1.table1");

		expectTypeOf(table).toMatchTypeOf<Table<TestData, TestData["db1"], false, "db1.schema1", "db1.schema1.table1">>();

		expectTypeOf(table.database).toEqualTypeOf<Database<TestData, TestData["db1"], false>>();
		expect(table.database).toEqual(database);

		//* Expect the shortcut method `db()` to work the same as `database()`
		expectTypeOf(table.db).toEqualTypeOf<Database<TestData, TestData["db1"], false>>();
		expect(table.db).toEqual(database);
	});

	test("get primaryKey()", () => {
		const table = new Client<TestData>(testData).table("db1.schema1.table1");

		expectTypeOf(table.primaryKey).toEqualTypeOf<"id">();
		expect(table.primaryKey).toBe("id");
	});

	test("get select()", () => {
		const table = new Client<TestData>(testData).table("db1.schema1.table1");

		expectTypeOf(table.select).toEqualTypeOf<
			SelectBuilder<TestData, TestData["db1"], false, Table<TestData, TestData["db1"], false, "db1.schema1", "db1.schema1.table1">>
		>();
		expect(table.select).toBeInstanceOf(SelectBuilder);
	});

	test("get columns()", () => {
		const table = new Client<TestData>(testData).table("db1.schema1.table1");

		expectTypeOf(table.columns).toEqualTypeOf<"id"[]>();
		expect(table.columns).toEqual(["id"]);
	});

	test("getParserOfColumn(...)", () => {
		const table = new Client<TestData>(testData).table("db1.schema1.table1");

		expectTypeOf(table.getParserOfColumn("id")).toEqualTypeOf<PGTPParserClass<UUIDConstructor>>();
		expect(table.getParserOfColumn("id")).toBeInstanceOf(PGTPParserClass);

		expect(() => table.getParserOfColumn("nonexistent" as any)).toThrowError();
	});
});
