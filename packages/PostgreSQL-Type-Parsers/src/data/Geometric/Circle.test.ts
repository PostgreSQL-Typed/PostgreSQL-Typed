import { Client } from "pg";
import { describe, expect, it, test } from "vitest";

import { Circle } from "./Circle";

describe("CircleConstructor", () => {
	test("_parse(...)", () => {
		expect(Circle.safeFrom("<(1,2),3>").success).toBe(true);
		expect(Circle.safeFrom({ x: 1, y: 2, radius: 3 }).success).toBe(true);
		expect(Circle.safeFrom(1, 2, 3).success).toBe(true);
		expect(Circle.safeFrom(Circle.from("<(1,2),3>")).success).toBe(true);

		//@ts-expect-error - this is a test
		expect(() => Circle.from()).toThrowError("Function must have exactly 1 argument(s)");
		//@ts-expect-error - this is a test
		expect(() => Circle.from("a", "b")).toThrowError("Function must have exactly 1 argument(s)");
		//@ts-expect-error - this is a test
		expect(() => Circle.from(BigInt("1"))).toThrowError("Expected 'number' | 'string' | 'object', received 'bigint'");
		expect(() => Circle.from("()")).toThrowError("Expected 'LIKE <(x,y),radius>', received '()'");
		expect(() => Circle.from({} as any)).toThrowError("Missing keys in object: 'x', 'y', 'radius'");
		expect(() =>
			Circle.from({
				x: 1,
				y: 2,
				radius: "a",
			} as any)
		).toThrowError("Expected 'number' for key 'radius', received 'string'");
		expect(() =>
			Circle.from({
				x: 1,
				y: 2,
				radius: 3,
				r: 4,
			} as any)
		).toThrowError("Unrecognized key in object: 'r'");
		expect(() => Circle.from(1, 2, "a" as any)).toThrowError("Expected 'number', received 'string'");
		//@ts-expect-error - this is a test
		expect(() => Circle.from(1, 2)).toThrowError("Function must have exactly 3 argument(s)");
		//@ts-expect-error - this is a test
		expect(() => Circle.from(1, 2, 3, 4)).toThrowError("Function must have exactly 3 argument(s)");
	});

	test("isCircle(...)", () => {
		const circle = Circle.from({ x: 1, y: 2, radius: 3 });
		expect(Circle.isCircle(circle)).toBe(true);
		expect(Circle.isCircle({ x: 1, y: 2, radius: 3 })).toBe(false);
	});
});

describe("Circle", () => {
	test("_equals(...)", () => {
		const circle = Circle.from({ x: 1, y: 2, radius: 3 });

		expect(circle.equals(Circle.from({ x: 1, y: 2, radius: 3 }))).toBe(true);
		expect(circle.equals(Circle.from({ x: 1, y: 2, radius: 4 }))).toBe(false);
		expect(circle.equals(Circle.from({ x: 1, y: 2, radius: 3 }).toJSON())).toBe(true);
		expect(circle.equals(Circle.from({ x: 1, y: 2, radius: 4 }).toJSON())).toBe(false);
		expect(circle.equals(Circle.from({ x: 1, y: 2, radius: 3 }).toString())).toBe(true);
		expect(circle.equals(Circle.from({ x: 1, y: 2, radius: 4 }).toString())).toBe(false);
		//@ts-expect-error - this is a test
		expect(() => circle.equals(BigInt(1))).toThrowError("Expected 'number' | 'string' | 'object', received 'bigint'");
	});

	test("toString()", () => {
		const circle = Circle.from({ x: 1, y: 2, radius: 3 });
		expect(circle.toString()).toBe("<(1,2),3>");
	});

	test("toJSON()", () => {
		const circle = Circle.from({ x: 1, y: 2, radius: 3 });
		expect(circle.toJSON()).toEqual({ x: 1, y: 2, radius: 3 });
	});

	test("get x()", () => {
		const circle = Circle.from({ x: 1, y: 2, radius: 3 });
		expect(circle.x).toBe(1);
	});

	test("set x(...)", () => {
		const circle = Circle.from({ x: 1, y: 2, radius: 3 });
		expect(() => {
			circle.x = "a" as any;
		}).toThrowError("Expected 'number', received 'string'");
		circle.x = 5;
		expect(circle.x).toBe(5);
	});

	test("get y()", () => {
		const circle = Circle.from({ x: 1, y: 2, radius: 3 });
		expect(circle.y).toBe(2);
	});

	test("set y(...)", () => {
		const circle = Circle.from({ x: 1, y: 2, radius: 3 });
		expect(() => {
			circle.y = "a" as any;
		}).toThrowError("Expected 'number', received 'string'");
		circle.y = 5;
		expect(circle.y).toBe(5);
	});

	test("get radius()", () => {
		const circle = Circle.from({ x: 1, y: 2, radius: 3 });
		expect(circle.radius).toBe(3);
	});

	test("set radius(...)", () => {
		const circle = Circle.from({ x: 1, y: 2, radius: 3 });
		expect(() => {
			circle.radius = "a" as any;
		}).toThrowError("Expected 'number', received 'string'");
		circle.radius = 5;
		expect(circle.radius).toBe(5);
	});
});

describe("PostgreSQL", () => {
	it("should work with PostgreSQL's own tests", () => {
		//* https://github.com/postgres/postgres/blob/master/src/test/regress/sql/circle.sql
		expect(() => Circle.from("<(5,1),3>")).not.toThrowError();
		expect(() => Circle.from("((1,2),100)")).not.toThrowError();
		expect(() => Circle.from(" 1 , 3 , 5 ")).not.toThrowError();
		expect(() => Circle.from(" ( ( 1 , 2 ) , 3 ) ")).not.toThrowError();
		expect(() => Circle.from(" ( 100 , 200 ) , 10 ")).not.toThrowError();
		expect(() => Circle.from(" < ( 100 , 1 ) , 115 > ")).not.toThrowError();
		expect(() => Circle.from("<(3,5),0>")).not.toThrowError(); // Zero radius
		expect(() => Circle.from("<(3,5),NaN>")).not.toThrowError(); // NaN radius

		// bad values
		expect(() => Circle.from("<(-100,0),-100>")).toThrowError();
		expect(() => Circle.from("<(100,200),10")).toThrowError();
		expect(() => Circle.from("<(100,200),10> x")).toThrowError();
		expect(() => Circle.from("1abc,3,5")).toThrowError();
		expect(() => Circle.from("(3,(1,2),3)")).toThrowError();
	});

	it("should be returned from PostgreSQL", async () => {
		const client = new Client({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			application_name: "circle.test.ts",
		});

		await client.connect();

		let error = null;
		try {
			await client.query(`
				CREATE TABLE public.jestcircle (
					circle circle NULL,
					_circle _circle NULL
				)
			`);

			await client.query(`
				INSERT INTO public.jestcircle (circle, _circle)
				VALUES (
					'<(1,2),3>',
					'{ <(1.1\\,2.2)\\,3.3>, <(4\\,5)\\,6> }'
				)
			`);

			const result = await client.query(`
				SELECT * FROM public.jestcircle
			`);

			expect(result.rows[0].circle.toString()).toStrictEqual(Circle.from({ x: 1, y: 2, radius: 3 }).toString());
			expect(result.rows[0]._circle).toHaveLength(2);
			expect(result.rows[0]._circle[0].toString()).toStrictEqual(Circle.from({ x: 1.1, y: 2.2, radius: 3.3 }).toString());
			expect(result.rows[0]._circle[1].toString()).toStrictEqual(Circle.from({ x: 4, y: 5, radius: 6 }).toString());
		} catch (error_) {
			error = error_;
		}

		await client.query(`
			DROP TABLE public.jestcircle
		`);

		await client.end();

		if (error) throw error;
	});
});
