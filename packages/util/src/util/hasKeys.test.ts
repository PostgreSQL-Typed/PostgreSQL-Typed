import { describe, expect, expectTypeOf, it } from "vitest";

import { ParsedType } from "./getParsedType.js";
import { hasKeys } from "./hasKeys.js";

describe("hasKeys", () => {
	it("should return true for an object with keys", () => {
		const test1 = hasKeys<{ a: 1; b: 2 }>({ a: 1, b: 2 }, [
			["a", ParsedType.number],
			["b", ParsedType.number],
		]);
		expect(test1).toStrictEqual({
			obj: { a: 1, b: 2 },
			success: true,
		});
		if (test1.success) expectTypeOf(test1.obj).toEqualTypeOf<{ a: 1; b: 2 }>();
		else expect.fail();
	});

	it("should return false for an object with extra keys", () => {
		const test1 = hasKeys<{ a: 1; b: 2 }>({ a: 1, b: 2, c: 3 }, [
			["a", ParsedType.number],
			["b", ParsedType.number],
		]);
		expect(test1).toStrictEqual({
			invalidKeys: [],
			missingKeys: [],
			otherKeys: ["c"],
			success: false,
		});
		if (test1.success) expect.fail();
		else expectTypeOf(test1.otherKeys).toEqualTypeOf<string[]>();
	});

	it("should return false for an object with missing keys", () => {
		const test1 = hasKeys<{ a: 1; b: 2 }>({ a: 1 }, [
			["a", ParsedType.number],
			["b", ParsedType.number],
		]);
		expect(test1).toStrictEqual({
			invalidKeys: [
				{
					expected: "number",
					objectKey: "b",
					received: "undefined",
				},
			],
			missingKeys: ["b"],
			otherKeys: [],
			success: false,
		});
		if (test1.success) expect.fail();
		else expectTypeOf(test1.missingKeys).toEqualTypeOf<string[]>();

		const test2 = hasKeys<{ a: 1; b: 2 }>({}, [
			["a", [ParsedType.number, ParsedType.undefined]],
			["b", [ParsedType.number, ParsedType.undefined]],
		]);
		expect(test2).toStrictEqual({
			invalidKeys: [],
			missingKeys: ["a", "b"],
			otherKeys: [],
			success: false,
		});
		if (test1.success) expect.fail();
		else expectTypeOf(test1.missingKeys).toEqualTypeOf<string[]>();
	});

	it("should return false if types of the keys are incorrect", () => {
		const test1 = hasKeys<{ a: 1; b: 2 }>({ a: 1, b: "2" }, [
			["a", ParsedType.number],
			["b", ParsedType.number],
		]);
		expect(test1).toStrictEqual({
			invalidKeys: [
				{
					expected: "number",
					objectKey: "b",
					received: "string",
				},
			],
			missingKeys: [],
			otherKeys: [],
			success: false,
		});
		if (test1.success) expect.fail();
		else {
			expectTypeOf(test1.invalidKeys).toEqualTypeOf<
				{
					objectKey: string;
					expected: ParsedType | ParsedType[];
					received: ParsedType;
				}[]
			>();
		}

		const test2 = hasKeys<{ a: 1; b: 2 | string }>({ a: 1, b: 2 }, [
			["a", ParsedType.number],
			["b", [ParsedType.number, ParsedType.string]],
		]);
		expect(test2).toStrictEqual({
			obj: { a: 1, b: 2 },
			success: true,
		});

		const test3 = hasKeys<{ a: 1; b: 2 | string }>({ a: 1, b: "2" }, [
			["a", ParsedType.number],
			["b", [ParsedType.number, ParsedType.string]],
		]);
		expect(test3).toStrictEqual({
			obj: { a: 1, b: "2" },
			success: true,
		});

		const test4 = hasKeys<{ a: 1; b: 2 | string }>({ a: 1, b: true }, [
			["a", ParsedType.number],
			["b", [ParsedType.number, ParsedType.string]],
		]);
		expect(test4).toStrictEqual({
			invalidKeys: [
				{
					expected: ["number", "string"],
					objectKey: "b",
					received: "boolean",
				},
			],
			missingKeys: [],
			otherKeys: [],
			success: false,
		});
	});

	it("should return false for an object with extra and missing keys", () => {
		const test1 = hasKeys<{ a: 1; b: 2 }>({ a: "1", c: 3 }, [
			["a", ParsedType.number],
			["b", ParsedType.number],
		]);
		expect(test1).toStrictEqual({
			invalidKeys: [
				{
					expected: "number",
					objectKey: "a",
					received: "string",
				},
				{
					expected: "number",
					objectKey: "b",
					received: "undefined",
				},
			],
			missingKeys: ["b"],
			otherKeys: ["c"],
			success: false,
		});
		if (test1.success) expect.fail();
		else {
			expectTypeOf(test1.otherKeys).toEqualTypeOf<string[]>();
			expectTypeOf(test1.missingKeys).toEqualTypeOf<string[]>();
			expectTypeOf(test1.invalidKeys).toEqualTypeOf<
				{
					objectKey: string;
					expected: ParsedType | ParsedType[];
					received: ParsedType;
				}[]
			>();
		}
	});
});
