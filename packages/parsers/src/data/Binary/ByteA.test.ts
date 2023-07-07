import { Buffer } from "node:buffer";

import { Client, types } from "pg";
import { describe, expect, it, test } from "vitest";

import { arrayParser } from "../../util/arrayParser.js";
import { arraySerializer } from "../../util/arraySerializer.js";
import { parser } from "../../util/parser.js";
import { serializer } from "../../util/serializer.js";
import { ByteA } from "./ByteA.js";

describe("ByteAConstructor", () => {
	test("_parse(...)", () => {
		//#region //* it should return OK when parsing succeeds
		expect(ByteA.safeFrom("\\x1234").success).toBe(true);
		expect(ByteA.safeFrom("\\000\\100\\200").success).toBe(true);
		expect(ByteA.safeFrom(Buffer.from([0x12, 0x34])).success).toBe(true);
		expect(
			ByteA.safeFrom({
				value: Buffer.from([0x12, 0x34]),
			}).success
		).toBe(true);
		expect(ByteA.safeFrom(ByteA.from("\\x1234").value).success).toBe(true);
		//#endregion

		//#region //* should return INVALID when parsing fails
		const boolean = ByteA.safeFrom(true as any);
		expect(boolean.success).toEqual(false);
		if (boolean.success) expect.fail();
		else {
			expect(boolean.error.issue).toStrictEqual({
				code: "invalid_type",
				expected: ["string", "object", "Buffer"],
				received: "boolean",
				message: "Expected 'string' | 'object' | 'Buffer', received 'boolean'",
			});
		}

		//@ts-expect-error - testing invalid type
		const tooManyArguments = ByteA.safeFrom(1, 2);
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
		const tooFewArguments = ByteA.safeFrom();
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

		const unrecognizedKeys = ByteA.safeFrom({
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

		const missingKeys = ByteA.safeFrom({
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

		const invalidKeys = ByteA.safeFrom({
			value: 1,
		} as any);
		expect(invalidKeys.success).toEqual(false);
		if (invalidKeys.success) expect.fail();
		else {
			expect(invalidKeys.error.issue).toStrictEqual({
				code: "invalid_key_type",
				objectKey: "value",
				expected: "Buffer",
				received: "number",
				message: "Expected 'Buffer' for key 'value', received 'number'",
			});
		}
		//#endregion
	});

	test("isByteA(...)", () => {
		//* it should return true in isByteA when value is a ByteA
		expect(ByteA.isByteA(ByteA.from("\\x1234"))).toBe(true);

		//* it should return false in isByteA when value is not a ByteA
		expect(ByteA.isByteA("\\x1234")).toEqual(false);
		expect(ByteA.isByteA(Buffer.from([0x12, 0x34]))).toEqual(false);
		expect(ByteA.isByteA({})).toEqual(false);
		expect(ByteA.isByteA({ value: Buffer.from([0x12, 0x34]) })).toEqual(false);
	});
});

describe("ByteA", () => {
	test("_equals(...)", () => {
		//#region //* it should return OK when parsing succeeds
		const bytea = ByteA.from("\\x1234");
		expect(bytea.equals(ByteA.from("\\x1234"))).toBe(true);
		expect(bytea.equals(ByteA.from("\\x3456"))).toEqual(false);
		expect(bytea.equals("\\x1234")).toBe(true);
		expect(bytea.equals("\\3456")).toEqual(false);
		expect(bytea.equals({ value: Buffer.from([0x12, 0x34]) })).toBe(true);
		expect(bytea.equals({ value: Buffer.from([0x34, 0x56]) })).toEqual(false);
		expect(ByteA.from("foo\\000\\200\\\\\\377").equals(Buffer.from([102, 111, 111, 0, 128, 92, 255]))).toBe(true);

		const safeEquals1 = bytea.safeEquals(ByteA.from("\\x1234"));
		expect(safeEquals1.success).toBe(true);
		if (safeEquals1.success) expect(safeEquals1.equals).toBe(true);
		else expect.fail();

		const safeEquals2 = bytea.safeEquals(ByteA.from("\\x3456"));
		expect(safeEquals2.success).toBe(true);
		if (safeEquals2.success) expect(safeEquals2.equals).toEqual(false);
		else expect.fail();

		const safeEquals3 = bytea.safeEquals("\\x1234");
		expect(safeEquals3.success).toBe(true);
		if (safeEquals3.success) expect(safeEquals3.equals).toBe(true);
		else expect.fail();

		const safeEquals4 = bytea.safeEquals("\\x3456");
		expect(safeEquals4.success).toBe(true);
		if (safeEquals4.success) expect(safeEquals4.equals).toEqual(false);
		else expect.fail();

		const safeEquals5 = bytea.safeEquals(Buffer.from([0x12, 0x34]));
		expect(safeEquals5.success).toBe(true);
		if (safeEquals5.success) expect(safeEquals5.equals).toBe(true);
		else expect.fail();

		const safeEquals6 = bytea.safeEquals(Buffer.from([0x34, 0x56]));
		expect(safeEquals6.success).toBe(true);
		if (safeEquals6.success) expect(safeEquals6.equals).toEqual(false);
		else expect.fail();

		const safeEquals7 = bytea.safeEquals({ value: Buffer.from([0x12, 0x34]) });
		expect(safeEquals7.success).toBe(true);
		if (safeEquals7.success) expect(safeEquals7.equals).toBe(true);
		else expect.fail();

		const safeEquals8 = bytea.safeEquals({ value: Buffer.from([0x34, 0x56]) });
		expect(safeEquals8.success).toBe(true);
		if (safeEquals8.success) expect(safeEquals8.equals).toEqual(false);
		else expect.fail();
		//#endregion

		//#region //* should return INVALID when parsing fails
		const boolean = bytea.safeEquals(true as any);
		expect(boolean.success).toEqual(false);
		if (boolean.success) expect.fail();
		else {
			expect(boolean.error.issue).toStrictEqual({
				code: "invalid_type",
				expected: ["string", "object", "Buffer"],
				received: "boolean",
				message: "Expected 'string' | 'object' | 'Buffer', received 'boolean'",
			});
		}

		expect(() => bytea.equals(true as any)).toThrowError();
		//#endregion
	});

	test("toString()", () => {
		const bytea = ByteA.from("\\x1234");
		expect(bytea.toString()).toEqual("\\x1234");
		const bytea2 = ByteA.from(Buffer.from([0x12, 0x34]));
		expect(bytea2.toString()).toEqual("\\x1234");
	});

	test("toBuffer()", () => {
		const bytea = ByteA.from("\\x1234");
		expect(bytea.toBuffer()).toEqual(Buffer.from([0x12, 0x34]));
	});

	test("toJSON()", () => {
		const bytea = ByteA.from("\\x1234");
		expect(bytea.toJSON()).toStrictEqual({ value: Buffer.from([0x12, 0x34]) });
	});

	test("get bytea()", () => {
		expect(ByteA.from("\\x1234").bytea).toEqual(Buffer.from([0x12, 0x34]));
		expect(ByteA.from(Buffer.from([0x12, 0x34])).bytea).toEqual(Buffer.from([0x12, 0x34]));
		expect(ByteA.from({ value: Buffer.from([0x12, 0x34]) }).bytea).toEqual(Buffer.from([0x12, 0x34]));
	});

	test("set bytea(...)", () => {
		const bytea = ByteA.from("\\x1234");
		bytea.bytea = Buffer.from([0x34, 0x56]);
		expect(bytea.bytea).toEqual(Buffer.from([0x34, 0x56]));

		expect(() => (bytea.bytea = true as any)).toThrowError("Expected 'string' | 'object' | 'Buffer', received 'boolean'");
	});

	test("get value()", () => {
		expect(ByteA.from("\\x1234").value).toEqual(Buffer.from([0x12, 0x34]));
		expect(ByteA.from(Buffer.from([0x12, 0x34])).value).toEqual(Buffer.from([0x12, 0x34]));
		expect(ByteA.from({ value: Buffer.from([0x12, 0x34]) }).value).toEqual(Buffer.from([0x12, 0x34]));
	});

	test("set value(...)", () => {
		const bytea = ByteA.from("\\x1234");
		bytea.value = Buffer.from([0x34, 0x56]);
		expect(bytea.value).toEqual(Buffer.from([0x34, 0x56]));

		expect(() => (bytea.value = true as any)).toThrowError("Expected 'string' | 'object' | 'Buffer', received 'boolean'");
	});

	test("get postgres()", () => {
		expect(ByteA.from("\\x1234").postgres).toEqual("\\x1234");
		expect(ByteA.from(Buffer.from([0x12, 0x34])).postgres).toEqual("\\x1234");
		expect(ByteA.from({ value: Buffer.from([0x12, 0x34]) }).postgres).toEqual("\\x1234");
	});

	test("set postgres(...)", () => {
		const bytea = ByteA.from("\\x1234");
		bytea.postgres = "\\x3456";
		expect(bytea.postgres).toEqual("\\x3456");

		expect(() => (bytea.postgres = true as any)).toThrowError("Expected 'string' | 'object' | 'Buffer', received 'boolean'");
	});
});

describe("PostgreSQL", () => {
	it.skip("should work with PostgreSQL's own tests", () => {
		//* https://github.com/postgres/postgres/blob/master/src/test/regress/sql/bytea.sql
		//* Could not find any official tests for bytea...
	});

	it("should be returned as a ByteA", async () => {
		const client = new Client({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			application_name: "bytea.test.ts",
		});

		await client.connect();

		//* PG has a native parser for the 'bytea' and '_bytea' types
		types.setTypeParser(17 as any, value => value);
		types.setTypeParser(1001 as any, value => value);

		let error = null;
		try {
			await client.query(`
				CREATE TABLE IF NOT EXISTS public.vitestbytea (
					bytea bytea NULL,
					_bytea _bytea NULL
				)
			`);

			const [singleInput, arrayInput] = [
				serializer<ByteA>(ByteA)(ByteA.from("\\x1234")),
				arraySerializer<ByteA>(ByteA, undefined, "\\")([ByteA.from(Buffer.from([0x12, 0x34])), ByteA.from("foo\\000\\200\\\\\\377")]),
			];

			expect(singleInput).toEqual("\\x1234");
			expect(arrayInput).toEqual('{"\\\\x1234","\\\\x666f6f00805cff"}');

			await client.query(
				`
				INSERT INTO public.vitestbytea ("bytea", "_bytea")
				VALUES (
					$1::bytea,
					$2::_bytea
				)
			`,
				[singleInput, arrayInput]
			);

			const result = await client.query(`
				SELECT * FROM public.vitestbytea
			`);

			result.rows[0].bytea = parser<ByteA>(ByteA)(result.rows[0].bytea);
			result.rows[0]._bytea = arrayParser<ByteA>(ByteA, undefined, "\\")(result.rows[0]._bytea);

			expect(ByteA.isByteA(result.rows[0].bytea)).toBe(true);
			expect(ByteA.from("\\x1234").equals(result.rows[0].bytea)).toBe(true);

			const [a, b] = result.rows[0]._bytea;
			expect(result.rows[0]._bytea).toHaveLength(2);
			expect(ByteA.isByteA(a)).toBe(true);
			expect(ByteA.from(Buffer.from([0x12, 0x34])).equals(a)).toBe(true);
			expect(ByteA.isByteA(b)).toBe(true);
			expect(ByteA.from(Buffer.from([102, 111, 111, 0, 128, 92, 255])).equals(b)).toBe(true);
		} catch (error_) {
			error = error_;
			// eslint-disable-next-line no-console
			console.error(error);
		}

		await client.query(`
				DROP TABLE public.vitestbytea
			`);

		await client.end();

		if (error) throw error;
	});
});
