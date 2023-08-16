/* eslint-disable unicorn/filename-case */
import { Client, types } from "pg";
import { describe, expect, it, test } from "vitest";

import { arrayParser } from "../../util/arrayParser.js";
import { arraySerializer } from "../../util/arraySerializer.js";
import { parser } from "../../util/parser.js";
import { serializer } from "../../util/serializer.js";
import { JSON } from "./JSON.js";

describe("JSONConstructor", () => {
	test("_parse(...)", () => {
		//#region //* it should return OK when parsing succeeds
		expect(JSON.safeFrom(1).success).toBe(true);
		expect(JSON.safeFrom("1").success).toBe(true);
		expect(JSON.safeFrom(null).success).toBe(true);
		expect(JSON.safeFrom(true).success).toBe(true);
		expect(JSON.safeFrom(false).success).toBe(true);
		expect(JSON.safeFrom({}).success).toBe(true);
		expect(JSON.safeFrom([]).success).toBe(true);
		expect(JSON.safeFrom({ value: "1" }).success).toBe(true);
		expect(JSON.safeFrom({ foo: "bar" }).success).toBe(true);
		expect(JSON.safeFrom([{ value: 1 }]).success).toBe(true);
		expect(JSON.safeFrom(JSON.from(1)).success).toBe(true);
		expect(JSON.safeFrom(JSON.from("1")).success).toBe(true);
		expect(JSON.safeFrom(JSON.from(null)).success).toBe(true);
		expect(JSON.safeFrom(JSON.from(true)).success).toBe(true);
		expect(JSON.safeFrom(JSON.from(false)).success).toBe(true);
		expect(JSON.safeFrom(JSON.from({})).success).toBe(true);
		expect(JSON.safeFrom(JSON.from([])).success).toBe(true);
		expect(JSON.safeFrom(JSON.from({ value: "1" })).success).toBe(true);
		expect(JSON.safeFrom(JSON.from({ foo: "bar" })).success).toBe(true);
		expect(JSON.safeFrom(JSON.from([{ value: 1 }])).success).toBe(true);
		//#endregion

		//#region //* should return INVALID when parsing fails
		const boolean = JSON.safeFrom('{ "value: true }');
		expect(boolean.success).toEqual(false);
		if (boolean.success) expect.fail();
		else {
			expect(boolean.error.issue).toStrictEqual({
				code: "invalid_json",
				message: "Invalid JSON",
				received: '{ "value: true }',
			});
		}
		//#endregion
	});

	test("isJSON(...)", () => {
		//* it should return true in isJSON when value is a JSON
		expect(JSON.isJSON(JSON.from(1))).toBe(true);

		//* it should return false in isJSON when value is not a JSON
		expect(JSON.isJSON(1)).toEqual(false);
		expect(JSON.isJSON("1")).toEqual(false);
		expect(JSON.isJSON({})).toEqual(false);
		expect(JSON.isJSON({ json: 1 })).toEqual(false);
	});
});

describe("JSON", () => {
	test("_equals(...)", () => {
		//#region //* it should return OK when parsing succeeds
		const json = JSON.from(1);
		expect(json.equals(JSON.from(1))).toBe(true);
		expect(json.equals(JSON.from(2))).toEqual(false);
		expect(json.equals(1)).toBe(true);
		expect(json.equals(2)).toEqual(false);
		expect(json.equals("1")).toBe(true);
		expect(json.equals("2")).toEqual(false);
		expect(json.equals({ value: "1" })).toBe(true);
		expect(json.equals({ value: "2" })).toEqual(false);

		const safeEquals1 = json.safeEquals(JSON.from(1));
		expect(safeEquals1.success).toBe(true);
		if (safeEquals1.success) expect(safeEquals1.equals).toBe(true);
		else expect.fail();

		const safeEquals2 = json.safeEquals(JSON.from(2));
		expect(safeEquals2.success).toBe(true);
		if (safeEquals2.success) expect(safeEquals2.equals).toEqual(false);
		else expect.fail();

		const safeEquals3 = json.safeEquals(1);
		expect(safeEquals3.success).toBe(true);
		if (safeEquals3.success) expect(safeEquals3.equals).toBe(true);
		else expect.fail();

		const safeEquals4 = json.safeEquals(2);
		expect(safeEquals4.success).toBe(true);
		if (safeEquals4.success) expect(safeEquals4.equals).toEqual(false);
		else expect.fail();

		const safeEquals5 = json.safeEquals("1");
		expect(safeEquals5.success).toBe(true);
		if (safeEquals5.success) expect(safeEquals5.equals).toBe(true);
		else expect.fail();

		const safeEquals6 = json.safeEquals("2");
		expect(safeEquals6.success).toBe(true);
		if (safeEquals6.success) expect(safeEquals6.equals).toEqual(false);
		else expect.fail();

		const safeEquals7 = json.safeEquals({ value: "1" });
		expect(safeEquals7.success).toBe(true);
		if (safeEquals7.success) expect(safeEquals7.equals).toBe(true);
		else expect.fail();

		const safeEquals8 = json.safeEquals({ value: "2" });
		expect(safeEquals8.success).toBe(true);
		if (safeEquals8.success) expect(safeEquals8.equals).toEqual(false);
		else expect.fail();
		//#endregion

		//#region //* should return INVALID when parsing fails
		const invalidObjectString = json.safeEquals('{ "value: true }');
		expect(invalidObjectString.success).toEqual(false);
		if (invalidObjectString.success) expect.fail();
		else {
			expect(invalidObjectString.error.issue).toStrictEqual({
				code: "invalid_json",
				message: "Invalid JSON",
				received: '{ "value: true }',
			});
		}

		const nanNumber = JSON.safeFrom(Number.NaN);
		expect(nanNumber.success).toEqual(false);
		if (nanNumber.success) expect.fail();
		else {
			expect(nanNumber.error.issue).toStrictEqual({
				code: "invalid_type",
				expected: ["number", "string", "object", "null", "array", "boolean"],
				message: "Expected 'number' | 'string' | 'object' | 'null' | 'array' | 'boolean', received 'nan'",
				received: "nan",
			});
		}

		//@ts-expect-error - testing invalid type
		const tooManyArguments = JSON.safeFrom(1, 2);
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
		const tooFewArguments = JSON.safeFrom();
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

		expect(() => json.equals('{ "value: true }')).toThrowError();
		//#endregion
	});

	test("toString()", () => {
		const json = JSON.from(1);
		expect(json.toString()).toEqual("1");
		const json2 = JSON.from(true);
		expect(json2.toString()).toEqual("true");
		const json3 = JSON.from('"foo"');
		expect(json3.toString()).toEqual('"foo"');
		const json4 = JSON.from({ value: '"foo"' });
		expect(json4.toString()).toEqual('"foo"');
		const json5 = JSON.from({ foo: "bar" });
		expect(json5.toString()).toEqual('{"foo":"bar"}');
	});

	test("toJSON()", () => {
		const json = JSON.from(1);
		expect(json.toJSON()).toStrictEqual({ value: "1" });
	});

	test("get json()", () => {
		expect(JSON.from(1).json).toEqual(1);
		expect(JSON.from(true).json).toEqual(true);
		expect(JSON.from('"foo"').json).toEqual("foo");
		expect(JSON.from({ value: '"foo"' }).json).toEqual("foo");
		expect(JSON.from({ foo: "bar" }).json).toEqual({ foo: "bar" });
	});

	test("set json(...)", () => {
		const json = JSON.from(1);
		json.json = 2 as any;
		expect(json.json).toEqual(2);

		expect(() => (json.json = '{ "value: 1 }' as any)).toThrowError("Invalid JSON");
	});

	test("get value()", () => {
		expect(JSON.from(1).value).toEqual("1");
		expect(JSON.from(true).value).toEqual("true");
		expect(JSON.from('"foo"').value).toEqual('"foo"');
		expect(JSON.from({ value: '"foo"' }).value).toEqual('"foo"');
		expect(JSON.from({ foo: "bar" }).value).toEqual('{"foo":"bar"}');
	});

	test("set value(...)", () => {
		const json = JSON.from("1");
		json.value = "2";
		expect(json.value).toEqual("2");

		expect(() => (json.value = '{ "value: 1')).toThrowError("Invalid JSON");
	});

	test("get postgres()", () => {
		expect(JSON.from(1).postgres).toEqual("1");
		expect(JSON.from(true).postgres).toEqual("true");
		expect(JSON.from('"foo"').postgres).toEqual('"foo"');
		expect(JSON.from({ value: '"foo"' }).postgres).toEqual('"foo"');
		expect(JSON.from({ foo: "bar" }).postgres).toEqual('{"foo":"bar"}');
	});

	test("set postgres(...)", () => {
		const json = JSON.from("1");
		json.postgres = "2";
		expect(json.postgres).toEqual("2");

		expect(() => (json.postgres = '{ "value: 1')).toThrowError("Invalid JSON");
	});
});

describe("PostgreSQL", () => {
	it("should work with PostgreSQL's own tests", () => {
		//* https://github.com/postgres/postgres/blob/master/src/test/regress/sql/json.sql
		// input checks
		expect(() => JSON.from('""')).not.toThrowError();
		expect(() => JSON.from('"abc"')).not.toThrowError();
		expect(() => JSON.from(1)).not.toThrowError();
		expect(() => JSON.from("1")).not.toThrowError();
		expect(() => JSON.from(0.1)).not.toThrowError();
		expect(() => JSON.from("0.1")).not.toThrowError();
		expect(() => JSON.from("[]")).not.toThrowError();
		expect(() =>
			JSON.from(
				"[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]"
			)
		).not.toThrowError();
		expect(() => JSON.from("[1,2]")).not.toThrowError();
		expect(() => JSON.from("{}")).not.toThrowError();
		expect(() => JSON.from('{"abc":1}')).not.toThrowError();
		expect(() => JSON.from('{"abc":1,"def":2,"ghi":[3,4],"hij":{"klm":5,"nop":[6]}}')).not.toThrowError();
		expect(() => JSON.from("true")).not.toThrowError();
		expect(() => JSON.from("false")).not.toThrowError();
		expect(() => JSON.from("null")).not.toThrowError();
		expect(() => JSON.from(" true ")).not.toThrowError();
		expect(() =>
			JSON.from(`{
		"one": 1,
		"two":"two",
		"three":
		true}`)
		).not.toThrowError();

		expect(() => JSON.from('"abc')).toThrowError();
		expect(() => JSON.from("[1,2,]")).toThrowError();
		expect(() => JSON.from("[1,2")).toThrowError();
		expect(() => JSON.from("[1,[2]")).toThrowError();
		expect(() => JSON.from('{"abc"}')).toThrowError();
		expect(() => JSON.from('{1:"abc"}')).toThrowError();
		expect(() => JSON.from('{"abc",1}')).toThrowError();
		expect(() => JSON.from('{"abc"=1}')).toThrowError();
		expect(() => JSON.from('{"abc"::1}')).toThrowError();
		expect(() => JSON.from('{"abc":1:2}')).toThrowError();
		expect(() => JSON.from('{"abc":1,3}')).toThrowError();
		expect(() => JSON.from("true false")).toThrowError();
		expect(() => JSON.from("true, false")).toThrowError();
		expect(() => JSON.from("truf")).toThrowError();
		expect(() => JSON.from("trues")).toThrowError();
		expect(() => JSON.from("")).toThrowError();
		expect(() => JSON.from("    ")).toThrowError();
		expect(() =>
			JSON.from(`{
		"one": 1,
		"two":,"two",  -- ERROR extraneous comma before field "two"
		"three":
		true}`)
		).toThrowError();
		expect(() =>
			JSON.from(`{
		"one": 1,
		"two":"two",
		"averyveryveryveryveryveryveryveryveryverylongfieldname":}`)
		).toThrowError();
	});

	it("should be returned as a JSON", async () => {
		const client = new Client({
			application_name: "json.test.ts",
			database: "postgres",
			host: "localhost",
			password: "password",
			port: 5432,
			user: "postgres",
		});

		await client.connect();

		//* PG has a native parser for the 'json', '_json', 'jsonb' and '_jsonb' types
		types.setTypeParser(114 as any, value => value);
		types.setTypeParser(199 as any, value => value);
		types.setTypeParser(3802 as any, value => value);
		types.setTypeParser(3807 as any, value => value);

		//* PG has a native parser for the '_json' type
		types.setTypeParser(791 as any, value => value);

		let error = null;
		try {
			await client.query(`
				CREATE TABLE IF NOT EXISTS public.vitestjson (
					json json NULL,
          _json _json NULL,
          jsonb jsonb NULL,
          _jsonb _jsonb NULL
				)
			`);

			const [singleInput, arrayInput] = [serializer<JSON>(JSON)(JSON.from(1)), arraySerializer<JSON>(JSON, ",")([JSON.from(2), JSON.from(3)])];

			expect(singleInput).toEqual("1");
			expect(arrayInput).toEqual("{2,3}");

			await client.query(
				`
				INSERT INTO public.vitestjson (json, _json, jsonb, _jsonb)
				VALUES (
					$1::json,
					$2::_json,
          $3::jsonb,
          $4::_jsonb
				)
			`,
				[singleInput, arrayInput, singleInput, arrayInput]
			);

			const result = await client.query(`
				SELECT * FROM public.vitestjson
			`);

			result.rows[0].json = parser<JSON>(JSON)(result.rows[0].json);
			result.rows[0]._json = arrayParser<JSON>(JSON)(result.rows[0]._json);
			result.rows[0].jsonb = parser<JSON>(JSON)(result.rows[0].jsonb);
			result.rows[0]._jsonb = arrayParser<JSON>(JSON)(result.rows[0]._jsonb);

			expect(JSON.isJSON(result.rows[0].json)).toBe(true);
			expect(JSON.from(1).equals(result.rows[0].json)).toBe(true);
			expect(JSON.isJSON(result.rows[0].jsonb)).toBe(true);
			expect(JSON.from(1).equals(result.rows[0].jsonb)).toBe(true);

			const [a, b] = result.rows[0]._json;
			expect(result.rows[0]._json).toHaveLength(2);
			expect(JSON.isJSON(a)).toBe(true);
			expect(JSON.from(2).equals(a)).toBe(true);
			expect(JSON.isJSON(b)).toBe(true);
			expect(JSON.from(3).equals(b)).toBe(true);

			const [c, d] = result.rows[0]._jsonb;
			expect(result.rows[0]._jsonb).toHaveLength(2);
			expect(JSON.isJSON(c)).toBe(true);
			expect(JSON.from(2).equals(c)).toBe(true);
			expect(JSON.isJSON(d)).toBe(true);
			expect(JSON.from(3).equals(d)).toBe(true);
		} catch (error_) {
			error = error_;
			// eslint-disable-next-line no-console
			console.error(error);
		}

		await client.query(`
				DROP TABLE public.vitestjson
			`);

		await client.end();

		if (error) throw error;
	});
});
