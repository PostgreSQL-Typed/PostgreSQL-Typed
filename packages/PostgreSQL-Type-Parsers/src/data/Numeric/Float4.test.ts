import { Client } from "pg";
import { describe, expect, it, test } from "vitest";

import { Float4 } from "./Float4.js";

describe("Float4Constructor", () => {
	test("_parse(...)", () => {
		//#region //* it should return OK when parsing succeeds
		expect(Float4.safeFrom(1).success).toBe(true);
		expect(Float4.safeFrom(2_147_483_647).success).toBe(true);
		expect(Float4.safeFrom(-2_147_483_648).success).toBe(true);
		expect(Float4.safeFrom("1").success).toBe(true);
		expect(Float4.safeFrom("2147483647").success).toBe(true);
		expect(Float4.safeFrom("-2147483648").success).toBe(true);
		expect(Float4.safeFrom(Float4.from(1)).success).toBe(true);
		expect(Float4.safeFrom(Float4.from(2_147_483_647)).success).toBe(true);
		expect(Float4.safeFrom(Float4.from(-2_147_483_648)).success).toBe(true);
		expect(
			Float4.safeFrom({
				float4: "1",
			}).success
		).toBe(true);
		expect(
			Float4.safeFrom({
				float4: "2147483647",
			}).success
		).toBe(true);
		expect(
			Float4.safeFrom({
				float4: "-2147483648",
			}).success
		).toBe(true);
		expect(Float4.safeFrom(Number.POSITIVE_INFINITY).success).toBe(true);
		expect(Float4.safeFrom(Number.NEGATIVE_INFINITY).success).toBe(true);
		expect(Float4.safeFrom(Number.NaN).success).toBe(true);
		expect(Float4.safeFrom(BigInt(1)).success).toBe(true);
		expect(Float4.safeFrom(Float4.from(-1).float4).success).toBe(true);
		expect(Float4.safeFrom(1.5).success).toBe(true);
		//#endregion

		//#region //* should return INVALID when parsing fails
		const boolean = Float4.safeFrom(true as any);
		expect(boolean.success).toEqual(false);
		if (boolean.success) expect.fail();
		else {
			expect(boolean.error.issue).toStrictEqual({
				code: "invalid_type",
				expected: ["number", "string", "object", "nan", "infinity", "bigNumber", "bigint"],
				received: "boolean",
				message: "Expected 'number' | 'string' | 'object' | 'nan' | 'infinity' | 'bigNumber' | 'bigint', received 'boolean'",
			});
		}

		const nanString = Float4.safeFrom("abc");
		expect(nanString.success).toEqual(false);
		if (nanString.success) expect.fail();
		else {
			expect(nanString.error.issue).toStrictEqual({
				code: "invalid_string",
				expected: "LIKE 1.23",
				received: "abc",
				message: "Expected 'LIKE 1.23', received 'abc'",
			});
		}

		const tooBig = Float4.safeFrom("10e400");
		expect(tooBig.success).toEqual(false);
		if (tooBig.success) expect.fail();
		else {
			expect(tooBig.error.issue).toStrictEqual({
				code: "too_big",
				type: "number",
				maximum: "9.9999999999999999999999999999999999999e+37",
				inclusive: true,
				message: "Number must be less than or equal to 9.9999999999999999999999999999999999999e+37",
			});
		}

		const tooSmall = Float4.safeFrom("-10e400");
		expect(tooSmall.success).toEqual(false);
		if (tooSmall.success) expect.fail();
		else {
			expect(tooSmall.error.issue).toStrictEqual({
				code: "too_small",
				type: "number",
				minimum: "-9.9999999999999999999999999999999999999e+37",
				inclusive: true,
				message: "Number must be greater than or equal to -9.9999999999999999999999999999999999999e+37",
			});
		}

		//@ts-expect-error - testing invalid type
		const tooManyArguments = Float4.safeFrom(1, 2);
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
		const tooFewArguments = Float4.safeFrom();
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

		const unrecognizedKeys = Float4.safeFrom({
			float4: 1,
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

		const missingKeys = Float4.safeFrom({
			// float4: 1,
		} as any);
		expect(missingKeys.success).toEqual(false);
		if (missingKeys.success) expect.fail();
		else {
			expect(missingKeys.error.issue).toStrictEqual({
				code: "missing_keys",
				keys: ["float4"],
				message: "Missing key in object: 'float4'",
			});
		}

		const invalidKeys = Float4.safeFrom({
			float4: 1,
		} as any);
		expect(invalidKeys.success).toEqual(false);
		if (invalidKeys.success) expect.fail();
		else {
			expect(invalidKeys.error.issue).toStrictEqual({
				code: "invalid_key_type",
				objectKey: "float4",
				expected: "string",
				received: "number",
				message: "Expected 'string' for key 'float4', received 'number'",
			});
		}
		//#endregion
	});

	test("isFloat4(...)", () => {
		//* it should return true in isFloat4 when value is a Float4
		expect(Float4.isFloat4(Float4.from(1))).toBe(true);

		//* it should return false in isFloat4 when value is not a Float4
		expect(Float4.isFloat4(1)).toEqual(false);
		expect(Float4.isFloat4("1")).toEqual(false);
		expect(Float4.isFloat4({})).toEqual(false);
		expect(Float4.isFloat4({ float4: 1 })).toEqual(false);
	});
});

describe("Float4", () => {
	test("_equals(...)", () => {
		//#region //* it should return OK when parsing succeeds
		const float4 = Float4.from(1);
		expect(float4.equals(Float4.from(1))).toBe(true);
		expect(float4.equals(Float4.from(2))).toEqual(false);
		expect(float4.equals(1)).toBe(true);
		expect(float4.equals(2)).toEqual(false);
		expect(float4.equals("1")).toBe(true);
		expect(float4.equals("2")).toEqual(false);
		expect(float4.equals({ float4: "1" })).toBe(true);
		expect(float4.equals({ float4: "2" })).toEqual(false);

		const safeEquals1 = float4.safeEquals(Float4.from(1));
		expect(safeEquals1.success).toBe(true);
		if (safeEquals1.success) expect(safeEquals1.equals).toBe(true);
		else expect.fail();

		const safeEquals2 = float4.safeEquals(Float4.from(2));
		expect(safeEquals2.success).toBe(true);
		if (safeEquals2.success) expect(safeEquals2.equals).toEqual(false);
		else expect.fail();

		const safeEquals3 = float4.safeEquals(1);
		expect(safeEquals3.success).toBe(true);
		if (safeEquals3.success) expect(safeEquals3.equals).toBe(true);
		else expect.fail();

		const safeEquals4 = float4.safeEquals(2);
		expect(safeEquals4.success).toBe(true);
		if (safeEquals4.success) expect(safeEquals4.equals).toEqual(false);
		else expect.fail();

		const safeEquals5 = float4.safeEquals("1");
		expect(safeEquals5.success).toBe(true);
		if (safeEquals5.success) expect(safeEquals5.equals).toBe(true);
		else expect.fail();

		const safeEquals6 = float4.safeEquals("2");
		expect(safeEquals6.success).toBe(true);
		if (safeEquals6.success) expect(safeEquals6.equals).toEqual(false);
		else expect.fail();

		const safeEquals7 = float4.safeEquals({ float4: "1" });
		expect(safeEquals7.success).toBe(true);
		if (safeEquals7.success) expect(safeEquals7.equals).toBe(true);
		else expect.fail();

		const safeEquals8 = float4.safeEquals({ float4: "2" });
		expect(safeEquals8.success).toBe(true);
		if (safeEquals8.success) expect(safeEquals8.equals).toEqual(false);
		else expect.fail();
		//#endregion

		//#region //* should return INVALID when parsing fails
		const boolean = float4.safeEquals(true as any);
		expect(boolean.success).toEqual(false);
		if (boolean.success) expect.fail();
		else {
			expect(boolean.error.issue).toStrictEqual({
				code: "invalid_type",
				expected: ["number", "string", "object", "nan", "infinity", "bigNumber", "bigint"],
				received: "boolean",
				message: "Expected 'number' | 'string' | 'object' | 'nan' | 'infinity' | 'bigNumber' | 'bigint', received 'boolean'",
			});
		}

		expect(() => float4.equals(true as any)).toThrowError();
		//#endregion
	});

	test("toString()", () => {
		const float4 = Float4.from(1);
		expect(float4.toString()).toEqual("1");
	});

	test("toBigNumber()", () => {
		const float4 = Float4.from(1);
		expect(float4.toBigNumber().toNumber()).toEqual(1);
	});

	test("toJSON()", () => {
		const float4 = Float4.from(1);
		expect(float4.toJSON()).toStrictEqual({ float4: "1" });
	});

	test("get float4()", () => {
		expect(Float4.from(1).float4.toNumber()).toEqual(1);
		expect(Float4.from("2").float4.toNumber()).toEqual(2);
		expect(Float4.from({ float4: "3" }).float4.toNumber()).toEqual(3);
	});

	test("set float4(...)", () => {
		const float4 = Float4.from(1);
		float4.float4 = 2 as any;
		expect(float4.float4.toNumber()).toEqual(2);

		expect(() => (float4.float4 = "10e400" as any)).toThrowError("Number must be less than or equal to 9.9999999999999999999999999999999999999e+37");
	});
});

describe("PostgreSQL", () => {
	it("should work with PostgreSQL's own tests", () => {
		//* https://github.com/postgres/postgres/blob/master/src/test/regress/sql/float4.sql
		expect(() => Float4.from("    0.0")).not.toThrowError();
		expect(() => Float4.from("1004.30   ")).not.toThrowError();
		expect(() => Float4.from("     -34.84    ")).not.toThrowError();
		expect(() => Float4.from("1.2345678901234e+20")).not.toThrowError();
		expect(() => Float4.from("1.2345678901234e-20")).not.toThrowError();

		// test for over and under flow
		expect(() => Float4.from("10e70")).toThrowError();
		expect(() => Float4.from("-10e70")).toThrowError();
		expect(() => Float4.from("10e-70")).not.toThrowError();
		expect(() => Float4.from("-10e-70")).not.toThrowError();

		expect(() => Float4.from("10e400")).toThrowError();
		expect(() => Float4.from("-10e400")).toThrowError();
		expect(() => Float4.from("10e-400")).not.toThrowError();
		expect(() => Float4.from("-10e-400")).not.toThrowError();

		// bad input
		expect(() => Float4.from("")).toThrowError();
		expect(() => Float4.from("       ")).toThrowError();
		expect(() => Float4.from("xyz")).toThrowError();
		expect(() => Float4.from("5.0.0")).toThrowError();
		expect(() => Float4.from("5 . 0")).toThrowError();
		expect(() => Float4.from("5.   0")).toThrowError();
		expect(() => Float4.from("     - 3.0")).toThrowError();
		expect(() => Float4.from("123            5")).toThrowError();

		// Also try it with non-error-throwing API
		expect(() => Float4.from("34.5")).not.toThrowError();
		expect(() => Float4.from("xyz")).toThrowError();

		// special inputs
		expect(() => Float4.from("NaN")).not.toThrowError();
		expect(() => Float4.from("nan")).not.toThrowError();
		expect(() => Float4.from("   NAN  ")).not.toThrowError();
		expect(() => Float4.from("infinity")).not.toThrowError();
		expect(() => Float4.from("          -INFINiTY   ")).not.toThrowError();
		// bad special inputs
		expect(() => Float4.from("N A N")).toThrowError();
		expect(() => Float4.from("NaN x")).toThrowError();
		expect(() => Float4.from(" INFINITY    x")).toThrowError();

		expect(() => Float4.from("32767.4")).not.toThrowError();
		expect(() => Float4.from("32767.6")).not.toThrowError();
		expect(() => Float4.from("-32768.4")).not.toThrowError();
		expect(() => Float4.from("-32768.6")).not.toThrowError();
		expect(() => Float4.from("2147483520")).not.toThrowError();
		expect(() => Float4.from("2147483647")).not.toThrowError();
		expect(() => Float4.from("-2147483648.5")).not.toThrowError();
		expect(() => Float4.from("-2147483900")).not.toThrowError();
		expect(() => Float4.from("9223369837831520256")).not.toThrowError();
		expect(() => Float4.from("9223372036854775807")).not.toThrowError();
		expect(() => Float4.from("-9223372036854775808.5")).not.toThrowError();
		expect(() => Float4.from("-9223380000000000000")).not.toThrowError();
	});

	it("should be returned as a Float4", async () => {
		const client = new Client({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			application_name: "float4.test.ts",
		});

		await client.connect();

		let error = null;
		try {
			await client.query(`
				CREATE TABLE IF NOT EXISTS public.vitestfloat4 (
					float4 float4 NULL,
					_float4 _float4 NULL
				)
			`);

			await client.query(`
				INSERT INTO public.vitestfloat4 (float4, _float4)
				VALUES (
					1,
					'{2, 3}'
				)
			`);

			const result = await client.query(`
				SELECT * FROM public.vitestfloat4
			`);

			expect(Float4.isFloat4(result.rows[0].float4)).toBe(true);
			expect(Float4.from(1).equals(result.rows[0].float4)).toBe(true);

			const [a, b] = result.rows[0]._float4;
			expect(result.rows[0]._float4).toHaveLength(2);
			expect(Float4.isFloat4(a)).toBe(true);
			expect(Float4.from(2).equals(a)).toBe(true);
			expect(Float4.isFloat4(b)).toBe(true);
			expect(Float4.from(3).equals(b)).toBe(true);
		} catch (error_) {
			error = error_;
			// eslint-disable-next-line no-console
			console.error(error);
		}

		await client.query(`
				DROP TABLE public.vitestfloat4
			`);

		await client.end();

		if (error) throw error;
	});
});
