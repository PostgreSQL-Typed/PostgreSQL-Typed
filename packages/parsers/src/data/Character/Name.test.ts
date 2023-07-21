/* eslint-disable unicorn/filename-case */
import { Client } from "pg";
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

describe("NameConstructor", () => {
	test("_parse(...)", () => {
		//#region //* it should return OK when parsing succeeds
		expect(Name.safeFrom("abc").success).toBe(true);
		expect(Name.safeFrom(Name.from("abc")).success).toBe(true);
		expect(
			Name.safeFrom({
				value: "abc",
			}).success
		).toBe(true);
		expect(Name.safeFrom(Character.from("a")).success).toBe(true);
		expect(Name.safeFrom(CharacterVarying.from("a")).success).toBe(true);
		expect(Name.safeFrom(Text.from("a")).success).toBe(true);
		expect(Name.safeFrom(UUID.generate()).success).toBe(true);
		//#endregion

		//#region //* should return INVALID when parsing fails
		const boolean = Name.safeFrom(true as any);
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
		const tooManyArguments = Name.safeFrom(1, 2);
		expect(tooManyArguments.success).toEqual(false);
		if (tooManyArguments.success) expect.fail();
		else {
			expect(tooManyArguments.error.issue).toStrictEqual({
				code: "too_big",
				type: "arguments",
				maximum: 1,
				exact: true,
				message: "Function must have exactly 1 argument(s)",
				received: 2,
			});
		}

		//@ts-expect-error - testing invalid type
		const tooFewArguments = Name.safeFrom();
		expect(tooFewArguments.success).toEqual(false);
		if (tooFewArguments.success) expect.fail();
		else {
			expect(tooFewArguments.error.issue).toStrictEqual({
				code: "too_small",
				type: "arguments",
				minimum: 1,
				exact: true,
				message: "Function must have exactly 1 argument(s)",
				received: 0,
			});
		}

		const unrecognizedKeys = Name.safeFrom({
			value: "abc",
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

		const missingKeys = Name.safeFrom({
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

		const invalidKeys = Name.safeFrom({
			value: 0,
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

		const moreThan64Bytes = Name.safeFrom("a".repeat(65));
		expect(moreThan64Bytes.success).toEqual(false);
		if (moreThan64Bytes.success) expect.fail();
		else {
			expect(moreThan64Bytes.error.issue).toStrictEqual({
				code: "too_big",
				type: "bytes",
				maximum: 64,
				inclusive: true,
				message: "String must be at most 64 byte(s) long",
				received: 65,
				input: "a".repeat(65),
			});
		}
		//#endregion
	});

	test("isName(...)", () => {
		const name = Name.from("abc");
		expect(Name.isName(name)).toBe(true);
		expect(Name.isName({ value: "abc" })).toBe(false);
	});
});

describe("Name", () => {
	test("_equals(...)", () => {
		const name = Name.from("abc");

		expect(name.equals(Name.from("abc"))).toBe(true);
		expect(name.equals(Name.from("def"))).toBe(false);
		expect(name.equals(Name.from("abc").toJSON())).toBe(true);
		expect(name.equals(Name.from("def").toJSON())).toBe(false);
		expect(name.equals(Name.from("abc").toString())).toBe(true);
		expect(name.equals(Name.from("def").toString())).toBe(false);

		expect(name.safeEquals(1 as any).success).toBe(false);
	});

	test("toString()", () => {
		const name = Name.from("abc");
		expect(name.toString()).toBe("abc");
	});

	test("toJSON()", () => {
		const name = Name.from("abc");
		expect(name.toJSON()).toEqual({
			value: "abc",
		});
	});

	test("get name()", () => {
		const name = Name.from("abc");
		expect(name.name).toBe("abc");
	});

	test("set name(...)", () => {
		const name = Name.from("abc");
		name.name = "def";
		expect(name.name).toBe("def");
		expect(() => {
			name.name = true as any;
		}).toThrowError("Expected 'string' | 'object', received 'boolean'");
	});

	test("get value()", () => {
		const name = Name.from("abc");
		expect(name.value).toBe("abc");
	});

	test("set value(...)", () => {
		const name = Name.from("abc");
		name.value = "def";
		expect(name.value).toBe("def");
		expect(() => {
			name.value = true as any;
		}).toThrowError("Expected 'string' | 'object', received 'boolean'");
	});

	test("get postgres()", () => {
		const name = Name.from("abc");
		expect(name.postgres).toBe("abc");
	});

	test("set postgres(...)", () => {
		const name = Name.from("abc");
		name.postgres = "def";
		expect(name.postgres).toBe("def");
		expect(() => {
			name.postgres = true as any;
		}).toThrowError("Expected 'string' | 'object', received 'boolean'");
	});
});

describe("PostgreSQL", () => {
	it("should work with PostgreSQL's own tests", () => {
		//* https://github.com/postgres/postgres/blob/master/src/test/regress/sql/name.sql
		expect(() => Name.from("this is a name string")).not.toThrowError();

		expect(() => Name.from("1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ABCDEFGHIJKLMNOPQR")).not.toThrowError();
		expect(() => Name.from("1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnopqr")).not.toThrowError();
		expect(() => Name.from("asdfghjkl;")).not.toThrowError();
		expect(() => Name.from("343f%2a")).not.toThrowError();
		expect(() => Name.from("d34aaasdf")).not.toThrowError();
		expect(() => Name.from("")).not.toThrowError();
		expect(() => Name.from("1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ")).toThrowError();
	});

	it("should be returned from PostgreSQL", async () => {
		const client = new Client({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			application_name: "name.test.ts",
		});

		await client.connect();

		let error = null;
		try {
			await client.query(`
				CREATE TABLE public.vitestname (
					name name NULL,
					_name _name NULL
				)
			`);

			const [singleInput, arrayInput] = [serializer<Name>(Name)(Name.from("abc")), arraySerializer<Name>(Name, ",")([Name.from("abc"), Name.from("def")])];

			expect(singleInput).toBe("abc");
			expect(arrayInput).toBe("{abc,def}");

			await client.query(
				`
				INSERT INTO public.vitestname (name, _name)
				VALUES (
					$1::name,
					$2::_name
				)
			`,
				[singleInput, arrayInput]
			);

			const result = await client.query(`
				SELECT * FROM public.vitestname
			`);

			result.rows[0].name = parser<Name>(Name)(result.rows[0].name);
			result.rows[0]._name = arrayParser<Name>(Name, ",")(result.rows[0]._name);

			expect(result.rows[0].name.toString()).toStrictEqual(Name.from("abc").toString());
			expect(result.rows[0]._name).toHaveLength(2);
			expect(result.rows[0]._name[0].toString()).toStrictEqual(Name.from("abc").toString());
			expect(result.rows[0]._name[1].toString()).toStrictEqual(Name.from("def").toString());
		} catch (error_) {
			error = error_;
			// eslint-disable-next-line no-console
			console.error(error);
		}

		await client.query(`
			DROP TABLE public.vitestname
		`);

		await client.end();

		if (error) throw error;
	});
});
