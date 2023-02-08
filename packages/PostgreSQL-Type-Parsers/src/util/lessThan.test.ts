import { describe, expect, it } from "vitest";

import { lessThan } from "./lessThan.js";

describe("lessThan", () => {
	it("should return true if value1 is less than value2", () => {
		expect(lessThan(1, 2)).toBe(true);
		expect(lessThan("a", "b")).toBe(true);
	});

	it("should return false if value1 is greater than or equal to value2", () => {
		expect(lessThan(2, 1)).toBe(false);
		expect(lessThan(1, 1)).toBe(false);
		expect(lessThan("b", "a")).toBe(false);
		expect(lessThan("a", "a")).toBe(false);
	});
});
