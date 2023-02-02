import { describe, expect, expectTypeOf, it } from "vitest";

import { joinValues } from "./joinValues";

describe("joinValues", () => {
	it("should join values", () => {
		expect(joinValues(["a", "b", "c"])).toBe("'a', 'b', 'c'");
		expect(joinValues([1, "b", 3])).toBe("1, 'b', 3");
		expectTypeOf(joinValues(["a", "b", "c"])).toEqualTypeOf<string>();
	});

	it("should join values with a custom separator", () => {
		expect(joinValues(["a", "b", "c"], " | ")).toBe("'a' | 'b' | 'c'");
		expect(joinValues([1, "b", 3], " | ")).toBe("1 | 'b' | 3");
	});
});
