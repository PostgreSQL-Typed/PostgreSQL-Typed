/* eslint-disable unicorn/filename-case */
import { Client, types } from "pg";
import { describe, expect, it, test } from "vitest";

import { arrayParser } from "../../util/arrayParser.js";
import { arraySerializer } from "../../util/arraySerializer.js";
import { parser } from "../../util/parser.js";
import { serializer } from "../../util/serializer.js";
import { UUID } from "../UUID/UUID.js";
import { Character } from "./Character.js";
import { CharacterVarying } from "./CharacterVarying.js";
import { Name } from "./Name.js";
import { Text } from "./Text.js";

describe("TextConstructor", () => {
	test("_parse(...)", () => {
		//#region //* it should return OK when parsing succeeds
		expect(Text.safeFrom("abc").success).toBe(true);
		expect(Text.safeFrom(Text.from("abc")).success).toBe(true);
		expect(
			Text.safeFrom({
				value: "abc",
			}).success
		).toBe(true);
		expect(Text.safeFrom(Character.from("a")).success).toBe(true);
		expect(Text.safeFrom(CharacterVarying.from("a")).success).toBe(true);
		expect(Text.safeFrom(Name.from("a")).success).toBe(true);
		expect(Text.safeFrom(UUID.generate()).success).toBe(true);
		//#endregion

		//#region //* should return INVALID when parsing fails
		const boolean = Text.safeFrom(true as any);
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
		const tooManyArguments = Text.safeFrom(1, 2);
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
		const tooFewArguments = Text.safeFrom();
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

		const unrecognizedKeys = Text.safeFrom({
			unrecognized: true,
			value: "abc",
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

		const missingKeys = Text.safeFrom({
			// value: "abc",
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

		const invalidKeys = Text.safeFrom({
			value: 0,
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
		//#endregion
	});

	test("isText(...)", () => {
		const text = Text.from("abc");
		expect(Text.isText(text)).toBe(true);
		expect(Text.isText({ value: "abc" })).toBe(false);
	});
});

describe("Text", () => {
	test("_equals(...)", () => {
		const text = Text.from("abc");

		expect(text.equals(Text.from("abc"))).toBe(true);
		expect(text.equals(Text.from("def"))).toBe(false);
		expect(text.equals(Text.from("abc").toJSON())).toBe(true);
		expect(text.equals(Text.from("def").toJSON())).toBe(false);
		expect(text.equals(Text.from("abc").toString())).toBe(true);
		expect(text.equals(Text.from("def").toString())).toBe(false);

		expect(text.safeEquals(1 as any).success).toBe(false);
	});

	test("toString()", () => {
		const text = Text.from("abc");
		expect(text.toString()).toBe("abc");
	});

	test("toJSON()", () => {
		const text = Text.from("abc");
		expect(text.toJSON()).toEqual({
			value: "abc",
		});
	});

	test("get text()", () => {
		const text = Text.from("abc");
		expect(text.text).toBe("abc");
	});

	test("set text(...)", () => {
		const text = Text.from("abc");
		text.text = "def";
		expect(text.text).toBe("def");
		expect(() => {
			text.text = true as any;
		}).toThrowError("Expected 'string' | 'object', received 'boolean'");
	});

	test("get value()", () => {
		const text = Text.from("abc");
		expect(text.value).toBe("abc");
	});

	test("set value(...)", () => {
		const text = Text.from("abc");
		text.value = "def";
		expect(text.value).toBe("def");
		expect(() => {
			text.value = true as any;
		}).toThrowError("Expected 'string' | 'object', received 'boolean'");
	});

	test("get postgres()", () => {
		const text = Text.from("abc");
		expect(text.postgres).toBe("abc");
	});

	test("set postgres(...)", () => {
		const text = Text.from("abc");
		text.postgres = "def";
		expect(text.postgres).toBe("def");
		expect(() => {
			text.postgres = true as any;
		}).toThrowError("Expected 'string' | 'object', received 'boolean'");
	});
});

describe("PostgreSQL", () => {
	it("should work with PostgreSQL's own tests", () => {
		//* https://github.com/postgres/postgres/blob/master/src/test/regress/sql/text.sql
		expect(() => Text.from("this is a text string")).not.toThrowError();
	});

	it("should be returned from PostgreSQL", async () => {
		const client = new Client({
			application_name: "text.test.ts",
			database: "postgres",
			host: "localhost",
			password: "password",
			port: 5432,
			user: "postgres",
		});

		await client.connect();

		//* PG has a native parser for the '_text' type
		types.setTypeParser(1009 as any, value => value);

		let error = null;
		try {
			await client.query(`
				CREATE TABLE public.vitesttext (
					text text NULL,
					_text _text NULL
				)
			`);

			const [singleInput, arrayInput] = [serializer<Text>(Text)(Text.from("abc")), arraySerializer<Text>(Text, ",")([Text.from("abc"), Text.from("def")])];

			expect(singleInput).toBe("abc");
			expect(arrayInput).toBe("{abc,def}");

			await client.query(
				`
				INSERT INTO public.vitesttext (text, _text)
				VALUES (
					$1::text,
					$2::_text
				)
			`,
				[singleInput, arrayInput]
			);

			const result = await client.query(`
				SELECT * FROM public.vitesttext
			`);

			result.rows[0].text = parser<Text>(Text)(result.rows[0].text);
			result.rows[0]._text = arrayParser<Text>(Text)(result.rows[0]._text);

			expect(result.rows[0].text.toString()).toStrictEqual(Text.from("abc").toString());
			expect(result.rows[0]._text).toHaveLength(2);
			expect(result.rows[0]._text[0].toString()).toStrictEqual(Text.from("abc").toString());
			expect(result.rows[0]._text[1].toString()).toStrictEqual(Text.from("def").toString());
		} catch (error_) {
			error = error_;
			// eslint-disable-next-line no-console
			console.error(error);
		}

		await client.query(`
			DROP TABLE public.vitesttext
		`);

		await client.end();

		if (error) throw error;
	});
});
