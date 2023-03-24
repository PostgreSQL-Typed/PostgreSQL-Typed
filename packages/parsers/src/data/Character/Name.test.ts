/* eslint-disable unicorn/filename-case */
import { Client } from "pg";
import { describe, expect, it, test } from "vitest";

import { Name } from "./Name.js";

describe("NameConstructor", () => {
	test("_parse(...)", () => {
		//#region //* it should return OK when parsing succeeds
		expect(Name.safeFrom("abc").success).toBe(true);
		expect(Name.safeFrom(Name.from("abc")).success).toBe(true);
		expect(
			Name.safeFrom({
				name: "abc",
			}).success
		).toBe(true);
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
			});
		}

		const unrecognizedKeys = Name.safeFrom({
			name: "abc",
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
			// name: "abc",
		} as any);
		expect(missingKeys.success).toEqual(false);
		if (missingKeys.success) expect.fail();
		else {
			expect(missingKeys.error.issue).toStrictEqual({
				code: "missing_keys",
				keys: ["name"],
				message: "Missing key in object: 'name'",
			});
		}

		const invalidKeys = Name.safeFrom({
			name: 0,
		} as any);
		expect(invalidKeys.success).toEqual(false);
		if (invalidKeys.success) expect.fail();
		else {
			expect(invalidKeys.error.issue).toStrictEqual({
				code: "invalid_key_type",
				objectKey: "name",
				expected: "string",
				received: "number",
				message: "Expected 'string' for key 'name', received 'number'",
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
			});
		}
		//#endregion
	});

	test("isName(...)", () => {
		const name = Name.from("abc");
		expect(Name.isName(name)).toBe(true);
		expect(Name.isName({ name: "abc" })).toBe(false);
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
			name: "abc",
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

			await client.query(`
				INSERT INTO public.vitestname (name, _name)
				VALUES (
					'abc',
					'{abc, def}'
				)
			`);

			const result = await client.query(`
				SELECT * FROM public.vitestname
			`);

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