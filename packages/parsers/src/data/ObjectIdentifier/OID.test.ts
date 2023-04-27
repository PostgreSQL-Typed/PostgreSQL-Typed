/* eslint-disable unicorn/filename-case */
import { Client, types } from "pg";
import { describe, expect, it, test } from "vitest";

import { arrayParser } from "../../util/arrayParser.js";
import { parser } from "../../util/parser.js";
import { OID } from "./OID.js";

describe("OIDConstructor", () => {
	test("_parse(...)", () => {
		//#region //* it should return OK when parsing succeeds
		expect(OID.safeFrom(1).success).toBe(true);
		expect(OID.safeFrom(4_294_967_295).success).toBe(true);
		expect(OID.safeFrom(0).success).toBe(true);
		expect(OID.safeFrom("1").success).toBe(true);
		expect(OID.safeFrom("4294967295").success).toBe(true);
		expect(OID.safeFrom("0").success).toBe(true);
		expect(OID.safeFrom(OID.from(1)).success).toBe(true);
		expect(OID.safeFrom(OID.from(4_294_967_295)).success).toBe(true);
		expect(OID.safeFrom(OID.from(0)).success).toBe(true);
		expect(
			OID.safeFrom({
				value: 1,
			}).success
		).toBe(true);
		expect(
			OID.safeFrom({
				value: 4_294_967_295,
			}).success
		).toBe(true);
		expect(
			OID.safeFrom({
				value: 0,
			}).success
		).toBe(true);
		//#endregion

		//#region //* should return INVALID when parsing fails
		const boolean = OID.safeFrom(true as any);
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

		const nanString = OID.safeFrom("abc");
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

		const notFinite1 = OID.safeFrom(Number.POSITIVE_INFINITY);
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

		const notFinite2 = OID.safeFrom("Infinity");
		expect(notFinite2.success).toEqual(false);
		if (notFinite2.success) expect.fail();
		else {
			expect(notFinite2.error.issue).toStrictEqual({
				code: "not_finite",
				message: "Number must be finite",
			});
		}

		const notWhole = OID.safeFrom(0.5);
		expect(notWhole.success).toEqual(false);
		if (notWhole.success) expect.fail();
		else {
			expect(notWhole.error.issue).toStrictEqual({
				code: "not_whole",
				message: "Number must be whole",
			});
		}

		const tooBig = OID.safeFrom(4_294_967_296);
		expect(tooBig.success).toEqual(false);
		if (tooBig.success) expect.fail();
		else {
			expect(tooBig.error.issue).toStrictEqual({
				code: "too_big",
				type: "number",
				maximum: 4_294_967_295,
				inclusive: true,
				message: "Number must be less than or equal to 4294967295",
			});
		}

		const tooSmall = OID.safeFrom(-1);
		expect(tooSmall.success).toEqual(false);
		if (tooSmall.success) expect.fail();
		else {
			expect(tooSmall.error.issue).toStrictEqual({
				code: "too_small",
				type: "number",
				minimum: 0,
				inclusive: true,
				message: "Number must be greater than or equal to 0",
			});
		}

		//@ts-expect-error - testing invalid type
		const tooManyArguments = OID.safeFrom(1, 2);
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
		const tooFewArguments = OID.safeFrom();
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

		const unrecognizedKeys = OID.safeFrom({
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

		const missingKeys = OID.safeFrom({
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

		const invalidKeys = OID.safeFrom({
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

	test("isOID(...)", () => {
		//* it should return true in isOID when value is a OID
		expect(OID.isOID(OID.from(1))).toBe(true);

		//* it should return false in isOID when value is not a OID
		expect(OID.isOID(1)).toEqual(false);
		expect(OID.isOID("1")).toEqual(false);
		expect(OID.isOID({})).toEqual(false);
		expect(OID.isOID({ value: 1 })).toEqual(false);
	});
});

describe("OID", () => {
	test("_equals(...)", () => {
		//#region //* it should return OK when parsing succeeds
		const oid = OID.from(1);
		expect(oid.equals(OID.from(1))).toBe(true);
		expect(oid.equals(OID.from(2))).toEqual(false);
		expect(oid.equals(1)).toBe(true);
		expect(oid.equals(2)).toEqual(false);
		expect(oid.equals("1")).toBe(true);
		expect(oid.equals("2")).toEqual(false);
		expect(oid.equals({ value: 1 })).toBe(true);
		expect(oid.equals({ value: 2 })).toEqual(false);

		const safeEquals1 = oid.safeEquals(OID.from(1));
		expect(safeEquals1.success).toBe(true);
		if (safeEquals1.success) expect(safeEquals1.equals).toBe(true);
		else expect.fail();

		const safeEquals2 = oid.safeEquals(OID.from(2));
		expect(safeEquals2.success).toBe(true);
		if (safeEquals2.success) expect(safeEquals2.equals).toEqual(false);
		else expect.fail();

		const safeEquals3 = oid.safeEquals(1);
		expect(safeEquals3.success).toBe(true);
		if (safeEquals3.success) expect(safeEquals3.equals).toBe(true);
		else expect.fail();

		const safeEquals4 = oid.safeEquals(2);
		expect(safeEquals4.success).toBe(true);
		if (safeEquals4.success) expect(safeEquals4.equals).toEqual(false);
		else expect.fail();

		const safeEquals5 = oid.safeEquals("1");
		expect(safeEquals5.success).toBe(true);
		if (safeEquals5.success) expect(safeEquals5.equals).toBe(true);
		else expect.fail();

		const safeEquals6 = oid.safeEquals("2");
		expect(safeEquals6.success).toBe(true);
		if (safeEquals6.success) expect(safeEquals6.equals).toEqual(false);
		else expect.fail();

		const safeEquals7 = oid.safeEquals({ value: 1 });
		expect(safeEquals7.success).toBe(true);
		if (safeEquals7.success) expect(safeEquals7.equals).toBe(true);
		else expect.fail();

		const safeEquals8 = oid.safeEquals({ value: 2 });
		expect(safeEquals8.success).toBe(true);
		if (safeEquals8.success) expect(safeEquals8.equals).toEqual(false);
		else expect.fail();
		//#endregion

		//#region //* should return INVALID when parsing fails
		const boolean = oid.safeEquals(true as any);
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

		expect(() => oid.equals(true as any)).toThrowError();
		//#endregion
	});

	test("toString()", () => {
		const oid = OID.from(1);
		expect(oid.toString()).toEqual("1");
	});

	test("toNumber()", () => {
		const oid = OID.from(1);
		expect(oid.toNumber()).toEqual(1);
	});

	test("toJSON()", () => {
		const oid = OID.from(1);
		expect(oid.toJSON()).toStrictEqual({ value: 1 });
	});

	test("get oid()", () => {
		expect(OID.from(1).oid).toEqual(1);
		expect(OID.from("2").oid).toEqual(2);
		expect(OID.from({ value: 3 }).oid).toEqual(3);
	});

	test("set oid(...)", () => {
		const oid = OID.from(1);
		oid.oid = 2;
		expect(oid.oid).toEqual(2);

		expect(() => (oid.oid = 4_294_967_296)).toThrowError("Number must be less than or equal to 4294967295");
	});

	test("get value()", () => {
		expect(OID.from(1).value).toEqual(1);
		expect(OID.from("2").value).toEqual(2);
		expect(OID.from({ value: 3 }).value).toEqual(3);
	});

	test("set value(...)", () => {
		const oid = OID.from(1);
		oid.value = 2;
		expect(oid.value).toEqual(2);

		expect(() => (oid.value = 4_294_967_296)).toThrowError("Number must be less than or equal to 4294967295");
	});

	test("get postgres()", () => {
		expect(OID.from(1).postgres).toEqual("1");
		expect(OID.from("2").postgres).toEqual("2");
		expect(OID.from({ value: 3 }).postgres).toEqual("3");
	});

	test("set postgres(...)", () => {
		const oid = OID.from(1);
		oid.postgres = "2";
		expect(oid.postgres).toEqual("2");

		expect(() => (oid.postgres = "4294967296")).toThrowError("Number must be less than or equal to 4294967295");
	});
});

describe("PostgreSQL", () => {
	it("should work with PostgreSQL's own tests", () => {
		//* https://github.com/postgres/postgres/blob/master/src/test/regress/sql/oid.sql
		expect(() => OID.from("1234")).not.toThrowError();
		expect(() => OID.from("1235")).not.toThrowError();
		expect(() => OID.from("987")).not.toThrowError();
		expect(() => OID.from("-1040")).toThrowError();
		expect(() => OID.from("99999999")).not.toThrowError();
		expect(() => OID.from("5     ")).not.toThrowError();
		expect(() => OID.from("   10  ")).not.toThrowError();
		// leading/trailing hard tab is also allowed
		expect(() => OID.from("	  15 	  ")).not.toThrowError();

		// bad inputs
		expect(() => OID.from("")).toThrowError();
		expect(() => OID.from("    ")).toThrowError();
		expect(() => OID.from("asdfasd")).toThrowError();
		expect(() => OID.from("99asdfasd")).not.toThrowError(); // Our parser is more lenient, it just ignores the invalid characters
		expect(() => OID.from("5    d")).not.toThrowError(); // Our parser is more lenient, it just ignores the invalid characters
		expect(() => OID.from("    5d")).not.toThrowError(); // Our parser is more lenient, it just ignores the invalid characters
		expect(() => OID.from("5    5")).not.toThrowError(); // Our parser is more lenient, it just ignores the invalid characters
		expect(() => OID.from(" - 500")).toThrowError();
		expect(() => OID.from("32958209582039852935")).toThrowError();
		expect(() => OID.from("-23582358720398502385")).toThrowError();
	});

	it("should be returned as a OID", async () => {
		const client = new Client({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			application_name: "oid.test.ts",
		});

		try {
			await client.connect();

			//* PG has a native parser for the '_oid' type
			types.setTypeParser(1028 as any, value => value);

			await client.query(`
				CREATE TABLE IF NOT EXISTS public.vitestoid (
					oid oid NULL,
					_oid _oid NULL
				)
			`);

			await client.query(`
				INSERT INTO public.vitestoid (oid, _oid)
				VALUES (
					1,
					'{2, 3}'
				)
			`);
		} catch {
			expect.fail("Failed to connect to PostgreSQL");
		}

		const result = await client.query(`
			SELECT * FROM public.vitestoid
		`);

		result.rows[0].oid = parser<OID>(OID)(result.rows[0].oid);
		result.rows[0]._oid = arrayParser<OID>(OID, ",")(result.rows[0]._oid);

		expect(OID.isOID(result.rows[0].oid)).toBe(true);
		expect(OID.from(1).equals(result.rows[0].oid)).toBe(true);

		const [a, b] = result.rows[0]._oid;
		expect(result.rows[0]._oid).toHaveLength(2);
		expect(OID.isOID(a)).toBe(true);
		expect(OID.from(2).equals(a)).toBe(true);
		expect(OID.isOID(b)).toBe(true);
		expect(OID.from(3).equals(b)).toBe(true);

		try {
			await client.query(`
				DROP TABLE public.vitestoid
			`);

			await client.end();
		} catch {
			expect.fail("Failed to disconnect from PostgreSQL");
		}
	});
});
