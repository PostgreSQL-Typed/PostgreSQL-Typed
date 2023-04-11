import { Client, types } from "pg";
import { describe, expect, it, test } from "vitest";

import { arrayParser } from "../../util/arrayParser.js";
import { parser } from "../../util/parser.js";
import { Point } from "./Point.js";

describe("PointConstructor", () => {
	test("_parse(...)", () => {
		expect(Point.safeFrom("(1,2)").success).toBe(true);
		expect(Point.safeFrom("(1,NaN)").success).toBe(true);
		expect(Point.safeFrom({ x: 1, y: 2 }).success).toBe(true);
		expect(Point.safeFrom({ x: 1, y: Number.NaN }).success).toBe(true);
		expect(Point.safeFrom(1, 2).success).toBe(true);
		expect(Point.safeFrom(1, Number.NaN).success).toBe(true);
		expect(Point.safeFrom(Point.from("(1,2)")).success).toBe(true);

		//@ts-expect-error - this is a test
		expect(() => Point.from()).toThrowError("Function must have exactly 1 argument(s)");
		//@ts-expect-error - this is a test
		expect(() => Point.from("a", "b")).toThrowError("Function must have exactly 1 argument(s)");
		//@ts-expect-error - this is a test
		expect(() => Point.from(BigInt("1"))).toThrowError("Expected 'number' | 'nan' | 'string' | 'object', received 'bigint'");
		expect(() => Point.from("()")).toThrowError("Expected 'LIKE (x,y)', received '()'");
		expect(() => Point.from({} as any)).toThrowError("Missing keys in object: 'x', 'y'");
		expect(() =>
			Point.from({
				x: 1,
				y: "a",
			} as any)
		).toThrowError("Expected 'number' | 'nan' for key 'y', received 'string'");
		expect(() =>
			Point.from({
				x: 1,
				y: 2,
				r: 3,
			} as any)
		).toThrowError("Unrecognized key in object: 'r'");
		expect(() => Point.from(1, "a" as any)).toThrowError("Expected 'number' | 'nan', received 'string'");
		//@ts-expect-error - this is a test
		expect(() => Point.from(1)).toThrowError("Function must have exactly 2 argument(s)");
		//@ts-expect-error - this is a test
		expect(() => Point.from(1, 2, 3)).toThrowError("Function must have exactly 2 argument(s)");
	});

	test("isPoint(...)", () => {
		const circle = Point.from({ x: 1, y: 2 });
		expect(Point.isPoint(circle)).toBe(true);
		expect(Point.isPoint({ x: 1, y: 2 })).toBe(false);
	});
});

describe("Point", () => {
	test("_equals(...)", () => {
		const circle = Point.from({ x: 1, y: 2 });

		expect(circle.equals(Point.from({ x: 1, y: 2 }))).toBe(true);
		expect(circle.equals(Point.from({ x: 1, y: 3 }))).toBe(false);
		expect(circle.equals(Point.from({ x: 1, y: 2 }).toJSON())).toBe(true);
		expect(circle.equals(Point.from({ x: 1, y: 3 }).toJSON())).toBe(false);
		expect(circle.equals(Point.from({ x: 1, y: 2 }).toString())).toBe(true);
		expect(circle.equals(Point.from({ x: 1, y: 3 }).toString())).toBe(false);
		//@ts-expect-error - this is a test
		expect(() => circle.equals(BigInt(1))).toThrowError("Expected 'number' | 'nan' | 'string' | 'object', received 'bigint'");
	});

	test("toString()", () => {
		const circle = Point.from({ x: 1, y: 2 });
		expect(circle.toString()).toBe("(1,2)");
	});

	test("toJSON()", () => {
		const circle = Point.from({ x: 1, y: 2 });
		expect(circle.toJSON()).toEqual({ x: 1, y: 2 });
	});

	test("get x()", () => {
		const circle = Point.from({ x: 1, y: 2 });
		expect(circle.x).toBe(1);
	});

	test("set x(...)", () => {
		const circle = Point.from({ x: 1, y: 2 });
		expect(() => {
			circle.x = "a" as any;
		}).toThrowError("Expected 'number', received 'string'");
		circle.x = 5;
		expect(circle.x).toBe(5);
		circle.x = Number.NaN;
		expect(circle.x).toBe(Number.NaN);
	});

	test("get y()", () => {
		const circle = Point.from({ x: 1, y: 2 });
		expect(circle.y).toBe(2);
	});

	test("set y(...)", () => {
		const circle = Point.from({ x: 1, y: 2 });
		expect(() => {
			circle.y = "a" as any;
		}).toThrowError("Expected 'number', received 'string'");
		circle.y = 5;
		expect(circle.y).toBe(5);
		circle.y = Number.NaN;
		expect(circle.y).toBe(Number.NaN);
	});

	test("get value()", () => {
		const point = Point.from("(2.0,2.0)");
		expect(point.value).toBe("(2,2)");
	});

	test("set value(...)", () => {
		const point = Point.from("(2.0,2.0)");
		point.value = "(1.0,1.0)";
		expect(point.value).toBe("(1,1)");
		expect(() => {
			point.value = true as any;
		}).toThrowError("Expected 'number' | 'nan' | 'string' | 'object', received 'boolean'");
	});

	test("get postgres()", () => {
		const point = Point.from("(2.0,2.0)");
		expect(point.postgres).toBe("(2,2)");
	});

	test("set postgres(...)", () => {
		const point = Point.from("(2.0,2.0)");
		point.postgres = "(1.0,1.0)";
		expect(point.postgres).toBe("(1,1)");
		expect(() => {
			point.postgres = true as any;
		}).toThrowError("Expected 'number' | 'nan' | 'string' | 'object', received 'boolean'");
	});
});

describe("PostgreSQL", () => {
	it("should work with PostgreSQL's own tests", () => {
		//* https://github.com/postgres/postgres/blob/master/src/test/regress/sql/point.sql
		// Here we just try to insert bad values.
		expect(() => Point.from("asdfasdf")).toThrowError();
		expect(() => Point.from("(10.0 10.0)")).toThrowError();
		expect(() => Point.from("(10.0, 10.0) x")).toThrowError();
		expect(() => Point.from("(10.0,10.0")).toThrowError();

		// Here we try to insert good values.
		expect(() => Point.from("(10.0,10.0)")).not.toThrowError();
		expect(() => Point.from("(0.0000009,0.0000009)")).not.toThrowError();
	});

	it("should be returned from PostgreSQL", async () => {
		const client = new Client({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			application_name: "point.test.ts",
		});

		await client.connect();

		//* PG has a native parser for the '_point' type
		types.setTypeParser(1017 as any, value => value);

		let error = null;
		try {
			await client.query(`
				CREATE TABLE public.vitestpoint (
					point point NULL,
					_point _point NULL
				)
			`);

			await client.query(`
				INSERT INTO public.vitestpoint (point, _point)
				VALUES (
					'(1,2)',
					'{ (1.1\\,2.2), (3.3\\,4.4) }'
				)
			`);

			const result = await client.query(`
				SELECT * FROM public.vitestpoint
			`);

			result.rows[0].point = parser<Point>(Point)(result.rows[0].point);
			result.rows[0]._point = arrayParser<Point>(Point)(result.rows[0]._point);

			expect(result.rows[0].point.toString()).toStrictEqual(Point.from({ x: 1, y: 2 }).toString());
			expect(result.rows[0]._point).toHaveLength(2);
			expect(result.rows[0]._point[0].toString()).toStrictEqual(Point.from({ x: 1.1, y: 2.2 }).toString());
			expect(result.rows[0]._point[1].toString()).toStrictEqual(Point.from({ x: 3.3, y: 4.4 }).toString());
		} catch (error_) {
			error = error_;
			// eslint-disable-next-line no-console
			console.error(error);
		}

		await client.query(`
			DROP TABLE public.vitestpoint
		`);

		await client.end();

		if (error) throw error;
	});
});
