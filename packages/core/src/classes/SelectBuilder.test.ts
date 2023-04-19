import { CharacterVarying, UUID } from "@postgresql-typed/parsers";
import { describe, expect, test } from "vitest";

import { Client } from "../__mocks__/client";
import {
	clearTableQueryDatabase2,
	createSchemaQueryDatabase1,
	createSchemaQueryDatabase2,
	createTableQueryDatabase1,
	createTableQueryDatabase2,
	dropSchemaQueryDatabase1,
	dropSchemaQueryDatabase2,
	insertQueryDatabase2,
	type TestData,
	testData,
} from "../__mocks__/testData";
import { isReady } from "../functions/isReady";

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

		expect(query).toEqual({ success: true, data: "SELECT *\nFROM schema1.table1 t\nINNER JOIN schema1.table2 t1\nON t1.id = t.id" });

		//* Make sure the table is an instance of Table
		expect(
			table1.select
				.join("foo" as any, {
					$ON: {
						"schema1.table2.id": "schema1.table1.id",
					},
				})
				.execute("*")
		).toEqual({
			success: false,
			error: new Error("Expected a class extending the 'Table' class"),
		});

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

		expect(query).toEqual({ success: true, data: "SELECT *\nFROM schema1.table1 t\nWHERE t.id ILIKE $1" });

		//* An invalid where clause
		const query2 = table.select
			.where({
				"schema1.table1.id": true as any,
			})
			.execute("*", {
				raw: true,
			});

		expect(query2.success).toBe(false);
	});

	test("groupBy(...)", () => {
		const table = new Client<TestData>(testData).table("db1.schema1.table1"),
			query = table.select.groupBy("schema1.table1.id").execute("*", { raw: true });

		expect(query).toEqual({ success: true, data: "SELECT *\nFROM schema1.table1 t\nGROUP BY t.id" });

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

		expect(query2).toEqual({ success: true, data: "SELECT *\nFROM schema1.table1 t\nINNER JOIN schema1.table2 t1\nON t1.id = t.id\nGROUP BY t.id, t1.id" });

		//* An invalid groupBy clause
		const query3 = table.select.groupBy(true as any).execute("*", { raw: true });

		expect(query3.success).toBe(false);
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

		expect(query).toEqual({ success: true, data: "SELECT *\nFROM schema1.table1 t\nORDER BY t.id ASC" });

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

		expect(query2).toEqual({
			success: true,
			data: "SELECT *\nFROM schema1.table1 t\nINNER JOIN schema1.table2 t1\nON t1.id = t.id\nORDER BY t.id ASC, t1.id DESC",
		});

		//* With nulls first
		const query3 = table.select
			.orderBy({
				nulls: "NULLS FIRST",
			})
			.execute("*", {
				raw: true,
			});

		expect(query3).toEqual({ success: true, data: "SELECT *\nFROM schema1.table1 t\nORDER BY NULLS FIRST" });

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

		expect(query4).toEqual({ success: true, data: "SELECT *\nFROM schema1.table1 t\nORDER BY t.id ASC NULLS FIRST" });

		//* With nulls last
		const query5 = table.select
			.orderBy({
				nulls: "NULLS LAST",
			})
			.execute("*", {
				raw: true,
			});

		expect(query5).toEqual({ success: true, data: "SELECT *\nFROM schema1.table1 t\nORDER BY NULLS LAST" });

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

		expect(query6).toEqual({ success: true, data: "SELECT *\nFROM schema1.table1 t\nORDER BY t.id ASC NULLS LAST" });

		//* An invalid orderBy clause
		const query7 = table.select.orderBy(true as any).execute("*", { raw: true });

		expect(query7.success).toBe(false);
	});

	test("limit(...)", () => {
		const table = new Client<TestData>(testData).table("db1.schema1.table1"),
			query = table.select.limit(10).execute("*", {
				raw: true,
			});

		expect(query).toEqual({ success: true, data: "SELECT *\nFROM schema1.table1 t\nLIMIT 10" });

		//* With offset
		const query2 = table.select.limit(10, 5).execute("*", {
			raw: true,
		});

		expect(query2).toEqual({ success: true, data: "SELECT *\nFROM schema1.table1 t\nLIMIT 10\nOFFSET 5" });

		//* An invalid limit clause
		const query3 = table.select.limit(true as any).execute("*", { raw: true });

		expect(query3.success).toBe(false);
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

		expect(query).toEqual({ success: true, data: "SELECT *\nFROM schema1.table1 t\nFETCH FIRST 10 ROWS ONLY" });

		//* With offset
		const query2 = table.select
			.fetch({
				fetch: 10,
				offset: 5,
			})
			.execute("*", {
				raw: true,
			});

		expect(query2).toEqual({ success: true, data: "SELECT *\nFROM schema1.table1 t\nOFFSET 5 ROWS\nFETCH FIRST 10 ROWS ONLY" });

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

		expect(query3).toEqual({ success: true, data: "SELECT *\nFROM schema1.table1 t\nOFFSET 5 ROWS\nFETCH NEXT 10 ROWS ONLY" });

		//* If the value is 1 then it should be ROW instead of ROWS
		const query4 = table.select
			.fetch({
				fetch: 1,
				offset: 1,
			})
			.execute("*", {
				raw: true,
			});

		expect(query4).toEqual({ success: true, data: "SELECT *\nFROM schema1.table1 t\nOFFSET 1 ROW\nFETCH FIRST 1 ROW ONLY" });

		//* An invalid fetch clause
		const query5 = table.select.fetch(true as any).execute("*", { raw: true });

		expect(query5.success).toBe(false);
	});

	test("execute(...)", async () => {
		let client: Client<TestData, boolean> = new Client<TestData>(testData, {
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
		});
		const table = client.table("db1.schema1.table1"),
			query = table.select.execute("*");

		await expect(query).resolves.toEqual({
			success: false,
			error: new Error("The client is not ready yet, please make sure you ran the 'testConnection' method before querying the database."),
		});

		client = await client.testConnection();
		if (!isReady(client)) expect.fail();

		try {
			const schemaCreation = await client.safeQuery(createSchemaQueryDatabase1);
			expect(schemaCreation.success).toBe(true);

			const tableCreation = await client.safeQuery(createTableQueryDatabase1);
			expect(tableCreation.success).toBe(true);

			const query2 = table.select.execute("*");

			await expect(query2).resolves.toEqual({
				success: true,
				data: {
					command: "SELECT",
					input: {
						query: "SELECT *\nFROM schema1.table1 t",
						values: [],
					},
					rowCount: 0,
					rows: [],
				},
			});

			await client.safeQuery(dropSchemaQueryDatabase1);
		} catch (error) {
			await client.safeQuery(dropSchemaQueryDatabase1);
			throw error;
		}

		try {
			const schemaCreation = await client.safeQuery(createSchemaQueryDatabase2);
			expect(schemaCreation.success).toBe(true);

			const tableCreation = await client.safeQuery(createTableQueryDatabase2);
			expect(tableCreation.success).toBe(true);

			const clearTable = await client.safeQuery(clearTableQueryDatabase2);
			expect(clearTable.success).toBe(true);

			const tableInsertion = await client.safeQuery(insertQueryDatabase2, ["5696cdd5-2c60-4964-8b95-3fd1c97e7592", "c9edf3fd-aaa6-4d43-a602-efad6a03ef17"]);
			expect(tableInsertion.success).toBe(true);

			const query2 = client.table("db2.schema3.table5").select.execute("*"),
				response = await query2;

			expect(response.success).toBe(true);
			if (!response.success) expect.fail();
			expect(response.data.command).toBe("SELECT");
			expect(response.data.rowCount).toBe(1);
			expect(response.data.input).toEqual({
				query: "SELECT *\nFROM schema3.table5 t",
				values: [],
			});

			const { id, not_uuid } = response.data.rows[0];
			expect(UUID.isUUID(id)).toBe(true);
			expect(UUID.isUUID(not_uuid)).toBe(false);

			const varchar = CharacterVarying.setN(36);
			expect(varchar.isAnyCharacterVarying(id)).toBe(false);
			expect(varchar.isCharacterVarying(id)).toBe(false);
			expect(varchar.isAnyCharacterVarying(not_uuid)).toBe(true);
			expect(varchar.isCharacterVarying(not_uuid)).toBe(true);

			const query3 = client
					.table("db2.schema3.table5")
					.select.where({
						"schema3.table5.id": {
							$EQUAL: "5696cdd5-2c60-4964-8b95-3fd1c97e7592",
						},
					})
					.execute("schema3.table5.id"),
				response2 = await query3;
			expect(response2.success).toBe(true);
			if (!response2.success) expect.fail();
			expect(response2.data.input.query).toBe("SELECT t.id\nFROM schema3.table5 t\nWHERE t.id = $1");

			const query4 = client
					.table("db2.schema3.table5")
					.select.where({
						"schema3.table5.not_uuid": {
							$LIKE: "c9edf3fd-aaa6-4d43-a602-efad6a03ef17",
						},
					})
					.execute("schema3.table5.id"),
				response3 = await query4;
			expect(response3.success).toBe(true);
			if (!response3.success) expect.fail();
			expect(response3.data.input.query).toBe("SELECT t.id\nFROM schema3.table5 t\nWHERE t.not_uuid LIKE $1");

			const query5 = client.table("db2.schema3.table4").select.join(client.table("db2.schema3.table5"), {
					$ON: {
						"schema3.table5.id": {
							$EQUAL: "5696cdd5-2c60-4964-8b95-3fd1c97e7592",
						},
					},
				}),
				response4 = await query5.execute("*");
			expect(response4.success).toBe(true);
			if (!response4.success) expect.fail();
			expect(response4.data.input.query).toBe("SELECT *\nFROM schema3.table4 t\nINNER JOIN schema3.table5 t1\nON t1.id = $1");

			const query6 = client.table("db2.schema3.table4").select.join(client.table("db2.schema3.table5"), {
					$ON: {
						"schema3.table5.not_uuid": {
							$LIKE: "c9edf3fd-aaa6-4d43-a602-efad6a03ef17",
						},
					},
				}),
				response5 = await query6.execute("*");
			expect(response5.success).toBe(true);
			if (!response5.success) expect.fail();

			expect(response5.data.input.query).toBe("SELECT *\nFROM schema3.table4 t\nINNER JOIN schema3.table5 t1\nON t1.not_uuid LIKE $1");

			await client.safeQuery(dropSchemaQueryDatabase2);
		} catch (error) {
			await client.safeQuery(dropSchemaQueryDatabase2);
			throw error;
		}

		expect(client.table("db2.schema3.table5").select.execute("*", 1 as any)).toEqual({
			success: false,
			error: new Error("Expected 'object' | 'undefined', received 'number'"),
		});

		expect(client.table("db2.schema3.table5").select.execute("*", {})).toEqual({
			success: false,
			error: new Error("Missing keys in object: 'raw', 'valuesOnly', 'subquery'"),
		});

		expect(client.table("db2.schema3.table5").select.execute("*", { foo: 1 } as any)).toEqual({
			success: false,
			error: new Error("Unrecognized key in object: 'foo'"),
		});

		expect(client.table("db2.schema3.table5").select.execute("*", { raw: 1 } as any)).toEqual({
			success: false,
			error: new Error("Expected 'boolean' | 'undefined' for key 'raw', received 'number'"),
		});
	});

	test("execute(..., { valuesOnly: true })", async () => {
		const client = await new Client<TestData>(testData, {
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
		}).testConnection();

		if (!isReady(client)) expect.fail();

		try {
			const schemaCreation = await client.safeQuery(createSchemaQueryDatabase2);
			expect(schemaCreation.success).toBe(true);

			const tableCreation = await client.safeQuery(createTableQueryDatabase2);
			expect(tableCreation.success).toBe(true);

			const tableInsertion = await client.safeQuery(insertQueryDatabase2, ["b8d0b5c0-5f9a-11eb-ae93-0242ac130002", "882c83b1-4a65-4b69-b969-c0f53ccbd5ca"]);
			expect(tableInsertion.success).toBe(true);

			const query = client.table("db2.schema3.table5").select.execute("*", {
				valuesOnly: true,
			});

			await expect(query).resolves.toEqual({
				success: true,
				data: {
					command: "SELECT",
					input: {
						query: "SELECT *\nFROM schema3.table5 t",
						values: [],
					},
					rowCount: 1,
					rows: [
						{
							id: "b8d0b5c0-5f9a-11eb-ae93-0242ac130002",
							not_uuid: "882c83b1-4a65-4b69-b969-c0f53ccbd5ca",
						},
					],
				},
			});
		} catch (error) {
			await client.safeQuery(dropSchemaQueryDatabase2);
			throw error;
		}

		//* An invalid select clause
		const query = client.table("db2.schema3.table5").select.execute("id" as any, {
			raw: true,
		});

		expect(query.success).toBe(false);
	});
});
