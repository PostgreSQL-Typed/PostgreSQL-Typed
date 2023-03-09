import { Client } from "pg";
import { describe, expect, it, test } from "vitest";

import { BitVarying } from "./BitVarying.js";

describe("BitVaryingConstructor", () => {
	test("_parse(...)", () => {
		//#region //* it should return OK when parsing succeeds
		expect(BitVarying.safeFrom("1").success).toBe(true);
		expect(BitVarying.safeFrom(1).success).toBe(true);
		expect(BitVarying.safeFrom(BitVarying.from(1)).success).toBe(true);
		expect(
			BitVarying.safeFrom({
				bit: "1",
			}).success
		).toBe(true);

		// Test it with a different n
		const BitVarying2 = BitVarying.setN(3);
		expect(BitVarying2.safeFrom("101").success).toBe(true);
		expect(BitVarying2.safeFrom(5).success).toBe(true);
		expect(BitVarying2.safeFrom(BitVarying2.from(5)).success).toBe(true);
		expect(
			BitVarying2.safeFrom({
				bit: "101",
			}).success
		).toBe(true);
		//#endregion

		//#region //* should return INVALID when parsing fails
		const boolean = BitVarying.safeFrom(true as any);
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

		const nanString = BitVarying.safeFrom("abc");
		expect(nanString.success).toEqual(false);
		if (nanString.success) expect.fail();
		else {
			expect(nanString.error.issue).toStrictEqual({
				code: "invalid_string",
				expected: "LIKE 010101",
				received: "abc",
				message: "Expected 'LIKE 010101', received 'abc'",
			});
		}

		const notWhole = BitVarying.safeFrom(1.5);
		expect(notWhole.success).toEqual(false);
		if (notWhole.success) expect.fail();
		else {
			expect(notWhole.error.issue).toStrictEqual({
				code: "not_whole",
				message: "Number must be whole",
			});
		}

		const tooSmall = BitVarying.safeFrom(-1);
		expect(tooSmall.success).toEqual(false);
		if (tooSmall.success) expect.fail();
		else {
			expect(tooSmall.error.issue).toStrictEqual({
				code: "too_small",
				type: "number",
				minimum: 0,
				exact: true,
				message: "Number must be exactly equal to 0",
			});
		}

		//@ts-expect-error - testing invalid type
		const tooManyArguments = BitVarying.safeFrom(1, 2);
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
		const tooFewArguments = BitVarying.safeFrom();
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

		const unrecognizedKeys = BitVarying.safeFrom({
			bit: "1",
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

		const missingKeys = BitVarying.safeFrom({
			// bit: 1,
		} as any);
		expect(missingKeys.success).toEqual(false);
		if (missingKeys.success) expect.fail();
		else {
			expect(missingKeys.error.issue).toStrictEqual({
				code: "missing_keys",
				keys: ["bit"],
				message: "Missing key in object: 'bit'",
			});
		}

		const invalidKeys = BitVarying.safeFrom({
			bit: 1,
		} as any);
		expect(invalidKeys.success).toEqual(false);
		if (invalidKeys.success) expect.fail();
		else {
			expect(invalidKeys.error.issue).toStrictEqual({
				code: "invalid_key_type",
				objectKey: "bit",
				expected: "string",
				received: "number",
				message: "Expected 'string' for key 'bit', received 'number'",
			});
		}

		const invalidBitLength = BitVarying.setN(1).safeFrom(BitVarying.setN(2).from(2));
		expect(invalidBitLength.success).toEqual(false);
		if (invalidBitLength.success) expect.fail();
		else {
			expect(invalidBitLength.error.issue).toStrictEqual({
				code: "invalid_bit_length",
				maximum: 1,
				received: 2,
				message: "Invalid bit length: 2, n must be less than or equal to 1",
			});
		}
		//#endregion
	});

	test("isBitVarying(...)", () => {
		//* it should return true in isBitVarying when value is a BitVarying
		expect(BitVarying.isBitVarying(BitVarying.from(1))).toBe(true);

		//* it should return false in isBitVarying when value is not a BitVarying
		expect(BitVarying.isBitVarying(1)).toEqual(false);
		expect(BitVarying.isBitVarying("1")).toEqual(false);
		expect(BitVarying.isBitVarying({})).toEqual(false);
		expect(BitVarying.isBitVarying({ bit: "1" })).toEqual(false);

		//* it should return true in isBitVarying when value is a BitVarying of specified length
		expect(BitVarying.isBitVarying(BitVarying.from(1), Number.POSITIVE_INFINITY)).toBe(true);
		expect(BitVarying.isBitVarying(BitVarying.setN(3).from(5), 3)).toBe(true);

		//* it should return false in isBitVarying when value is not a BitVarying of specified length
		expect(BitVarying.isBitVarying(BitVarying.from(1), 2)).toEqual(false);
		expect(BitVarying.isBitVarying(BitVarying.setN(3).from(5), 2)).toEqual(false);
	});

	test("isAnyBitVarying(...)", () => {
		//* it should return true in isAnyBitVarying when value is a BitVarying of any length
		expect(BitVarying.isAnyBitVarying(BitVarying.from(1))).toBe(true);
		expect(BitVarying.isAnyBitVarying(BitVarying.setN(3).from(5))).toBe(true);

		//* it should return false in isAnyBitVarying when value is not a BitVarying
		expect(BitVarying.isAnyBitVarying(1)).toEqual(false);
		expect(BitVarying.isAnyBitVarying("1")).toEqual(false);
		expect(BitVarying.isAnyBitVarying({})).toEqual(false);
		expect(BitVarying.isAnyBitVarying({ bit: "1" })).toEqual(false);
	});

	test("setN(...)", () => {
		//* it should return a new BitVarying class with a new n
		const BitVarying2 = BitVarying.setN(2);
		expect(BitVarying2.n).toEqual(2);

		//* It should error on invalid n values
		expect(() => BitVarying.setN(1.5)).toThrowError("Number must be whole");
		expect(() => BitVarying.setN(-1)).toThrowError("Number must be greater than or equal to 1");
		expect(() => BitVarying.setN(true as any)).toThrowError("Expected 'number' | 'infinity', received 'boolean'");
	});

	test("get n()", () => {
		//* it should return the n of the BitVarying class
		expect(BitVarying.n).toEqual(Number.POSITIVE_INFINITY);
	});
});

describe("BitVarying", () => {
	test("_equals(...)", () => {
		//#region //* it should return OK when parsing succeeds
		const bit = BitVarying.from(1);
		expect(bit.equals(BitVarying.from(1))).toBe(true);
		expect(bit.equals(BitVarying.from(0))).toEqual(false);
		expect(bit.equals(1)).toBe(true);
		expect(bit.equals(0)).toEqual(false);
		expect(bit.equals("1")).toBe(true);
		expect(bit.equals("0")).toEqual(false);
		expect(bit.equals({ bit: "1" })).toBe(true);
		expect(bit.equals({ bit: "0" })).toEqual(false);

		const safeEquals1 = bit.safeEquals(BitVarying.from(1));
		expect(safeEquals1.success).toBe(true);
		if (safeEquals1.success) expect(safeEquals1.equals).toBe(true);
		else expect.fail();

		const safeEquals2 = bit.safeEquals(BitVarying.from(0));
		expect(safeEquals2.success).toBe(true);
		if (safeEquals2.success) expect(safeEquals2.equals).toEqual(false);
		else expect.fail();

		const safeEquals3 = bit.safeEquals(1);
		expect(safeEquals3.success).toBe(true);
		if (safeEquals3.success) expect(safeEquals3.equals).toBe(true);
		else expect.fail();

		const safeEquals4 = bit.safeEquals(0);
		expect(safeEquals4.success).toBe(true);
		if (safeEquals4.success) expect(safeEquals4.equals).toEqual(false);
		else expect.fail();

		const safeEquals5 = bit.safeEquals("1");
		expect(safeEquals5.success).toBe(true);
		if (safeEquals5.success) expect(safeEquals5.equals).toBe(true);
		else expect.fail();

		const safeEquals6 = bit.safeEquals("0");
		expect(safeEquals6.success).toBe(true);
		if (safeEquals6.success) expect(safeEquals6.equals).toEqual(false);
		else expect.fail();

		const safeEquals7 = bit.safeEquals({ bit: "1" });
		expect(safeEquals7.success).toBe(true);
		if (safeEquals7.success) expect(safeEquals7.equals).toBe(true);
		else expect.fail();

		const safeEquals8 = bit.safeEquals({ bit: "0" });
		expect(safeEquals8.success).toBe(true);
		if (safeEquals8.success) expect(safeEquals8.equals).toEqual(false);
		else expect.fail();
		//#endregion

		//#region //* should return INVALID when parsing fails
		const boolean = bit.safeEquals(true as any);
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

		expect(() => bit.equals(true as any)).toThrowError();
		//#endregion
	});

	test("toString()", () => {
		const bit = BitVarying.from(1);
		expect(bit.toString()).toEqual("1");
	});

	test("toNumber()", () => {
		const bit = BitVarying.from(1);
		expect(bit.toNumber()).toEqual(1);
		const bit2 = BitVarying.setN(3).from("101");
		expect(bit2.toNumber()).toEqual(5);
	});

	test("toJSON()", () => {
		const bit = BitVarying.from(1);
		expect(bit.toJSON()).toStrictEqual({ bit: "1" });
	});

	test("get bit()", () => {
		expect(BitVarying.setN(3).from(5).bit).toEqual("101");
		expect(BitVarying.setN(3).from("100").bit).toEqual("100");
		expect(BitVarying.setN(3).from({ bit: "100" }).bit).toEqual("100");
	});

	test("set bit(...)", () => {
		const bit = BitVarying.setN(2).from(1);
		bit.bit = "0" as any;
		expect(bit.bit).toEqual("0");

		expect(() => (bit.bit = "101" as any)).toThrowError("Invalid bit length: 3, n must be less than or equal to 2");
	});
});

describe("PostgreSQL", () => {
	it("should work with PostgreSQL's own tests", () => {
		//* https://github.com/postgres/postgres/blob/master/src/test/regress/sql/bit.sql
		const B = BitVarying.setN(11);

		expect(() => B.from("")).not.toThrowError();
		expect(() => B.from("0")).not.toThrowError();
		expect(() => B.from("010101")).not.toThrowError();
		expect(() => B.from("01010101010")).not.toThrowError();
		expect(() => B.from("101011111010")).toThrowError(); // too long
	});

	it("should be returned as a BitVarying", async () => {
		const client = new Client({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			application_name: "varbit.test.ts",
		});

		await client.connect();

		let error = null;
		try {
			await client.query(`
				CREATE TABLE IF NOT EXISTS public.vitestvarbit (
					varbit varbit NULL,
					_varbit _varbit NULL
				)
			`);

			await client.query(`
				INSERT INTO public.vitestvarbit (varbit, _varbit)
				VALUES (
					'1',
					'{0, 1}'
				)
			`);

			const result = await client.query(`
				SELECT * FROM public.vitestvarbit
			`);

			expect(BitVarying.isBitVarying(result.rows[0].varbit)).toBe(true);
			expect(BitVarying.from(1).equals(result.rows[0].varbit)).toBe(true);

			const [a, b] = result.rows[0]._varbit;
			expect(result.rows[0]._varbit).toHaveLength(2);
			expect(BitVarying.isBitVarying(a)).toBe(true);
			expect(BitVarying.from(0).equals(a)).toBe(true);
			expect(BitVarying.isBitVarying(b)).toBe(true);
			expect(BitVarying.from(1).equals(b)).toBe(true);
		} catch (error_) {
			error = error_;
			// eslint-disable-next-line no-console
			console.error(error);
		}

		await client.query(`
				DROP TABLE public.vitestvarbit
			`);

		await client.end();

		if (error) throw error;
	});
});
