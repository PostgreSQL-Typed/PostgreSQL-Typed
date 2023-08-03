import { Client } from "pg";
import { describe, expect, it, test } from "vitest";

import { arrayParser } from "../../util/arrayParser.js";
import { arraySerializer } from "../../util/arraySerializer.js";
import { parser } from "../../util/parser.js";
import { serializer } from "../../util/serializer.js";
import { Circle } from "./Circle";

describe("CircleConstructor", () => {
	test("_parse(...)", () => {
		expect(Circle.safeFrom("<(1,2),3>").success).toBe(true);
		expect(Circle.safeFrom({ radius: 3, x: 1, y: 2 }).success).toBe(true);
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
				radius: "a",
				x: 1,
				y: 2,
			} as any)
		).toThrowError("Expected 'number' for key 'radius', received 'string'");
		expect(() =>
			Circle.from({
				r: 4,
				radius: 3,
				x: 1,
				y: 2,
			} as any)
		).toThrowError("Unrecognized key in object: 'r'");
		expect(() => Circle.from(1, 2, "a" as any)).toThrowError("Expected 'number', received 'string'");
		//@ts-expect-error - this is a test
		expect(() => Circle.from(1, 2)).toThrowError("Function must have exactly 3 argument(s)");
		//@ts-expect-error - this is a test
		expect(() => Circle.from(1, 2, 3, 4)).toThrowError("Function must have exactly 3 argument(s)");
	});

	test("isCircle(...)", () => {
		const circle = Circle.from({ radius: 3, x: 1, y: 2 });
		expect(Circle.isCircle(circle)).toBe(true);
		expect(Circle.isCircle({ radius: 3, x: 1, y: 2 })).toBe(false);
	});
});

describe("Circle", () => {
	test("_equals(...)", () => {
		const circle = Circle.from({ radius: 3, x: 1, y: 2 });

		expect(circle.equals(Circle.from({ radius: 3, x: 1, y: 2 }))).toBe(true);
		expect(circle.equals(Circle.from({ radius: 4, x: 1, y: 2 }))).toBe(false);
		expect(circle.equals(Circle.from({ radius: 3, x: 1, y: 2 }).toJSON())).toBe(true);
		expect(circle.equals(Circle.from({ radius: 4, x: 1, y: 2 }).toJSON())).toBe(false);
		expect(circle.equals(Circle.from({ radius: 3, x: 1, y: 2 }).toString())).toBe(true);
		expect(circle.equals(Circle.from({ radius: 4, x: 1, y: 2 }).toString())).toBe(false);
		//@ts-expect-error - this is a test
		expect(() => circle.equals(BigInt(1))).toThrowError("Expected 'number' | 'string' | 'object', received 'bigint'");
	});

	test("toString()", () => {
		const circle = Circle.from({ radius: 3, x: 1, y: 2 });
		expect(circle.toString()).toBe("<(1,2),3>");
	});

	test("toJSON()", () => {
		const circle = Circle.from({ radius: 3, x: 1, y: 2 });
		expect(circle.toJSON()).toEqual({ radius: 3, x: 1, y: 2 });
	});

	test("get x()", () => {
		const circle = Circle.from({ radius: 3, x: 1, y: 2 });
		expect(circle.x).toBe(1);
	});

	test("set x(...)", () => {
		const circle = Circle.from({ radius: 3, x: 1, y: 2 });
		expect(() => {
			circle.x = "a" as any;
		}).toThrowError("Expected 'number', received 'string'");
		circle.x = 5;
		expect(circle.x).toBe(5);
	});

	test("get y()", () => {
		const circle = Circle.from({ radius: 3, x: 1, y: 2 });
		expect(circle.y).toBe(2);
	});

	test("set y(...)", () => {
		const circle = Circle.from({ radius: 3, x: 1, y: 2 });
		expect(() => {
			circle.y = "a" as any;
		}).toThrowError("Expected 'number', received 'string'");
		circle.y = 5;
		expect(circle.y).toBe(5);
	});

	test("get radius()", () => {
		const circle = Circle.from({ radius: 3, x: 1, y: 2 });
		expect(circle.radius).toBe(3);
	});

	test("set radius(...)", () => {
		const circle = Circle.from({ radius: 3, x: 1, y: 2 });
		expect(() => {
			circle.radius = "a" as any;
		}).toThrowError("Expected 'number', received 'string'");
		circle.radius = 5;
		expect(circle.radius).toBe(5);
	});

	test("get value()", () => {
		const circle = Circle.from("<(2,2),1>");
		expect(circle.value).toBe("<(2,2),1>");
	});

	test("set value(...)", () => {
		const circle = Circle.from("<(2,2),1>");
		circle.value = "<(1,1),3>";
		expect(circle.value).toBe("<(1,1),3>");
		expect(() => {
			circle.value = true as any;
		}).toThrowError("Expected 'number' | 'string' | 'object', received 'boolean'");
	});

	test("get postgres()", () => {
		const circle = Circle.from("<(2,2),1>");
		expect(circle.postgres).toBe("<(2,2),1>");
	});

	test("set postgres(...)", () => {
		const circle = Circle.from("<(2,2),1>");
		circle.postgres = "<(1,1),3>";
		expect(circle.postgres).toBe("<(1,1),3>");
		expect(() => {
			circle.postgres = true as any;
		}).toThrowError("Expected 'number' | 'string' | 'object', received 'boolean'");
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
			application_name: "circle.test.ts",
			database: "postgres",
			host: "localhost",
			password: "password",
			port: 5432,
			user: "postgres",
		});

		await client.connect();

		let error = null;
		try {
			await client.query(`
				CREATE TABLE public.vitestcircle (
					circle circle NULL,
					_circle _circle NULL
				)
			`);

			const [singleInput, arrayInput] = [
				serializer<Circle>(Circle)(Circle.from({ radius: 3, x: 1, y: 2 })),
				arraySerializer<Circle>(Circle)([Circle.from({ radius: 3.3, x: 1.1, y: 2.2 }), Circle.from({ radius: 6, x: 4, y: 5 })]),
			];

			expect(singleInput).toStrictEqual("<(1,2),3>");
			expect(arrayInput).toStrictEqual('{"<(1.1\\,2.2)\\,3.3>","<(4\\,5)\\,6>"}');

			await client.query(
				`
				INSERT INTO public.vitestcircle (circle, _circle)
				VALUES (
					$1::circle,
					$2::_circle
				)
			`,
				[singleInput, arrayInput]
			);

			const result = await client.query(`
				SELECT * FROM public.vitestcircle
			`);

			result.rows[0].circle = parser<Circle>(Circle)(result.rows[0].circle);
			result.rows[0]._circle = arrayParser<Circle>(Circle)(result.rows[0]._circle);

			expect(result.rows[0].circle.toString()).toStrictEqual(Circle.from({ radius: 3, x: 1, y: 2 }).toString());
			expect(result.rows[0]._circle).toHaveLength(2);
			expect(result.rows[0]._circle[0].toString()).toStrictEqual(Circle.from({ radius: 3.3, x: 1.1, y: 2.2 }).toString());
			expect(result.rows[0]._circle[1].toString()).toStrictEqual(Circle.from({ radius: 6, x: 4, y: 5 }).toString());
		} catch (error_) {
			error = error_;
			// eslint-disable-next-line no-console
			console.error(error);
		}

		await client.query(`
			DROP TABLE public.vitestcircle
		`);

		await client.end();

		if (error) throw error;
	});
});
