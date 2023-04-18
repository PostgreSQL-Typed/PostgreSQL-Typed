import { describe, expect, test } from "vitest";

import { getRawLimit } from "./getRawLimit.js";

describe("getRawLimit", () => {
	test("returns an error if the limit is not a number", () => {
		const result = getRawLimit("0" as any);
		expect(result.success).toBe(false);
		if (result.success) expect.fail();
		expect(result.error.message).toBe("Expected 'number', received 'string'");
	});

	test("returns an error if the limit is too small", () => {
		const result = getRawLimit(-1);
		expect(result.success).toBe(false);
		if (result.success) expect.fail();
		expect(result.error.message).toBe("Number must be greater than or equal to 0");
	});

	test("returns the limit if it is valid", () => {
		const result = getRawLimit(0);
		expect(result.success).toBe(true);
		if (!result.success) expect.fail();
		expect(result.data).toBe("LIMIT 0");
	});

	test("returns an error if the offset is not a number", () => {
		const result = getRawLimit(0, "0" as any);
		expect(result.success).toBe(false);
		if (result.success) expect.fail();
		expect(result.error.message).toBe("Expected 'number', received 'string'");
	});

	test("returns an error if the offset is too small", () => {
		const result = getRawLimit(0, -1);
		expect(result.success).toBe(false);
		if (result.success) expect.fail();
		expect(result.error.message).toBe("Number must be greater than or equal to 0");
	});

	test("returns the offset if it is valid", () => {
		const result = getRawLimit(0, 0);
		expect(result.success).toBe(true);
		if (!result.success) expect.fail();
		expect(result.data).toBe("LIMIT 0\nOFFSET 0");
	});
});
