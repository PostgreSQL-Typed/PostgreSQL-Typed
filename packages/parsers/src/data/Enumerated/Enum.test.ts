import { describe, expect, it, test } from "vitest";

import { Character } from "../Character/Character.js";
import { CharacterVarying } from "../Character/CharacterVarying.js";
import { Name } from "../Character/Name.js";
import { Text } from "../Character/Text.js";
import { UUID } from "../UUID/UUID.js";
import { Enum } from "./Enum.js";

describe("EnumConstructor", () => {
	test("_parse(...)", () => {
		//#region //* it should return OK when parsing succeeds
		const Enum1 = Enum.setEnums(["a", "b", "c"]);
		expect(Enum1.safeFrom("a").success).toBe(true);
		expect(Enum1.safeFrom(Enum1.from("b")).success).toBe(true);
		expect(
			Enum1.safeFrom({
				value: "c",
			}).success
		).toBe(true);

		// Test it with different enum values
		const Enum2 = Enum.setEnums(["abc", "def", "ghi", "8dd88328-3f69-48f0-9dc3-8292f8194a84"]);
		expect(Enum2.safeFrom("abc").success).toBe(true);
		expect(Enum2.safeFrom(Enum2.from("abc")).success).toBe(true);
		expect(Enum2.safeFrom(Character.setN(3).from("def")).success).toBe(true);
		expect(Enum2.safeFrom(CharacterVarying.setN(3).from("ghi")).success).toBe(true);
		expect(Enum2.safeFrom(Name.from("abc")).success).toBe(true);
		expect(Enum2.safeFrom(Text.from("def")).success).toBe(true);
		expect(Enum2.safeFrom(UUID.from("8dd88328-3f69-48f0-9dc3-8292f8194a84")).success).toBe(true);
		expect(
			Enum2.safeFrom({
				value: "abc",
			}).success
		).toBe(true);
		//#endregion

		//#region //* should return INVALID when parsing fails
		const boolean = Enum1.safeFrom(true as any);
		expect(boolean.success).toEqual(false);
		if (boolean.success) expect.fail();
		else {
			expect(boolean.error.issue).toStrictEqual({
				code: "invalid_type",
				expected: ["string", "object"],
				message: "Expected 'string' | 'object', received 'boolean'",
				received: "boolean",
			});
		}

		const tooBig = Enum1.safeFrom("abc");
		expect(tooBig.success).toEqual(false);
		if (tooBig.success) expect.fail();
		else {
			expect(tooBig.error.issue).toStrictEqual({
				code: "invalid_string",
				expected: ["a", "b", "c"],
				message: "Expected 'a' | 'b' | 'c', received 'abc'",
				received: "abc",
			});
		}

		//@ts-expect-error - testing invalid type
		const tooManyArguments = Enum1.safeFrom(1, 2);
		expect(tooManyArguments.success).toEqual(false);
		if (tooManyArguments.success) expect.fail();
		else {
			expect(tooManyArguments.error.issue).toStrictEqual({
				code: "too_big",
				exact: true,
				maximum: 1,
				message: "Function must have exactly 1 argument(s)",
				received: 2,
				type: "arguments",
			});
		}

		//@ts-expect-error - testing invalid type
		const tooFewArguments = Enum1.safeFrom();
		expect(tooFewArguments.success).toEqual(false);
		if (tooFewArguments.success) expect.fail();
		else {
			expect(tooFewArguments.error.issue).toStrictEqual({
				code: "too_small",
				exact: true,
				message: "Function must have exactly 1 argument(s)",
				minimum: 1,
				received: 0,
				type: "arguments",
			});
		}

		const unrecognizedKeys = Enum1.safeFrom({
			unrecognized: true,
			value: "a",
		} as any);
		expect(unrecognizedKeys.success).toEqual(false);
		if (unrecognizedKeys.success) expect.fail();
		else {
			expect(unrecognizedKeys.error.issue).toStrictEqual({
				code: "unrecognized_keys",
				keys: ["unrecognized"],
				message: "Unrecognized key in object: 'unrecognized'",
			});
		}

		const missingKeys = Enum1.safeFrom({
			// value: "a",
		} as any);
		expect(missingKeys.success).toEqual(false);
		if (missingKeys.success) expect.fail();
		else {
			expect(missingKeys.error.issue).toStrictEqual({
				code: "missing_keys",
				keys: ["value"],
				message: "Missing key in object: 'value'",
			});
		}

		const invalidKeys = Enum1.safeFrom({
			value: 1,
		} as any);
		expect(invalidKeys.success).toEqual(false);
		if (invalidKeys.success) expect.fail();
		else {
			expect(invalidKeys.error.issue).toStrictEqual({
				code: "invalid_key_type",
				expected: "string",
				message: "Expected 'string' for key 'value', received 'number'",
				objectKey: "value",
				received: "number",
			});
		}
		//#endregion
	});

	test("isEnum(...)", () => {
		//* it should return true in isEnum when value is a Enum
		const Enum1 = Enum.setEnums(["a", "b", "c"]);
		expect(Enum1.isEnum(Enum1.from("a"))).toBe(true);
		expect(Enum1.isEnum(Enum.setEnums(["foo"]).from("foo"), ["foo"])).toBe(true);

		//* it should return false in isEnum when value is not a Enum
		expect(Enum1.isEnum(1)).toEqual(false);
		expect(Enum1.isEnum("a")).toEqual(false);
		expect(Enum1.isEnum({})).toEqual(false);
		expect(Enum1.isEnum({ value: "a" })).toEqual(false);
		expect(Enum1.isEnum(Enum.setEnums(["foo"]).from("foo"))).toBe(false);
	});

	test("isAnyEnum(...)", () => {
		//* it should return true in isAnyEnum when value is a Enum with any enum
		expect(Enum.isAnyEnum(Enum.setEnums(["a", "b", "c"]).from("a"))).toBe(true);
		expect(Enum.isAnyEnum(Enum.setEnums(["abc", "def"]).from("abc"))).toBe(true);

		//* it should return false in isAnyEnum when value is not a Enum
		expect(Enum.isAnyEnum(1)).toEqual(false);
		expect(Enum.isAnyEnum("1")).toEqual(false);
		expect(Enum.isAnyEnum({})).toEqual(false);
		expect(Enum.isAnyEnum({ character: "1" })).toEqual(false);
	});

	test("setEnums(...)", () => {
		//* it should return a new Enum class with a new n
		const Enum2 = Enum.setEnums(["a", "b", "c"]);
		expect(Enum2.enums).toEqual(["a", "b", "c"]);

		//* It should error on invalid n values
		expect(() => Enum.setEnums(1.5 as any)).toThrowError("Expected 'array', received 'number'");
		expect(() => Enum.setEnums(["a", 1 as any])).toThrowError("Expected 'string', received 'number'");
	});

	test("get enums()", () => {
		//* it should return the n of the Enum class
		expect(Enum.enums).toEqual(["No", "Enums", "Setupped", "Yet"]);
		const Enum3 = Enum.setEnums(["a", "b", "c"]);
		expect(Enum3.enums).toEqual(["a", "b", "c"]);
	});
});

describe("Enum", () => {
	test("_equals(...)", () => {
		//#region //* it should return OK when parsing succeeds
		const Enum1 = Enum.setEnums(["a", "b", "c"]),
			enum1 = Enum1.from("a");
		expect(enum1.equals(Enum1.from("a"))).toBe(true);
		expect(enum1.equals(Enum1.from("b"))).toEqual(false);
		expect(enum1.equals("a")).toBe(true);
		expect(enum1.equals("b")).toEqual(false);
		expect(enum1.equals({ value: "a" })).toBe(true);
		expect(enum1.equals({ value: "b" })).toEqual(false);

		const safeEquals1 = enum1.safeEquals(Enum1.from("a"));
		expect(safeEquals1.success).toBe(true);
		if (safeEquals1.success) expect(safeEquals1.equals).toBe(true);
		else expect.fail();

		const safeEquals2 = enum1.safeEquals(Enum1.from("b"));
		expect(safeEquals2.success).toBe(true);
		if (safeEquals2.success) expect(safeEquals2.equals).toEqual(false);
		else expect.fail();

		const safeEquals3 = enum1.safeEquals("a");
		expect(safeEquals3.success).toBe(true);
		if (safeEquals3.success) expect(safeEquals3.equals).toBe(true);
		else expect.fail();

		const safeEquals4 = enum1.safeEquals("b");
		expect(safeEquals4.success).toBe(true);
		if (safeEquals4.success) expect(safeEquals4.equals).toEqual(false);
		else expect.fail();

		const safeEquals5 = enum1.safeEquals({ value: "a" });
		expect(safeEquals5.success).toBe(true);
		if (safeEquals5.success) expect(safeEquals5.equals).toBe(true);
		else expect.fail();

		const safeEquals6 = enum1.safeEquals({ value: "b" });
		expect(safeEquals6.success).toBe(true);
		if (safeEquals6.success) expect(safeEquals6.equals).toEqual(false);
		else expect.fail();
		//#endregion

		//#region //* should return INVALID when parsing fails
		const boolean = enum1.safeEquals(true as any);
		expect(boolean.success).toEqual(false);
		if (boolean.success) expect.fail();
		else {
			expect(boolean.error.issue).toStrictEqual({
				code: "invalid_type",
				expected: ["string", "object"],
				message: "Expected 'string' | 'object', received 'boolean'",
				received: "boolean",
			});
		}

		expect(() => enum1.equals(true as any)).toThrowError();
		//#endregion
	});

	test("toString()", () => {
		const enum1 = Enum.setEnums(["a"]).from("a");
		expect(enum1.toString()).toEqual("a");
	});

	test("toJSON()", () => {
		const enum1 = Enum.setEnums(["a"]).from("a");
		expect(enum1.toJSON()).toStrictEqual({ value: "a" });
	});

	test("get enum()", () => {
		const Enum1 = Enum.setEnums(["abc"]);
		expect(Enum1.from("abc").enum).toEqual("abc");
		expect(Enum1.from("abc").enum).toEqual("abc");
		expect(Enum1.from({ value: "abc" }).enum).toEqual("abc");
	});

	test("set enum(...)", () => {
		const Enum1 = Enum.setEnums(["a", "b", "c"]),
			enum1 = Enum1.from("a");
		enum1.enum = "b";
		expect(enum1.enum).toEqual("b");

		expect(() => (enum1.enum = "abc" as any)).toThrowError("Expected 'a' | 'b' | 'c', received 'abc'");
	});

	test("get value()", () => {
		const Enum1 = Enum.setEnums(["abc"]);
		expect(Enum1.from("abc").value).toEqual("abc");
		expect(Enum1.from("abc").value).toEqual("abc");
		expect(Enum1.from({ value: "abc" }).value).toEqual("abc");
	});

	test("set value(...)", () => {
		const Enum1 = Enum.setEnums(["a", "b", "c"]),
			enum1 = Enum1.from("a");
		enum1.value = "b";
		expect(enum1.value).toEqual("b");

		expect(() => (enum1.value = "abc" as any)).toThrowError("Expected 'a' | 'b' | 'c', received 'abc'");
	});

	test("get postgres()", () => {
		const Enum1 = Enum.setEnums(["abc"]);
		expect(Enum1.from("abc").postgres).toEqual("abc");
		expect(Enum1.from("abc").postgres).toEqual("abc");
		expect(Enum1.from({ value: "abc" }).postgres).toEqual("abc");
	});

	test("set postgres(...)", () => {
		const Enum1 = Enum.setEnums(["a", "b", "c"]),
			enum1 = Enum1.from("a");
		enum1.postgres = "b";
		expect(enum1.postgres).toEqual("b");

		expect(() => (enum1.postgres = "abc" as any)).toThrowError("Expected 'a' | 'b' | 'c', received 'abc'");
	});
});

describe("PostgreSQL", () => {
	it("should work with PostgreSQL's own tests", () => {
		//* https://github.com/postgres/postgres/blob/master/src/test/regress/sql/enum.sql
		const C = Enum.setEnums(["red", "orange", "yellow", "green", "blue", "purple"]);

		expect(() => C.from("red")).not.toThrowError();
		expect(() => C.from("mauve")).toThrowError();
	});
});
