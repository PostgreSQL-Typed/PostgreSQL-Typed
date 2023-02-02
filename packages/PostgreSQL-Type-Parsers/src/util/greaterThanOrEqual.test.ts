import { describe, expect, it } from "vitest";

import { greaterThanOrEqual } from "./greaterThanOrEqual";

describe("greaterThanOrEqual", () => {
	it("should return true if value1 is greater than or equal to value2", () => {
		expect(greaterThanOrEqual(2, 1)).toBe(true);
		expect(greaterThanOrEqual(1, 1)).toBe(true);
		expect(greaterThanOrEqual("b", "a")).toBe(true);
		expect(greaterThanOrEqual("a", "a")).toBe(true);
	});

	it("should return false if value1 is less than value2", () => {
		expect(greaterThanOrEqual(1, 2)).toBe(false);
		expect(greaterThanOrEqual("a", "b")).toBe(false);
	});
});
