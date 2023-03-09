/* eslint-disable unicorn/filename-case */
import { Client } from "pg";
import { describe, expect, it, test } from "vitest";

import { Text } from "./Text.js";

describe("TextConstructor", () => {
	test("_parse(...)", () => {
		//#region //* it should return OK when parsing succeeds
		expect(Text.safeFrom("abc").success).toBe(true);
		expect(Text.safeFrom(Text.from("abc")).success).toBe(true);
		expect(
			Text.safeFrom({
				text: "abc",
			}).success
		).toBe(true);
		//#endregion

		//#region //* should return INVALID when parsing fails
		const boolean = Text.safeFrom(true as any);
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
		const tooManyArguments = Text.safeFrom(1, 2);
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
		const tooFewArguments = Text.safeFrom();
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

		const unrecognizedKeys = Text.safeFrom({
			text: "abc",
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

		const missingKeys = Text.safeFrom({
			// text: "abc",
		} as any);
		expect(missingKeys.success).toEqual(false);
		if (missingKeys.success) expect.fail();
		else {
			expect(missingKeys.error.issue).toStrictEqual({
				code: "missing_keys",
				keys: ["text"],
				message: "Missing key in object: 'text'",
			});
		}

		const invalidKeys = Text.safeFrom({
			text: 0,
		} as any);
		expect(invalidKeys.success).toEqual(false);
		if (invalidKeys.success) expect.fail();
		else {
			expect(invalidKeys.error.issue).toStrictEqual({
				code: "invalid_key_type",
				objectKey: "text",
				expected: "string",
				received: "number",
				message: "Expected 'string' for key 'text', received 'number'",
			});
		}
		//#endregion
	});

	test("isText(...)", () => {
		const text = Text.from("abc");
		expect(Text.isText(text)).toBe(true);
		expect(Text.isText({ text: "abc" })).toBe(false);
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
			text: "abc",
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
});

describe("PostgreSQL", () => {
	it("should work with PostgreSQL's own tests", () => {
		//* https://github.com/postgres/postgres/blob/master/src/test/regress/sql/text.sql
		expect(() => Text.from("this is a text string")).not.toThrowError();
	});

	it("should be returned from PostgreSQL", async () => {
		const client = new Client({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			application_name: "text.test.ts",
		});

		await client.connect();

		let error = null;
		try {
			await client.query(`
				CREATE TABLE public.vitesttext (
					text text NULL,
					_text _text NULL
				)
			`);

			await client.query(`
				INSERT INTO public.vitesttext (text, _text)
				VALUES (
					'abc',
					'{abc, def}'
				)
			`);

			const result = await client.query(`
				SELECT * FROM public.vitesttext
			`);

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
