import { Int2, PGTPParser } from "@postgresql-typed/parsers";
import { describe, expect, test } from "vitest";

import { getRawFilterOperator } from "./getRawFilterOperator";

describe("getRawFilterOperator", () => {
	const parser = PGTPParser(Int2);

	test("too many operators", () => {
		const tooManyOperators = getRawFilterOperator(
			{
				$EQUAL: 1,
				$NOT_EQUAL: 2,
			},
			parser
		);
		expect(tooManyOperators.success).toBe(false);
		if (tooManyOperators.success) expect.fail();
	});

	test("too few operators", () => {
		const tooFewOperators = getRawFilterOperator({}, parser);
		expect(tooFewOperators.success).toBe(false);
		if (tooFewOperators.success) expect.fail();
	});

	test("invalid operator", () => {
		const invalidOperator = getRawFilterOperator(
			{
				$INVALID: 1,
			} as any,
			parser
		);
		expect(invalidOperator.success).toBe(false);
		if (invalidOperator.success) expect.fail();
	});

	test("$EQUAL", () => {
		const result = getRawFilterOperator({ $EQUAL: 1 }, parser);
		expect(result.success).toBe(true);
		if (!result.success) expect.fail();
		expect(result.data.map(variable => (typeof variable === "string" ? variable : variable.value))).toEqual(["= %?%", 1]);

		const invalidType = getRawFilterOperator({ $EQUAL: {} }, parser);
		expect(invalidType.success).toBe(false);
		if (invalidType.success) expect.fail();

		// eslint-disable-next-line unicorn/no-null
		const nullValue = getRawFilterOperator({ $EQUAL: null }, parser.nullable());
		expect(nullValue.success).toBe(false);
		if (nullValue.success) expect.fail();

		const undefinedValue = getRawFilterOperator({ $EQUAL: undefined }, parser.optional());
		expect(undefinedValue.success).toBe(false);
		if (undefinedValue.success) expect.fail();
	});

	test("$NOT_EQUAL", () => {
		const result = getRawFilterOperator({ $NOT_EQUAL: 1 }, parser);
		expect(result.success).toBe(true);
		if (!result.success) expect.fail();
		expect(result.data.map(variable => (typeof variable === "string" ? variable : variable.value))).toEqual(["!= %?%", 1]);
	});

	test("$LESS_THAN", () => {
		const result = getRawFilterOperator({ $LESS_THAN: 1 }, parser);
		expect(result.success).toBe(true);
		if (!result.success) expect.fail();
		expect(result.data.map(variable => (typeof variable === "string" ? variable : variable.value))).toEqual(["< %?%", 1]);
	});

	test("$LESS_THAN_OR_EQUAL", () => {
		const result = getRawFilterOperator({ $LESS_THAN_OR_EQUAL: 1 }, parser);
		expect(result.success).toBe(true);
		if (!result.success) expect.fail();
		expect(result.data.map(variable => (typeof variable === "string" ? variable : variable.value))).toEqual(["<= %?%", 1]);
	});

	test("$GREATER_THAN", () => {
		const result = getRawFilterOperator({ $GREATER_THAN: 1 }, parser);
		expect(result.success).toBe(true);
		if (!result.success) expect.fail();
		expect(result.data.map(variable => (typeof variable === "string" ? variable : variable.value))).toEqual(["> %?%", 1]);
	});

	test("$GREATER_THAN_OR_EQUAL", () => {
		const result = getRawFilterOperator({ $GREATER_THAN_OR_EQUAL: 1 }, parser);
		expect(result.success).toBe(true);
		if (!result.success) expect.fail();
		expect(result.data.map(variable => (typeof variable === "string" ? variable : variable.value))).toEqual([">= %?%", 1]);
	});

	test("$LIKE", () => {
		const result = getRawFilterOperator({ $LIKE: "abc" }, parser);
		expect(result.success).toBe(true);
		if (!result.success) expect.fail();
		expect(result.data.map(variable => (typeof variable === "string" ? variable : variable.value))).toEqual(["LIKE %?%", "abc"]);

		const invalidType = getRawFilterOperator({ $LIKE: {} as any }, parser);
		expect(invalidType.success).toBe(false);
		if (invalidType.success) expect.fail();
	});

	test("$NOT_LIKE", () => {
		const result = getRawFilterOperator({ $NOT_LIKE: "abc" }, parser);
		expect(result.success).toBe(true);
		if (!result.success) expect.fail();
		expect(result.data.map(variable => (typeof variable === "string" ? variable : variable.value))).toEqual(["NOT LIKE %?%", "abc"]);
	});

	test("$ILIKE", () => {
		const result = getRawFilterOperator({ $ILIKE: "abc" }, parser);
		expect(result.success).toBe(true);
		if (!result.success) expect.fail();
		expect(result.data.map(variable => (typeof variable === "string" ? variable : variable.value))).toEqual(["ILIKE %?%", "abc"]);
	});

	test("$NOT_ILIKE", () => {
		const result = getRawFilterOperator({ $NOT_ILIKE: "abc" }, parser);
		expect(result.success).toBe(true);
		if (!result.success) expect.fail();
		expect(result.data.map(variable => (typeof variable === "string" ? variable : variable.value))).toEqual(["NOT ILIKE %?%", "abc"]);
	});

	test("$IN", () => {
		const result = getRawFilterOperator({ $IN: [1, 2, 3, 4, 5] }, parser);
		expect(result.success).toBe(true);
		if (!result.success) expect.fail();
		expect(result.data.map(variable => (typeof variable === "string" ? variable : variable.value))).toEqual(["IN (%?%, %?%, %?%, %?%, %?%)", 1, 2, 3, 4, 5]);

		const notArrayResult = getRawFilterOperator({ $IN: 1 } as any, parser);
		expect(notArrayResult.success).toBe(false);
		if (notArrayResult.success) expect.fail();

		const notEnoughItemsResult = getRawFilterOperator({ $IN: [1] }, parser);
		expect(notEnoughItemsResult.success).toBe(false);
		if (notEnoughItemsResult.success) expect.fail();

		const invalidType = getRawFilterOperator({ $IN: [1, 2, 3, 4, {} as any] }, parser);
		expect(invalidType.success).toBe(false);
		if (invalidType.success) expect.fail();

		// eslint-disable-next-line unicorn/no-null
		const nullValue = getRawFilterOperator({ $IN: [1, 2, 3, 4, null] }, parser.nullable());
		expect(nullValue.success).toBe(false);
		if (nullValue.success) expect.fail();

		const undefinedValue = getRawFilterOperator({ $IN: [1, 2, 3, 4, undefined] }, parser.optional());
		expect(undefinedValue.success).toBe(false);
		if (undefinedValue.success) expect.fail();
	});

	test("$NOT_IN", () => {
		const result = getRawFilterOperator({ $NOT_IN: [1, 2, 3, 4, 5] }, parser);
		expect(result.success).toBe(true);
		if (!result.success) expect.fail();
		expect(result.data.map(variable => (typeof variable === "string" ? variable : variable.value))).toEqual([
			"NOT IN (%?%, %?%, %?%, %?%, %?%)",
			1,
			2,
			3,
			4,
			5,
		]);

		const notArrayResult = getRawFilterOperator({ $NOT_IN: 1 } as any, parser);
		expect(notArrayResult.success).toBe(false);
		if (notArrayResult.success) expect.fail();

		const notEnoughItemsResult = getRawFilterOperator({ $NOT_IN: [1] }, parser);
		expect(notEnoughItemsResult.success).toBe(false);
		if (notEnoughItemsResult.success) expect.fail();
	});

	test("$BETWEEN", () => {
		const result = getRawFilterOperator({ $BETWEEN: [1, 5] }, parser);
		expect(result.success).toBe(true);
		if (!result.success) expect.fail();
		expect(result.data.map(variable => (typeof variable === "string" ? variable : variable.value))).toEqual(["BETWEEN %?% AND %?%", 1, 5]);

		const notArrayResult = getRawFilterOperator({ $BETWEEN: 1 } as any, parser);
		expect(notArrayResult.success).toBe(false);
		if (notArrayResult.success) expect.fail();

		const notEnoughItemsResult = getRawFilterOperator({ $BETWEEN: [1] } as any, parser);
		expect(notEnoughItemsResult.success).toBe(false);
		if (notEnoughItemsResult.success) expect.fail();

		const tooManyItemsResult = getRawFilterOperator({ $BETWEEN: [1, 2, 3] } as any, parser);
		expect(tooManyItemsResult.success).toBe(false);
		if (tooManyItemsResult.success) expect.fail();

		const invalidType = getRawFilterOperator({ $BETWEEN: [1, {} as any] }, parser);
		expect(invalidType.success).toBe(false);
		if (invalidType.success) expect.fail();

		// eslint-disable-next-line unicorn/no-null
		const nullValueA = getRawFilterOperator({ $BETWEEN: [null, 1] }, parser.nullable());
		expect(nullValueA.success).toBe(false);
		if (nullValueA.success) expect.fail();

		const undefinedValueA = getRawFilterOperator({ $BETWEEN: [undefined, 1] }, parser.optional());
		expect(undefinedValueA.success).toBe(false);
		if (undefinedValueA.success) expect.fail();

		// eslint-disable-next-line unicorn/no-null
		const nullValueB = getRawFilterOperator({ $BETWEEN: [1, null] }, parser.nullable());
		expect(nullValueB.success).toBe(false);
		if (nullValueB.success) expect.fail();

		const undefinedValueB = getRawFilterOperator({ $BETWEEN: [1, undefined] }, parser.optional());
		expect(undefinedValueB.success).toBe(false);
		if (undefinedValueB.success) expect.fail();
	});

	test("$NOT_BETWEEN", () => {
		const result = getRawFilterOperator({ $NOT_BETWEEN: [1, 5] }, parser);
		expect(result.success).toBe(true);
		if (!result.success) expect.fail();
		expect(result.data.map(variable => (typeof variable === "string" ? variable : variable.value))).toEqual(["NOT BETWEEN %?% AND %?%", 1, 5]);

		const notArrayResult = getRawFilterOperator({ $NOT_BETWEEN: 1 } as any, parser);
		expect(notArrayResult.success).toBe(false);
		if (notArrayResult.success) expect.fail();

		const notEnoughItemsResult = getRawFilterOperator({ $NOT_BETWEEN: [1] } as any, parser);
		expect(notEnoughItemsResult.success).toBe(false);
		if (notEnoughItemsResult.success) expect.fail();

		const tooManyItemsResult = getRawFilterOperator({ $NOT_BETWEEN: [1, 2, 3] } as any, parser);
		expect(tooManyItemsResult.success).toBe(false);
		if (tooManyItemsResult.success) expect.fail();
	});

	test("$IS_NULL", () => {
		const result = getRawFilterOperator({ $IS_NULL: true }, parser);
		expect(result.success).toBe(true);
		if (!result.success) expect.fail();

		const notBooleanResult = getRawFilterOperator({ $IS_NULL: 1 } as any, parser);
		expect(notBooleanResult.success).toBe(false);
		if (notBooleanResult.success) expect.fail();
	});

	test("$IS_NOT_NULL", () => {
		const result = getRawFilterOperator({ $IS_NOT_NULL: true }, parser);
		expect(result.success).toBe(true);
		if (!result.success) expect.fail();

		const notBooleanResult = getRawFilterOperator({ $IS_NOT_NULL: 1 } as any, parser);
		expect(notBooleanResult.success).toBe(false);
		if (notBooleanResult.success) expect.fail();
	});
});
