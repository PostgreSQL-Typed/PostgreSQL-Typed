import { Client } from "pg";
import { describe, expect, it, test } from "vitest";

import { LowerRange, UpperRange } from "../../util/Range";
import { Int4MultiRange } from "./Int4MultiRange";
import { Int4Range } from "./Int4Range";

describe("Int4MultiRangeConstructor", () => {
	test("_parse(...)", () => {
		const int4MultiRange = Int4MultiRange.from("{[1,3),[11,13),[21,23)}");
		expect(int4MultiRange).not.toBeNull();

		expect(() => {
			Int4MultiRange.from("{[1,3),[11,13),[21,23)");
		}).toThrowError("Expected '}', received ')'");

		const int4MultiRangeFromObject = Int4MultiRange.from({
			ranges: [Int4Range.from("[1,3)"), Int4Range.from("[11,13)"), Int4Range.from("[21,23)")],
		});
		expect(int4MultiRangeFromObject).not.toBeNull();

		expect(() => {
			Int4MultiRange.from({} as any);
		}).toThrowError("Missing key in object: 'ranges'");

		const int4MultiRangeFromObject2 = Int4MultiRange.from({
			ranges: [
				{
					lower: LowerRange.include,
					upper: UpperRange.exclude,
					value: [{ int4: 1 }, { int4: 3 }],
				},
				{
					lower: "(",
					upper: "]",
					value: [{ int4: 11 }, { int4: 13 }],
				},
				{
					lower: LowerRange.include,
					upper: "]",
					value: [{ int4: 21 }, { int4: 23 }],
				},
			],
		});
		expect(int4MultiRangeFromObject2).not.toBeNull();

		expect(() => {
			Int4MultiRange.from({
				ranges: ["range1", "range2"],
			} as any);
		}).toThrowError("Expected '[' | '(', received 'r'");

		const int4MultiRangeFromArray = Int4MultiRange.from([Int4Range.from("[1,3)"), Int4Range.from("[11,13)"), Int4Range.from("[21,23)")]);
		expect(int4MultiRangeFromArray).not.toBeNull();

		expect(() => {
			Int4MultiRange.from(["range1", "range2"] as any);
		}).toThrowError("Expected '[' | '(', received 'r'");

		const int4MultiRangeFromArgsArray = Int4MultiRange.from(Int4Range.from("[1,3)"), Int4Range.from("[11,13)"), Int4Range.from("[21,23)"));
		expect(int4MultiRangeFromArgsArray).not.toBeNull();

		expect(() => {
			Int4MultiRange.from(Int4Range.from("[1,3)"), "range2" as any);
		}).toThrowError("Expected '[' | '(', received 'r'");
	});

	test("isMultiRange(...)", () => {
		const int4MultiRange = Int4MultiRange.from(Int4Range.from("[1,3)"), Int4Range.from("[11,13)"), Int4Range.from("[21,23)"));
		expect(Int4MultiRange.isMultiRange(int4MultiRange)).toBe(true);
		expect(
			Int4MultiRange.isMultiRange({
				ranges: [Int4Range.from("[1,3)"), Int4Range.from("[11,13)"), Int4Range.from("[21,23)")],
			})
		).toBe(false);
	});
});

describe("Int4MultiRange", () => {
	test("_equals(...)", () => {
		const int4MultiRange = Int4MultiRange.from(Int4Range.from("[1,3)"), Int4Range.from("[11,13)"), Int4Range.from("[21,23)"));

		expect(int4MultiRange.equals(Int4MultiRange.from("{[1,3),[11,13),[21,23)}"))).toBe(true);
		expect(int4MultiRange.equals(Int4MultiRange.from("{[1,3),[11,99),[21,23)}"))).toBe(false);
		expect(int4MultiRange.equals(Int4MultiRange.from("{[1,3),[11,13),[21,23)}").toJSON())).toBe(true);
		expect(int4MultiRange.equals(Int4MultiRange.from("{[1,3),[11,99),[21,23)}").toJSON())).toBe(false);
		expect(int4MultiRange.equals(Int4MultiRange.from("{[1,3),[11,13),[21,23)}").toString())).toBe(true);
		expect(int4MultiRange.equals(Int4MultiRange.from("{[1,3),[11,99),[21,23)}").toString())).toBe(false);
		expect(int4MultiRange.equals([Int4Range.from("[1,3)"), Int4Range.from("[11,13)"), Int4Range.from("[21,23)")])).toBe(true);
		expect(int4MultiRange.equals([Int4Range.from("[1,3)"), Int4Range.from("[11,99)"), Int4Range.from("[21,23)")])).toBe(false);
	});

	test("toString()", () => {
		const int4MultiRange = Int4MultiRange.from(Int4Range.from("[1,3)"), Int4Range.from("[11,13)"), Int4Range.from("[21,23)"));
		expect(int4MultiRange.toString()).toBe("{[1,3),[11,13),[21,23)}");
	});

	test("toJSON()", () => {
		const int4MultiRange = Int4MultiRange.from(Int4Range.from("[1,3)"), Int4Range.from("[11,13)"), Int4Range.from("[21,23)"));
		expect(int4MultiRange.toJSON()).toEqual({
			ranges: [
				{
					lower: "[",
					upper: ")",
					value: [{ int4: 1 }, { int4: 3 }],
				},
				{
					lower: "[",
					upper: ")",
					value: [{ int4: 11 }, { int4: 13 }],
				},
				{
					lower: "[",
					upper: ")",
					value: [{ int4: 21 }, { int4: 23 }],
				},
			],
		});
	});

	test("get ranges()", () => {
		const int4MultiRange = Int4MultiRange.from(Int4Range.from("[1,3)"), Int4Range.from("[11,13)"), Int4Range.from("[21,23)"));
		expect(int4MultiRange.ranges).toHaveLength(3);
		expect(int4MultiRange.ranges[0].equals(Int4Range.from("[1,3)"))).toBe(true);
		expect(int4MultiRange.ranges[1].equals(Int4Range.from("[11,13)"))).toBe(true);
		expect(int4MultiRange.ranges[2].equals(Int4Range.from("[21,23)"))).toBe(true);
	});

	test("set ranges(...)", () => {
		const int4MultiRange = Int4MultiRange.from(Int4Range.from("[1,3)"), Int4Range.from("[11,13)"), Int4Range.from("[21,23)"));
		int4MultiRange.ranges = [Int4Range.from("[1,3)"), Int4Range.from("[11,15)"), Int4Range.from("[21,23)")];
		expect(int4MultiRange.ranges).toHaveLength(3);
		expect(int4MultiRange.ranges[0].equals(Int4Range.from("[1,3)"))).toBe(true);
		expect(int4MultiRange.ranges[1].equals(Int4Range.from("[11,15)"))).toBe(true);
		expect(int4MultiRange.ranges[2].equals(Int4Range.from("[21,23)"))).toBe(true);
	});
});

describe("PostgreSQL", () => {
	it("should work with PostgreSQL's own tests", () => {
		//* https://github.com/postgres/postgres/blob/master/src/test/regress/sql/multirangetypes.sql#L61
		expect(() => Int4MultiRange.from("{[1,2],[4,5]}")).not.toThrowError();
		expect(() => Int4MultiRange.from("{[1,2],[4,5]")).toThrowError();
		expect(() => Int4MultiRange.from("{[1,2],[4,5]")).toThrowError();
		expect(() => Int4MultiRange.from("{[1,2],[4,zed]}")).toThrowError();
		expect(() => Int4MultiRange.from("{[1,2],[4,zed]}")).toThrowError();
	});

	it("should be returned from PostgreSQL", async () => {
		const client = new Client({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			application_name: "int4multirange.test.ts",
		});

		await client.connect();

		let error = null;
		try {
			await client.query(`
				CREATE TABLE public.jestint4multirange (
					int4multirange int4multirange NULL,
					_int4multirange _int4multirange NULL
				)
			`);

			await client.query(`
				INSERT INTO public.jestint4multirange (int4multirange, _int4multirange)
				VALUES (
					'{[1,3),[11,13),[21,23)}',
					'{\\{[1\\,3)\\,[11\\,13)\\},\\{[21\\,23)\\,[31\\,33)\\}}'
				)
			`);

			const result = await client.query(`
				SELECT * FROM public.jestint4multirange
			`);

			expect(result.rows[0].int4multirange.toString()).toStrictEqual(Int4MultiRange.from("{[1,3),[11,13),[21,23)}").toString());
			expect(result.rows[0]._int4multirange).toHaveLength(2);
			expect(result.rows[0]._int4multirange[0].toString()).toStrictEqual(Int4MultiRange.from("{[1,3),[11,13)}").toString());
			expect(result.rows[0]._int4multirange[1].toString()).toStrictEqual(Int4MultiRange.from("{[21,23),[31,33)}").toString());
		} catch (err) {
			error = err;
		}

		await client.query(`
			DROP TABLE public.jestint4multirange
		`);

		await client.end();

		if (error) throw error;
	});
});
