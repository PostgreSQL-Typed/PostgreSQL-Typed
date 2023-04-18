import { describe, expect, test } from "vitest";

import { getRawFetch } from "./getRawFetch.js";

describe("getRawFetch", () => {
	test("returns an error if the fetch is not an object", () => {
		const result = getRawFetch(0 as any);
		expect(result.success).toBe(false);
		if (result.success) expect.fail();
		expect(result.error.message).toBe("Expected 'object', received 'number'");
	});

	test("returns an error if the fetch is missing keys", () => {
		const result = getRawFetch({} as any);
		expect(result.success).toBe(false);
		if (result.success) expect.fail();
		expect(result.error.message).toBe("Missing key in object: 'fetch'");
	});

	test("returns an error if the fetch has unrecognized keys", () => {
		const result = getRawFetch({ fetch: 0, foo: 0 } as any);
		expect(result.success).toBe(false);
		if (result.success) expect.fail();
		expect(result.error.message).toBe("Unrecognized key in object: 'foo'");
	});

	test("returns an error if the fetch has invalid key types", () => {
		const result = getRawFetch({ fetch: 0, type: 0 } as any);
		expect(result.success).toBe(false);
		if (result.success) expect.fail();
		expect(result.error.message).toBe("Expected 'string' | 'undefined' for key 'type', received 'number'");
	});

	test("returns an error if the fetch has an invalid type", () => {
		const result = getRawFetch({ fetch: 0, type: "FOO" } as any);
		expect(result.success).toBe(false);
		if (result.success) expect.fail();
		expect(result.error.message).toBe("Expected 'FIRST' | 'NEXT', received 'FOO'");
	});

	test("returns an error if the fetch is too small", () => {
		const result = getRawFetch({ fetch: -1, type: "FIRST" });
		expect(result.success).toBe(false);
		if (result.success) expect.fail();
		expect(result.error.message).toBe("Number must be greater than or equal to 0");
	});

	test("returns the fetch if it is valid", () => {
		const result = getRawFetch({ fetch: 0, type: "FIRST" });
		expect(result.success).toBe(true);
		if (!result.success) expect.fail();
		expect(result.data).toBe("FETCH FIRST 0 ROWS ONLY");

		const result2 = getRawFetch({ fetch: 1, type: "FIRST" });
		expect(result2.success).toBe(true);
		if (!result2.success) expect.fail();
		expect(result2.data).toBe("FETCH FIRST 1 ROW ONLY");
	});

	test("returns an error if the offset is too small", () => {
		const result = getRawFetch({ fetch: 0, type: "FIRST", offset: -1 });
		expect(result.success).toBe(false);
		if (result.success) expect.fail();
		expect(result.error.message).toBe("Number must be greater than or equal to 0");
	});

	test("returns the fetch if it is valid and has an offset", () => {
		const result = getRawFetch({ fetch: 0, type: "FIRST", offset: 0 });
		expect(result.success).toBe(true);
		if (!result.success) expect.fail();
		expect(result.data).toBe("OFFSET 0 ROWS\nFETCH FIRST 0 ROWS ONLY");

		const result2 = getRawFetch({ fetch: 1, type: "FIRST", offset: 1 });
		expect(result2.success).toBe(true);
		if (!result2.success) expect.fail();
		expect(result2.data).toBe("OFFSET 1 ROW\nFETCH FIRST 1 ROW ONLY");
	});
});
