import { describe, expect, test } from "vitest";

import { Client } from "../__mocks__/client";
import { type TestData, testData } from "../__mocks__/testData";
import type { TableColumnsFromSchemaOnwards } from "../types/types/TableColumnsFromSchemaOnwards";
import { getRawSelectQuery } from "./getRawSelectQuery";

describe("getRawSelectQuery", () => {
	test("*", () => {
		const client = new Client<TestData>(testData),
			table1 = client.table("db1.schema1.table1"),
			table2 = client.table("db1.schema1.table2"),
			result1 = getRawSelectQuery<TableColumnsFromSchemaOnwards<typeof table1 | typeof table2>>("*", [table1, table2]);
		expect(result1.success).toBe(true);
		if (!result1.success) expect.fail();
		expect(result1.data.query).toBe("*");
		expect(result1.data.mappings).toHaveProperty(["id"]);

		const result2 = getRawSelectQuery<TableColumnsFromSchemaOnwards<typeof table1 | typeof table2>>(
			{
				"*": true,
			},
			[table1, table2]
		);

		expect(result2.success).toBe(true);
		if (!result2.success) expect.fail();
		expect(result2.data.query).toBe("*");
		expect(result2.data.mappings).toHaveProperty(["id"]);
	});

	test("COUNT(*)", () => {
		const client = new Client<TestData>(testData),
			table1 = client.table("db1.schema1.table1"),
			table2 = client.table("db1.schema1.table2"),
			result1 = getRawSelectQuery<TableColumnsFromSchemaOnwards<typeof table1 | typeof table2>>("COUNT(*)", [table1, table2]);

		expect(result1.success).toBe(true);
		if (!result1.success) expect.fail();
		expect(result1.data.query).toBe("COUNT(*)");
		expect(result1.data.mappings).toHaveProperty(["count"]);

		const result2 = getRawSelectQuery<TableColumnsFromSchemaOnwards<typeof table1 | typeof table2>>(
			{
				"COUNT(*)": true,
			},
			[table1, table2]
		);

		expect(result2.success).toBe(true);
		if (!result2.success) expect.fail();
		expect(result2.data.query).toBe("COUNT(*)");
		expect(result2.data.mappings).toHaveProperty(["count"]);

		const result3 = getRawSelectQuery<TableColumnsFromSchemaOnwards<typeof table1 | typeof table2>>(
			{
				"COUNT(*)": {
					alias: "howMany",
				},
			},
			[table1, table2]
		);

		expect(result3.success).toBe(true);
		if (!result3.success) expect.fail();
		expect(result3.data.query).toBe("COUNT(*) AS howMany");
		expect(result3.data.mappings).toHaveProperty(["howMany"]);
	});

	test("string | string[]", () => {
		const client = new Client<TestData>(testData),
			table1 = client.table("db1.schema1.table1"),
			table2 = client.table("db1.schema1.table2"),
			result1 = getRawSelectQuery<TableColumnsFromSchemaOnwards<typeof table1 | typeof table2>>("schema1.table1.id", [table1, table2]);

		expect(result1.success).toBe(true);
		if (!result1.success) expect.fail();
		expect(result1.data.query).toBe("%schema1.table1%.id");
		expect(result1.data.mappings).toHaveProperty(["id"]);

		const result2 = getRawSelectQuery<TableColumnsFromSchemaOnwards<typeof table1 | typeof table2>>(
			["schema1.table1.id", "schema1.table2.id"],
			[table1, table2]
		);

		expect(result2.success).toBe(true);
		if (!result2.success) expect.fail();
		expect(result2.data.query).toBe("%schema1.table1%.id,\n%schema1.table2%.id");
		expect(result2.data.mappings).toHaveProperty(["id"]);

		const result3 = getRawSelectQuery<TableColumnsFromSchemaOnwards<typeof table1 | typeof table2>>("unknown" as any, [table1, table2]);

		expect(result3.success).toBe(false);
		if (result3.success) expect.fail();
		expect(result3.error.message).toBe("Expected '*' | 'COUNT(*)' | 'schema1.table1.id' | 'schema1.table2.id', received 'unknown'");

		const result4 = getRawSelectQuery<TableColumnsFromSchemaOnwards<typeof table1 | typeof table2>>(["unknown"] as any, [table1, table2]);

		expect(result4.success).toBe(false);
		if (result4.success) expect.fail();
		expect(result4.error.message).toBe("Expected 'schema1.table1.id' | 'schema1.table2.id', received 'unknown'");
	});

	test("object", () => {
		const client = new Client<TestData>(testData),
			table1 = client.table("db1.schema1.table1"),
			table2 = client.table("db1.schema1.table2"),
			result1 = getRawSelectQuery<TableColumnsFromSchemaOnwards<typeof table1 | typeof table2>>({ "schema1.table1.id": true }, [table1, table2]);

		expect(result1.success).toBe(true);
		if (!result1.success) expect.fail();
		expect(result1.data.query).toBe("%schema1.table1%.id");
		expect(result1.data.mappings).toHaveProperty(["id"]);

		const result2 = getRawSelectQuery<TableColumnsFromSchemaOnwards<typeof table1 | typeof table2>>(
			{
				"schema1.table1.id": true,
				"schema1.table2.id": true,
			},
			[table1, table2]
		);

		expect(result2.success).toBe(true);
		if (!result2.success) expect.fail();
		expect(result2.data.query).toBe("%schema1.table1%.id,\n%schema1.table2%.id");
		expect(result2.data.mappings).toHaveProperty(["id"]);
	});

	test("alias", () => {
		const client = new Client<TestData>(testData),
			table1 = client.table("db1.schema1.table1"),
			table2 = client.table("db1.schema1.table2"),
			result1 = getRawSelectQuery<TableColumnsFromSchemaOnwards<typeof table1 | typeof table2>>(
				{
					"schema1.table1.id": {
						alias: "identifier",
					},
				},
				[table1, table2]
			);

		expect(result1.success).toBe(true);
		if (!result1.success) expect.fail();
		expect(result1.data.query).toBe("%schema1.table1%.id AS identifier");

		const result2 = getRawSelectQuery<TableColumnsFromSchemaOnwards<typeof table1 | typeof table2>>(
			{
				"schema1.table1.id": {
					alias: "identifier",
				},
				"schema1.table2.id": {
					alias: "identifier2",
				},
			},
			[table1, table2]
		);

		expect(result2.success).toBe(true);
		if (!result2.success) expect.fail();
		expect(result2.data.query).toBe("%schema1.table1%.id AS identifier,\n%schema1.table2%.id AS identifier2");
	});

	test("distinct", () => {
		const client = new Client<TestData>(testData),
			table1 = client.table("db1.schema1.table1"),
			table2 = client.table("db1.schema1.table2"),
			result1 = getRawSelectQuery<TableColumnsFromSchemaOnwards<typeof table1 | typeof table2>>(
				{
					"schema1.table1.id": {
						distinct: true,
					},
				},
				[table1, table2]
			);

		expect(result1.success).toBe(true);
		if (!result1.success) expect.fail();
		expect(result1.data.query).toBe("DISTINCT %schema1.table1%.id");

		const result2 = getRawSelectQuery<TableColumnsFromSchemaOnwards<typeof table1 | typeof table2>>(
			{
				"schema1.table1.id": {
					distinct: true,
				},
				"schema1.table2.id": {
					distinct: "ON",
				},
			},
			[table1, table2]
		);

		expect(result2.success).toBe(true);
		if (!result2.success) expect.fail();
		expect(result2.data.query).toBe("DISTINCT %schema1.table1%.id,\nDISTINCT ON (%schema1.table2%.id) id");

		const result3 = getRawSelectQuery<TableColumnsFromSchemaOnwards<typeof table1 | typeof table2>>(
			{
				"schema1.table1.id": {
					distinct: true,
					alias: "identifier",
				},
				"schema1.table2.id": {
					distinct: "ON",
					alias: "identifier2",
				},
			},
			[table1, table2]
		);

		expect(result3.success).toBe(true);
		if (!result3.success) expect.fail();
		expect(result3.data.query).toBe("DISTINCT %schema1.table1%.id AS identifier,\nDISTINCT ON (%schema1.table2%.id) identifier2");

		const result4 = getRawSelectQuery<TableColumnsFromSchemaOnwards<typeof table1 | typeof table2>>(
			{
				"schema1.table1.id": undefined,
			},
			[table1, table2]
		);

		expect(result4.success).toBe(false);
		if (result4.success) expect.fail();
		expect(result4.error.message).toBe("Object must have at least 1 key(s)");
	});

	test("invalid", () => {
		const client = new Client<TestData>(testData),
			table1 = client.table("db1.schema1.table1"),
			table2 = client.table("db1.schema1.table2"),
			result1 = getRawSelectQuery<TableColumnsFromSchemaOnwards<typeof table1 | typeof table2>>(undefined as any, [table1, table2]);

		expect(result1.success).toBe(false);
		if (result1.success) expect.fail();
		expect(result1.error.message).toBe("Expected 'array' | 'object' | 'string', received 'undefined'");

		const result2 = getRawSelectQuery<TableColumnsFromSchemaOnwards<typeof table1 | typeof table2>>({}, [table1, table2]);

		expect(result2.success).toBe(false);
		if (result2.success) expect.fail();
		expect(result2.error.message).toBe("Missing keys in object: '*', 'COUNT(*)', 'schema1.table1.id', 'schema1.table2.id'");

		const result3 = getRawSelectQuery<TableColumnsFromSchemaOnwards<typeof table1 | typeof table2>>({ foo: 1 } as any, [table1, table2]);

		expect(result3.success).toBe(false);
		if (result3.success) expect.fail();
		expect(result3.error.message).toBe("Unrecognized key in object: 'foo'");

		const result4 = getRawSelectQuery<TableColumnsFromSchemaOnwards<typeof table1 | typeof table2>>(
			{
				"*": 1 as any,
			},
			[table1, table2]
		);

		expect(result4.success).toBe(false);
		if (result4.success) expect.fail();
		expect(result4.error.message).toBe("Expected 'boolean' | 'undefined' for key '*', received 'number'");

		const result5 = getRawSelectQuery<TableColumnsFromSchemaOnwards<typeof table1 | typeof table2>>(
			{
				"*": undefined,
			},
			[table1, table2]
		);

		expect(result5.success).toBe(false);
		if (result5.success) expect.fail();
		expect(result5.error.message).toBe("Object must have at least 1 key(s)");

		const result6 = getRawSelectQuery<TableColumnsFromSchemaOnwards<typeof table1 | typeof table2>>(
			{
				"COUNT(*)": {} as any,
			},
			[table1, table2]
		);

		expect(result6.success).toBe(false);
		if (result6.success) expect.fail();
		expect(result6.error.message).toBe("Missing key in object: 'alias'");

		const result7 = getRawSelectQuery<TableColumnsFromSchemaOnwards<typeof table1 | typeof table2>>(
			{
				"COUNT(*)": {
					alias: 1 as any,
				},
			},
			[table1, table2]
		);

		expect(result7.success).toBe(false);
		if (result7.success) expect.fail();
		expect(result7.error.message).toBe("Expected 'string' for key 'alias', received 'number'");

		const result8 = getRawSelectQuery<TableColumnsFromSchemaOnwards<typeof table1 | typeof table2>>(
			{
				"COUNT(*)": {
					foo: 1,
				} as any,
			},
			[table1, table2]
		);

		expect(result8.success).toBe(false);
		if (result8.success) expect.fail();
		expect(result8.error.message).toBe("Unrecognized key in object: 'foo'");

		const result9 = getRawSelectQuery<TableColumnsFromSchemaOnwards<typeof table1 | typeof table2>>(
			{
				"schema1.table1.id": {},
			},
			[table1, table2]
		);

		expect(result9.success).toBe(false);
		if (result9.success) expect.fail();
		expect(result9.error.message).toBe("Missing keys in object: 'alias', 'distinct'");

		const result10 = getRawSelectQuery<TableColumnsFromSchemaOnwards<typeof table1 | typeof table2>>(
			{
				"schema1.table1.id": {
					alias: 1 as any,
				},
			},
			[table1, table2]
		);

		expect(result10.success).toBe(false);
		if (result10.success) expect.fail();
		expect(result10.error.message).toBe("Expected 'string' | 'undefined' for key 'alias', received 'number'");

		const result11 = getRawSelectQuery<TableColumnsFromSchemaOnwards<typeof table1 | typeof table2>>(
			{
				"schema1.table1.id": {
					foo: 1,
				} as any,
			},
			[table1, table2]
		);

		expect(result11.success).toBe(false);
		if (result11.success) expect.fail();
		expect(result11.error.message).toBe("Unrecognized key in object: 'foo'");

		const result12 = getRawSelectQuery<TableColumnsFromSchemaOnwards<typeof table1 | typeof table2>>(
			{
				"schema1.table1.id": {
					alias: undefined,
				},
			},
			[table1, table2]
		);

		expect(result12.success).toBe(false);
		if (result12.success) expect.fail();
		expect(result12.error.message).toBe("Object must have at least 1 key(s)");

		const result13 = getRawSelectQuery<TableColumnsFromSchemaOnwards<typeof table1 | typeof table2>>(
			{
				"schema1.table1.id": {
					alias: "foo",
					distinct: "FOO",
				} as any,
			},
			[table1, table2]
		);

		expect(result13.success).toBe(false);
		if (result13.success) expect.fail();
		expect(result13.error.message).toBe("Expected 'ON', received 'FOO'");
	});
});
