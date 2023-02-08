import { describe, expect, expectTypeOf, it } from "vitest";

import { arrayToEnum } from "./arrayToEnum.js";

describe("arrayToEnum", () => {
	it("should return an object with the same keys as the array", () => {
		expect(arrayToEnum(["a", "b", "c"])).toStrictEqual({
			a: "a",
			b: "b",
			c: "c",
		});
	});

	it("should infer the type correctly", () => {
		expectTypeOf(arrayToEnum(["a", "b", "c"])).toEqualTypeOf<{
			a: "a";
			b: "b";
			c: "c";
		}>();
	});
});
