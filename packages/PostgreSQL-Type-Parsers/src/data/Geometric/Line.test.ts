import { Client } from "pg";
import { describe, expect, it, test } from "vitest";

import { Line } from "./Line";

describe("LineConstructor", () => {
	test("_parse(...)", () => {
		expect(Line.safeFrom("{1,2,3}").success).toBe(true);
		expect(Line.safeFrom({ a: 1, b: 2, c: 3 }).success).toBe(true);
		expect(Line.safeFrom(1, 2, 3).success).toBe(true);
		expect(Line.safeFrom(Line.from("{1,2,3}")).success).toBe(true);

		//@ts-expect-error - this is a test
		expect(() => Line.from()).toThrowError("Function must have exactly 1 argument(s)");
		//@ts-expect-error - this is a test
		expect(() => Line.from("a", "b")).toThrowError("Function must have exactly 1 argument(s)");
		//@ts-expect-error - this is a test
		expect(() => Line.from(BigInt("1"))).toThrowError("Expected 'number' | 'string' | 'object', received 'bigint'");
		expect(() => Line.from("()")).toThrowError("Expected 'LIKE {a,b,c}', received '()'");
		expect(() => Line.from({} as any)).toThrowError("Missing keys in object: 'a', 'b', 'c'");
		expect(() =>
			Line.from({
				a: 1,
				b: 2,
				c: "a",
			} as any)
		).toThrowError("Expected 'number' for key 'c', received 'string'");
		expect(() =>
			Line.from({
				a: 1,
				b: 2,
				c: 3,
				r: 4,
			} as any)
		).toThrowError("Unrecognized key in object: 'r'");
		expect(() => Line.from(1, 2, "a" as any)).toThrowError("Expected 'number', received 'string'");
		//@ts-expect-error - this is a test
		expect(() => Line.from(1, 2)).toThrowError("Function must have exactly 3 argument(s)");
		//@ts-expect-error - this is a test
		expect(() => Line.from(1, 2, 3, 4)).toThrowError("Function must have exactly 3 argument(s)");
	});

	test("isLine(...)", () => {
		const line = Line.from({ a: 1, b: 2, c: 3 });
		expect(Line.isLine(line)).toBe(true);
		expect(Line.isLine({ a: 1, b: 2, c: 3 })).toBe(false);
	});
});

describe("Line", () => {
	test("_equals(...)", () => {
		const line = Line.from({ a: 1, b: 2, c: 3 });

		expect(line.equals(Line.from({ a: 1, b: 2, c: 3 }))).toBe(true);
		expect(line.equals(Line.from({ a: 1, b: 2, c: 4 }))).toBe(false);
		expect(line.equals(Line.from({ a: 1, b: 2, c: 3 }).toJSON())).toBe(true);
		expect(line.equals(Line.from({ a: 1, b: 2, c: 4 }).toJSON())).toBe(false);
		expect(line.equals(Line.from({ a: 1, b: 2, c: 3 }).toString())).toBe(true);
		expect(line.equals(Line.from({ a: 1, b: 2, c: 4 }).toString())).toBe(false);
		//@ts-expect-error - this is a test
		expect(() => line.equals(BigInt(1))).toThrowError("Expected 'number' | 'string' | 'object', received 'bigint'");
	});

	test("toString()", () => {
		const line = Line.from({ a: 1, b: 2, c: 3 });
		expect(line.toString()).toBe("{1,2,3}");
	});

	test("toJSON()", () => {
		const line = Line.from({ a: 1, b: 2, c: 3 });
		expect(line.toJSON()).toEqual({ a: 1, b: 2, c: 3 });
	});

	test("get a()", () => {
		const line = Line.from({ a: 1, b: 2, c: 3 });
		expect(line.a).toBe(1);
	});

	test("set a(...)", () => {
		const line = Line.from({ a: 1, b: 2, c: 3 });
		expect(() => {
			line.a = "a" as any;
		}).toThrowError("Expected 'number', received 'string'");
		line.a = 5;
		expect(line.a).toBe(5);
	});

	test("get b()", () => {
		const line = Line.from({ a: 1, b: 2, c: 3 });
		expect(line.b).toBe(2);
	});

	test("set b(...)", () => {
		const line = Line.from({ a: 1, b: 2, c: 3 });
		expect(() => {
			line.b = "a" as any;
		}).toThrowError("Expected 'number', received 'string'");
		line.b = 5;
		expect(line.b).toBe(5);
	});

	test("get c()", () => {
		const line = Line.from({ a: 1, b: 2, c: 3 });
		expect(line.c).toBe(3);
	});

	test("set c(...)", () => {
		const line = Line.from({ a: 1, b: 2, c: 3 });
		expect(() => {
			line.c = "a" as any;
		}).toThrowError("Expected 'number', received 'string'");
		line.c = 5;
		expect(line.c).toBe(5);
	});
});

describe("PostgreSQL", () => {
	it("should work with PostgreSQL's own tests", () => {
		//* https://github.com/postgres/postgres/blob/master/src/test/regress/sql/line.sql
		expect(() => Line.from("{0,-1,5}")).not.toThrowError(); // A == 0
		expect(() => Line.from("{1,0,5}")).not.toThrowError(); // B == 0
		expect(() => Line.from("{0,3,0}")).not.toThrowError(); // A == C == 0

		expect(() => Line.from("{3,NaN,5}")).not.toThrowError();
		expect(() => Line.from("{NaN,NaN,NaN}")).not.toThrowError();

		// bad values for parser testing
		expect(() => Line.from("{}")).toThrowError();
		expect(() => Line.from("{0")).toThrowError();
		expect(() => Line.from("{0,0}")).toThrowError();
		expect(() => Line.from("{0,0,1")).toThrowError();
		expect(() => Line.from("{0,0,1}")).toThrowError();
		expect(() => Line.from("{0,0,1} x")).toThrowError();
		expect(() => Line.from("(3asdf,2 ,3,4r2)")).toThrowError();
		expect(() => Line.from("[1,2,3, 4")).toThrowError();
		expect(() => Line.from("[(,2),(3,4)]")).toThrowError();
		expect(() => Line.from("[(1,2),(3,4)")).toThrowError();
		expect(() => Line.from("[(1,2),(1,2)]")).toThrowError();
	});

	it("should be returned from PostgreSQL", async () => {
		const client = new Client({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			application_name: "line.test.ts",
		});

		await client.connect();

		let error = null;
		try {
			await client.query(`
				CREATE TABLE public.jestline (
					line line NULL,
					_line _line NULL
				)
			`);

			await client.query(`
				INSERT INTO public.jestline (line, _line)
				VALUES (
					'{1.1,2.2,3.3}',
					'{\\{1.1\\,2.2\\,3.3\\},\\{4.4\\,5.5\\,6.6\\}}'
				)
			`);

			const result = await client.query(`
				SELECT * FROM public.jestline
			`);

			expect(result.rows[0].line.toString()).toStrictEqual(
				Line.from({
					a: 1.1,
					b: 2.2,
					c: 3.3,
				}).toString()
			);
			expect(result.rows[0]._line).toHaveLength(2);
			expect(result.rows[0]._line[0].toString()).toStrictEqual(
				Line.from({
					a: 1.1,
					b: 2.2,
					c: 3.3,
				}).toString()
			);
			expect(result.rows[0]._line[1].toString()).toStrictEqual(
				Line.from({
					a: 4.4,
					b: 5.5,
					c: 6.6,
				}).toString()
			);
		} catch (err) {
			error = err;
		}

		await client.query(`
			DROP TABLE public.jestline
		`);

		await client.end();

		if (error) throw error;
	});
});
