import { describe, expect, it } from "vitest";

import { lessThanOrEqual } from "./lessThanOrEqual.js";

describe("lessThanOrEqual", () => {
	it("should return true if value1 is less than or equal to value2", () => {
		expect(lessThanOrEqual(1, 2)).toBe(true);
		expect(lessThanOrEqual(1, 1)).toBe(true);
		expect(lessThanOrEqual("a", "b")).toBe(true);
		expect(lessThanOrEqual("a", "a")).toBe(true);
	});

	it("should return false if value1 is greater than value2", () => {
		expect(lessThanOrEqual(2, 1)).toBe(false);
		expect(lessThanOrEqual("b", "a")).toBe(false);
	});
});
