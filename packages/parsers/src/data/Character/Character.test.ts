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

describe("CharacterConstructor", () => {
	test("_parse(...)", () => {
		//#region //* it should return OK when parsing succeeds
		expect(Character.safeFrom("a").success).toBe(true);
		expect(Character.safeFrom(Character.from("a")).success).toBe(true);
		expect(
			Character.safeFrom({
				value: "a",
			}).success
		).toBe(true);

		// Test it with a different n
		const Character2 = Character.setN(3);
		expect(Character2.safeFrom("abc").success).toBe(true);
		expect(Character2.safeFrom("a").success).toBe(true);
		expect(Character2.safeFrom(Character2.from("a")).success).toBe(true);
		expect(Character.safeFrom(Bit.from(1)).success).toBe(true);
		expect(Character.safeFrom(BitVarying.from(1)).success).toBe(true);
		expect(Character.safeFrom(CharacterVarying.from("a")).success).toBe(true);
		expect(Character.safeFrom(Name.from("a")).success).toBe(true);
		expect(Character.safeFrom(Text.from("a")).success).toBe(true);
		expect(Character.safeFrom(Int2.from(1)).success).toBe(true);
		expect(Character.safeFrom(Int4.from(1)).success).toBe(true);
		expect(Character.safeFrom(Int8.from(1)).success).toBe(true);
		expect(Character.safeFrom(OID.from(1)).success).toBe(true);
		expect(Character.setN(36).safeFrom(UUID.generate()).success).toBe(true);
		expect(
			Character2.safeFrom({
				value: "abc",
			}).success
		).toBe(true);
		//#endregion

		//#region //* should return INVALID when parsing fails
		const boolean = Character.safeFrom(true as any);
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

		const tooBig = Character.safeFrom("abc");
		expect(tooBig.success).toEqual(false);
		if (tooBig.success) expect.fail();
		else {
			expect(tooBig.error.issue).toStrictEqual({
				code: "invalid_n_length",
				input: "abc",
				maximum: 1,
				message: "Invalid 'n' length: 3, 'n' must be less than or equal to 1",
				received: 3,
			});
		}

		//@ts-expect-error - testing invalid type
		const tooManyArguments = Character.safeFrom(1, 2);
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
		const tooFewArguments = Character.safeFrom();
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

		const unrecognizedKeys = Character.safeFrom({
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

		const missingKeys = Character.safeFrom({
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

		const invalidKeys = Character.safeFrom({
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

		const invalidCharLength = Character.safeFrom(Character.setN(2).from("a"));
		expect(invalidCharLength.success).toEqual(false);
		if (invalidCharLength.success) expect.fail();
		else {
			expect(invalidCharLength.error.issue).toStrictEqual({
				code: "invalid_n_length",
				input: "a ",
				maximum: 1,
				message: "Invalid 'n' length: 2, 'n' must be less than or equal to 1",
				received: 2,
			});
		}
		//#endregion
	});

	test("isCharacter(...)", () => {
		//* it should return true in isCharacter when value is a Character
		expect(Character.isCharacter(Character.from("a"))).toBe(true);

		//* it should return false in isCharacter when value is not a Character
		expect(Character.isCharacter(1)).toEqual(false);
		expect(Character.isCharacter("a")).toEqual(false);
		expect(Character.isCharacter({})).toEqual(false);
		expect(Character.isCharacter({ value: "a" })).toEqual(false);

		//* it should return true in isCharacter when value is a Character of specified length
		expect(Character.isCharacter(Character.from("a"), 1)).toBe(true);
		expect(Character.isCharacter(Character.setN(3).from("abc"), 3)).toBe(true);

		//* it should return false in isCharacter when value is not a Character of specified length
		expect(Character.isCharacter(Character.from("a"), 2)).toEqual(false);
		expect(Character.isCharacter(Character.setN(3).from("abc"), 2)).toEqual(false);
	});

	test("isAnyCharacter(...)", () => {
		//* it should return true in isAnyCharacter when value is a Character of any length
		expect(Character.isAnyCharacter(Character.from("a"))).toBe(true);
		expect(Character.isAnyCharacter(Character.setN(3).from("abc"))).toBe(true);

		//* it should return false in isAnyCharacter when value is not a Character
		expect(Character.isAnyCharacter(1)).toEqual(false);
		expect(Character.isAnyCharacter("1")).toEqual(false);
		expect(Character.isAnyCharacter({})).toEqual(false);
		expect(Character.isAnyCharacter({ character: "1" })).toEqual(false);
	});

	test("setN(...)", () => {
		//* it should return a new Character class with a new n
		const Character2 = Character.setN(2);
		expect(Character2.n).toEqual(2);

		//* It should error on invalid n values
		expect(() => Character.setN(1.5)).toThrowError("Number must be whole");
		expect(() => Character.setN(-1)).toThrowError("Number must be greater than or equal to 1");
		expect(() => Character.setN(10_485_761)).toThrowError("Number must be less than or equal to 10485760");
		expect(() => Character.setN(true as any)).toThrowError("Expected 'number' | 'infinity', received 'boolean'");
	});

	test("get n()", () => {
		//* it should return the n of the Character class
		expect(Character.n).toEqual(1);
	});
});

describe("Character", () => {
	test("_equals(...)", () => {
		//#region //* it should return OK when parsing succeeds
		const char = Character.from("a");
		expect(char.equals(Character.from("a"))).toBe(true);
		expect(char.equals(Character.from("b"))).toEqual(false);
		expect(char.equals("a")).toBe(true);
		expect(char.equals("b")).toEqual(false);
		expect(char.equals({ value: "a" })).toBe(true);
		expect(char.equals({ value: "b" })).toEqual(false);

		const safeEquals1 = char.safeEquals(Character.from("a"));
		expect(safeEquals1.success).toBe(true);
		if (safeEquals1.success) expect(safeEquals1.equals).toBe(true);
		else expect.fail();

		const safeEquals2 = char.safeEquals(Character.from("b"));
		expect(safeEquals2.success).toBe(true);
		if (safeEquals2.success) expect(safeEquals2.equals).toEqual(false);
		else expect.fail();

		const safeEquals3 = char.safeEquals("a");
		expect(safeEquals3.success).toBe(true);
		if (safeEquals3.success) expect(safeEquals3.equals).toBe(true);
		else expect.fail();

		const safeEquals4 = char.safeEquals("b");
		expect(safeEquals4.success).toBe(true);
		if (safeEquals4.success) expect(safeEquals4.equals).toEqual(false);
		else expect.fail();

		const safeEquals5 = char.safeEquals({ value: "a" });
		expect(safeEquals5.success).toBe(true);
		if (safeEquals5.success) expect(safeEquals5.equals).toBe(true);
		else expect.fail();

		const safeEquals6 = char.safeEquals({ value: "b" });
		expect(safeEquals6.success).toBe(true);
		if (safeEquals6.success) expect(safeEquals6.equals).toEqual(false);
		else expect.fail();
		//#endregion

		//#region //* should return INVALID when parsing fails
		const boolean = char.safeEquals(true as any);
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

		expect(() => char.equals(true as any)).toThrowError();
		//#endregion
	});

	test("toString()", () => {
		const char = Character.from("a");
		expect(char.toString()).toEqual("a");
	});

	test("toJSON()", () => {
		const char = Character.from("a");
		expect(char.toJSON()).toStrictEqual({ value: "a" });
	});

	test("get character()", () => {
		expect(Character.setN(3).from("abc").character).toEqual("abc");
		expect(Character.setN(3).from("abc").character).toEqual("abc");
		expect(Character.setN(3).from({ value: "abc" }).character).toEqual("abc");
	});

	test("set character(...)", () => {
		const char = Character.from("a");
		char.character = "b" as any;
		expect(char.character).toEqual("b");

		expect(() => (char.character = "abc" as any)).toThrowError("Invalid 'n' length: 3, 'n' must be less than or equal to 1");
	});

	test("get value()", () => {
		expect(Character.setN(3).from("abc").value).toEqual("abc");
		expect(Character.setN(3).from("abc").value).toEqual("abc");
		expect(Character.setN(3).from({ value: "abc" }).value).toEqual("abc");
	});

	test("set value(...)", () => {
		const char = Character.from("a");
		char.value = "b" as any;
		expect(char.value).toEqual("b");

		expect(() => (char.value = "abc" as any)).toThrowError("Invalid 'n' length: 3, 'n' must be less than or equal to 1");
	});

	test("get postgres()", () => {
		expect(Character.setN(3).from("abc").postgres).toEqual("abc");
		expect(Character.setN(3).from("abc").postgres).toEqual("abc");
		expect(Character.setN(3).from({ value: "abc" }).postgres).toEqual("abc");
	});

	test("set postgres(...)", () => {
		const char = Character.from("a");
		char.postgres = "b" as any;
		expect(char.postgres).toEqual("b");

		expect(() => (char.postgres = "abc" as any)).toThrowError("Invalid 'n' length: 3, 'n' must be less than or equal to 1");
	});
});

describe("PostgreSQL", () => {
	it("should work with PostgreSQL's own tests", () => {
		//* https://github.com/postgres/postgres/blob/master/src/test/regress/sql/char.sql
		const C = Character.setN(11);

		expect(() => C.from("10")).not.toThrowError(); // too short but will be padded
		expect(() => C.from("00000000000")).not.toThrowError();
		expect(() => C.from("11011000000")).not.toThrowError();
		expect(() => C.from("01010101010")).not.toThrowError();
		expect(() => C.from("101011111010")).toThrowError(); // too long
	});

	it("should be returned as a Character", async () => {
		const client = new Client({
			application_name: "char.test.ts",
			database: "postgres",
			host: "localhost",
			password: "password",
			port: 5432,
			user: "postgres",
		});

		await client.connect();

		//* PG has a native parser for the '_bpchar' type
		types.setTypeParser(1014 as any, value => value);

		let error = null;
		try {
			await client.query(`
				CREATE TABLE IF NOT EXISTS public.vitestchar (
					char "char" NULL,
					_char _char NULL,
					bpchar bpchar NULL,
					_bpchar _bpchar NULL
				)
			`);

			const [singleInputChar, arrayInputChar, singleInputBpchar, arrayInputBpchar] = [
				serializer<Character<number>>(Character)(Character.from("a")),
				arraySerializer<Character<number>>(Character, ",")([Character.from("a"), Character.from("b")]),
				serializer<Character<number>>(Character)(Character.from("c")),
				arraySerializer<Character<number>>(Character, ",")([Character.from("c"), Character.from("d")]),
			];

			expect(singleInputChar).toEqual("a");
			expect(arrayInputChar).toEqual("{a,b}");
			expect(singleInputBpchar).toEqual("c");
			expect(arrayInputBpchar).toEqual("{c,d}");

			await client.query(
				`
				INSERT INTO public.vitestchar (char, _char, bpchar, _bpchar)
				VALUES (
					$1::"char",
					$2::_char,
					$3::bpchar,
					$4::_bpchar
				)
			`,
				[singleInputChar, arrayInputChar, singleInputBpchar, arrayInputBpchar]
			);

			const result = await client.query(`
				SELECT * FROM public.vitestchar
			`);

			result.rows[0].char = parser<Character<number>>(Character)(result.rows[0].char);
			result.rows[0]._char = arrayParser<Character<number>>(Character)(result.rows[0]._char);
			result.rows[0].bpchar = parser<Character<number>>(Character)(result.rows[0].bpchar);
			result.rows[0]._bpchar = arrayParser<Character<number>>(Character)(result.rows[0]._bpchar);

			expect(Character.isAnyCharacter(result.rows[0].char)).toBe(true);
			expect(Character.from("a").equals(result.rows[0].char.value)).toBe(true);

			expect(Character.isAnyCharacter(result.rows[0].bpchar)).toBe(true);
			expect(Character.from("c").equals(result.rows[0].bpchar.value)).toBe(true);

			const [a, b] = result.rows[0]._char;
			expect(result.rows[0]._char).toHaveLength(2);
			expect(Character.isAnyCharacter(a)).toBe(true);
			expect(Character.from("a").equals(a.value)).toBe(true);
			expect(Character.isAnyCharacter(b)).toBe(true);
			expect(Character.from("b").equals(b.value)).toBe(true);

			const [c, d] = result.rows[0]._bpchar;
			expect(result.rows[0]._bpchar).toHaveLength(2);
			expect(Character.isAnyCharacter(c)).toBe(true);
			expect(Character.from("c").equals(c.value)).toBe(true);
			expect(Character.isAnyCharacter(d)).toBe(true);
			expect(Character.from("d").equals(d.value)).toBe(true);
		} catch (error_) {
			error = error_;
			// eslint-disable-next-line no-console
			console.error(error);
		}

		await client.query(`
				DROP TABLE public.vitestchar
			`);

		await client.end();

		if (error) throw error;
	});
});
