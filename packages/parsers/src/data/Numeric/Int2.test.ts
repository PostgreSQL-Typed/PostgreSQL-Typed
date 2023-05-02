import { Client, types } from "pg";
import { describe, expect, it, test } from "vitest";

import { arrayParser } from "../../util/arrayParser.js";
import { arraySerializer } from "../../util/arraySerializer.js";
import { parser } from "../../util/parser.js";
import { serializer } from "../../util/serializer.js";
import { Int2 } from "./Int2.js";

describe("Int2Constructor", () => {
	test("_parse(...)", () => {
		//#region //* it should return OK when parsing succeeds
		expect(Int2.safeFrom(1).success).toBe(true);
		expect(Int2.safeFrom(32_767).success).toBe(true);
		expect(Int2.safeFrom(-32_768).success).toBe(true);
		expect(Int2.safeFrom("1").success).toBe(true);
		expect(Int2.safeFrom("32767").success).toBe(true);
		expect(Int2.safeFrom("-32768").success).toBe(true);
		expect(Int2.safeFrom(Int2.from(1)).success).toBe(true);
		expect(Int2.safeFrom(Int2.from(32_767)).success).toBe(true);
		expect(Int2.safeFrom(Int2.from(-32_768)).success).toBe(true);
		expect(
			Int2.safeFrom({
				value: 1,
			}).success
		).toBe(true);
		expect(
			Int2.safeFrom({
				value: 32_767,
			}).success
		).toBe(true);
		expect(
			Int2.safeFrom({
				value: -32_768,
			}).success
		).toBe(true);
		//#endregion

		//#region //* should return INVALID when parsing fails
		const boolean = Int2.safeFrom(true as any);
		expect(boolean.success).toEqual(false);
		if (boolean.success) expect.fail();
		else {
			expect(boolean.error.issue).toStrictEqual({
				code: "invalid_type",
				expected: ["number", "string", "object"],
				received: "boolean",
				message: "Expected 'number' | 'string' | 'object', received 'boolean'",
			});
		}

		const nanString = Int2.safeFrom("abc");
		expect(nanString.success).toEqual(false);
		if (nanString.success) expect.fail();
		else {
			expect(nanString.error.issue).toStrictEqual({
				code: "invalid_type",
				expected: "number",
				received: "nan",
				message: "Expected 'number', received 'nan'",
			});
		}

		const notFinite1 = Int2.safeFrom(Number.POSITIVE_INFINITY);
		expect(notFinite1.success).toEqual(false);
		if (notFinite1.success) expect.fail();
		else {
			expect(notFinite1.error.issue).toStrictEqual({
				code: "invalid_type",
				expected: ["number", "string", "object"],
				message: "Expected 'number' | 'string' | 'object', received 'infinity'",
				received: "infinity",
			});
		}

		const notFinite2 = Int2.safeFrom("Infinity");
		expect(notFinite2.success).toEqual(false);
		if (notFinite2.success) expect.fail();
		else {
			expect(notFinite2.error.issue).toStrictEqual({
				code: "not_finite",
				message: "Number must be finite",
			});
		}

		const notWhole = Int2.safeFrom(0.5);
		expect(notWhole.success).toEqual(false);
		if (notWhole.success) expect.fail();
		else {
			expect(notWhole.error.issue).toStrictEqual({
				code: "not_whole",
				message: "Number must be whole",
			});
		}

		const tooBig = Int2.safeFrom(32_768);
		expect(tooBig.success).toEqual(false);
		if (tooBig.success) expect.fail();
		else {
			expect(tooBig.error.issue).toStrictEqual({
				code: "too_big",
				type: "number",
				maximum: 32_767,
				inclusive: true,
				message: "Number must be less than or equal to 32767",
			});
		}

		const tooSmall = Int2.safeFrom(-32_769);
		expect(tooSmall.success).toEqual(false);
		if (tooSmall.success) expect.fail();
		else {
			expect(tooSmall.error.issue).toStrictEqual({
				code: "too_small",
				type: "number",
				minimum: -32_768,
				inclusive: true,
				message: "Number must be greater than or equal to -32768",
			});
		}

		//@ts-expect-error - testing invalid type
		const tooManyArguments = Int2.safeFrom(1, 2);
		expect(tooManyArguments.success).toEqual(false);
		if (tooManyArguments.success) expect.fail();
		else {
			expect(tooManyArguments.error.issue).toStrictEqual({
				code: "too_big",
				type: "arguments",
				maximum: 1,
				exact: true,
				message: "Function must have exactly 1 argument(s)",
			});
		}

		//@ts-expect-error - testing invalid type
		const tooFewArguments = Int2.safeFrom();
		expect(tooFewArguments.success).toEqual(false);
		if (tooFewArguments.success) expect.fail();
		else {
			expect(tooFewArguments.error.issue).toStrictEqual({
				code: "too_small",
				type: "arguments",
				minimum: 1,
				exact: true,
				message: "Function must have exactly 1 argument(s)",
			});
		}

		const unrecognizedKeys = Int2.safeFrom({
			value: 1,
			unrecognized: true,
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

		const missingKeys = Int2.safeFrom({
			// value: 1,
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

		const invalidKeys = Int2.safeFrom({
			value: "abc",
		} as any);
		expect(invalidKeys.success).toEqual(false);
		if (invalidKeys.success) expect.fail();
		else {
			expect(invalidKeys.error.issue).toStrictEqual({
				code: "invalid_key_type",
				objectKey: "value",
				expected: "number",
				received: "string",
				message: "Expected 'number' for key 'value', received 'string'",
			});
		}
		//#endregion
	});

	test("isInt2(...)", () => {
		//* it should return true in isInt2 when value is a Int2
		expect(Int2.isInt2(Int2.from(1))).toBe(true);

		//* it should return false in isInt2 when value is not a Int2
		expect(Int2.isInt2(1)).toEqual(false);
		expect(Int2.isInt2("1")).toEqual(false);
		expect(Int2.isInt2({})).toEqual(false);
		expect(Int2.isInt2({ value: 1 })).toEqual(false);
	});
});

describe("Int2", () => {
	test("_equals(...)", () => {
		//#region //* it should return OK when parsing succeeds
		const int2 = Int2.from(1);
		expect(int2.equals(Int2.from(1))).toBe(true);
		expect(int2.equals(Int2.from(2))).toEqual(false);
		expect(int2.equals(1)).toBe(true);
		expect(int2.equals(2)).toEqual(false);
		expect(int2.equals("1")).toBe(true);
		expect(int2.equals("2")).toEqual(false);
		expect(int2.equals({ value: 1 })).toBe(true);
		expect(int2.equals({ value: 2 })).toEqual(false);

		const safeEquals1 = int2.safeEquals(Int2.from(1));
		expect(safeEquals1.success).toBe(true);
		if (safeEquals1.success) expect(safeEquals1.equals).toBe(true);
		else expect.fail();

		const safeEquals2 = int2.safeEquals(Int2.from(2));
		expect(safeEquals2.success).toBe(true);
		if (safeEquals2.success) expect(safeEquals2.equals).toEqual(false);
		else expect.fail();

		const safeEquals3 = int2.safeEquals(1);
		expect(safeEquals3.success).toBe(true);
		if (safeEquals3.success) expect(safeEquals3.equals).toBe(true);
		else expect.fail();

		const safeEquals4 = int2.safeEquals(2);
		expect(safeEquals4.success).toBe(true);
		if (safeEquals4.success) expect(safeEquals4.equals).toEqual(false);
		else expect.fail();

		const safeEquals5 = int2.safeEquals("1");
		expect(safeEquals5.success).toBe(true);
		if (safeEquals5.success) expect(safeEquals5.equals).toBe(true);
		else expect.fail();

		const safeEquals6 = int2.safeEquals("2");
		expect(safeEquals6.success).toBe(true);
		if (safeEquals6.success) expect(safeEquals6.equals).toEqual(false);
		else expect.fail();

		const safeEquals7 = int2.safeEquals({ value: 1 });
		expect(safeEquals7.success).toBe(true);
		if (safeEquals7.success) expect(safeEquals7.equals).toBe(true);
		else expect.fail();

		const safeEquals8 = int2.safeEquals({ value: 2 });
		expect(safeEquals8.success).toBe(true);
		if (safeEquals8.success) expect(safeEquals8.equals).toEqual(false);
		else expect.fail();
		//#endregion

		//#region //* should return INVALID when parsing fails
		const boolean = int2.safeEquals(true as any);
		expect(boolean.success).toEqual(false);
		if (boolean.success) expect.fail();
		else {
			expect(boolean.error.issue).toStrictEqual({
				code: "invalid_type",
				expected: ["number", "string", "object"],
				received: "boolean",
				message: "Expected 'number' | 'string' | 'object', received 'boolean'",
			});
		}

		expect(() => int2.equals(true as any)).toThrowError();
		//#endregion
	});

	test("toString()", () => {
		const int2 = Int2.from(1);
		expect(int2.toString()).toEqual("1");
	});

	test("toNumber()", () => {
		const int2 = Int2.from(1);
		expect(int2.toNumber()).toEqual(1);
	});

	test("toJSON()", () => {
		const int2 = Int2.from(1);
		expect(int2.toJSON()).toStrictEqual({ value: 1 });
	});

	test("get int2()", () => {
		expect(Int2.from(1).int2).toEqual(1);
		expect(Int2.from("2").int2).toEqual(2);
		expect(Int2.from({ value: 3 }).int2).toEqual(3);
	});

	test("set int2(...)", () => {
		const int2 = Int2.from(1);
		int2.int2 = 2;
		expect(int2.int2).toEqual(2);

		expect(() => (int2.int2 = 32_768)).toThrowError("Number must be less than or equal to 32767");
	});

	test("get value()", () => {
		expect(Int2.from(1).value).toEqual(1);
		expect(Int2.from("2").value).toEqual(2);
		expect(Int2.from({ value: 3 }).value).toEqual(3);
	});

	test("set value(...)", () => {
		const int2 = Int2.from(1);
		int2.value = 2;
		expect(int2.value).toEqual(2);

		expect(() => (int2.value = 32_768)).toThrowError("Number must be less than or equal to 32767");
	});

	test("get postgres()", () => {
		expect(Int2.from(1).postgres).toEqual("1");
		expect(Int2.from("2").postgres).toEqual("2");
		expect(Int2.from({ value: 3 }).postgres).toEqual("3");
	});

	test("set postgres(...)", () => {
		const int2 = Int2.from(1);
		int2.postgres = "2";
		expect(int2.postgres).toEqual("2");

		expect(() => (int2.postgres = "32768")).toThrowError("Number must be less than or equal to 32767");
	});
});

describe("PostgreSQL", () => {
	it("should work with PostgreSQL's own tests", () => {
		//* https://github.com/postgres/postgres/blob/master/src/test/regress/sql/int2.sql
		expect(() => Int2.from("34")).not.toThrowError();
		expect(() => Int2.from("asdf")).toThrowError();
		expect(() => Int2.from("50000")).toThrowError();
	});

	it("should be returned as a Int2", async () => {
		const client = new Client({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			application_name: "int2.test.ts",
		});

		try {
			await client.connect();

			//* PG has a native parser for the '_int2' type
			types.setTypeParser(1005 as any, value => value);

			await client.query(`
				CREATE TABLE IF NOT EXISTS public.vitestint2 (
					int2 int2 NULL,
					_int2 _int2 NULL
				)
			`);

			const [singleInput, arrayInput] = [serializer<Int2>(Int2)(Int2.from(1)), arraySerializer<Int2>(Int2, ",")([Int2.from(2), Int2.from(3)])];

			expect(singleInput).toEqual("1");
			expect(arrayInput).toEqual("{2,3}");

			await client.query(
				`
				INSERT INTO public.vitestint2 (int2, _int2)
				VALUES (
					$1::int2,
					$2::_int2
				)
			`,
				[singleInput, arrayInput]
			);
		} catch {
			expect.fail("Failed to connect to PostgreSQL");
		}

		const result = await client.query(`
			SELECT * FROM public.vitestint2
		`);

		result.rows[0].int2 = parser<Int2>(Int2)(result.rows[0].int2);
		result.rows[0]._int2 = arrayParser<Int2>(Int2, ",")(result.rows[0]._int2);

		expect(Int2.isInt2(result.rows[0].int2)).toBe(true);
		expect(Int2.from(1).equals(result.rows[0].int2)).toBe(true);

		const [a, b] = result.rows[0]._int2;
		expect(result.rows[0]._int2).toHaveLength(2);
		expect(Int2.isInt2(a)).toBe(true);
		expect(Int2.from(2).equals(a)).toBe(true);
		expect(Int2.isInt2(b)).toBe(true);
		expect(Int2.from(3).equals(b)).toBe(true);

		try {
			await client.query(`
				DROP TABLE public.vitestint2
			`);

			await client.end();
		} catch {
			expect.fail("Failed to disconnect from PostgreSQL");
		}
	});
});
