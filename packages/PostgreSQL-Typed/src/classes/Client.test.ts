import postgres from "postgres";
import { describe, expect, expectTypeOf, test } from "vitest";

import { isReady } from "../functions/isReady";
import { Client } from "./Client";
import type { Database } from "./Database";
import type { Schema } from "./Schema";
import type { Table } from "./Table";
import { type TestData, testData } from "./testData";

describe("Client", () => {
	test("Client<..., false>.testConnection()", async () => {
		let client: Client<TestData, false> | Client<TestData, true> = new Client<TestData>(testData);

		expect(client).toBeInstanceOf(Client);
		expect(client.ready).toBe(false);

		client = await client.testConnection();

		expect(client.ready).toBe(false);
		expect(client.connectionError).toBeInstanceOf(Error);

		expect(isReady(client)).toBe(false);
		if (isReady(client)) expect.fail("Client should not be ready");

		expectTypeOf(client).toEqualTypeOf<Client<TestData, false>>();
	});

	test("Client<..., true>.testConnection()", async () => {
		let client: Client<TestData, false> | Client<TestData, true> = new Client<TestData>(testData, {
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
		});

		client = await client.testConnection();

		expect(client.ready).toBe(true);
		expect(client.connectionError).toBe(undefined);

		expect(isReady(client)).toBe(true);
		if (!isReady(client)) expect.fail("Client should be ready");

		expectTypeOf(client).toEqualTypeOf<Client<TestData, true>>();
	});

	test("Client<..., boolean>.testConnection(...)", async () => {
		let client: Client<TestData, false> | Client<TestData, true> = new Client<TestData>(testData);

		client = await client.testConnection();

		expect(client.ready).toBe(false);
		expect(client.connectionError).toBeInstanceOf(Error);

		expect(isReady(client)).toBe(false);
		if (isReady(client)) expect.fail("Client should not be ready");

		expectTypeOf(client).toEqualTypeOf<Client<TestData, false>>();

		client = await client.testConnection({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
		});

		expect(client.ready).toBe(true);
		expect(client.connectionError).toBe(undefined);

		expect(isReady(client)).toBe(true);
		if (!isReady(client)) expect.fail("Client should be ready");

		expectTypeOf(client).toEqualTypeOf<Client<TestData, true>>();
	});

	test("get databaseNames()", () => {
		const client = new Client<TestData>(testData);

		expect(client.databaseNames).toEqual(["db1", "db2"]);
		expectTypeOf(client.databaseNames).toEqualTypeOf<("db1" | "db2")[]>();
	});

	test("database(...)", () => {
		const client = new Client<TestData>(testData);

		expectTypeOf(client.database).toBeFunction();
		expectTypeOf(client.database).parameter(0).toEqualTypeOf<"db1" | "db2">();
		expectTypeOf(client.database("db1")).toMatchTypeOf<Database<TestData, TestData["db1"], false>>();
		expectTypeOf(client.database("db2")).toMatchTypeOf<Database<TestData, TestData["db2"], false>>();

		// Should throw an error if the database name is not valid
		// @ts-expect-error - Should throw an error
		expect(() => client.database("db3")).toThrowError();
	});

	test("get databases()", () => {
		const client = new Client<TestData>(testData);

		expectTypeOf(client.databases).toEqualTypeOf<{
			db1: Database<TestData, TestData["db1"], false>;
			db2: Database<TestData, TestData["db2"], false>;
		}>();

		expect(client.databases).toEqual({
			db1: client.database("db1"),
			db2: client.database("db2"),
		});
	});

	test("get schemaLocations()", () => {
		const client = new Client<TestData>(testData);

		expect(client.schemaLocations).toEqual(["db1.schema1", "db1.schema2", "db2.schema3"]);
		expectTypeOf(client.schemaLocations).toEqualTypeOf<("db1.schema1" | "db1.schema2" | "db2.schema3")[]>();
	});

	test("schema(...)", () => {
		const client = new Client<TestData>(testData);

		expectTypeOf(client.schema).toBeFunction();
		expectTypeOf(client.schema).parameter(0).toEqualTypeOf<"db1.schema1" | "db1.schema2" | "db2.schema3">();
		expectTypeOf(client.schema("db1.schema1")).toMatchTypeOf<Schema<TestData, TestData["db1"], false, "db1.schema1">>();
		expectTypeOf(client.schema("db1.schema2")).toMatchTypeOf<Schema<TestData, TestData["db1"], false, "db1.schema2">>();
		expectTypeOf(client.schema("db2.schema3")).toMatchTypeOf<Schema<TestData, TestData["db2"], false, "db2.schema3">>();

		// Should throw an error if the schema location is not valid
		// @ts-expect-error - Should throw an error
		expect(() => client.schema("db1.schema3")).toThrowError();
	});

	test("get schemas()", () => {
		const client = new Client<TestData>(testData);

		expectTypeOf(client.schemas).toEqualTypeOf<{
			db1: {
				schema1: Schema<TestData, TestData["db1"], false, "db1.schema1">;
				schema2: Schema<TestData, TestData["db1"], false, "db1.schema2">;
			};
			db2: {
				schema3: Schema<TestData, TestData["db2"], false, "db2.schema3">;
			};
		}>();

		expect(client.schemas).toEqual({
			db1: {
				schema1: client.schema("db1.schema1"),
				schema2: client.schema("db1.schema2"),
			},
			db2: {
				schema3: client.schema("db2.schema3"),
			},
		});
	});

	test("get tableLocations()", () => {
		const client = new Client<TestData>(testData);

		expect(client.tableLocations).toEqual(["db1.schema1.table1", "db1.schema1.table2", "db1.schema2.table3", "db2.schema3.table4", "db2.schema3.table5"]);
		// eslint-disable-next-line func-call-spacing
		expectTypeOf(client.tableLocations).toEqualTypeOf<
			("db1.schema1.table1" | "db1.schema1.table2" | "db1.schema2.table3" | "db2.schema3.table4" | "db2.schema3.table5")[]
		>();
	});

	test("table(...)", () => {
		const client = new Client<TestData>(testData);

		expectTypeOf(client.table).toBeFunction();
		expectTypeOf(client.table)
			.parameter(0)
			.toEqualTypeOf<"db1.schema1.table1" | "db1.schema1.table2" | "db1.schema2.table3" | "db2.schema3.table4" | "db2.schema3.table5">();
		expectTypeOf(client.table("db1.schema1.table1")).toMatchTypeOf<Table<TestData, TestData["db1"], false, "db1.schema1", "db1.schema1.table1">>();
		expectTypeOf(client.table("db1.schema1.table2")).toMatchTypeOf<Table<TestData, TestData["db1"], false, "db1.schema1", "db1.schema1.table2">>();
		expectTypeOf(client.table("db1.schema2.table3")).toMatchTypeOf<Table<TestData, TestData["db1"], false, "db1.schema2", "db1.schema2.table3">>();
		expectTypeOf(client.table("db2.schema3.table4")).toMatchTypeOf<Table<TestData, TestData["db2"], false, "db2.schema3", "db2.schema3.table4">>();
		expectTypeOf(client.table("db2.schema3.table5")).toMatchTypeOf<Table<TestData, TestData["db2"], false, "db2.schema3", "db2.schema3.table5">>();

		// Should throw an error if the table location is not valid
		// @ts-expect-error - Should throw an error
		expect(() => client.table("db1.schema1.table3")).toThrowError();
	});

	test("get tables()", () => {
		const client = new Client<TestData>(testData);

		expectTypeOf(client.tables).toEqualTypeOf<{
			db1: {
				schema1: {
					table1: Table<TestData, TestData["db1"], false, "db1.schema1", "db1.schema1.table1">;
					table2: Table<TestData, TestData["db1"], false, "db1.schema1", "db1.schema1.table2">;
				};
				schema2: {
					table3: Table<TestData, TestData["db1"], false, "db1.schema2", "db1.schema2.table3">;
				};
			};
			db2: {
				schema3: {
					table4: Table<TestData, TestData["db2"], false, "db2.schema3", "db2.schema3.table4">;
					table5: Table<TestData, TestData["db2"], false, "db2.schema3", "db2.schema3.table5">;
				};
			};
		}>();

		expect(client.tables).toEqual({
			db1: {
				schema1: {
					table1: client.table("db1.schema1.table1"),
					table2: client.table("db1.schema1.table2"),
				},
				schema2: {
					table3: client.table("db1.schema2.table3"),
				},
			},
			db2: {
				schema3: {
					table4: client.table("db2.schema3.table4"),
					table5: client.table("db2.schema3.table5"),
				},
			},
		});
	});

	test("get client()", () => {
		const client = new Client<TestData>(testData);

		expectTypeOf(client.client).toEqualTypeOf<postgres.Sql>();

		expect(client.client).toBeDefined;
	});
});
