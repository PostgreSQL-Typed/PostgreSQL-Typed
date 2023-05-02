import { Client, types } from "pg";
import { describe, expect, it, test } from "vitest";

import { arrayParser } from "../../util/arrayParser.js";
import { arraySerializer } from "../../util/arraySerializer.js";
import { parser } from "../../util/parser.js";
import { serializer } from "../../util/serializer.js";
import { Boolean } from "./Boolean.js";

describe("BooleanConstructor", () => {
	test("_parse(...)", () => {
		//#region //* it should return OK when parsing succeeds
		expect(Boolean.safeFrom(true).success).toBe(true);
		expect(Boolean.safeFrom(false).success).toBe(true);
		expect(Boolean.safeFrom(1).success).toBe(true);
		expect(Boolean.safeFrom(0).success).toBe(true);
		expect(Boolean.safeFrom("1").success).toBe(true);
		expect(Boolean.safeFrom("0").success).toBe(true);
		expect(Boolean.safeFrom(Boolean.from(1)).success).toBe(true);
		expect(Boolean.safeFrom(Boolean.from(0)).success).toBe(true);
		expect(
			Boolean.safeFrom({
				value: true,
			}).success
		).toBe(true);
		expect(
			Boolean.safeFrom({
				value: false,
			}).success
		).toBe(true);
		//#endregion

		//#region //* should return INVALID when parsing fails
		const boolean = Boolean.safeFrom(Symbol() as any);
		expect(boolean.success).toEqual(false);
		if (boolean.success) expect.fail();
		else {
			expect(boolean.error.issue).toStrictEqual({
				code: "invalid_type",
				expected: ["number", "string", "object", "boolean"],
				received: "symbol",
				message: "Expected 'number' | 'string' | 'object' | 'boolean', received 'symbol'",
			});
		}

		const nanString = Boolean.safeFrom("abc");
		expect(nanString.success).toEqual(false);
		if (nanString.success) expect.fail();
		else {
			expect(nanString.error.issue).toStrictEqual({
				code: "invalid_string",
				expected: ["true", "t", "yes", "y", "1", "on", "false", "f", "no", "n", "0", "off", "of"],
				received: "abc",
				message: "Expected 'true' | 't' | 'yes' | 'y' | '1' | 'on' | 'false' | 'f' | 'no' | 'n' | '0' | 'off' | 'of', received 'abc'",
			});
		}

		const notFinite1 = Boolean.safeFrom(Number.POSITIVE_INFINITY);
		expect(notFinite1.success).toEqual(false);
		if (notFinite1.success) expect.fail();
		else {
			expect(notFinite1.error.issue).toStrictEqual({
				code: "invalid_type",
				expected: ["number", "string", "object", "boolean"],
				message: "Expected 'number' | 'string' | 'object' | 'boolean', received 'infinity'",
				received: "infinity",
			});
		}

		//@ts-expect-error - testing invalid type
		const tooManyArguments = Boolean.safeFrom(1, 2);
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
		const tooFewArguments = Boolean.safeFrom();
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

		const unrecognizedKeys = Boolean.safeFrom({
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

		const missingKeys = Boolean.safeFrom({
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

		const invalidKeys = Boolean.safeFrom({
			value: "abc",
		} as any);
		expect(invalidKeys.success).toEqual(false);
		if (invalidKeys.success) expect.fail();
		else {
			expect(invalidKeys.error.issue).toStrictEqual({
				code: "invalid_key_type",
				objectKey: "value",
				expected: "boolean",
				received: "string",
				message: "Expected 'boolean' for key 'value', received 'string'",
			});
		}
		//#endregion
	});

	test("isBoolean(...)", () => {
		//* it should return true in isBoolean when value is a Boolean
		expect(Boolean.isBoolean(Boolean.from(1))).toBe(true);

		//* it should return false in isBoolean when value is not a Boolean
		expect(Boolean.isBoolean(1)).toEqual(false);
		expect(Boolean.isBoolean("1")).toEqual(false);
		expect(Boolean.isBoolean({})).toEqual(false);
		expect(Boolean.isBoolean({ value: 1 })).toEqual(false);
	});
});

describe("Boolean", () => {
	test("_equals(...)", () => {
		//#region //* it should return OK when parsing succeeds
		const bool = Boolean.from(1);
		expect(bool.equals(Boolean.from(1))).toBe(true);
		expect(bool.equals(Boolean.from(0))).toEqual(false);
		expect(bool.equals(1)).toBe(true);
		expect(bool.equals(0)).toEqual(false);
		expect(bool.equals("1")).toBe(true);
		expect(bool.equals("0")).toEqual(false);
		expect(bool.equals({ value: true })).toBe(true);
		expect(bool.equals({ value: false })).toEqual(false);

		const safeEquals1 = bool.safeEquals(Boolean.from(1));
		expect(safeEquals1.success).toBe(true);
		if (safeEquals1.success) expect(safeEquals1.equals).toBe(true);
		else expect.fail();

		const safeEquals2 = bool.safeEquals(Boolean.from(0));
		expect(safeEquals2.success).toBe(true);
		if (safeEquals2.success) expect(safeEquals2.equals).toEqual(false);
		else expect.fail();

		const safeEquals3 = bool.safeEquals(1);
		expect(safeEquals3.success).toBe(true);
		if (safeEquals3.success) expect(safeEquals3.equals).toBe(true);
		else expect.fail();

		const safeEquals4 = bool.safeEquals(0);
		expect(safeEquals4.success).toBe(true);
		if (safeEquals4.success) expect(safeEquals4.equals).toEqual(false);
		else expect.fail();

		const safeEquals5 = bool.safeEquals("1");
		expect(safeEquals5.success).toBe(true);
		if (safeEquals5.success) expect(safeEquals5.equals).toBe(true);
		else expect.fail();

		const safeEquals6 = bool.safeEquals("0");
		expect(safeEquals6.success).toBe(true);
		if (safeEquals6.success) expect(safeEquals6.equals).toEqual(false);
		else expect.fail();

		const safeEquals7 = bool.safeEquals({ value: true });
		expect(safeEquals7.success).toBe(true);
		if (safeEquals7.success) expect(safeEquals7.equals).toBe(true);
		else expect.fail();

		const safeEquals8 = bool.safeEquals({ value: false });
		expect(safeEquals8.success).toBe(true);
		if (safeEquals8.success) expect(safeEquals8.equals).toEqual(false);
		else expect.fail();
		//#endregion

		//#region //* should return INVALID when parsing fails
		const bool2 = bool.safeEquals(Symbol() as any);
		expect(bool2.success).toEqual(false);
		if (bool2.success) expect.fail();
		else {
			expect(bool2.error.issue).toStrictEqual({
				code: "invalid_type",
				expected: ["number", "string", "object", "boolean"],
				received: "symbol",
				message: "Expected 'number' | 'string' | 'object' | 'boolean', received 'symbol'",
			});
		}

		expect(() => bool.equals(Symbol() as any)).toThrowError();
		//#endregion
	});

	test("toString()", () => {
		const boolean = Boolean.from(1);
		expect(boolean.toString()).toEqual("true");
	});

	test("toNumber()", () => {
		const boolean = Boolean.from(1);
		expect(boolean.toNumber()).toEqual(1);
		expect(Boolean.from(0).toNumber()).toEqual(0);
	});

	test("toBoolean()", () => {
		const boolean = Boolean.from(1);
		expect(boolean.toBoolean()).toEqual(true);
	});

	test("toJSON()", () => {
		const boolean = Boolean.from(1);
		expect(boolean.toJSON()).toStrictEqual({ value: true });
	});

	test("get boolean()", () => {
		expect(Boolean.from(1).boolean).toEqual(true);
		expect(Boolean.from("0").boolean).toEqual(false);
		expect(Boolean.from({ value: true }).boolean).toEqual(true);
	});

	test("set boolean(...)", () => {
		const bool = Boolean.from(true);
		bool.boolean = false;
		expect(bool.boolean).toEqual(false);

		expect(() => (bool.boolean = 2 as any)).toThrowError(
			"Expected 'true' | 't' | 'yes' | 'y' | '1' | 'on' | 'false' | 'f' | 'no' | 'n' | '0' | 'off' | 'of', received '2'"
		);
	});

	test("get value()", () => {
		expect(Boolean.from(1).value).toEqual(true);
		expect(Boolean.from("0").value).toEqual(false);
		expect(Boolean.from({ value: true }).value).toEqual(true);
	});

	test("set value(...)", () => {
		const bool = Boolean.from(true);
		bool.value = false;
		expect(bool.value).toEqual(false);

		expect(() => (bool.value = 2 as any)).toThrowError(
			"Expected 'true' | 't' | 'yes' | 'y' | '1' | 'on' | 'false' | 'f' | 'no' | 'n' | '0' | 'off' | 'of', received '2'"
		);
	});

	test("get postgres()", () => {
		expect(Boolean.from(1).postgres).toEqual("true");
		expect(Boolean.from("0").postgres).toEqual("false");
		expect(Boolean.from({ value: true }).postgres).toEqual("true");
	});

	test("set postgres(...)", () => {
		const bool = Boolean.from(true);
		bool.postgres = "false";
		expect(bool.postgres).toEqual("false");

		expect(() => (bool.postgres = "2" as any)).toThrowError(
			"Expected 'true' | 't' | 'yes' | 'y' | '1' | 'on' | 'false' | 'f' | 'no' | 'n' | '0' | 'off' | 'of', received '2'"
		);
	});
});

describe("PostgreSQL", () => {
	it("should work with PostgreSQL's own tests", () => {
		//* https://github.com/postgres/postgres/blob/master/src/test/regress/sql/boolean.sql
		expect(() => Boolean.from(true)).not.toThrowError();
		expect(() => Boolean.from(false)).not.toThrowError();
		expect(() => Boolean.from("t")).not.toThrowError();
		expect(() => Boolean.from("   f           ")).not.toThrowError();
		expect(() => Boolean.from("true")).not.toThrowError();
		expect(() => Boolean.from("test")).toThrowError();
		expect(() => Boolean.from("false")).not.toThrowError();
		expect(() => Boolean.from("foo")).toThrowError();
		expect(() => Boolean.from("y")).not.toThrowError();
		expect(() => Boolean.from("yes")).not.toThrowError();
		expect(() => Boolean.from("yeah")).toThrowError();
		expect(() => Boolean.from("n")).not.toThrowError();
		expect(() => Boolean.from("no")).not.toThrowError();
		expect(() => Boolean.from("nay")).toThrowError();
		expect(() => Boolean.from("on")).not.toThrowError();
		expect(() => Boolean.from("off")).not.toThrowError();
		expect(() => Boolean.from("of")).not.toThrowError();
		expect(() => Boolean.from("o")).toThrowError();
		expect(() => Boolean.from("on_")).toThrowError();
		expect(() => Boolean.from("off_")).toThrowError();
		expect(() => Boolean.from("1")).not.toThrowError();
		expect(() => Boolean.from("11")).toThrowError();
		expect(() => Boolean.from("0")).not.toThrowError();
		expect(() => Boolean.from("000")).toThrowError();
		expect(() => Boolean.from("")).toThrowError();
	});

	it("should be returned as a Boolean", async () => {
		const client = new Client({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			application_name: "boolean.test.ts",
		});

		try {
			await client.connect();

			//* PG has a native parser for the '_boolean' type
			types.setTypeParser(1000 as any, value => value);

			await client.query(`
				CREATE TABLE IF NOT EXISTS public.vitestboolean (
					boolean bool NULL,
					_boolean _bool NULL
				)
			`);

			const [singleInput, arrayInput] = [
				// eslint-disable-next-line @typescript-eslint/ban-types
				serializer<Boolean>(Boolean)(true),
				// eslint-disable-next-line @typescript-eslint/ban-types
				arraySerializer<Boolean>(Boolean, ",")([true, false]),
			];

			expect(singleInput).toEqual("true");
			expect(arrayInput).toEqual("{true,false}");

			await client.query(
				`
				INSERT INTO public.vitestboolean (boolean, _boolean)
				VALUES (
					$1::bool,
					$2::_bool
				)
			`,
				[singleInput, arrayInput]
			);
		} catch {
			expect.fail("Failed to connect to PostgreSQL");
		}

		const result = await client.query(`
				SELECT * FROM public.vitestboolean
			`);

		// eslint-disable-next-line @typescript-eslint/ban-types
		result.rows[0].boolean = parser<Boolean>(Boolean)(result.rows[0].boolean);
		// eslint-disable-next-line @typescript-eslint/ban-types
		result.rows[0]._boolean = arrayParser<Boolean>(Boolean, ",")(result.rows[0]._boolean);

		expect(Boolean.isBoolean(result.rows[0].boolean)).toBe(true);
		expect(Boolean.from(true).equals(result.rows[0].boolean)).toBe(true);

		const [a, b] = result.rows[0]._boolean;
		expect(result.rows[0]._boolean).toHaveLength(2);
		expect(Boolean.isBoolean(a)).toBe(true);
		expect(Boolean.from(true).equals(a)).toBe(true);
		expect(Boolean.isBoolean(b)).toBe(true);
		expect(Boolean.from(false).equals(b)).toBe(true);

		try {
			await client.query(`
				DROP TABLE public.vitestboolean
			`);

			await client.end();
		} catch {
			expect.fail("Failed to disconnect from PostgreSQL");
		}
	});
});
