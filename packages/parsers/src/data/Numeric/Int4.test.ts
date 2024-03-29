import { Client, types } from "pg";
import { describe, expect, it, test } from "vitest";

import { arrayParser } from "../../util/arrayParser.js";
import { arraySerializer } from "../../util/arraySerializer.js";
import { parser } from "../../util/parser.js";
import { serializer } from "../../util/serializer.js";
import { Int4 } from "./Int4.js";

describe("Int4Constructor", () => {
	test("_parse(...)", () => {
		//#region //* it should return OK when parsing succeeds
		expect(Int4.safeFrom(1).success).toBe(true);
		expect(Int4.safeFrom(2_147_483_647).success).toBe(true);
		expect(Int4.safeFrom(-2_147_483_648).success).toBe(true);
		expect(Int4.safeFrom("1").success).toBe(true);
		expect(Int4.safeFrom("2147483647").success).toBe(true);
		expect(Int4.safeFrom("-2147483648").success).toBe(true);
		expect(Int4.safeFrom(Int4.from(1)).success).toBe(true);
		expect(Int4.safeFrom(Int4.from(2_147_483_647)).success).toBe(true);
		expect(Int4.safeFrom(Int4.from(-2_147_483_648)).success).toBe(true);
		expect(
			Int4.safeFrom({
				value: 1,
			}).success
		).toBe(true);
		expect(
			Int4.safeFrom({
				value: 2_147_483_647,
			}).success
		).toBe(true);
		expect(
			Int4.safeFrom({
				value: -2_147_483_648,
			}).success
		).toBe(true);
		//#endregion

		//#region //* should return INVALID when parsing fails
		const boolean = Int4.safeFrom(true as any);
		expect(boolean.success).toEqual(false);
		if (boolean.success) expect.fail();
		else {
			expect(boolean.error.issue).toStrictEqual({
				code: "invalid_type",
				expected: ["number", "string", "object"],
				message: "Expected 'number' | 'string' | 'object', received 'boolean'",
				received: "boolean",
			});
		}

		const nanString = Int4.safeFrom("abc");
		expect(nanString.success).toEqual(false);
		if (nanString.success) expect.fail();
		else {
			expect(nanString.error.issue).toStrictEqual({
				code: "invalid_type",
				expected: "number",
				message: "Expected 'number', received 'nan'",
				received: "nan",
			});
		}

		const notFinite = Int4.safeFrom("Infinity");
		expect(notFinite.success).toEqual(false);
		if (notFinite.success) expect.fail();
		else {
			expect(notFinite.error.issue).toStrictEqual({
				code: "not_finite",
				message: "Number must be finite",
				received: Number.POSITIVE_INFINITY,
			});
		}

		const notWhole = Int4.safeFrom(0.5);
		expect(notWhole.success).toEqual(false);
		if (notWhole.success) expect.fail();
		else {
			expect(notWhole.error.issue).toStrictEqual({
				code: "not_whole",
				message: "Number must be whole",
				received: 0.5,
			});
		}

		const tooBig = Int4.safeFrom(2_147_483_648);
		expect(tooBig.success).toEqual(false);
		if (tooBig.success) expect.fail();
		else {
			expect(tooBig.error.issue).toStrictEqual({
				code: "too_big",
				inclusive: true,
				maximum: 2_147_483_647,
				message: "Number must be less than or equal to 2147483647",
				received: 2_147_483_648,
				type: "number",
			});
		}

		const tooSmall = Int4.safeFrom(-2_147_483_649);
		expect(tooSmall.success).toEqual(false);
		if (tooSmall.success) expect.fail();
		else {
			expect(tooSmall.error.issue).toStrictEqual({
				code: "too_small",
				inclusive: true,
				message: "Number must be greater than or equal to -2147483648",
				minimum: -2_147_483_648,
				received: -2_147_483_649,
				type: "number",
			});
		}

		//@ts-expect-error - testing invalid type
		const tooManyArguments = Int4.safeFrom(1, 2);
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
		const tooFewArguments = Int4.safeFrom();
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

		const unrecognizedKeys = Int4.safeFrom({
			unrecognized: true,
			value: 1,
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

		const missingKeys = Int4.safeFrom({
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

		const invalidKeys = Int4.safeFrom({
			value: "abc",
		} as any);
		expect(invalidKeys.success).toEqual(false);
		if (invalidKeys.success) expect.fail();
		else {
			expect(invalidKeys.error.issue).toStrictEqual({
				code: "invalid_key_type",
				expected: "number",
				message: "Expected 'number' for key 'value', received 'string'",
				objectKey: "value",
				received: "string",
			});
		}
		//#endregion
	});

	test("isInt4(...)", () => {
		//* it should return true in isInt4 when value is a Int4
		expect(Int4.isInt4(Int4.from(1))).toBe(true);

		//* it should return false in isInt4 when value is not a Int4
		expect(Int4.isInt4(1)).toEqual(false);
		expect(Int4.isInt4("1")).toEqual(false);
		expect(Int4.isInt4({})).toEqual(false);
		expect(Int4.isInt4({ value: 1 })).toEqual(false);
	});
});

describe("Int4", () => {
	test("_equals(...)", () => {
		//#region //* it should return OK when parsing succeeds
		const int4 = Int4.from(1);
		expect(int4.equals(Int4.from(1))).toBe(true);
		expect(int4.equals(Int4.from(2))).toEqual(false);
		expect(int4.equals(1)).toBe(true);
		expect(int4.equals(2)).toEqual(false);
		expect(int4.equals("1")).toBe(true);
		expect(int4.equals("2")).toEqual(false);
		expect(int4.equals({ value: 1 })).toBe(true);
		expect(int4.equals({ value: 2 })).toEqual(false);

		const safeEquals1 = int4.safeEquals(Int4.from(1));
		expect(safeEquals1.success).toBe(true);
		if (safeEquals1.success) expect(safeEquals1.equals).toBe(true);
		else expect.fail();

		const safeEquals2 = int4.safeEquals(Int4.from(2));
		expect(safeEquals2.success).toBe(true);
		if (safeEquals2.success) expect(safeEquals2.equals).toEqual(false);
		else expect.fail();

		const safeEquals3 = int4.safeEquals(1);
		expect(safeEquals3.success).toBe(true);
		if (safeEquals3.success) expect(safeEquals3.equals).toBe(true);
		else expect.fail();

		const safeEquals4 = int4.safeEquals(2);
		expect(safeEquals4.success).toBe(true);
		if (safeEquals4.success) expect(safeEquals4.equals).toEqual(false);
		else expect.fail();

		const safeEquals5 = int4.safeEquals("1");
		expect(safeEquals5.success).toBe(true);
		if (safeEquals5.success) expect(safeEquals5.equals).toBe(true);
		else expect.fail();

		const safeEquals6 = int4.safeEquals("2");
		expect(safeEquals6.success).toBe(true);
		if (safeEquals6.success) expect(safeEquals6.equals).toEqual(false);
		else expect.fail();

		const safeEquals7 = int4.safeEquals({ value: 1 });
		expect(safeEquals7.success).toBe(true);
		if (safeEquals7.success) expect(safeEquals7.equals).toBe(true);
		else expect.fail();

		const safeEquals8 = int4.safeEquals({ value: 2 });
		expect(safeEquals8.success).toBe(true);
		if (safeEquals8.success) expect(safeEquals8.equals).toEqual(false);
		else expect.fail();
		//#endregion

		//#region //* should return INVALID when parsing fails
		const boolean = int4.safeEquals(true as any);
		expect(boolean.success).toEqual(false);
		if (boolean.success) expect.fail();
		else {
			expect(boolean.error.issue).toStrictEqual({
				code: "invalid_type",
				expected: ["number", "string", "object"],
				message: "Expected 'number' | 'string' | 'object', received 'boolean'",
				received: "boolean",
			});
		}

		expect(() => int4.equals(true as any)).toThrowError();
		//#endregion
	});

	test("toString()", () => {
		const int4 = Int4.from(1);
		expect(int4.toString()).toEqual("1");
	});

	test("toNumber()", () => {
		const int4 = Int4.from(1);
		expect(int4.toNumber()).toEqual(1);
	});

	test("toJSON()", () => {
		const int4 = Int4.from(1);
		expect(int4.toJSON()).toStrictEqual({ value: 1 });
	});

	test("get int4()", () => {
		expect(Int4.from(1).int4).toEqual(1);
		expect(Int4.from("2").int4).toEqual(2);
		expect(Int4.from({ value: 3 }).int4).toEqual(3);
	});

	test("set int4(...)", () => {
		const int4 = Int4.from(1);
		int4.int4 = 2;
		expect(int4.int4).toEqual(2);

		expect(() => (int4.int4 = 2_147_483_648)).toThrowError("Number must be less than or equal to 2147483647");
	});

	test("get value()", () => {
		expect(Int4.from(1).value).toEqual(1);
		expect(Int4.from("2").value).toEqual(2);
		expect(Int4.from({ value: 3 }).value).toEqual(3);
	});

	test("set value(...)", () => {
		const int4 = Int4.from(1);
		int4.value = 2;
		expect(int4.value).toEqual(2);

		expect(() => (int4.value = 2_147_483_648)).toThrowError("Number must be less than or equal to 2147483647");
	});

	test("get postgres()", () => {
		expect(Int4.from(1).postgres).toEqual("1");
		expect(Int4.from("2").postgres).toEqual("2");
		expect(Int4.from({ value: 3 }).postgres).toEqual("3");
	});

	test("set postgres(...)", () => {
		const int4 = Int4.from(1);
		int4.postgres = "2";
		expect(int4.postgres).toEqual("2");

		expect(() => (int4.postgres = "2147483648")).toThrowError("Number must be less than or equal to 2147483647");
	});
});

describe("PostgreSQL", () => {
	it("should work with PostgreSQL's own tests", () => {
		//* https://github.com/postgres/postgres/blob/master/src/test/regress/sql/int4.sql
		expect(() => Int4.from("34")).not.toThrowError();
		expect(() => Int4.from("asdf")).toThrowError();
		expect(() => Int4.from("1000000000000")).toThrowError();
	});

	it("should be returned as a Int4", async () => {
		const client = new Client({
			application_name: "int4.test.ts",
			database: "postgres",
			host: "localhost",
			password: "password",
			port: 5432,
			user: "postgres",
		});

		try {
			await client.connect();

			//* PG has a native parser for the '_int4' type
			types.setTypeParser(1007 as any, value => value);

			await client.query(`
				CREATE TABLE IF NOT EXISTS public.vitestint4 (
					int4 int4 NULL,
					_int4 _int4 NULL
				)
			`);

			const [singleInput, arrayInput] = [serializer<Int4>(Int4)(Int4.from(1)), arraySerializer<Int4>(Int4, ",")([Int4.from(2), Int4.from(3)])];

			expect(singleInput).toEqual("1");
			expect(arrayInput).toEqual("{2,3}");

			await client.query(
				`
				INSERT INTO public.vitestint4 (int4, _int4)
				VALUES (
					$1::int4,
					$2::_int4
				)
			`,
				[singleInput, arrayInput]
			);
		} catch {
			expect.fail("Failed to connect to PostgreSQL");
		}

		const result = await client.query(`
			SELECT * FROM public.vitestint4
		`);

		result.rows[0].int4 = parser<Int4>(Int4)(result.rows[0].int4);
		result.rows[0]._int4 = arrayParser<Int4>(Int4)(result.rows[0]._int4);

		expect(Int4.isInt4(result.rows[0].int4)).toBe(true);
		expect(Int4.from(1).equals(result.rows[0].int4)).toBe(true);

		const [a, b] = result.rows[0]._int4;
		expect(result.rows[0]._int4).toHaveLength(2);
		expect(Int4.isInt4(a)).toBe(true);
		expect(Int4.from(2).equals(a)).toBe(true);
		expect(Int4.isInt4(b)).toBe(true);
		expect(Int4.from(3).equals(b)).toBe(true);

		try {
			await client.query(`
				DROP TABLE public.vitestint4
			`);

			await client.end();
		} catch {
			expect.fail("Failed to disconnect from PostgreSQL");
		}
	});
});
