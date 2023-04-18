import { describe, expect, test } from "vitest";

import { Client } from "../__mocks__/client.js";
import { TestData, testData } from "../__mocks__/testData.js";
import { getRawOrderBy } from "./getRawOrderBy.js";

describe("getRawOrderBy", () => {
	test("returns an error if the orderBy is not an object", () => {
		const result = getRawOrderBy(0 as any, []);
		expect(result.success).toBe(false);
		if (result.success) expect.fail();
		expect(result.error.message).toBe("Expected 'object', received 'number'");
	});

	test("returns an error if the orderBy is missing keys", () => {
		const result = getRawOrderBy({} as any, []);
		expect(result.success).toBe(false);
		if (result.success) expect.fail();
		expect(result.error.message).toBe("Missing keys in object: 'nulls', 'columns'");

		const result2 = getRawOrderBy({ nulls: undefined } as any, []);
		expect(result2.success).toBe(false);
		if (result2.success) expect.fail();
		expect(result2.error.message).toBe("Object must have at least 1 key(s)");
	});

	test("returns an error if the orderBy has unrecognized keys", () => {
		const result = getRawOrderBy({ nulls: "NULLS FIRST", foo: 0 } as any, []);
		expect(result.success).toBe(false);
		if (result.success) expect.fail();
		expect(result.error.message).toBe("Unrecognized key in object: 'foo'");
	});

	test("returns an error if the orderBy has invalid key types", () => {
		const result = getRawOrderBy({ nulls: 1 } as any, []);
		expect(result.success).toBe(false);
		if (result.success) expect.fail();
		expect(result.error.message).toBe("Expected 'string' | 'undefined' for key 'nulls', received 'number'");
	});

	test("returns an error if the orderBy has an invalid nulls", () => {
		const result = getRawOrderBy({ nulls: "FOO" } as any, []);
		expect(result.success).toBe(false);
		if (result.success) expect.fail();
		expect(result.error.message).toBe("Expected 'NULLS FIRST' | 'NULLS LAST', received 'FOO'");
	});

	test("returns an error if the orderBy column is missing keys", () => {
		const client = new Client<TestData>(testData),
			table1 = client.table("db1.schema1.table1"),
			result = getRawOrderBy(
				{
					nulls: "NULLS FIRST",
					columns: {},
				} as any,
				[table1]
			);

		expect(result.success).toBe(false);
		if (result.success) expect.fail();
		expect(result.error.message).toBe("Missing key in object: 'schema1.table1.id'");

		const result2 = getRawOrderBy(
			{
				nulls: "NULLS FIRST",
				columns: {
					"schema1.table1.id": undefined,
				},
			} as any,
			[table1]
		);

		expect(result2.success).toBe(false);
		if (result2.success) expect.fail();
		expect(result2.error.message).toBe("Object must have at least 1 key(s)");
	});

	test("returns an error if the orderBy column has unrecognized keys", () => {
		const client = new Client<TestData>(testData),
			table1 = client.table("db1.schema1.table1"),
			result = getRawOrderBy(
				{
					nulls: "NULLS FIRST",
					columns: {
						foo: "ASC",
					},
				} as any,
				[table1]
			);

		expect(result.success).toBe(false);
		if (result.success) expect.fail();
		expect(result.error.message).toBe("Unrecognized key in object: 'foo'");
	});

	test("returns an error if the orderBy column has invalid key types", () => {
		const client = new Client<TestData>(testData),
			table1 = client.table("db1.schema1.table1"),
			result = getRawOrderBy(
				{
					nulls: "NULLS FIRST",
					columns: {
						"schema1.table1.id": 1,
					},
				} as any,
				[table1]
			);

		expect(result.success).toBe(false);
		if (result.success) expect.fail();
		expect(result.error.message).toBe("Expected 'string' | 'undefined' for key 'schema1.table1.id', received 'number'");

		const result2 = getRawOrderBy(
			{
				nulls: "NULLS FIRST",
				columns: {
					"schema1.table1.id": "FOO",
				},
			} as any,
			[table1]
		);

		expect(result2.success).toBe(false);
		if (result2.success) expect.fail();
		expect(result2.error.message).toBe("Expected 'ASC' | 'DESC', received 'FOO'");
	});

	test("returns a string if the orderBy is valid", () => {
		const client = new Client<TestData>(testData),
			table1 = client.table("db1.schema1.table1"),
			result = getRawOrderBy(
				{
					nulls: "NULLS FIRST",
					columns: {
						"schema1.table1.id": "ASC",
					},
				},
				[table1]
			);

		expect(result.success).toBe(true);
		if (!result.success) expect.fail();
		expect(result.data).toBe("ORDER BY %schema1.table1%.id ASC NULLS FIRST");

		const result2 = getRawOrderBy(
			{
				nulls: "NULLS LAST",
			},
			[table1]
		);

		expect(result2.success).toBe(true);
		if (!result2.success) expect.fail();
		expect(result2.data).toBe("ORDER BY NULLS LAST");

		const result3 = getRawOrderBy(
			{
				columns: {
					"schema1.table1.id": "DESC",
				},
			},
			[table1]
		);

		expect(result3.success).toBe(true);
		if (!result3.success) expect.fail();
		expect(result3.data).toBe("ORDER BY %schema1.table1%.id DESC");
	});
});
