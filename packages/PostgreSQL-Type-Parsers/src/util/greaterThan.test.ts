import { describe, expect, it } from "vitest";

import { greaterThan } from "./greaterThan";

describe("greaterThan", () => {
	it("should return true if value1 is greater than value2", () => {
		expect(greaterThan(2, 1)).toBe(true);
		expect(greaterThan("b", "a")).toBe(true);
	});

	it("should return false if value1 is less than or equal to value2", () => {
		expect(greaterThan(1, 2)).toBe(false);
		expect(greaterThan(1, 1)).toBe(false);
		expect(greaterThan("a", "b")).toBe(false);
		expect(greaterThan("a", "a")).toBe(false);
	});
});
