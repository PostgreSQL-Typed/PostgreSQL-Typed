import { Client } from "pg";
import { describe, expect, it, test } from "vitest";

import { LineSegment } from "./LineSegment.js";
import { Point } from "./Point.js";

describe("LineSegmentConstructor", () => {
	test("_parse(...)", () => {
		expect(LineSegment.safeFrom("[(1,2),(3,4)]").success).toBe(true);
		expect(
			LineSegment.safeFrom({
				a: {
					x: 1,
					y: 2,
				},
				b: {
					x: 3,
					y: 4,
				},
			}).success
		).toBe(true);
		expect(LineSegment.safeFrom({ a: Point.from("(1,2)"), b: Point.from("(3,4)") }).success).toBe(true);
		expect(LineSegment.safeFrom(Point.from("(1,2)"), Point.from("(3,4)")).success).toBe(true);
		expect(LineSegment.safeFrom([Point.from("(1,2)"), Point.from("(3,4)")]).success).toBe(true);
		expect(LineSegment.safeFrom(LineSegment.from("[(1,2),(3,4)]")).success).toBe(true);

		//@ts-expect-error - this is a test
		expect(() => LineSegment.from()).toThrowError("Function must have exactly 1 argument(s)");
		//@ts-expect-error - this is a test
		expect(() => LineSegment.from("a", "b")).toThrowError("Function must have exactly 1 argument(s)");
		//@ts-expect-error - this is a test
		expect(() => LineSegment.from(LineSegment.from("[(1,2),(3,4)]"), "b")).toThrowError("Function must have exactly 1 argument(s)");
		//@ts-expect-error - this is a test
		expect(() => LineSegment.from({ a: Point.from("(1,2)"), b: Point.from("(3,4)") }, "b")).toThrowError("Function must have exactly 1 argument(s)");
		//@ts-expect-error - this is a test
		expect(() => LineSegment.from(BigInt("1"))).toThrowError("Expected 'string' | 'object' | 'array', received 'bigint'");
		expect(() => LineSegment.from("()")).toThrowError("Expected 'LIKE [(x1,y1),(x2,y2)]', received '()'");
		expect(() => LineSegment.from({} as any)).toThrowError("Missing keys in object: 'a', 'b'");
		expect(() =>
			LineSegment.from({
				a: Point.from("(1,2)"),
				b: "a",
			} as any)
		).toThrowError("Expected 'object' for key 'b', received 'string'");
		expect(() =>
			LineSegment.from({
				a: Point.from("(1,2)"),
				b: Point.from("(3,4)"),
				c: 4,
			} as any)
		).toThrowError("Unrecognized key in object: 'c'");
		expect(() =>
			LineSegment.from({
				a: {
					x: "brr" as any,
					y: 2,
				},
				b: {
					x: 3,
					y: 4,
				},
			})
		).toThrowError("Expected 'number' | 'nan' for key 'x', received 'string'");
		expect(() =>
			LineSegment.from({
				a: {
					x: 1,
					y: 2,
				},
				b: {
					x: "brr" as any,
					y: 4,
				},
			})
		).toThrowError("Expected 'number' | 'nan' for key 'x', received 'string'");
		expect(() => LineSegment.from(Point.from("(1,2)"), BigInt(1) as any)).toThrowError("Expected 'number' | 'nan' | 'string' | 'object', received 'bigint'");
		//@ts-expect-error - this is a test
		expect(() => LineSegment.from(Point.from("(1,2)"))).toThrowError("Function must have exactly 2 argument(s)");
		//@ts-expect-error - this is a test
		expect(() => LineSegment.from(Point.from("(1,2)"), Point.from("(3,4)"), Point.from("(5,6)"))).toThrowError("Function must have at most 2 argument(s)");
	});

	test("isLineSegment(...)", () => {
		const lineSegment = LineSegment.from({
			a: Point.from("(1,2)"),
			b: Point.from("(3,4)"),
		});
		expect(LineSegment.isLineSegment(lineSegment)).toBe(true);
		expect(
			LineSegment.isLineSegment({
				a: Point.from("(1,2)"),
				b: Point.from("(3,4)"),
			})
		).toBe(false);
	});
});

describe("LineSegment", () => {
	test("_equals(...)", () => {
		const lineSegment = LineSegment.from({
			a: Point.from("(1,2)"),
			b: Point.from("(3,4)"),
		});

		expect(lineSegment.equals(LineSegment.from({ a: Point.from("(1,2)"), b: Point.from("(3,4)") }))).toBe(true);
		expect(lineSegment.equals(LineSegment.from({ a: Point.from("(1,2)"), b: Point.from("(5,6)") }))).toBe(false);
		expect(
			lineSegment.equals(
				LineSegment.from({
					a: Point.from("(1,2)"),
					b: Point.from("(3,4)"),
				}).toJSON()
			)
		).toBe(true);
		expect(
			lineSegment.equals(
				LineSegment.from({
					a: Point.from("(1,2)"),
					b: Point.from("(5,6)"),
				}).toJSON()
			)
		).toBe(false);
		expect(
			lineSegment.equals(
				LineSegment.from({
					a: Point.from("(1,2)"),
					b: Point.from("(3,4)"),
				}).toString()
			)
		).toBe(true);
		expect(
			lineSegment.equals(
				LineSegment.from({
					a: Point.from("(1,2)"),
					b: Point.from("(5,6)"),
				}).toString()
			)
		).toBe(false);
		//@ts-expect-error - this is a test
		expect(() => lineSegment.equals(BigInt(1))).toThrowError("Expected 'string' | 'object' | 'array', received 'bigint'");
	});

	test("toString()", () => {
		const lineSegment = LineSegment.from({
			a: Point.from("(1,2)"),
			b: Point.from("(3,4)"),
		});
		expect(lineSegment.toString()).toBe("[(1,2),(3,4)]");
	});

	test("toJSON()", () => {
		const lineSegment = LineSegment.from({
			a: Point.from("(1,2)"),
			b: Point.from("(3,4)"),
		});
		expect(lineSegment.toJSON()).toEqual({
			a: {
				x: 1,
				y: 2,
			},
			b: {
				x: 3,
				y: 4,
			},
		});
	});

	test("get a()", () => {
		const lineSegment = LineSegment.from({
			a: Point.from("(1,2)"),
			b: Point.from("(3,4)"),
		});
		expect(lineSegment.a.toString()).toBe("(1,2)");
	});

	test("set a(...)", () => {
		const lineSegment = LineSegment.from({
			a: Point.from("(1,2)"),
			b: Point.from("(3,4)"),
		});
		expect(() => {
			lineSegment.a = BigInt(1) as any;
		}).toThrowError("Expected 'number' | 'nan' | 'string' | 'object', received 'bigint'");
		lineSegment.a = Point.from("(5,6)");
		expect(lineSegment.a.toString()).toBe("(5,6)");
	});

	test("get b()", () => {
		const lineSegment = LineSegment.from({
			a: Point.from("(1,2)"),
			b: Point.from("(3,4)"),
		});
		expect(lineSegment.b.toString()).toBe("(3,4)");
	});

	test("set b(...)", () => {
		const lineSegment = LineSegment.from({
			a: Point.from("(1,2)"),
			b: Point.from("(3,4)"),
		});
		expect(() => {
			lineSegment.b = BigInt(1) as any;
		}).toThrowError("Expected 'number' | 'nan' | 'string' | 'object', received 'bigint'");
		lineSegment.b = Point.from("(5,6)");
		expect(lineSegment.b.toString()).toBe("(5,6)");
	});
});

describe("PostgreSQL", () => {
	it("should work with PostgreSQL's own tests", () => {
		//* https://github.com/postgres/postgres/blob/master/src/test/regress/sql/lseg.sql
		expect(() => LineSegment.from("[(1,2),(3,4)]")).not.toThrowError();
		expect(() => LineSegment.from("(0,0),(6,6)")).not.toThrowError();
		expect(() => LineSegment.from("[(-10,2),(-10,3)]")).not.toThrowError(); // vertical
		expect(() => LineSegment.from("[(0,-20),(30,-20)]")).not.toThrowError(); // horizontal
		expect(() => LineSegment.from("[(NaN,1),(NaN,90)]")).not.toThrowError(); // NaN

		// bad values for parser testing
		expect(() => LineSegment.from("(3asdf,2 ,3,4r2)")).toThrowError();
		expect(() => LineSegment.from("[1,2,3, 4")).toThrowError();
		expect(() => LineSegment.from("[(,2),(3,4)]")).toThrowError();
		expect(() => LineSegment.from("[(1,2),(3,4)")).toThrowError();
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

		let error = null;
		try {
			await client.query(`
				CREATE TABLE public.vitestlseg (
					lseg lseg NULL,
					_lseg _lseg NULL
				)
			`);

			await client.query(`
				INSERT INTO public.vitestlseg (lseg, _lseg)
				VALUES (
					'[(1.1,2.2),(3.3,4.4)]',
					'{ \\[(1.1\\,2.2)\\,(3.3\\,4.4)\\], \\[(5.5\\,6.6)\\,(7.7\\,8.8)\\] }'
				)
			`);

			const result = await client.query(`
				SELECT * FROM public.vitestlseg
			`);

			expect(result.rows[0].lseg.toString()).toStrictEqual(
				LineSegment.from({
					a: Point.from(1.1, 2.2),
					b: Point.from(3.3, 4.4),
				}).toString()
			);
			expect(result.rows[0]._lseg).toHaveLength(2);
			expect(result.rows[0]._lseg[0].toString()).toStrictEqual(
				LineSegment.from({
					a: Point.from(1.1, 2.2),
					b: Point.from(3.3, 4.4),
				}).toString()
			);
			expect(result.rows[0]._lseg[1].toString()).toStrictEqual(
				LineSegment.from({
					a: Point.from(5.5, 6.6),
					b: Point.from(7.7, 8.8),
				}).toString()
			);
		} catch (error_) {
			error = error_;
			// eslint-disable-next-line no-console
			console.error(error);
		}

		await client.query(`
			DROP TABLE public.vitestlseg
		`);

		await client.end();

		if (error) throw error;
	});
});
