import { Client } from "pg";
import { describe, expect, it, test } from "vitest";

import { Point } from "./Point.js";
import { Polygon } from "./Polygon.js";

describe("PolygonConstructor", () => {
	test("_parse(...)", () => {
		expect(Polygon.safeFrom("((1,2),(3,4))").success).toBe(true);
		expect(
			Polygon.safeFrom({
				points: [
					{
						x: 1,
						y: 2,
					},
					{
						x: 3,
						y: 4,
					},
				],
			}).success
		).toBe(true);
		expect(
			Polygon.safeFrom({
				points: [Point.from({ x: 1, y: 2 }), Point.from({ x: 3, y: 4 })],
			}).success
		).toBe(true);
		expect(Polygon.safeFrom(Point.from("(1,2)"), Point.from("(3,4)")).success).toBe(true);
		expect(Polygon.safeFrom([Point.from("(1,2)"), Point.from("(3,4)")]).success).toBe(true);
		expect(Polygon.safeFrom(Polygon.from("((1,2),(3,4))")).success).toBe(true);

		//@ts-expect-error - this is a test
		expect(() => Polygon.from()).toThrowError("Function must have exactly 1 argument(s)");
		//@ts-expect-error - this is a test
		expect(() => Polygon.from("a", "b")).toThrowError("Function must have exactly 1 argument(s)");
		//@ts-expect-error - this is a test
		expect(() => Polygon.from(Polygon.from("((1,2),(3,4))"), "b")).toThrowError("Function must have exactly 1 argument(s)");
		expect(() =>
			Polygon.from(
				{
					//@ts-expect-error - this is a test
					points: [Point.from({ x: 1, y: 2 }), Point.from({ x: 3, y: 4 })],
				},
				"b"
			)
		).toThrowError("Function must have exactly 1 argument(s)");
		//@ts-expect-error - this is a test
		expect(() => Polygon.from(BigInt("1"))).toThrowError("Expected 'string' | 'object' | 'array', received 'bigint'");
		expect(() => Polygon.from("()")).toThrowError("Expected 'LIKE ((x,y),...)', received '()'");
		expect(() => Polygon.from({} as any)).toThrowError("Missing key in object: 'points'");
		expect(() => Polygon.from({ points: BigInt(1) } as any)).toThrowError("Expected 'array' for key 'points', received 'bigint'");
		expect(() => Polygon.from({ points: [], extra: "" } as any)).toThrowError("Unrecognized key in object: 'extra'");
		expect(() => Polygon.from({ points: [] })).toThrowError("Array must contain at least 1 element(s)");
		expect(() => Polygon.from({ points: [Point.from("(1,2)"), "brr"] } as any)).toThrowError("Expected 'LIKE (x,y)', received 'brr'");
		expect(() => Polygon.from([])).toThrowError("Array must contain at least 1 element(s)");
		expect(() => Polygon.from(["brrr" as any])).toThrowError("Expected 'LIKE (x,y)', received 'brrr'");
		expect(() => Polygon.from(Point.from("(1,2)"), "brrr" as any)).toThrowError("Expected 'LIKE (x,y)', received 'brrr'");
	});

	test("isPolygon(...)", () => {
		const polygon = Polygon.from({
			points: [Point.from({ x: 1, y: 2 }), Point.from({ x: 3, y: 4 })],
		});
		expect(Polygon.isPolygon(polygon)).toBe(true);
		expect(
			Polygon.isPolygon({
				points: [Point.from({ x: 1, y: 2 }), Point.from({ x: 3, y: 4 })],
			})
		).toBe(false);
	});
});

describe("Polygon", () => {
	test("_equals(...)", () => {
		const polygon = Polygon.from({
			points: [Point.from({ x: 1, y: 2 }), Point.from({ x: 3, y: 4 })],
		});

		expect(
			polygon.equals(
				Polygon.from({
					points: [Point.from({ x: 1, y: 2 }), Point.from({ x: 3, y: 4 })],
				})
			)
		).toBe(true);
		expect(
			polygon.equals(
				Polygon.from({
					points: [Point.from({ x: 1, y: 2 }), Point.from({ x: 5, y: 6 })],
				})
			)
		).toBe(false);
		expect(
			polygon.equals(
				Polygon.from({
					points: [Point.from({ x: 1, y: 2 }), Point.from({ x: 3, y: 4 })],
				}).toJSON()
			)
		).toBe(true);
		expect(
			polygon.equals(
				Polygon.from({
					points: [Point.from({ x: 1, y: 2 }), Point.from({ x: 5, y: 6 })],
				}).toJSON()
			)
		).toBe(false);
		expect(
			polygon.equals(
				Polygon.from({
					points: [Point.from({ x: 1, y: 2 }), Point.from({ x: 3, y: 4 })],
				}).toString()
			)
		).toBe(true);
		expect(
			polygon.equals(
				Polygon.from({
					points: [Point.from({ x: 1, y: 2 }), Point.from({ x: 5, y: 6 })],
				}).toString()
			)
		).toBe(false);
		//@ts-expect-error - this is a test
		expect(() => polygon.equals(BigInt(1))).toThrowError("Expected 'string' | 'object' | 'array', received 'bigint'");
	});

	test("toString()", () => {
		expect(
			Polygon.from({
				points: [Point.from({ x: 1, y: 2 }), Point.from({ x: 3, y: 4 })],
			}).toString()
		).toBe("((1,2),(3,4))");
	});

	test("toJSON()", () => {
		const polygon = Polygon.from({
			points: [Point.from({ x: 1, y: 2 }), Point.from({ x: 3, y: 4 })],
		});
		expect(polygon.toJSON()).toEqual({
			points: [
				{
					x: 1,
					y: 2,
				},
				{
					x: 3,
					y: 4,
				},
			],
		});
	});

	test("get points()", () => {
		const polygon = Polygon.from("((1,2),(3,4))");
		expect(polygon.points).toHaveLength(2);
		expect(polygon.points[0].toString()).toBe("(1,2)");
		expect(polygon.points[1].toString()).toBe("(3,4)");
	});

	test("set points(...)", () => {
		const polygon = Polygon.from("((1,2),(3,4))");
		expect(() => {
			polygon.points = BigInt(1) as any;
		}).toThrowError("Expected 'array', received 'bigint'");
		expect(() => {
			polygon.points = [];
		}).toThrowError("Array must contain at least 1 element(s)");
		expect(() => {
			polygon.points = [BigInt(1)] as any;
		}).toThrowError("Expected 'number' | 'nan' | 'string' | 'object', received 'bigint'");
		polygon.points = [Point.from("(5,6)")];
		expect(polygon.points).toHaveLength(1);
		expect(polygon.points[0].toString()).toBe("(5,6)");
	});

	test("get value()", () => {
		const polygon = Polygon.from("((2.0,2.0),(0.0,0.0))");
		expect(polygon.value).toBe("((2,2),(0,0))");
	});

	test("set value(...)", () => {
		const polygon = Polygon.from("((2.0,2.0),(0.0,0.0))");
		polygon.value = "((1.0,1.0),(3.0,3.0))";
		expect(polygon.value).toBe("((1,1),(3,3))");
		expect(() => {
			polygon.value = true as any;
		}).toThrowError("Expected 'string' | 'object' | 'array', received 'boolean'");
	});
});

describe("PostgreSQL", () => {
	it("should work with PostgreSQL's own tests", () => {
		//* https://github.com/postgres/postgres/blob/master/src/test/regress/sql/polygon.sql
		expect(() => Polygon.from("(2.0,0.0),(2.0,4.0),(0.0,0.0)")).not.toThrowError();
		expect(() => Polygon.from("(3.0,1.0),(3.0,3.0),(1.0,0.0)")).not.toThrowError();
		expect(() => Polygon.from("(1,2),(3,4),(5,6),(7,8)")).not.toThrowError();
		expect(() => Polygon.from("(7,8),(5,6),(3,4),(1,2)")).not.toThrowError(); // Reverse
		expect(() => Polygon.from("(1,2),(7,8),(5,6),(3,-4)")).not.toThrowError();

		// degenerate polygons
		expect(() => Polygon.from("(0.0,0.0)")).not.toThrowError();
		expect(() => Polygon.from("(0.0,1.0),(0.0,1.0)")).not.toThrowError();

		// bad polygon input strings
		expect(() => Polygon.from("0.0")).toThrowError();
		expect(() => Polygon.from("(0.0 0.0")).toThrowError();
		expect(() => Polygon.from("(0,1,2)")).toThrowError();
		expect(() => Polygon.from("(0,1,2,3")).toThrowError();
		expect(() => Polygon.from("asdf")).toThrowError();

		// test non-error-throwing API for some core types
		expect(() => Polygon.from("(2.0,0.8,0.1)")).toThrowError();
		expect(() => Polygon.from("(2.0,0.8,0.1)")).toThrowError();
		expect(() => Polygon.from("(2.0,xyz)")).toThrowError();
		expect(() => Polygon.from("(2.0,xyz)")).toThrowError();
	});

	it("should be returned from PostgreSQL", async () => {
		const client = new Client({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			application_name: "polygon.test.ts",
		});

		await client.connect();

		let error = null;
		try {
			await client.query(`
				CREATE TABLE public.vitestpolygon (
					polygon polygon NULL,
					_polygon _polygon NULL
				)
			`);

			await client.query(`
				INSERT INTO public.vitestpolygon (polygon, _polygon)
				VALUES (
					'((1.1,2.2),(3.3,4.4))',
					'{((1.1\\,2.2)\\,(3.3\\,4.4)),((5.5\\,6.6)\\,(7.7\\,8.8))}'
				)
			`);

			const result = await client.query(`
				SELECT * FROM public.vitestpolygon
			`);

			expect(result.rows[0].polygon.toString()).toStrictEqual(
				Polygon.from({
					points: [Point.from({ x: 1.1, y: 2.2 }), Point.from({ x: 3.3, y: 4.4 })],
				}).toString()
			);
			expect(result.rows[0]._polygon).toHaveLength(2);
			expect(result.rows[0]._polygon[0].toString()).toStrictEqual(
				Polygon.from({
					points: [Point.from({ x: 1.1, y: 2.2 }), Point.from({ x: 3.3, y: 4.4 })],
				}).toString()
			);
			expect(result.rows[0]._polygon[1].toString()).toStrictEqual(
				Polygon.from({
					points: [Point.from({ x: 5.5, y: 6.6 }), Point.from({ x: 7.7, y: 8.8 })],
				}).toString()
			);
		} catch (error_) {
			error = error_;
			// eslint-disable-next-line no-console
			console.error(error);
		}

		await client.query(`
			DROP TABLE public.vitestpolygon
		`);

		await client.end();

		if (error) throw error;
	});
});
