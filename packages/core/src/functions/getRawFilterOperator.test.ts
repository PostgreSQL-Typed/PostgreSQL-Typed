import { Int2, PGTPParser } from "@postgresql-typed/parsers";
import { describe, expect, test } from "vitest";

import { getRawFilterOperator } from "./getRawFilterOperator";

describe("getRawFilterOperator", () => {
	const parser = PGTPParser(Int2);

	test("too many operators", () => {
		expect(() =>
			getRawFilterOperator(
				{
					$EQUAL: 1,
					$NOT_EQUAL: 2,
				},
				parser
			)
		).toThrowError();
	});

	test("invalid operator", () => {
		expect(() =>
			getRawFilterOperator(
				{
					abc: 1,
				} as any,
				parser
			)
		).toThrowError();
	});

	test("$EQUAL", () => {
		expect(getRawFilterOperator({ $EQUAL: 1 }, parser).map(variable => (typeof variable === "string" ? variable : variable.value))).toEqual(["= %?%", 1]);
	});

	test("$NOT_EQUAL", () => {
		expect(getRawFilterOperator({ $NOT_EQUAL: 1 }, parser).map(variable => (typeof variable === "string" ? variable : variable.value))).toEqual(["!= %?%", 1]);
	});

	test("$LESS_THAN", () => {
		expect(getRawFilterOperator({ $LESS_THAN: 1 }, parser).map(variable => (typeof variable === "string" ? variable : variable.value))).toEqual(["< %?%", 1]);
	});

	test("$LESS_THAN_OR_EQUAL", () => {
		expect(getRawFilterOperator({ $LESS_THAN_OR_EQUAL: 1 }, parser).map(variable => (typeof variable === "string" ? variable : variable.value))).toEqual([
			"<= %?%",
			1,
		]);
	});

	test("$GREATER_THAN", () => {
		expect(getRawFilterOperator({ $GREATER_THAN: 1 }, parser).map(variable => (typeof variable === "string" ? variable : variable.value))).toEqual([
			"> %?%",
			1,
		]);
	});

	test("$GREATER_THAN_OR_EQUAL", () => {
		expect(getRawFilterOperator({ $GREATER_THAN_OR_EQUAL: 1 }, parser).map(variable => (typeof variable === "string" ? variable : variable.value))).toEqual([
			">= %?%",
			1,
		]);
	});

	test("$LIKE", () => {
		expect(getRawFilterOperator({ $LIKE: "abc" }, parser).map(variable => (typeof variable === "string" ? variable : variable.value))).toEqual([
			"LIKE %?%",
			"abc",
		]);
	});

	test("$NOT_LIKE", () => {
		expect(getRawFilterOperator({ $NOT_LIKE: "abc" }, parser).map(variable => (typeof variable === "string" ? variable : variable.value))).toEqual([
			"NOT LIKE %?%",
			"abc",
		]);
	});

	test("$ILIKE", () => {
		expect(getRawFilterOperator({ $ILIKE: "abc" }, parser).map(variable => (typeof variable === "string" ? variable : variable.value))).toEqual([
			"ILIKE %?%",
			"abc",
		]);
	});

	test("$NOT_ILIKE", () => {
		expect(getRawFilterOperator({ $NOT_ILIKE: "abc" }, parser).map(variable => (typeof variable === "string" ? variable : variable.value))).toEqual([
			"NOT ILIKE %?%",
			"abc",
		]);
	});

	test("$IN", () => {
		expect(getRawFilterOperator({ $IN: [1, 2, 3, 4, 5] }, parser).map(variable => (typeof variable === "string" ? variable : variable.value))).toEqual([
			"IN (%?%, %?%, %?%, %?%, %?%)",
			1,
			2,
			3,
			4,
			5,
		]);

		expect(() => getRawFilterOperator({ $IN: 1 } as any, parser).map(variable => (typeof variable === "string" ? variable : variable.value))).toThrowError();
		expect(() => getRawFilterOperator({ $IN: [1] }, parser).map(variable => (typeof variable === "string" ? variable : variable.value))).toThrowError();
	});

	test("$NOT_IN", () => {
		expect(getRawFilterOperator({ $NOT_IN: [1, 2, 3, 4, 5] }, parser).map(variable => (typeof variable === "string" ? variable : variable.value))).toEqual([
			"NOT IN (%?%, %?%, %?%, %?%, %?%)",
			1,
			2,
			3,
			4,
			5,
		]);

		expect(() =>
			getRawFilterOperator({ $NOT_IN: 1 } as any, parser).map(variable => (typeof variable === "string" ? variable : variable.value))
		).toThrowError();
		expect(() => getRawFilterOperator({ $NOT_IN: [1] }, parser).map(variable => (typeof variable === "string" ? variable : variable.value))).toThrowError();
	});

	test("$BETWEEN", () => {
		expect(getRawFilterOperator({ $BETWEEN: [1, 5] }, parser).map(variable => (typeof variable === "string" ? variable : variable.value))).toEqual([
			"BETWEEN %?% AND %?%",
			1,
			5,
		]);

		expect(() =>
			getRawFilterOperator({ $BETWEEN: 1 } as any, parser).map(variable => (typeof variable === "string" ? variable : variable.value))
		).toThrowError();
		expect(() =>
			getRawFilterOperator({ $BETWEEN: [1] as any }, parser).map(variable => (typeof variable === "string" ? variable : variable.value))
		).toThrowError();
	});

	test("$NOT_BETWEEN", () => {
		expect(getRawFilterOperator({ $NOT_BETWEEN: [1, 5] }, parser).map(variable => (typeof variable === "string" ? variable : variable.value))).toEqual([
			"NOT BETWEEN %?% AND %?%",
			1,
			5,
		]);

		expect(() =>
			getRawFilterOperator({ $NOT_BETWEEN: 1 } as any, parser).map(variable => (typeof variable === "string" ? variable : variable.value))
		).toThrowError();
		expect(() =>
			getRawFilterOperator({ $NOT_BETWEEN: [1] as any }, parser).map(variable => (typeof variable === "string" ? variable : variable.value))
		).toThrowError();
	});

	test("$IS_NULL", () => {
		expect(getRawFilterOperator({ $IS_NULL: true }, parser).map(variable => (typeof variable === "string" ? variable : variable.value))).toEqual(["IS NULL"]);
	});

	test("$IS_NOT_NULL", () => {
		expect(getRawFilterOperator({ $IS_NOT_NULL: true }, parser).map(variable => (typeof variable === "string" ? variable : variable.value))).toEqual([
			"IS NOT NULL",
		]);
	});
});
