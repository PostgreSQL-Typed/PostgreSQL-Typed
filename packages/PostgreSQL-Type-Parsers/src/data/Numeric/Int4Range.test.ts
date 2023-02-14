import { Client } from "pg";
import { describe, expect, it, test } from "vitest";

import { LowerRange, UpperRange } from "../../util/Range.js";
import { Int4 } from "./Int4.js";
import { Int4Range } from "./Int4Range.js";

describe("Int4RangeConstructor", () => {
	test("_parse(...)", () => {
		const int4Range = Int4Range.from("[1,3)");
		expect(int4Range).not.toBeNull();

		expect(() => {
			Int4Range.from("1");
		}).toThrowError("Expected '[' | '(', received '1'");

		const int4RangeFromObject = Int4Range.from({
			lower: LowerRange.include,
			upper: UpperRange.exclude,
			value: [Int4.from(1), Int4.from(3)],
		});
		expect(int4RangeFromObject).not.toBeNull();

		expect(() => {
			Int4Range.from({
				lower: LowerRange.include,
				upper: UpperRange.exclude,
				value: [] as any,
			});
		}).toThrowError("Array must contain exactly 2 element(s)");

		expect(() => {
			Int4Range.from({
				lower: LowerRange.include,
				upper: UpperRange.exclude,
				value: [Int4.from(1), Int4.from(3), Int4.from(5)] as any,
			});
		}).toThrowError("Array must contain exactly 2 element(s)");

		expect(() => {
			Int4Range.from({
				lower: "heya",
				upper: UpperRange.exclude,
				value: [Int4.from(1), Int4.from(3)],
			} as any);
		}).toThrowError("Expected '[' | '(', received 'heya'");

		const int4RangeFromObject2 = Int4Range.from({
			lower: LowerRange.include,
			upper: UpperRange.exclude,
			value: [{ int4: 1 }, { int4: 3 }],
		});
		expect(int4RangeFromObject2).not.toBeNull();

		expect(() => {
			Int4Range.from({} as any);
		}).toThrowError("Missing keys in object: 'lower', 'upper', 'value'");

		const int4RangeFromArgumentsArray = Int4Range.from(Int4.from({ int4: 1 }), Int4.from({ int4: 3 }));
		expect(int4RangeFromArgumentsArray).not.toBeNull();

		expect(() => {
			Int4Range.from(Int4.from({ int4: 1 }), "int4" as any);
		}).toThrowError("Expected 'number', received 'nan'");

		const int4RangeFromArray = Int4Range.from([Int4.from({ int4: 1 }), Int4.from({ int4: 3 })]);
		expect(int4RangeFromArray).not.toBeNull();

		expect(() => {
			Int4Range.from([] as any);
		}).toThrowError("Array must contain exactly 2 element(s)");

		expect(() => {
			Int4Range.from([Int4.from("1"), Int4.from("1"), Int4.from("1")] as any);
		}).toThrowError("Array must contain exactly 2 element(s)");

		expect(() => {
			Int4Range.from([{ brr: "1" }, "1"] as any);
		}).toThrowError("Unrecognized key in object: 'brr'");

		const int4RangeFromRange = Int4Range.from(Int4Range.from("[1,3)"));
		expect(int4RangeFromRange).not.toBeNull();
	});

	test("isRange(...)", () => {
		const int4Range = Int4Range.from("[1,3)");
		expect(Int4Range.isRange(int4Range)).toBe(true);
		expect(
			Int4Range.isRange({
				lower: LowerRange.include,
				upper: UpperRange.exclude,
				value: [Int4.from({ int4: 1 }), Int4.from({ int4: 3 })],
			})
		).toBe(false);
	});
});

describe("Int4Range", () => {
	test("_equals(...)", () => {
		const int4Range = Int4Range.from("[1,3)");
		expect(int4Range.equals(Int4Range.from("[1,3)"))).toBe(true);
		expect(int4Range.equals(Int4Range.from("[1,3]"))).toBe(false);
		expect(int4Range.equals(Int4Range.from("[1,3)").toString())).toBe(true);
		expect(int4Range.equals(Int4Range.from("[1,3]").toString())).toBe(false);
		expect(int4Range.equals(Int4Range.from("[1,3)").toJSON())).toBe(true);
		expect(int4Range.equals(Int4Range.from("[1,3]").toJSON())).toBe(false);
	});

	test("_isWithinRange(...)", () => {
		const int4Range1 = Int4Range.from("[1,6)");
		expect(int4Range1.isWithinRange(Int4.from("1"))).toBe(true);
		expect(int4Range1.isWithinRange(Int4.from("2"))).toBe(true);
		expect(int4Range1.isWithinRange(Int4.from("5"))).toBe(true);
		expect(int4Range1.isWithinRange(Int4.from("6"))).toBe(false);

		const int4Range2 = Int4Range.from("(1,6]");
		expect(int4Range2.isWithinRange(Int4.from("1"))).toBe(false);
		expect(int4Range2.isWithinRange(Int4.from("2"))).toBe(true);
		expect(int4Range2.isWithinRange(Int4.from("5"))).toBe(true);
		expect(int4Range2.isWithinRange(Int4.from("6"))).toBe(true);

		const int4Range3 = Int4Range.from("empty");
		expect(int4Range3.isWithinRange(Int4.from("1"))).toBe(false);
		expect(int4Range3.isWithinRange(Int4.from("2"))).toBe(false);
		expect(int4Range3.isWithinRange(Int4.from("5"))).toBe(false);
		expect(int4Range3.isWithinRange(Int4.from("6"))).toBe(false);

		const int4Range4 = Int4Range.from("[1,6]");
		expect(int4Range4.isWithinRange(Int4.from("1"))).toBe(true);
		expect(int4Range4.isWithinRange(Int4.from("2"))).toBe(true);
		expect(int4Range4.isWithinRange(Int4.from("5"))).toBe(true);
		expect(int4Range4.isWithinRange(Int4.from("6"))).toBe(true);

		const int4Range5 = Int4Range.from("(1,6)");
		expect(int4Range5.isWithinRange(Int4.from("1"))).toBe(false);
		expect(int4Range5.isWithinRange(Int4.from("2"))).toBe(true);
		expect(int4Range5.isWithinRange(Int4.from("5"))).toBe(true);
		expect(int4Range5.isWithinRange(Int4.from("6"))).toBe(false);
	});

	test("toString()", () => {
		const int4Range1 = Int4Range.from("[1,3)");
		expect(int4Range1.toString()).toBe("[1,3)");

		const int4Range2 = Int4Range.from("[1,3]");
		expect(int4Range2.toString()).toBe("[1,3]");

		const int4Range3 = Int4Range.from("(1,3)");
		expect(int4Range3.toString()).toBe("(1,3)");

		const int4Range4 = Int4Range.from("(1,3]");
		expect(int4Range4.toString()).toBe("(1,3]");
	});

	test("toJSON()", () => {
		const int4Range1 = Int4Range.from("[1,3)");
		expect(int4Range1.toJSON()).toStrictEqual({
			lower: LowerRange.include,
			upper: UpperRange.exclude,
			value: [{ int4: 1 }, { int4: 3 }],
		});

		const int4Range2 = Int4Range.from("[1,3]");
		expect(int4Range2.toJSON()).toStrictEqual({
			lower: LowerRange.include,
			upper: UpperRange.include,
			value: [{ int4: 1 }, { int4: 3 }],
		});

		const int4Range3 = Int4Range.from("(1,3)");
		expect(int4Range3.toJSON()).toStrictEqual({
			lower: LowerRange.exclude,
			upper: UpperRange.exclude,
			value: [{ int4: 1 }, { int4: 3 }],
		});

		const int4Range4 = Int4Range.from("(1,3]");
		expect(int4Range4.toJSON()).toStrictEqual({
			lower: LowerRange.exclude,
			upper: UpperRange.include,
			value: [{ int4: 1 }, { int4: 3 }],
		});
	});

	test("get lower()", () => {
		const int4Range = Int4Range.from("[1,3)");
		expect(int4Range.lower).toBe("[");
	});

	test("set lower(...)", () => {
		const int4Range = Int4Range.from("[1,3)");
		int4Range.lower = LowerRange.exclude;
		expect(int4Range.lower).toBe("(");
	});

	test("get upper()", () => {
		const int4Range = Int4Range.from("[1,3)");
		expect(int4Range.upper).toBe(")");
	});

	test("set upper(...)", () => {
		const int4Range = Int4Range.from("[1,3)");
		int4Range.upper = UpperRange.include;
		expect(int4Range.upper).toBe("]");
	});

	test("get value()", () => {
		const int4Range = Int4Range.from("[1,3)");
		expect(int4Range.value).toHaveLength(2);
		expect(int4Range.value?.[0].equals(Int4.from({ int4: 1 }))).toBe(true);
		expect(int4Range.value?.[1].equals(Int4.from({ int4: 3 }))).toBe(true);
	});

	test("set value(...)", () => {
		const int4Range = Int4Range.from("[1,3)");
		int4Range.value = [Int4.from(2), Int4.from(6)];
		expect(int4Range.value).toHaveLength(2);
		expect(int4Range.value?.[0].equals(Int4.from({ int4: 2 }))).toBe(true);
		expect(int4Range.value?.[1].equals(Int4.from({ int4: 6 }))).toBe(true);
	});

	test("get empty()", () => {
		const int4Range1 = Int4Range.from("[1,3)");
		expect(int4Range1.empty).toBe(false);
		const int4Range2 = Int4Range.from("[1,1)");
		expect(int4Range2.empty).toBe(true);
		const int4Range3 = Int4Range.from("(1,1]");
		expect(int4Range3.empty).toBe(true);
		const int4Range4 = Int4Range.from("empty");
		expect(int4Range4.empty).toBe(true);
	});
});

describe("PostgreSQL", () => {
	it("should work with PostgreSQL's own tests", () => {
		//* https://github.com/postgres/postgres/blob/master/src/test/regress/sql/rangetypes.sql#L43
		expect(() => Int4Range.from("(1,4)")).not.toThrowError();
		expect(() => Int4Range.from("(1,4")).toThrowError();
		expect(() => Int4Range.from("(4,1)")).toThrowError();
		expect(() => Int4Range.from("(4,zed)")).toThrowError();
		expect(() => Int4Range.from("[1,2147483647]")).not.toThrowError();
	});

	it("should be returned from PostgreSQL", async () => {
		const client = new Client({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			application_name: "int4range.test.ts",
		});

		await client.connect();

		let error = null;
		try {
			await client.query(`
				CREATE TABLE public.vitestint4range (
					int4range int4range NULL,
					_int4range _int4range NULL
				)
			`);

			await client.query(`
				INSERT INTO public.vitestint4range (int4range, _int4range)
				VALUES (
					'[1,3)',
					'{[1\\,3),(5\\,7]}'
				)
			`);

			const result = await client.query(`
				SELECT * FROM public.vitestint4range
			`);

			expect(result.rows[0].int4range.toString()).toStrictEqual(Int4Range.from("[1,3)").toString());
			expect(result.rows[0]._int4range).toHaveLength(2);
			expect(result.rows[0]._int4range[0].toString()).toStrictEqual(Int4Range.from("[1,3)").toString());
			expect(result.rows[0]._int4range[1].toString()).toStrictEqual(Int4Range.from("[6,8)").toString());
		} catch (error_) {
			error = error_;
			// eslint-disable-next-line no-console
			console.error(error);
		}

		await client.query(`
			DROP TABLE public.vitestint4range
		`);

		await client.end();

		if (error) throw error;
	});
});
