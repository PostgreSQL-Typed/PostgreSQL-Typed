import { describe, expect, test } from "vitest";

import { getRawFilterOperator } from "./getRawFilterOperator";

describe("getRawFilterOperator", () => {
	test("too many operators", () => {
		expect(() =>
			getRawFilterOperator({
				$EQUAL: 1,
				$NOT_EQUAL: 2,
			})
		).toThrowError();
	});

	test("invalid operator", () => {
		expect(() =>
			getRawFilterOperator({
				abc: 1,
			} as any)
		).toThrowError();
	});

	test("$EQUAL", () => {
		expect(getRawFilterOperator({ $EQUAL: 1 })).toEqual(["= %?%", 1]);
	});

	test("$NOT_EQUAL", () => {
		expect(getRawFilterOperator({ $NOT_EQUAL: 1 })).toEqual(["!= %?%", 1]);
	});

	test("$LESS_THAN", () => {
		expect(getRawFilterOperator({ $LESS_THAN: 1 })).toEqual(["< %?%", 1]);
	});

	test("$LESS_THAN_OR_EQUAL", () => {
		expect(getRawFilterOperator({ $LESS_THAN_OR_EQUAL: 1 })).toEqual(["<= %?%", 1]);
	});

	test("$GREATER_THAN", () => {
		expect(getRawFilterOperator({ $GREATER_THAN: 1 })).toEqual(["> %?%", 1]);
	});

	test("$GREATER_THAN_OR_EQUAL", () => {
		expect(getRawFilterOperator({ $GREATER_THAN_OR_EQUAL: 1 })).toEqual([">= %?%", 1]);
	});

	test("$LIKE", () => {
		expect(getRawFilterOperator({ $LIKE: "abc" })).toEqual(["LIKE %?%", "abc"]);
	});

	test("$NOT_LIKE", () => {
		expect(getRawFilterOperator({ $NOT_LIKE: "abc" })).toEqual(["NOT LIKE %?%", "abc"]);
	});

	test("$ILIKE", () => {
		expect(getRawFilterOperator({ $ILIKE: "abc" })).toEqual(["ILIKE %?%", "abc"]);
	});

	test("$NOT_ILIKE", () => {
		expect(getRawFilterOperator({ $NOT_ILIKE: "abc" })).toEqual(["NOT ILIKE %?%", "abc"]);
	});

	test("$IN", () => {
		expect(getRawFilterOperator({ $IN: [1, 2, 3, 4, 5] })).toEqual(["IN (%?%, %?%, %?%, %?%, %?%)", 1, 2, 3, 4, 5]);

		expect(() => getRawFilterOperator({ $IN: 1 } as any)).toThrowError();
		expect(() => getRawFilterOperator({ $IN: [1] })).toThrowError();
	});

	test("$NOT_IN", () => {
		expect(getRawFilterOperator({ $NOT_IN: [1, 2, 3, 4, 5] })).toEqual(["NOT IN (%?%, %?%, %?%, %?%, %?%)", 1, 2, 3, 4, 5]);

		expect(() => getRawFilterOperator({ $NOT_IN: 1 } as any)).toThrowError();
		expect(() => getRawFilterOperator({ $NOT_IN: [1] })).toThrowError();
	});

	test("$BETWEEN", () => {
		expect(getRawFilterOperator({ $BETWEEN: [1, 5] })).toEqual(["BETWEEN %?% AND %?%", 1, 5]);

		expect(() => getRawFilterOperator({ $BETWEEN: 1 } as any)).toThrowError();
		expect(() => getRawFilterOperator({ $BETWEEN: [1] as any })).toThrowError();
	});

	test("$NOT_BETWEEN", () => {
		expect(getRawFilterOperator({ $NOT_BETWEEN: [1, 5] })).toEqual(["NOT BETWEEN %?% AND %?%", 1, 5]);

		expect(() => getRawFilterOperator({ $NOT_BETWEEN: 1 } as any)).toThrowError();
		expect(() => getRawFilterOperator({ $NOT_BETWEEN: [1] as any })).toThrowError();
	});

	test("$IS_NULL", () => {
		expect(getRawFilterOperator({ $IS_NULL: true })).toEqual(["IS NULL"]);
	});

	test("$IS_NOT_NULL", () => {
		expect(getRawFilterOperator({ $IS_NOT_NULL: true })).toEqual(["IS NOT NULL"]);
	});
});
