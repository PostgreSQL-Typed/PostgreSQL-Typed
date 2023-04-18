import { describe, expect, test } from "vitest";

import { Client } from "../__mocks__/client.js";
import { TestData, testData } from "../__mocks__/testData.js";
import { getRawGroupBy } from "./getRawGroupBy.js";

describe("getRawGroupBy", () => {
	test("returns an error if the groupBy is not an array and not a string", () => {
		const result = getRawGroupBy(0 as any, []);
		expect(result.success).toBe(false);
		if (result.success) expect.fail();
		expect(result.error.message).toBe("Expected 'array' | 'string', received 'number'");
	});

	test("returns an error if the groupBy is an array with an invalid value", () => {
		const result = getRawGroupBy([0 as any], []);
		expect(result.success).toBe(false);
		if (result.success) expect.fail();
		expect(result.error.message).toBe("Expected 'string', received 'number'");

		const client = new Client<TestData>(testData),
			table1 = client.table("db1.schema1.table1"),
			result2 = getRawGroupBy(["0" as any], [table1]);

		expect(result2.success).toBe(false);
		if (result2.success) expect.fail();
		expect(result2.error.message).toBe("Expected 'schema1.table1.id', received '0'");
	});

	test("returns an error if the groupBy is a string with an invalid value", () => {
		const client = new Client<TestData>(testData),
			table1 = client.table("db1.schema1.table1"),
			result = getRawGroupBy("0" as any, [table1]);

		expect(result.success).toBe(false);
		if (result.success) expect.fail();
		expect(result.error.message).toBe("Expected 'schema1.table1.id', received '0'");
	});

	test("returns a string if the groupBy is valid", () => {
		const client = new Client<TestData>(testData),
			table1 = client.table("db1.schema1.table1"),
			result = getRawGroupBy("schema1.table1.id", [table1]);

		expect(result.success).toBe(true);
		if (!result.success) expect.fail();
		expect(result.data).toBe("GROUP BY %schema1.table1%.id");

		const result2 = getRawGroupBy(["schema1.table1.id"], [table1]);

		expect(result2.success).toBe(true);
		if (!result2.success) expect.fail();
		expect(result2.data).toBe("GROUP BY %schema1.table1%.id");
	});
});
