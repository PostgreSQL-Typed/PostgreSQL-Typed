import { Client } from "pg";
import { describe, expect, it, test } from "vitest";

import { CharacterVarying } from "./CharacterVarying.js";

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
				received: "boolean",
				message: "Expected 'string' | 'object', received 'boolean'",
			});
		}

		//@ts-expect-error - testing invalid type
		const tooManyArguments = CharacterVarying.safeFrom("a", 2);
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
		const tooFewArguments = CharacterVarying.safeFrom();
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

		const unrecognizedKeys = CharacterVarying.safeFrom({
			value: "a",
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
				objectKey: "value",
				expected: "string",
				received: "number",
				message: "Expected 'string' for key 'value', received 'number'",
			});
		}

		const invalidCharLength = CharacterVarying.setN(1).safeFrom(CharacterVarying.setN(2).from("a"));
		expect(invalidCharLength.success).toEqual(false);
		if (invalidCharLength.success) expect.fail();
		else {
			expect(invalidCharLength.error.issue).toStrictEqual({
				code: "invalid_n_length",
				maximum: 1,
				received: 2,
				message: "Invalid 'n' length: 2, 'n' must be less than or equal to 1",
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
				received: "boolean",
				message: "Expected 'string' | 'object', received 'boolean'",
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
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			application_name: "varchar.test.ts",
		});

		await client.connect();

		let error = null;
		try {
			await client.query(`
				CREATE TABLE IF NOT EXISTS public.vitestvarchar (
					varchar varchar NULL,
					_varchar _varchar NULL
				)
			`);

			await client.query(`
				INSERT INTO public.vitestvarchar (varchar, _varchar)
				VALUES (
					'a',
					'{a, b}'
				)
			`);

			const result = await client.query(`
				SELECT * FROM public.vitestvarchar
			`);

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
