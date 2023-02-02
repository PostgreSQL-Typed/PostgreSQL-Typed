import { describe, expect, expectTypeOf, it } from "vitest";

import { ParsedType } from "./getParsedType";
import { hasKeys } from "./hasKeys";

describe("hasKeys", () => {
	it("should return true for an object with keys", () => {
		const test1 = hasKeys<{ a: 1; b: 2 }>({ a: 1, b: 2 }, [
			["a", ParsedType.number],
			["b", ParsedType.number],
		]);
		expect(test1).toStrictEqual({
			success: true,
			obj: { a: 1, b: 2 },
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
			success: false,
			otherKeys: ["c"],
			missingKeys: [],
			invalidKeys: [],
		});
		if (!test1.success) expectTypeOf(test1.otherKeys).toEqualTypeOf<string[]>();
		else expect.fail();
	});

	it("should return false for an object with missing keys", () => {
		const test1 = hasKeys<{ a: 1; b: 2 }>({ a: 1 }, [
			["a", ParsedType.number],
			["b", ParsedType.number],
		]);
		expect(test1).toStrictEqual({
			success: false,
			otherKeys: [],
			missingKeys: ["b"],
			invalidKeys: [
				{
					expected: "number",
					objectKey: "b",
					received: "undefined",
				},
			],
		});
		if (!test1.success) expectTypeOf(test1.missingKeys).toEqualTypeOf<string[]>();
		else expect.fail();
	});

	it("should return false if types of the keys are incorrect", () => {
		const test1 = hasKeys<{ a: 1; b: 2 }>({ a: 1, b: "2" }, [
			["a", ParsedType.number],
			["b", ParsedType.number],
		]);
		expect(test1).toStrictEqual({
			success: false,
			otherKeys: [],
			missingKeys: [],
			invalidKeys: [
				{
					expected: "number",
					objectKey: "b",
					received: "string",
				},
			],
		});
		if (!test1.success) {
			expectTypeOf(test1.invalidKeys).toEqualTypeOf<
				{
					objectKey: string;
					expected: ParsedType | ParsedType[];
					received: ParsedType;
				}[]
			>();
		} else expect.fail();

		const test2 = hasKeys<{ a: 1; b: 2 | string }>({ a: 1, b: 2 }, [
			["a", ParsedType.number],
			["b", [ParsedType.number, ParsedType.string]],
		]);
		expect(test2).toStrictEqual({
			success: true,
			obj: { a: 1, b: 2 },
		});

		const test3 = hasKeys<{ a: 1; b: 2 | string }>({ a: 1, b: "2" }, [
			["a", ParsedType.number],
			["b", [ParsedType.number, ParsedType.string]],
		]);
		expect(test3).toStrictEqual({
			success: true,
			obj: { a: 1, b: "2" },
		});

		const test4 = hasKeys<{ a: 1; b: 2 | string }>({ a: 1, b: true }, [
			["a", ParsedType.number],
			["b", [ParsedType.number, ParsedType.string]],
		]);
		expect(test4).toStrictEqual({
			success: false,
			otherKeys: [],
			missingKeys: [],
			invalidKeys: [
				{
					expected: ["number", "string"],
					objectKey: "b",
					received: "boolean",
				},
			],
		});
	});

	it("should return false for an object with extra and missing keys", () => {
		const test1 = hasKeys<{ a: 1; b: 2 }>({ a: "1", c: 3 }, [
			["a", ParsedType.number],
			["b", ParsedType.number],
		]);
		expect(test1).toStrictEqual({
			success: false,
			otherKeys: ["c"],
			missingKeys: ["b"],
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
		});
		if (!test1.success) {
			expectTypeOf(test1.otherKeys).toEqualTypeOf<string[]>();
			expectTypeOf(test1.missingKeys).toEqualTypeOf<string[]>();
			expectTypeOf(test1.invalidKeys).toEqualTypeOf<
				{
					objectKey: string;
					expected: ParsedType | ParsedType[];
					received: ParsedType;
				}[]
			>();
		} else expect.fail();
	});
});
