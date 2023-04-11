import { Client } from "pg";
import { describe, expect, it, test } from "vitest";

import { arrayParser } from "../../util/arrayParser.js";
import { parser } from "../../util/parser.js";
import { Bit } from "./Bit.js";

describe("BitConstructor", () => {
	test("_parse(...)", () => {
		//#region //* it should return OK when parsing succeeds
		expect(Bit.safeFrom("1").success).toBe(true);
		expect(Bit.safeFrom(1).success).toBe(true);
		expect(Bit.safeFrom(Bit.from(1)).success).toBe(true);
		expect(
			Bit.safeFrom({
				value: "1",
			}).success
		).toBe(true);

		// Test it with a different n
		const Bit2 = Bit.setN(3);
		expect(Bit2.safeFrom("101").success).toBe(true);
		expect(Bit2.safeFrom(5).success).toBe(true);
		expect(Bit2.safeFrom(Bit2.from(5)).success).toBe(true);
		expect(
			Bit2.safeFrom({
				value: "101",
			}).success
		).toBe(true);
		//#endregion

		//#region //* should return INVALID when parsing fails
		const boolean = Bit.safeFrom(true as any);
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

		const nanString = Bit.safeFrom("abc");
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

		const notWhole = Bit.safeFrom(1.5);
		expect(notWhole.success).toEqual(false);
		if (notWhole.success) expect.fail();
		else {
			expect(notWhole.error.issue).toStrictEqual({
				code: "not_whole",
				message: "Number must be whole",
			});
		}

		const tooBig = Bit.safeFrom("101");
		expect(tooBig.success).toEqual(false);
		if (tooBig.success) expect.fail();
		else {
			expect(tooBig.error.issue).toStrictEqual({
				code: "invalid_n_length",
				maximum: 1,
				received: 3,
				exact: true,
				message: "Invalid 'n' length: 3, 'n' must be exactly 1",
			});
		}

		const tooSmall = Bit.safeFrom(-1);
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
		const tooManyArguments = Bit.safeFrom(1, 2);
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
		const tooFewArguments = Bit.safeFrom();
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

		const unrecognizedKeys = Bit.safeFrom({
			value: "1",
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

		const missingKeys = Bit.safeFrom({
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

		const invalidKeys = Bit.safeFrom({
			value: 1,
		} as any);
		expect(invalidKeys.success).toEqual(false);
		if (invalidKeys.success) expect.fail();
		else {
			expect(invalidKeys.error.issue).toStrictEqual({
				code: "invalid_key_type",
				objectKey: "value",
				expected: "string",
				received: "number",
				message: "Expected 'string' for key 'value', received 'number'",
			});
		}

		const invalidBitLength = Bit.safeFrom(Bit.setN(2).from(2));
		expect(invalidBitLength.success).toEqual(false);
		if (invalidBitLength.success) expect.fail();
		else {
			expect(invalidBitLength.error.issue).toStrictEqual({
				code: "invalid_n_length",
				exact: true,
				maximum: 1,
				received: 2,
				message: "Invalid 'n' length: 2, 'n' must be exactly 1",
			});
		}
		//#endregion
	});

	test("isBit(...)", () => {
		//* it should return true in isBit when value is a Bit
		expect(Bit.isBit(Bit.from(1))).toBe(true);

		//* it should return false in isBit when value is not a Bit
		expect(Bit.isBit(1)).toEqual(false);
		expect(Bit.isBit("1")).toEqual(false);
		expect(Bit.isBit({})).toEqual(false);
		expect(Bit.isBit({ value: "1" })).toEqual(false);

		//* it should return true in isBit when value is a Bit of specified length
		expect(Bit.isBit(Bit.from(1), 1)).toBe(true);
		expect(Bit.isBit(Bit.setN(3).from(5), 3)).toBe(true);

		//* it should return false in isBit when value is not a Bit of specified length
		expect(Bit.isBit(Bit.from(1), 2)).toEqual(false);
		expect(Bit.isBit(Bit.setN(3).from(5), 2)).toEqual(false);
	});

	test("isAnyBit(...)", () => {
		//* it should return true in isAnyBit when value is a Bit of any length
		expect(Bit.isAnyBit(Bit.from(1))).toBe(true);
		expect(Bit.isAnyBit(Bit.setN(3).from(5))).toBe(true);

		//* it should return false in isAnyBit when value is not a Bit
		expect(Bit.isAnyBit(1)).toEqual(false);
		expect(Bit.isAnyBit("1")).toEqual(false);
		expect(Bit.isAnyBit({})).toEqual(false);
		expect(Bit.isAnyBit({ value: "1" })).toEqual(false);
	});

	test("setN(...)", () => {
		//* it should return a new Bit class with a new n
		const Bit2 = Bit.setN(2);
		expect(Bit2.n).toEqual(2);

		//* It should error on invalid n values
		expect(() => Bit.setN(1.5)).toThrowError("Number must be whole");
		expect(() => Bit.setN(-1)).toThrowError("Number must be greater than or equal to 1");
		expect(() => Bit.setN(true as any)).toThrowError("Expected 'number' | 'infinity', received 'boolean'");
	});

	test("get n()", () => {
		//* it should return the n of the Bit class
		expect(Bit.n).toEqual(1);
	});
});

describe("Bit", () => {
	test("_equals(...)", () => {
		//#region //* it should return OK when parsing succeeds
		const bit = Bit.from(1);
		expect(bit.equals(Bit.from(1))).toBe(true);
		expect(bit.equals(Bit.from(0))).toEqual(false);
		expect(bit.equals(1)).toBe(true);
		expect(bit.equals(0)).toEqual(false);
		expect(bit.equals("1")).toBe(true);
		expect(bit.equals("0")).toEqual(false);
		expect(bit.equals({ value: "1" })).toBe(true);
		expect(bit.equals({ value: "0" })).toEqual(false);

		const safeEquals1 = bit.safeEquals(Bit.from(1));
		expect(safeEquals1.success).toBe(true);
		if (safeEquals1.success) expect(safeEquals1.equals).toBe(true);
		else expect.fail();

		const safeEquals2 = bit.safeEquals(Bit.from(0));
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

		const safeEquals7 = bit.safeEquals({ value: "1" });
		expect(safeEquals7.success).toBe(true);
		if (safeEquals7.success) expect(safeEquals7.equals).toBe(true);
		else expect.fail();

		const safeEquals8 = bit.safeEquals({ value: "0" });
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
		const bit = Bit.from(1);
		expect(bit.toString()).toEqual("1");
	});

	test("toNumber()", () => {
		const bit = Bit.from(1);
		expect(bit.toNumber()).toEqual(1);
		const bit2 = Bit.setN(3).from("101");
		expect(bit2.toNumber()).toEqual(5);
	});

	test("toJSON()", () => {
		const bit = Bit.from(1);
		expect(bit.toJSON()).toStrictEqual({ value: "1" });
	});

	test("get bit()", () => {
		expect(Bit.setN(3).from(5).bit).toEqual("101");
		expect(Bit.setN(3).from("100").bit).toEqual("100");
		expect(Bit.setN(3).from({ value: "100" }).bit).toEqual("100");
	});

	test("set bit(...)", () => {
		const bit = Bit.from(1);
		bit.bit = "0" as any;
		expect(bit.bit).toEqual("0");

		expect(() => (bit.bit = "101" as any)).toThrowError("Invalid 'n' length: 3, 'n' must be exactly 1");
	});

	test("get value()", () => {
		expect(Bit.setN(3).from(5).value).toEqual("101");
		expect(Bit.setN(3).from("100").value).toEqual("100");
		expect(Bit.setN(3).from({ value: "100" }).value).toEqual("100");
	});

	test("set value(...)", () => {
		const bit = Bit.from(1);
		bit.value = "0" as any;
		expect(bit.value).toEqual("0");

		expect(() => (bit.value = "101" as any)).toThrowError("Invalid 'n' length: 3, 'n' must be exactly 1");
	});

	test("get postgres()", () => {
		expect(Bit.setN(3).from(5).postgres).toEqual("101");
		expect(Bit.setN(3).from("100").postgres).toEqual("100");
		expect(Bit.setN(3).from({ value: "100" }).postgres).toEqual("100");
	});

	test("set postgres(...)", () => {
		const bit = Bit.from(1);
		bit.postgres = "0" as any;
		expect(bit.postgres).toEqual("0");

		expect(() => (bit.postgres = "101" as any)).toThrowError("Invalid 'n' length: 3, 'n' must be exactly 1");
	});
});

describe("PostgreSQL", () => {
	it("should work with PostgreSQL's own tests", () => {
		//* https://github.com/postgres/postgres/blob/master/src/test/regress/sql/bit.sql
		const B = Bit.setN(11);

		expect(() => B.from("10")).not.toThrowError(); // too short but will be padded
		expect(() => B.from("00000000000")).not.toThrowError();
		expect(() => B.from("11011000000")).not.toThrowError();
		expect(() => B.from("01010101010")).not.toThrowError();
		expect(() => B.from("101011111010")).toThrowError(); // too long
	});

	it("should be returned as a Bit", async () => {
		const client = new Client({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			application_name: "bit.test.ts",
		});

		await client.connect();

		let error = null;
		try {
			await client.query(`
				CREATE TABLE IF NOT EXISTS public.vitestbit (
					bit bit NULL,
					_bit _bit NULL
				)
			`);

			await client.query(`
				INSERT INTO public.vitestbit (bit, _bit)
				VALUES (
					'1',
					'{0, 1}'
				)
			`);

			const result = await client.query(`
				SELECT * FROM public.vitestbit
			`);

			result.rows[0].bit = parser<Bit<number>>(Bit)(result.rows[0].bit);
			result.rows[0]._bit = arrayParser<Bit<number>>(Bit, ",")(result.rows[0]._bit);

			expect(Bit.isAnyBit(result.rows[0].bit)).toBe(true);
			expect(Bit.from(1).equals(result.rows[0].bit.value)).toBe(true);

			const [a, b] = result.rows[0]._bit;
			expect(result.rows[0]._bit).toHaveLength(2);
			expect(Bit.isAnyBit(a)).toBe(true);
			expect(Bit.from(0).equals(a.value)).toBe(true);
			expect(Bit.isAnyBit(b)).toBe(true);
			expect(Bit.from(1).equals(b.value)).toBe(true);
		} catch (error_) {
			error = error_;
			// eslint-disable-next-line no-console
			console.error(error);
		}

		await client.query(`
				DROP TABLE public.vitestbit
			`);

		await client.end();

		if (error) throw error;
	});
});
