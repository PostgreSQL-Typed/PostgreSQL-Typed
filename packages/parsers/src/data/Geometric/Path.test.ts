import { Client } from "pg";
import { describe, expect, it, test } from "vitest";

import { arrayParser } from "../../util/arrayParser.js";
import { arraySerializer } from "../../util/arraySerializer.js";
import { parser } from "../../util/parser.js";
import { serializer } from "../../util/serializer.js";
import { Connection, Path } from "./Path.js";
import { Point } from "./Point.js";

describe("PathConstructor", () => {
	test("_parse(...)", () => {
		expect(Path.safeFrom("((1,2),(3,4))").success).toBe(true);
		expect(Path.safeFrom("[(1,2),(3,4)]").success).toBe(true);
		expect(
			Path.safeFrom({
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
				connection: "open",
			}).success
		).toBe(true);
		expect(
			Path.safeFrom({
				points: [Point.from({ x: 1, y: 2 }), Point.from({ x: 3, y: 4 })],
				connection: "open",
			}).success
		).toBe(true);
		expect(Path.safeFrom(Point.from("(1,2)"), Point.from("(3,4)")).success).toBe(true);
		expect(Path.safeFrom([Point.from("(1,2)"), Point.from("(3,4)")]).success).toBe(true);
		expect(Path.safeFrom(Path.from("[(1,2),(3,4)]")).success).toBe(true);

		//@ts-expect-error - this is a test
		expect(() => Path.from()).toThrowError("Function must have exactly 1 argument(s)");
		//@ts-expect-error - this is a test
		expect(() => Path.from("a", "b")).toThrowError("Function must have exactly 1 argument(s)");
		//@ts-expect-error - this is a test
		expect(() => Path.from(Path.from("[(1,2),(3,4)]"), "b")).toThrowError("Function must have exactly 1 argument(s)");
		expect(() =>
			Path.from(
				{
					//@ts-expect-error - this is a test
					points: [Point.from({ x: 1, y: 2 }), Point.from({ x: 3, y: 4 })],
					connection: "open",
				},
				"b"
			)
		).toThrowError("Function must have exactly 1 argument(s)");
		//@ts-expect-error - this is a test
		expect(() => Path.from(BigInt("1"))).toThrowError("Expected 'string' | 'object' | 'array', received 'bigint'");
		expect(() => Path.from("()")).toThrowError("Expected 'LIKE ((x,y),...) || [(x,y),...]', received '()'");
		expect(() => Path.from({} as any)).toThrowError("Missing keys in object: 'points', 'connection'");
		expect(() => Path.from({ points: BigInt(1), connection: "" } as any)).toThrowError("Expected 'array' for key 'points', received 'bigint'");
		expect(() => Path.from({ points: [], connection: "", extra: "" } as any)).toThrowError("Unrecognized key in object: 'extra'");
		expect(() => Path.from({ points: [], connection: "open" })).toThrowError("Array must contain at least 1 element(s)");
		expect(() =>
			Path.from({
				points: [Point.from("(1,2)"), "brr"],
				connection: "open",
			} as any)
		).toThrowError("Expected 'LIKE (x,y)', received 'brr'");
		expect(() =>
			Path.from({
				points: [Point.from("(1,2)"), Point.from("(3,4)")],
				connection: "brr",
			} as any)
		).toThrowError("Expected 'open' | 'closed', received 'brr'");
		expect(() => Path.from([])).toThrowError("Array must contain at least 1 element(s)");
		expect(() => Path.from(["brrr" as any])).toThrowError("Expected 'LIKE (x,y)', received 'brrr'");
		expect(() => Path.from(Point.from("(1,2)"), "brrr" as any)).toThrowError("Expected 'LIKE (x,y)', received 'brrr'");
	});

	test("isPath(...)", () => {
		const path = Path.from({
			points: [Point.from({ x: 1, y: 2 }), Point.from({ x: 3, y: 4 })],
			connection: "open",
		});
		expect(Path.isPath(path)).toBe(true);
		expect(
			Path.isPath({
				points: [Point.from({ x: 1, y: 2 }), Point.from({ x: 3, y: 4 })],
				connection: "open",
			})
		).toBe(false);
	});
});

describe("Path", () => {
	test("_equals(...)", () => {
		const path = Path.from({
			points: [Point.from({ x: 1, y: 2 }), Point.from({ x: 3, y: 4 })],
			connection: "open",
		});

		expect(
			path.equals(
				Path.from({
					points: [Point.from({ x: 1, y: 2 }), Point.from({ x: 3, y: 4 })],
					connection: "open",
				})
			)
		).toBe(true);
		expect(
			path.equals(
				Path.from({
					points: [Point.from({ x: 1, y: 2 }), Point.from({ x: 5, y: 6 })],
					connection: "open",
				})
			)
		).toBe(false);
		expect(
			path.equals(
				Path.from({
					points: [Point.from({ x: 1, y: 2 }), Point.from({ x: 3, y: 4 })],
					connection: "open",
				}).toJSON()
			)
		).toBe(true);
		expect(
			path.equals(
				Path.from({
					points: [Point.from({ x: 1, y: 2 }), Point.from({ x: 5, y: 6 })],
					connection: "open",
				}).toJSON()
			)
		).toBe(false);
		expect(
			path.equals(
				Path.from({
					points: [Point.from({ x: 1, y: 2 }), Point.from({ x: 3, y: 4 })],
					connection: "open",
				}).toString()
			)
		).toBe(true);
		expect(
			path.equals(
				Path.from({
					points: [Point.from({ x: 1, y: 2 }), Point.from({ x: 5, y: 6 })],
					connection: "open",
				}).toString()
			)
		).toBe(false);
		//@ts-expect-error - this is a test
		expect(() => path.equals(BigInt(1))).toThrowError("Expected 'string' | 'object' | 'array', received 'bigint'");
	});

	test("toString()", () => {
		expect(
			Path.from({
				points: [Point.from({ x: 1, y: 2 }), Point.from({ x: 3, y: 4 })],
				connection: "closed",
			}).toString()
		).toBe("((1,2),(3,4))");
		expect(
			Path.from({
				points: [Point.from({ x: 1, y: 2 }), Point.from({ x: 3, y: 4 })],
				connection: "open",
			}).toString()
		).toBe("[(1,2),(3,4)]");
	});

	test("toJSON()", () => {
		const path = Path.from({
			points: [Point.from({ x: 1, y: 2 }), Point.from({ x: 3, y: 4 })],
			connection: "open",
		});
		expect(path.toJSON()).toEqual({
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
			connection: "open",
		});
	});

	test("get points()", () => {
		const path = Path.from("((1,2),(3,4))");
		expect(path.points).toHaveLength(2);
		expect(path.points[0].toString()).toBe("(1,2)");
		expect(path.points[1].toString()).toBe("(3,4)");
	});

	test("set points(...)", () => {
		const path = Path.from("((1,2),(3,4))");
		expect(() => {
			path.points = BigInt(1) as any;
		}).toThrowError("Expected 'array', received 'bigint'");
		expect(() => {
			path.points = [];
		}).toThrowError("Array must contain at least 1 element(s)");
		expect(() => {
			path.points = [BigInt(1)] as any;
		}).toThrowError("Expected 'number' | 'nan' | 'string' | 'object', received 'bigint'");
		path.points = [Point.from("(5,6)")];
		expect(path.points).toHaveLength(1);
		expect(path.points[0].toString()).toBe("(5,6)");
	});

	test("get connection()", () => {
		const path = Path.from("((1,2),(3,4))");
		expect(path.connection).toBe("closed");
	});

	test("set connection(...)", () => {
		const path = Path.from("((1,2),(3,4))");
		expect(path.connection).toBe("closed");
		expect(() => {
			path.connection = BigInt(1) as any;
		}).toThrowError("Expected 'string', received 'bigint'");
		expect(() => {
			path.connection = "invalid" as any;
		}).toThrowError("Expected 'open' | 'closed', received 'invalid'");
		path.connection = Connection.open;
		expect(path.connection).toBe("open");
		expect(path.toString()).toBe("[(1,2),(3,4)]");
	});

	test("get value()", () => {
		const path = Path.from("[(-2.0,-2.0),(0.0,0.0)]");
		expect(path.value).toBe("[(-2,-2),(0,0)]");
	});

	test("set value(...)", () => {
		const path = Path.from("[(-2.0,-2.0),(0.0,0.0)]");
		path.value = "[(1,1),(3,3)]";
		expect(path.value).toBe("[(1,1),(3,3)]");
		expect(() => {
			path.value = true as any;
		}).toThrowError("Expected 'string' | 'object' | 'array', received 'boolean'");
	});

	test("get postgres()", () => {
		const path = Path.from("[(-2.0,-2.0),(0.0,0.0)]");
		expect(path.postgres).toBe("[(-2,-2),(0,0)]");
	});

	test("set postgres(...)", () => {
		const path = Path.from("[(-2.0,-2.0),(0.0,0.0)]");
		path.postgres = "[(1,1),(3,3)]";
		expect(path.postgres).toBe("[(1,1),(3,3)]");
		expect(() => {
			path.postgres = true as any;
		}).toThrowError("Expected 'string' | 'object' | 'array', received 'boolean'");
	});
});

describe("PostgreSQL", () => {
	it("should work with PostgreSQL's own tests", () => {
		//* https://github.com/postgres/postgres/blob/master/src/test/regress/sql/path.sql
		expect(() => Path.from("[(1,2),(3,4)]")).not.toThrowError();
		expect(() => Path.from(" ( ( 1 , 2 ) , ( 3 , 4 ) ) ")).not.toThrowError();
		expect(() => Path.from("[ (0,0),(3,0),(4,5),(1,6) ]")).not.toThrowError();
		expect(() => Path.from("((1,2) ,(3,4 ))")).not.toThrowError();
		expect(() => Path.from("((10,20))")).not.toThrowError(); // Only one point

		// bad values for parser testing
		expect(() => Path.from("[]")).toThrowError();
		expect(() => Path.from("[(,2),(3,4)]")).toThrowError();
		expect(() => Path.from("[(1,2),(3,4)")).toThrowError();
		expect(() => Path.from("(1,2,3,4")).toThrowError();
		expect(() => Path.from("(1,2),(3,4)]")).toThrowError();

		// test non-error-throwing API for some core types
		expect(() => Path.from("[(1,2),(3)]")).toThrowError();
		expect(() => Path.from("[(1,2),(3)]")).toThrowError();
		expect(() => Path.from("[(1,2,6),(3,4,6)]")).toThrowError();
		expect(() => Path.from("[(1,2,6),(3,4,6)]")).toThrowError();
	});

	it("should be returned from PostgreSQL", async () => {
		const client = new Client({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			application_name: "path.test.ts",
		});

		await client.connect();

		let error = null;
		try {
			await client.query(`
				CREATE TABLE public.vitestpath (
					path path NULL,
					_path _path NULL
				)
			`);

			const [singleInput, arrayInput] = [
				serializer<Path>(Path)(Path.from("((1.1,2.2),(3.3,4.4))")),
				arraySerializer<Path>(Path)([Path.from("((1,2),(3,4))"), Path.from("[(5.5,6.6),(7.7,8.8)]")]),
			];

			expect(singleInput).toStrictEqual("((1.1,2.2),(3.3,4.4))");
			expect(arrayInput).toStrictEqual('{"((1\\,2)\\,(3\\,4))","[(5.5\\,6.6)\\,(7.7\\,8.8)]"}');

			await client.query(
				`
				INSERT INTO public.vitestpath (path, _path)
				VALUES (
					$1::path,
					$2::_path
				)
			`,
				[singleInput, arrayInput]
			);

			const result = await client.query(`
				SELECT * FROM public.vitestpath
			`);

			result.rows[0].path = parser<Path>(Path)(result.rows[0].path);
			result.rows[0]._path = arrayParser<Path>(Path)(result.rows[0]._path);

			expect(result.rows[0].path.toString()).toStrictEqual(
				Path.from({
					points: [Point.from({ x: 1.1, y: 2.2 }), Point.from({ x: 3.3, y: 4.4 })],
					connection: "closed",
				}).toString()
			);
			expect(result.rows[0]._path).toHaveLength(2);
			expect(result.rows[0]._path[0].toString()).toStrictEqual(
				Path.from({
					points: [Point.from({ x: 1, y: 2 }), Point.from({ x: 3, y: 4 })],
					connection: "closed",
				}).toString()
			);
			expect(result.rows[0]._path[1].toString()).toStrictEqual(
				Path.from({
					points: [Point.from({ x: 5.5, y: 6.6 }), Point.from({ x: 7.7, y: 8.8 })],
					connection: "open",
				}).toString()
			);
		} catch (error_) {
			error = error_;
			// eslint-disable-next-line no-console
			console.error(error);
		}

		await client.query(`
			DROP TABLE public.vitestpath
		`);

		await client.end();

		if (error) throw error;
	});
});
