import { Client, types } from "pg";
import { describe, expect, it, test } from "vitest";

import { arrayParser } from "../../util/arrayParser.js";
import { arraySerializer } from "../../util/arraySerializer.js";
import { parser } from "../../util/parser.js";
import { serializer } from "../../util/serializer.js";
import { Bit } from "../BitString/Bit.js";
import { BitVarying } from "../BitString/BitVarying.js";
import { Int2 } from "../Numeric/Int2.js";
import { Int4 } from "../Numeric/Int4.js";
import { Int8 } from "../Numeric/Int8.js";
import { OID } from "../ObjectIdentifier/OID.js";
import { UUID } from "../UUID/UUID.js";
import { Character } from "./Character.js";
import { CharacterVarying } from "./CharacterVarying.js";
import { Name } from "./Name.js";
import { Text } from "./Text.js";

describe("CharacterVaryingConstructor", () => {
	test("_parse(...)", () => {
		//#region //* it should return OK when parsing succeeds
		expect(CharacterVarying.safeFrom("a").success).toBe(true);
		expect(CharacterVarying.safeFrom(CharacterVarying.from("a")).success).toBe(true);
		expect(
			CharacterVarying.safeFrom({
				value: "a",
			}).success
		).toBe(true);

		// Test it with a different n
		const CharacterVarying2 = CharacterVarying.setN(3);
		expect(CharacterVarying2.safeFrom("abc").success).toBe(true);
		expect(CharacterVarying2.safeFrom("abc").success).toBe(true);
		expect(CharacterVarying2.safeFrom(CharacterVarying2.from("abc")).success).toBe(true);
		expect(CharacterVarying.safeFrom(Bit.from(1)).success).toBe(true);
		expect(CharacterVarying.safeFrom(BitVarying.from(1)).success).toBe(true);
		expect(CharacterVarying.safeFrom(Character.from("a")).success).toBe(true);
		expect(CharacterVarying.safeFrom(Name.from("a")).success).toBe(true);
		expect(CharacterVarying.safeFrom(Text.from("a")).success).toBe(true);
		expect(CharacterVarying.safeFrom(Int2.from(1)).success).toBe(true);
		expect(CharacterVarying.safeFrom(Int4.from(1)).success).toBe(true);
		expect(CharacterVarying.safeFrom(Int8.from(1)).success).toBe(true);
		expect(CharacterVarying.safeFrom(OID.from(1)).success).toBe(true);
		expect(CharacterVarying.setN(36).safeFrom(UUID.generate()).success).toBe(true);
		expect(
			CharacterVarying2.safeFrom({
				value: "abc",
			}).success
		).toBe(true);
		//#endregion

		//#region //* should return INVALID when parsing fails
		const boolean = CharacterVarying.safeFrom(true as any);
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

		//@ts-expect-error - testing invalid type
		const tooManyArguments = CharacterVarying.safeFrom("a", 2);
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
		const tooFewArguments = CharacterVarying.safeFrom();
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

		const unrecognizedKeys = CharacterVarying.safeFrom({
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

		const missingKeys = CharacterVarying.safeFrom({
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

		const invalidKeys = CharacterVarying.safeFrom({
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

		const invalidCharLength = CharacterVarying.setN(1).safeFrom(CharacterVarying.setN(2).from("a"));
		expect(invalidCharLength.success).toEqual(false);
		if (invalidCharLength.success) expect.fail();
		else {
			expect(invalidCharLength.error.issue).toStrictEqual({
				code: "invalid_n_length",
				input: "a",
				maximum: 1,
				message: "Invalid 'n' length: 2, 'n' must be less than or equal to 1",
				received: 2,
			});
		}
		//#endregion
	});

	test("isCharacterVarying(...)", () => {
		//* it should return true in isCharacterVarying when value is a CharacterVarying
		expect(CharacterVarying.isCharacterVarying(CharacterVarying.from("a"))).toBe(true);

		//* it should return false in isCharacterVarying when value is not a CharacterVarying
		expect(CharacterVarying.isCharacterVarying("a")).toEqual(false);
		expect(CharacterVarying.isCharacterVarying({})).toEqual(false);
		expect(CharacterVarying.isCharacterVarying({ value: "a" })).toEqual(false);

		//* it should return true in isCharacterVarying when value is a CharacterVarying of specified length
		expect(CharacterVarying.isCharacterVarying(CharacterVarying.from("a"), Number.POSITIVE_INFINITY)).toBe(true);
		expect(CharacterVarying.isCharacterVarying(CharacterVarying.setN(3).from("abc"), 3)).toBe(true);

		//* it should return false in isCharacterVarying when value is not a CharacterVarying of specified length
		expect(CharacterVarying.isCharacterVarying(CharacterVarying.from("a"), 2)).toEqual(false);
		expect(CharacterVarying.isCharacterVarying(CharacterVarying.setN(3).from("abc"), 2)).toEqual(false);
	});

	test("isAnyCharacterVarying(...)", () => {
		//* it should return true in isAnyCharacterVarying when value is a CharacterVarying of any length
		expect(CharacterVarying.isAnyCharacterVarying(CharacterVarying.from("a"))).toBe(true);
		expect(CharacterVarying.isAnyCharacterVarying(CharacterVarying.setN(3).from("abc"))).toBe(true);

		//* it should return false in isAnyCharacterVarying when value is not a CharacterVarying
		expect(CharacterVarying.isAnyCharacterVarying("a")).toEqual(false);
		expect(CharacterVarying.isAnyCharacterVarying({})).toEqual(false);
		expect(CharacterVarying.isAnyCharacterVarying({ value: "a" })).toEqual(false);
	});

	test("setN(...)", () => {
		//* it should return a new CharacterVarying class with a new n
		const CharacterVarying2 = CharacterVarying.setN(2);
		expect(CharacterVarying2.n).toEqual(2);

		//* It should error on invalid n values
		expect(() => CharacterVarying.setN(1.5)).toThrowError("Number must be whole");
		expect(() => CharacterVarying.setN(-1)).toThrowError("Number must be greater than or equal to 1");
		expect(() => CharacterVarying.setN(10_485_761)).toThrowError("Number must be less than or equal to 10485760");
		expect(() => CharacterVarying.setN(true as any)).toThrowError("Expected 'number' | 'infinity', received 'boolean'");
	});

	test("get n()", () => {
		//* it should return the n of the CharacterVarying class
		expect(CharacterVarying.n).toEqual(Number.POSITIVE_INFINITY);
	});
});

describe("CharacterVarying", () => {
	test("_equals(...)", () => {
		//#region //* it should return OK when parsing succeeds
		const character = CharacterVarying.from("a");
		expect(character.equals(CharacterVarying.from("a"))).toBe(true);
		expect(character.equals(CharacterVarying.from("b"))).toEqual(false);
		expect(character.equals("a")).toBe(true);
		expect(character.equals("b")).toEqual(false);
		expect(character.equals({ value: "a" })).toBe(true);
		expect(character.equals({ value: "b" })).toEqual(false);

		const safeEquals1 = character.safeEquals(CharacterVarying.from("a"));
		expect(safeEquals1.success).toBe(true);
		if (safeEquals1.success) expect(safeEquals1.equals).toBe(true);
		else expect.fail();

		const safeEquals2 = character.safeEquals(CharacterVarying.from("b"));
		expect(safeEquals2.success).toBe(true);
		if (safeEquals2.success) expect(safeEquals2.equals).toEqual(false);
		else expect.fail();

		const safeEquals3 = character.safeEquals("a");
		expect(safeEquals3.success).toBe(true);
		if (safeEquals3.success) expect(safeEquals3.equals).toBe(true);
		else expect.fail();

		const safeEquals4 = character.safeEquals("b");
		expect(safeEquals4.success).toBe(true);
		if (safeEquals4.success) expect(safeEquals4.equals).toEqual(false);
		else expect.fail();

		const safeEquals5 = character.safeEquals({ value: "a" });
		expect(safeEquals5.success).toBe(true);
		if (safeEquals5.success) expect(safeEquals5.equals).toBe(true);
		else expect.fail();

		const safeEquals6 = character.safeEquals({ value: "b" });
		expect(safeEquals6.success).toBe(true);
		if (safeEquals6.success) expect(safeEquals6.equals).toEqual(false);
		else expect.fail();
		//#endregion

		//#region //* should return INVALID when parsing fails
		const boolean = character.safeEquals(true as any);
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

		expect(() => character.equals(true as any)).toThrowError();
		//#endregion
	});

	test("toString()", () => {
		const varchar = CharacterVarying.from("a");
		expect(varchar.toString()).toEqual("a");
	});

	test("toJSON()", () => {
		const varchar = CharacterVarying.from("a");
		expect(varchar.toJSON()).toStrictEqual({ value: "a" });
	});

	test("get characterVarying()", () => {
		expect(CharacterVarying.setN(3).from("abc").characterVarying).toEqual("abc");
		expect(CharacterVarying.setN(3).from({ value: "abc" }).characterVarying).toEqual("abc");
	});

	test("set characterVarying(...)", () => {
		const character = CharacterVarying.setN(2).from("a");
		character.characterVarying = "b";
		expect(character.characterVarying).toEqual("b");

		expect(() => (character.characterVarying = "abc" as any)).toThrowError("Invalid 'n' length: 3, 'n' must be less than or equal to 2");
	});

	test("get value()", () => {
		expect(CharacterVarying.setN(3).from("abc").value).toEqual("abc");
		expect(CharacterVarying.setN(3).from({ value: "abc" }).value).toEqual("abc");
	});

	test("set value(...)", () => {
		const character = CharacterVarying.setN(2).from("a");
		character.value = "b";
		expect(character.value).toEqual("b");

		expect(() => (character.value = "abc" as any)).toThrowError("Invalid 'n' length: 3, 'n' must be less than or equal to 2");
	});

	test("get postgres()", () => {
		expect(CharacterVarying.setN(3).from("abc").postgres).toEqual("abc");
		expect(CharacterVarying.setN(3).from({ value: "abc" }).postgres).toEqual("abc");
	});

	test("set postgres(...)", () => {
		const character = CharacterVarying.setN(2).from("a");
		character.postgres = "b";
		expect(character.postgres).toEqual("b");

		expect(() => (character.postgres = "abc" as any)).toThrowError("Invalid 'n' length: 3, 'n' must be less than or equal to 2");
	});
});

describe("PostgreSQL", () => {
	it("should work with PostgreSQL's own tests", () => {
		//* https://github.com/postgres/postgres/blob/master/src/test/regress/sql/varchar.sql
		const C = CharacterVarying.setN(11);

		expect(() => C.from("")).not.toThrowError();
		expect(() => C.from("0")).not.toThrowError();
		expect(() => C.from("010101")).not.toThrowError();
		expect(() => C.from("01010101010")).not.toThrowError();
		expect(() => C.from("101011111010")).toThrowError(); // too long
	});

	it("should be returned as a CharacterVarying", async () => {
		const client = new Client({
			application_name: "varchar.test.ts",
			database: "postgres",
			host: "localhost",
			password: "password",
			port: 5432,
			user: "postgres",
		});

		await client.connect();

		//* PG has a native parser for the '_varchar' type
		types.setTypeParser(1015 as any, value => value);

		let error = null;
		try {
			await client.query(`
				CREATE TABLE IF NOT EXISTS public.vitestvarchar (
					varchar varchar NULL,
					_varchar _varchar NULL
				)
			`);

			const [singleInput, arrayInput] = [
				serializer<CharacterVarying<number>>(CharacterVarying)(CharacterVarying.from("a")),
				arraySerializer<CharacterVarying<number>>(CharacterVarying, ",")([CharacterVarying.from("a"), CharacterVarying.from("b")]),
			];

			expect(singleInput).toEqual("a");
			expect(arrayInput).toEqual("{a,b}");

			await client.query(
				`
				INSERT INTO public.vitestvarchar (varchar, _varchar)
				VALUES (
					$1::varchar,
					$2::_varchar
				)
			`,
				[singleInput, arrayInput]
			);

			const result = await client.query(`
				SELECT * FROM public.vitestvarchar
			`);

			result.rows[0].varchar = parser<CharacterVarying<number>>(CharacterVarying)(result.rows[0].varchar);
			result.rows[0]._varchar = arrayParser<CharacterVarying<number>>(CharacterVarying)(result.rows[0]._varchar);

			expect(CharacterVarying.isCharacterVarying(result.rows[0].varchar)).toBe(true);
			expect(CharacterVarying.from("a").equals(result.rows[0].varchar)).toBe(true);

			const [a, b] = result.rows[0]._varchar;
			expect(result.rows[0]._varchar).toHaveLength(2);
			expect(CharacterVarying.isCharacterVarying(a)).toBe(true);
			expect(CharacterVarying.from("a").equals(a)).toBe(true);
			expect(CharacterVarying.isCharacterVarying(b)).toBe(true);
			expect(CharacterVarying.from("b").equals(b)).toBe(true);
		} catch (error_) {
			error = error_;
			// eslint-disable-next-line no-console
			console.error(error);
		}

		await client.query(`
				DROP TABLE public.vitestvarchar
			`);

		await client.end();

		if (error) throw error;
	});
});
