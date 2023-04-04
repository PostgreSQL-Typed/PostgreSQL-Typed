import { BigNumber } from "bignumber.js";
import { DateTime } from "luxon";
import { describe, expect, expectTypeOf, it } from "vitest";

import { getParsedType, ParsedType } from "./getParsedType.js";

describe("getParsedType", () => {
	it("should return string", () => {
		expect(getParsedType("string")).toBe("string");
	});

	it("should return number", () => {
		expect(getParsedType(1)).toBe("number");
	});

	it("should return boolean", () => {
		expect(getParsedType(true)).toBe("boolean");
	});

	it("should return bigint", () => {
		expect(getParsedType(BigInt(1))).toBe("bigint");
	});

	it("should return bigNumber", () => {
		expect(getParsedType(BigNumber(1))).toBe("bigNumber");
	});

	it("should return symbol", () => {
		expect(getParsedType(Symbol())).toBe("symbol");
	});

	it("should return function", () => {
		// eslint-disable-next-line @typescript-eslint/no-empty-function, unicorn/consistent-function-scoping
		function function_() {}
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		expect(getParsedType(() => {})).toBe("function");
		expect(getParsedType(function_)).toBe("function");
	});

	it("should return undefined", () => {
		// eslint-disable-next-line unicorn/no-useless-undefined
		expect(getParsedType(undefined)).toBe("undefined");
	});

	it("should return null", () => {
		// eslint-disable-next-line unicorn/no-null
		expect(getParsedType(null)).toBe("null");
	});

	it("should return array", () => {
		expect(getParsedType([])).toBe("array");
	});

	it("should return object", () => {
		expect(getParsedType({})).toBe("object");
	});

	it("should return globalThis.Date", () => {
		expect(getParsedType(new Date())).toBe("globalThis.Date");
	});

	it("should return luxon.DateTime", () => {
		expect(getParsedType(DateTime.now())).toBe("luxon.DateTime");
	});

	it("should return map", () => {
		expect(getParsedType(new Map())).toBe("map");
	});

	it("should return set", () => {
		expect(getParsedType(new Set())).toBe("set");
	});

	it("should return promise", () => {
		expect(getParsedType(Promise.resolve())).toBe("promise");
	});

	it("should return nan", () => {
		expect(getParsedType(Number.NaN)).toBe("nan");
	});

	it("should return infinity", () => {
		expect(getParsedType(Number.POSITIVE_INFINITY)).toBe("infinity");
		expect(getParsedType(Number.NEGATIVE_INFINITY)).toBe("infinity");
	});
});

describe("ParsedType", () => {
	it("should be an enum", () => {
		expect(ParsedType).toEqual({
			array: "array",
			bigint: "bigint",
			bigNumber: "bigNumber",
			boolean: "boolean",
			"globalThis.Date": "globalThis.Date",
			infinity: "infinity",
			"luxon.DateTime": "luxon.DateTime",
			function: "function",
			map: "map",
			nan: "nan",
			null: "null",
			number: "number",
			object: "object",
			promise: "promise",
			set: "set",
			string: "string",
			symbol: "symbol",
			undefined: "undefined",
			unknown: "unknown",
		});
	});

	it("should have a type of", () => {
		expectTypeOf<ParsedType>().toEqualTypeOf<
			| "array"
			| "bigint"
			| "bigNumber"
			| "boolean"
			| "globalThis.Date"
			| "infinity"
			| "luxon.DateTime"
			| "function"
			| "map"
			| "nan"
			| "null"
			| "number"
			| "object"
			| "promise"
			| "set"
			| "string"
			| "symbol"
			| "undefined"
			| "unknown"
		>();
	});
});
