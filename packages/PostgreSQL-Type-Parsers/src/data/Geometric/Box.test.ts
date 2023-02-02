/* eslint-disable no-useless-escape */
import { Client } from "pg";
import { describe, expect, it, test } from "vitest";

import { Box } from "./Box";

describe("BoxConstructor", () => {
	test("_parse(...)", () => {
		expect(Box.safeFrom("(1,2),(3,4)").success).toBe(true);
		expect(Box.safeFrom({ x1: 1, y1: 2, x2: 3, y2: 4 }).success).toBe(true);
		expect(Box.safeFrom(1, 2, 3, 4).success).toBe(true);
		expect(Box.safeFrom(Box.from("(1,2),(3,4)")).success).toBe(true);

		//@ts-expect-error - this is a test
		expect(() => Box.from()).toThrowError("Function must have exactly 1 argument(s)");
		//@ts-expect-error - this is a test
		expect(() => Box.from("a", "b")).toThrowError("Function must have exactly 1 argument(s)");
		//@ts-expect-error - this is a test
		expect(() => Box.from(BigInt("1"))).toThrowError("Expected 'number' | 'string' | 'object', received 'bigint'");
		expect(() => Box.from("()")).toThrowError("LIKE (x1,y1),(x2,y2)', received '()");
		expect(() => Box.from({} as any)).toThrowError("Missing keys in object: 'x1', 'y1', 'x2', 'y2'");
		expect(() =>
			Box.from({
				x1: 1,
				y1: 2,
				x2: 3,
				y2: "a",
			} as any)
		).toThrowError("Expected 'number' for key 'y2', received 'string'");
		expect(() =>
			Box.from({
				x1: 1,
				y1: 2,
				x2: 3,
				y2: 4,
				x3: 5,
			} as any)
		).toThrowError("Unrecognized key in object: 'x3'");
		expect(() => Box.from(1, 2, 3, "a" as any)).toThrowError("Expected 'number', received 'string'");
		//@ts-expect-error - this is a test
		expect(() => Box.from(1, 2, 3)).toThrowError("Function must have exactly 4 argument(s)");
		//@ts-expect-error - this is a test
		expect(() => Box.from(1, 2, 3, 4, 5)).toThrowError("Function must have exactly 4 argument(s)");
	});

	test("isBox(...)", () => {
		const box = Box.from({ x1: 1, y1: 2, x2: 3, y2: 4 });
		expect(Box.isBox(box)).toBe(true);
		expect(Box.isBox({ x1: 1, y1: 2, x2: 3, y2: 4 })).toBe(false);
	});
});

describe("Box", () => {
	test("_equals(...)", () => {
		const box = Box.from({ x1: 1, y1: 2, x2: 3, y2: 4 });

		expect(box.equals(Box.from({ x1: 1, y1: 2, x2: 3, y2: 4 }))).toBe(true);
		expect(box.equals(Box.from({ x1: 1, y1: 2, x2: 3, y2: 5 }))).toBe(false);
		expect(box.equals(Box.from({ x1: 1, y1: 2, x2: 3, y2: 4 }).toJSON())).toBe(true);
		expect(box.equals(Box.from({ x1: 1, y1: 2, x2: 3, y2: 5 }).toJSON())).toBe(false);
		expect(box.equals(Box.from({ x1: 1, y1: 2, x2: 3, y2: 4 }).toString())).toBe(true);
		expect(box.equals(Box.from({ x1: 1, y1: 2, x2: 3, y2: 5 }).toString())).toBe(false);
		//@ts-expect-error - this is a test
		expect(() => box.equals(BigInt(1))).toThrowError("Expected 'number' | 'string' | 'object', received 'bigint'");
	});

	test("toString()", () => {
		const box = Box.from({ x1: 1, y1: 2, x2: 3, y2: 4 });
		expect(box.toString()).toBe("(1,2),(3,4)");
	});

	test("toJSON()", () => {
		const box = Box.from({ x1: 1, y1: 2, x2: 3, y2: 4 });
		expect(box.toJSON()).toEqual({ x1: 1, y1: 2, x2: 3, y2: 4 });
	});

	test("get x1()", () => {
		const box = Box.from({ x1: 1, y1: 2, x2: 3, y2: 4 });
		expect(box.x1).toBe(1);
	});

	test("set x1(...)", () => {
		const box = Box.from({ x1: 1, y1: 2, x2: 3, y2: 4 });
		expect(() => {
			box.x1 = "a" as any;
		}).toThrowError("Expected 'number', received 'string'");
		box.x1 = 5;
		expect(box.x1).toBe(5);
	});

	test("get y1()", () => {
		const box = Box.from({ x1: 1, y1: 2, x2: 3, y2: 4 });
		expect(box.y1).toBe(2);
	});

	test("set y1()", () => {
		const box = Box.from({ x1: 1, y1: 2, x2: 3, y2: 4 });
		expect(() => {
			box.y1 = "a" as any;
		}).toThrowError("Expected 'number', received 'string'");
		box.y1 = 5;
		expect(box.y1).toBe(5);
	});

	test("get x2()", () => {
		const box = Box.from({ x1: 1, y1: 2, x2: 3, y2: 4 });
		expect(box.x2).toBe(3);
	});

	test("set x2()", () => {
		const box = Box.from({ x1: 1, y1: 2, x2: 3, y2: 4 });
		expect(() => {
			box.x2 = "a" as any;
		}).toThrowError("Expected 'number', received 'string'");
		box.x2 = 5;
		expect(box.x2).toBe(5);
	});

	test("get y2()", () => {
		const box = Box.from({ x1: 1, y1: 2, x2: 3, y2: 4 });
		expect(box.y2).toBe(4);
	});

	test("set y2()", () => {
		const box = Box.from({ x1: 1, y1: 2, x2: 3, y2: 4 });
		expect(() => {
			box.y2 = "a" as any;
		}).toThrowError("Expected 'number', received 'string'");
		box.y2 = 5;
		expect(box.y2).toBe(5);
	});
});

describe("PostgreSQL", () => {
	it("should work with PostgreSQL's own tests", () => {
		//* https://github.com/postgres/postgres/blob/master/src/test/regress/sql/box.sql
		expect(() => Box.from("(2.0,2.0),(0.0,0.0)")).not.toThrowError();
		expect(() => Box.from("(1.0,1.0),(3.0,3.0)")).not.toThrowError();
		expect(() => Box.from("((-8, 2), (-2, -10))")).not.toThrowError();

		// degenerate cases where the box is a line or a point
		// note that lines and points boxes all have zero area
		expect(() => Box.from("(2.5, 2.5),( 2.5,3.5)")).not.toThrowError();
		expect(() => Box.from("(3.0, 3.0),(3.0,3.0)")).not.toThrowError();

		// badly formatted box inputs
		expect(() => Box.from("(2.3, 4.5)")).toThrowError();
		expect(() => Box.from("[1, 2, 3, 4)")).toThrowError();
		expect(() => Box.from("(1, 2, 3, 4]")).toThrowError();
		expect(() => Box.from("(1, 2, 3, 4) x")).toThrowError();
		expect(() => Box.from("asdfasdf(ad")).toThrowError();
	});

	it("should be returned from PostgreSQL", async () => {
		const client = new Client({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			application_name: "box.test.ts",
		});

		await client.connect();

		let error = null;
		try {
			await client.query(`
				CREATE TABLE public.jestbox (
					box box NULL,
					_box _box NULL
				)
			`);

			await client.query(`
				INSERT INTO public.jestbox (box, _box)
				VALUES (
					'(1,2),(3,4)',
					'{(1.1\,2.2)\,(3.3\,4.4);(5.5\,6.6)\,(7.7\,8.8)}'
				)
			`);

			const result = await client.query(`
				SELECT * FROM public.jestbox
			`);

			expect(result.rows[0].box.toString()).toStrictEqual(Box.from({ x1: 3, y1: 4, x2: 1, y2: 2 }).toString());
			expect(result.rows[0]._box).toHaveLength(2);
			expect(result.rows[0]._box[0].toString()).toStrictEqual(Box.from({ x1: 3.3, y1: 4.4, x2: 1.1, y2: 2.2 }).toString());
			expect(result.rows[0]._box[1].toString()).toStrictEqual(Box.from({ x1: 7.7, y1: 8.8, x2: 5.5, y2: 6.6 }).toString());
		} catch (err) {
			error = err;
		}

		await client.query(`
			DROP TABLE public.jestbox
		`);

		await client.end();

		if (error) throw error;
	});
});
