import { Client } from "pg";
import { describe, expect, it, test } from "vitest";

import { Int8 } from "./Int8";

describe("Int8Constructor", () => {
	test("_parse(...)", () => {
		//#region //* it should return OK when parsing succeeds
		expect(Int8.safeFrom(1).success).toBe(true);
		expect(Int8.safeFrom(BigInt("9223372036854775807")).success).toBe(true);
		expect(Int8.safeFrom(BigInt("-9223372036854775808")).success).toBe(true);
		expect(Int8.safeFrom("1").success).toBe(true);
		expect(Int8.safeFrom("9223372036854775807").success).toBe(true);
		expect(Int8.safeFrom("-9223372036854775808").success).toBe(true);
		expect(Int8.safeFrom(Int8.from(1)).success).toBe(true);
		expect(Int8.safeFrom(BigInt("9223372036854775807")).success).toBe(true);
		expect(Int8.safeFrom(BigInt("-9223372036854775808")).success).toBe(true);
		expect(
			Int8.safeFrom({
				int8: BigInt("1"),
			}).success
		).toBe(true);
		expect(
			Int8.safeFrom({
				int8: BigInt("9223372036854775807"),
			}).success
		).toBe(true);
		expect(
			Int8.safeFrom({
				int8: BigInt("-9223372036854775808"),
			}).success
		).toBe(true);
		//#endregion

		//#region //* should return INVALID when parsing fails
		const boolean = Int8.safeFrom(true as any);
		expect(boolean.success).toEqual(false);
		if (!boolean.success) {
			expect(boolean.error.issue).toStrictEqual({
				code: "invalid_type",
				expected: ["bigint", "number", "string", "object"],
				received: "boolean",
				message: "Expected 'bigint' | 'number' | 'string' | 'object', received 'boolean'",
			});
		} else expect.fail();

		const invalidString = Int8.safeFrom("abc");
		expect(invalidString.success).toEqual(false);
		if (!invalidString.success) {
			expect(invalidString.error.issue).toStrictEqual({
				code: "invalid_type",
				expected: "bigint",
				received: "string",
				message: "Expected 'bigint', received 'string'",
			});
		} else expect.fail();

		const nanNumber = Int8.safeFrom(NaN);
		expect(nanNumber.success).toEqual(false);
		if (!nanNumber.success) {
			expect(nanNumber.error.issue).toStrictEqual({
				code: "invalid_type",
				expected: ["bigint", "number", "string", "object"],
				received: "nan",
				message: "Expected 'bigint' | 'number' | 'string' | 'object', received 'nan'",
			});
		} else expect.fail();

		const notFinite = Int8.safeFrom(Infinity);
		expect(notFinite.success).toEqual(false);
		if (!notFinite.success) {
			expect(notFinite.error.issue).toStrictEqual({
				code: "invalid_type",
				expected: ["bigint", "number", "string", "object"],
				message: "Expected 'bigint' | 'number' | 'string' | 'object', received 'infinity'",
				received: "infinity",
			});
		} else expect.fail();

		const notWhole = Int8.safeFrom(0.5);
		expect(notWhole.success).toEqual(false);
		if (!notWhole.success) {
			expect(notWhole.error.issue).toStrictEqual({
				code: "not_whole",
				message: "Number must be whole",
			});
		} else expect.fail();

		const tooBig = Int8.safeFrom(BigInt("9223372036854775808"));
		expect(tooBig.success).toEqual(false);
		if (!tooBig.success) {
			expect(tooBig.error.issue).toStrictEqual({
				code: "too_big",
				type: "bigint",
				maximum: BigInt("9223372036854775807"),
				inclusive: true,
				message: "BigInt must be less than or equal to 9223372036854775807",
			});
		} else expect.fail();

		const tooSmall = Int8.safeFrom(BigInt("-9223372036854775809"));
		expect(tooSmall.success).toEqual(false);
		if (!tooSmall.success) {
			expect(tooSmall.error.issue).toStrictEqual({
				code: "too_small",
				type: "bigint",
				minimum: BigInt("-9223372036854775808"),
				inclusive: true,
				message: "BigInt must be greater than or equal to -9223372036854775808",
			});
		} else expect.fail();

		//@ts-expect-error - testing invalid type
		const tooManyArguments = Int8.safeFrom(1, 2);
		expect(tooManyArguments.success).toEqual(false);
		if (!tooManyArguments.success) {
			expect(tooManyArguments.error.issue).toStrictEqual({
				code: "too_big",
				type: "arguments",
				maximum: 1,
				exact: true,
				message: "Function must have exactly 1 argument(s)",
			});
		} else expect.fail();

		//@ts-expect-error - testing invalid type
		const tooFewArguments = Int8.safeFrom();
		expect(tooFewArguments.success).toEqual(false);
		if (!tooFewArguments.success) {
			expect(tooFewArguments.error.issue).toStrictEqual({
				code: "too_small",
				type: "arguments",
				minimum: 1,
				exact: true,
				message: "Function must have exactly 1 argument(s)",
			});
		} else expect.fail();

		const unrecognizedKeys = Int8.safeFrom({
			int8: 1,
			unrecognized: true,
		} as any);
		expect(unrecognizedKeys.success).toEqual(false);
		if (!unrecognizedKeys.success) {
			expect(unrecognizedKeys.error.issue).toStrictEqual({
				code: "unrecognized_keys",
				keys: ["unrecognized"],
				message: "Unrecognized key in object: 'unrecognized'",
			});
		} else expect.fail();

		const missingKeys = Int8.safeFrom({
			// int8: 1,
		} as any);
		expect(missingKeys.success).toEqual(false);
		if (!missingKeys.success) {
			expect(missingKeys.error.issue).toStrictEqual({
				code: "missing_keys",
				keys: ["int8"],
				message: "Missing key in object: 'int8'",
			});
		} else expect.fail();

		const invalidKeys = Int8.safeFrom({
			int8: "abc",
		} as any);
		expect(invalidKeys.success).toEqual(false);
		if (!invalidKeys.success) {
			expect(invalidKeys.error.issue).toStrictEqual({
				code: "invalid_key_type",
				objectKey: "int8",
				expected: "bigint",
				received: "string",
				message: "Expected 'bigint' for key 'int8', received 'string'",
			});
		} else expect.fail();
		//#endregion
	});

	test("isInt8(...)", () => {
		//* it should return true in isInt8 when value is a Int8
		expect(Int8.isInt8(Int8.from(1))).toBe(true);

		//* it should return false in isInt8 when value is not a Int8
		expect(Int8.isInt8(1)).toEqual(false);
		expect(Int8.isInt8("1")).toEqual(false);
		expect(Int8.isInt8({})).toEqual(false);
		expect(Int8.isInt8({ int8: 1 })).toEqual(false);
	});
});

describe("Int8", () => {
	test("_equals(...)", () => {
		//#region //* it should return OK when parsing succeeds
		const int8 = Int8.from(1);
		expect(int8.equals(Int8.from(1))).toBe(true);
		expect(int8.equals(Int8.from(2))).toEqual(false);
		expect(int8.equals(1)).toBe(true);
		expect(int8.equals(2)).toEqual(false);
		expect(int8.equals("1")).toBe(true);
		expect(int8.equals("2")).toEqual(false);
		expect(int8.equals(BigInt("1"))).toBe(true);
		expect(int8.equals(BigInt("2"))).toEqual(false);
		expect(int8.equals({ int8: BigInt("1") })).toBe(true);
		expect(int8.equals({ int8: BigInt("2") })).toEqual(false);

		const safeEquals1 = int8.safeEquals(Int8.from(1));
		expect(safeEquals1.success).toBe(true);
		if (safeEquals1.success) expect(safeEquals1.equals).toBe(true);
		else expect.fail();

		const safeEquals2 = int8.safeEquals(Int8.from(2));
		expect(safeEquals2.success).toBe(true);
		if (safeEquals2.success) expect(safeEquals2.equals).toEqual(false);
		else expect.fail();

		const safeEquals3 = int8.safeEquals(1);
		expect(safeEquals3.success).toBe(true);
		if (safeEquals3.success) expect(safeEquals3.equals).toBe(true);
		else expect.fail();

		const safeEquals4 = int8.safeEquals(2);
		expect(safeEquals4.success).toBe(true);
		if (safeEquals4.success) expect(safeEquals4.equals).toEqual(false);
		else expect.fail();

		const safeEquals5 = int8.safeEquals("1");
		expect(safeEquals5.success).toBe(true);
		if (safeEquals5.success) expect(safeEquals5.equals).toBe(true);
		else expect.fail();

		const safeEquals6 = int8.safeEquals("2");
		expect(safeEquals6.success).toBe(true);
		if (safeEquals6.success) expect(safeEquals6.equals).toEqual(false);
		else expect.fail();

		const safeEquals7 = int8.safeEquals(BigInt("1"));
		expect(safeEquals7.success).toBe(true);
		if (safeEquals7.success) expect(safeEquals7.equals).toBe(true);
		else expect.fail();

		const safeEquals8 = int8.safeEquals(BigInt("2"));
		expect(safeEquals8.success).toBe(true);
		if (safeEquals8.success) expect(safeEquals8.equals).toEqual(false);
		else expect.fail();

		const safeEquals9 = int8.safeEquals({ int8: BigInt("1") });
		expect(safeEquals9.success).toBe(true);
		if (safeEquals9.success) expect(safeEquals9.equals).toBe(true);
		else expect.fail();

		const safeEquals10 = int8.safeEquals({ int8: BigInt("2") });
		expect(safeEquals10.success).toBe(true);
		if (safeEquals10.success) expect(safeEquals10.equals).toEqual(false);
		else expect.fail();
		//#endregion

		//#region //* should return INVALID when parsing fails
		const boolean = int8.safeEquals(true as any);
		expect(boolean.success).toEqual(false);
		if (!boolean.success) {
			expect(boolean.error.issue).toStrictEqual({
				code: "invalid_type",
				expected: ["bigint", "number", "string", "object"],
				received: "boolean",
				message: "Expected 'bigint' | 'number' | 'string' | 'object', received 'boolean'",
			});
		} else expect.fail();

		expect(() => int8.equals(true as any)).toThrowError();
		//#endregion
	});

	test("toString()", () => {
		const int8 = Int8.from(1);
		expect(int8.toString()).toEqual("1");
	});

	test("toBigint()", () => {
		const int8 = Int8.from(1);
		expect(int8.toBigint()).toEqual(BigInt(1));
	});

	test("toJSON()", () => {
		const int8 = Int8.from(1);
		expect(int8.toJSON()).toStrictEqual({ int8: BigInt(1) });
	});

	test("get int8()", () => {
		expect(Int8.from(1).int8).toEqual(BigInt(1));
		expect(Int8.from("2").int8).toEqual(BigInt(2));
		expect(Int8.from({ int8: BigInt(3) }).int8).toEqual(BigInt(3));
	});

	test("set int8(...)", () => {
		const int8 = Int8.from(1);
		int8.int8 = BigInt(2);
		expect(int8.int8).toEqual(BigInt(2));

		expect(() => (int8.int8 = BigInt("9223372036854775808"))).toThrowError("BigInt must be less than or equal to 9223372036854775807");
	});
});

describe("PostgreSQL", () => {
	it("should work with PostgreSQL's own tests", () => {
		//* https://github.com/postgres/postgres/blob/master/src/test/regress/sql/int8.sql
		expect(() => Int8.from("34")).not.toThrowError();
		expect(() => Int8.from("asdf")).toThrowError();
		expect(() => Int8.from("10000000000000000000")).toThrowError();
	});

	it("should be returned as a Int8", async () => {
		const client = new Client({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			application_name: "int8.test.ts",
		});

		try {
			await client.connect();

			await client.query(`
				CREATE TABLE IF NOT EXISTS public.jestint8 (
					int8 int8 NULL,
					_int8 _int8 NULL
				)
			`);

			await client.query(`
				INSERT INTO public.jestint8 (int8, _int8)
				VALUES (
					1,
					'{2, 3}'
				)
			`);
		} catch {
			expect.fail("Failed to connect to PostgreSQL");
		}

		const result = await client.query(`
				SELECT * FROM public.jestint8
			`);

		expect(Int8.isInt8(result.rows[0].int8)).toBe(true);
		expect(Int8.from(1).equals(result.rows[0].int8)).toBe(true);

		const [a, b] = result.rows[0]._int8;
		expect(result.rows[0]._int8).toHaveLength(2);
		expect(Int8.isInt8(a)).toBe(true);
		expect(Int8.from(2).equals(a)).toBe(true);
		expect(Int8.isInt8(b)).toBe(true);
		expect(Int8.from(3).equals(b)).toBe(true);

		try {
			await client.query(`
				DROP TABLE public.jestint8
			`);

			await client.end();
		} catch {
			expect.fail("Failed to disconnect from PostgreSQL");
		}
	});
});
