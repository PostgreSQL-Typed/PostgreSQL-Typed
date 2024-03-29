import { Client } from "pg";
import { describe, expect, it, test } from "vitest";

import { arrayParser } from "../../util/arrayParser.js";
import { arraySerializer } from "../../util/arraySerializer.js";
import { parser } from "../../util/parser.js";
import { LowerRange, UpperRange } from "../../util/Range.js";
import { serializer } from "../../util/serializer.js";
import { Int8 } from "./Int8.js";
import { Int8Range } from "./Int8Range.js";

describe("Int8RangeConstructor", () => {
	test("_parse(...)", () => {
		const int8Range = Int8Range.from("[1,3)");
		expect(int8Range).not.toBeNull();

		expect(() => {
			Int8Range.from("1");
		}).toThrowError("Expected '[' | '(', received '1'");

		const int8RangeFromObject = Int8Range.from({
			lower: LowerRange.include,
			upper: UpperRange.exclude,
			values: [Int8.from(1), Int8.from(3)],
		});
		expect(int8RangeFromObject).not.toBeNull();

		expect(() => {
			Int8Range.from({
				lower: LowerRange.include,
				upper: UpperRange.exclude,
				values: [] as any,
			});
		}).toThrowError("rray must contain exactly 2 element(s)");

		expect(() => {
			Int8Range.from({
				lower: LowerRange.include,
				upper: UpperRange.exclude,
				values: [Int8.from(1), Int8.from(3), Int8.from(5)] as any,
			});
		}).toThrowError("Array must contain exactly 2 element(s)");

		expect(() => {
			Int8Range.from({
				lower: "heya",
				upper: UpperRange.exclude,
				values: [Int8.from(1), Int8.from(3)],
			} as any);
		}).toThrowError("Expected '[' | '(', received 'heya'");

		const int8RangeFromObject2 = Int8Range.from({
			lower: LowerRange.include,
			upper: UpperRange.exclude,
			values: [{ value: "1" }, { value: "3" }],
		});
		expect(int8RangeFromObject2).not.toBeNull();

		expect(() => {
			Int8Range.from({} as any);
		}).toThrowError("Missing keys in object: 'lower', 'upper', 'values'");

		const int8RangeFromArgumentArrary = Int8Range.from(Int8.from({ value: "1" }), Int8.from({ value: "3" }));
		expect(int8RangeFromArgumentArrary).not.toBeNull();

		expect(() => {
			Int8Range.from(Int8.from({ value: "1" }), "int8" as any);
		}).toThrowError("Expected 'bigint', received 'string'");

		const int8RangeFromArray = Int8Range.from([Int8.from({ value: "1" }), Int8.from({ value: "3" })]);
		expect(int8RangeFromArray).not.toBeNull();

		expect(() => {
			Int8Range.from([] as any);
		}).toThrowError("Array must contain exactly 2 element(s)");

		expect(() => {
			Int8Range.from([Int8.from("1"), Int8.from("1"), Int8.from("1")] as any);
		}).toThrowError("Array must contain exactly 2 element(s)");

		const int8RangeFromRange = Int8Range.from(Int8Range.from("[1,3)"));
		expect(int8RangeFromRange).not.toBeNull();
	});

	test("isRange(...)", () => {
		const int8Range = Int8Range.from("[1,3)");
		expect(Int8Range.isRange(int8Range)).toBe(true);
		expect(
			Int8Range.isRange({
				lower: LowerRange.include,
				upper: UpperRange.exclude,
				values: [Int8.from({ value: "1" }), Int8.from({ value: "3" })],
			})
		).toBe(false);
	});
});

describe("Int8Range", () => {
	test("_equals(...)", () => {
		const int8Range = Int8Range.from("[1,3)");
		expect(int8Range.equals(Int8Range.from("[1,3)"))).toBe(true);
		expect(int8Range.equals(Int8Range.from("[1,3]"))).toBe(false);
		expect(int8Range.equals(Int8Range.from("[1,3)").toString())).toBe(true);
		expect(int8Range.equals(Int8Range.from("[1,3]").toString())).toBe(false);
		expect(int8Range.equals(Int8Range.from("[1,3)").toJSON())).toBe(true);
		expect(int8Range.equals(Int8Range.from("[1,3]").toJSON())).toBe(false);
	});

	test("_isWithinRange(...)", () => {
		const int8Range1 = Int8Range.from("[1,6)");
		expect(int8Range1.isWithinRange(Int8.from("1"))).toBe(true);
		expect(int8Range1.isWithinRange(Int8.from("2"))).toBe(true);
		expect(int8Range1.isWithinRange(Int8.from("5"))).toBe(true);
		expect(int8Range1.isWithinRange(Int8.from("6"))).toBe(false);

		const int8Range2 = Int8Range.from("(1,6]");
		expect(int8Range2.isWithinRange(Int8.from("1"))).toBe(false);
		expect(int8Range2.isWithinRange(Int8.from("2"))).toBe(true);
		expect(int8Range2.isWithinRange(Int8.from("5"))).toBe(true);
		expect(int8Range2.isWithinRange(Int8.from("6"))).toBe(true);

		const int8Range3 = Int8Range.from("empty");
		expect(int8Range3.isWithinRange(Int8.from("1"))).toBe(false);
		expect(int8Range3.isWithinRange(Int8.from("2"))).toBe(false);
		expect(int8Range3.isWithinRange(Int8.from("5"))).toBe(false);
		expect(int8Range3.isWithinRange(Int8.from("6"))).toBe(false);

		const int8Range4 = Int8Range.from("[1,6]");
		expect(int8Range4.isWithinRange(Int8.from("1"))).toBe(true);
		expect(int8Range4.isWithinRange(Int8.from("2"))).toBe(true);
		expect(int8Range4.isWithinRange(Int8.from("5"))).toBe(true);
		expect(int8Range4.isWithinRange(Int8.from("6"))).toBe(true);

		const int8Range5 = Int8Range.from("(1,6)");
		expect(int8Range5.isWithinRange(Int8.from("1"))).toBe(false);
		expect(int8Range5.isWithinRange(Int8.from("2"))).toBe(true);
		expect(int8Range5.isWithinRange(Int8.from("5"))).toBe(true);
		expect(int8Range5.isWithinRange(Int8.from("6"))).toBe(false);
	});

	test("toString()", () => {
		const int8Range1 = Int8Range.from("[1,3)");
		expect(int8Range1.toString()).toBe("[1,3)");

		const int8Range2 = Int8Range.from("[1,3]");
		expect(int8Range2.toString()).toBe("[1,3]");

		const int8Range3 = Int8Range.from("(1,3)");
		expect(int8Range3.toString()).toBe("(1,3)");

		const int8Range4 = Int8Range.from("(1,3]");
		expect(int8Range4.toString()).toBe("(1,3]");
	});

	test("toJSON()", () => {
		const int8Range1 = Int8Range.from("[1,3)");
		expect(int8Range1.toJSON()).toStrictEqual({
			lower: LowerRange.include,
			upper: UpperRange.exclude,
			values: [{ value: "1" }, { value: "3" }],
		});

		const int8Range2 = Int8Range.from("[1,3]");
		expect(int8Range2.toJSON()).toStrictEqual({
			lower: LowerRange.include,
			upper: UpperRange.include,
			values: [{ value: "1" }, { value: "3" }],
		});

		const int8Range3 = Int8Range.from("(1,3)");
		expect(int8Range3.toJSON()).toStrictEqual({
			lower: LowerRange.exclude,
			upper: UpperRange.exclude,
			values: [{ value: "1" }, { value: "3" }],
		});

		const int8Range4 = Int8Range.from("(1,3]");
		expect(int8Range4.toJSON()).toStrictEqual({
			lower: LowerRange.exclude,
			upper: UpperRange.include,
			values: [{ value: "1" }, { value: "3" }],
		});
	});

	test("get lower()", () => {
		const int8Range = Int8Range.from("[1,3)");
		expect(int8Range.lower).toBe("[");
	});

	test("set lower(...)", () => {
		const int8Range = Int8Range.from("[1,3)");
		int8Range.lower = LowerRange.exclude;
		expect(int8Range.lower).toBe("(");
	});

	test("get upper()", () => {
		const int8Range = Int8Range.from("[1,3)");
		expect(int8Range.upper).toBe(")");
	});

	test("set upper(...)", () => {
		const int8Range = Int8Range.from("[1,3)");
		int8Range.upper = UpperRange.include;
		expect(int8Range.upper).toBe("]");
	});

	test("get values()", () => {
		const int8Range = Int8Range.from("[1,3)");
		expect(int8Range.values).toHaveLength(2);
		expect(int8Range.values?.[0].equals(Int8.from(1))).toBe(true);
		expect(int8Range.values?.[1].equals(Int8.from(3))).toBe(true);
	});

	test("set values(...)", () => {
		const int8Range = Int8Range.from("[1,3)");
		int8Range.values = [Int8.from(2), Int8.from(6)];
		expect(int8Range.values).toHaveLength(2);
		expect(int8Range.values?.[0].equals(Int8.from(2))).toBe(true);
		expect(int8Range.values?.[1].equals(Int8.from(6))).toBe(true);
	});

	test("get empty()", () => {
		const int8Range1 = Int8Range.from("[1,3)");
		expect(int8Range1.empty).toBe(false);
		const int8Range2 = Int8Range.from("[1,1)");
		expect(int8Range2.empty).toBe(true);
		const int8Range3 = Int8Range.from("(1,1]");
		expect(int8Range3.empty).toBe(true);
		const int8Range4 = Int8Range.from("empty");
		expect(int8Range4.empty).toBe(true);
	});

	test("get value()", () => {
		const int8Range1 = Int8Range.from("[1,3)");
		expect(int8Range1.value).toBe("[1,3)");
		const int8Range2 = Int8Range.from("[1,1)");
		expect(int8Range2.value).toBe("empty");
		const int8Range3 = Int8Range.from("(1,1]");
		expect(int8Range3.value).toBe("empty");
		const int8Range4 = Int8Range.from("empty");
		expect(int8Range4.value).toBe("empty");
	});

	test("set value(...)", () => {
		const int8Range = Int8Range.from("[1,3)");
		int8Range.value = "(1,3]";
		expect(int8Range.value).toBe("(1,3]");
	});
});

describe("PostgreSQL", () => {
	it("should be returned from PostgreSQL", async () => {
		const client = new Client({
			application_name: "int8range.test.ts",
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
				CREATE TABLE public.vitestint8range (
					int8range int8range NULL,
					_int8range _int8range NULL
				)
			`);

			const [singleInput, arrayInput] = [
				serializer<Int8Range>(Int8Range)(Int8Range.from("[1,3)")),
				arraySerializer<Int8Range>(Int8Range)([Int8Range.from("[1,3)"), Int8Range.from("(5,7]")]),
			];

			expect(singleInput).toStrictEqual("[1,3)");
			expect(arrayInput).toStrictEqual('{"[1\\,3)","(5\\,7]"}');

			await client.query(
				`
				INSERT INTO public.vitestint8range (int8range, _int8range)
				VALUES (
					$1::int8range,
					$2::_int8range
				)
			`,
				[singleInput, arrayInput]
			);

			const result = await client.query(`
				SELECT * FROM public.vitestint8range
			`);

			result.rows[0].int8range = parser<Int8Range>(Int8Range)(result.rows[0].int8range);
			result.rows[0]._int8range = arrayParser<Int8Range>(Int8Range)(result.rows[0]._int8range);

			expect(result.rows[0].int8range.toString()).toStrictEqual(Int8Range.from("[1,3)").toString());
			expect(result.rows[0]._int8range).toHaveLength(2);
			expect(result.rows[0]._int8range[0].toString()).toStrictEqual(Int8Range.from("[1,3)").toString());
			expect(result.rows[0]._int8range[1].toString()).toStrictEqual(Int8Range.from("[6,8)").toString());
		} catch (error_) {
			error = error_;
			// eslint-disable-next-line no-console
			console.error(error);
		}

		await client.query(`
			DROP TABLE public.vitestint8range
		`);

		await client.end();

		if (error) throw error;
	});
});
