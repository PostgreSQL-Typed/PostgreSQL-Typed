import { Client } from "pg";
import { describe, expect, it, test } from "vitest";

import { arrayParser } from "../../util/arrayParser.js";
import { arraySerializer } from "../../util/arraySerializer.js";
import { parser } from "../../util/parser.js";
import { LowerRange, UpperRange } from "../../util/Range.js";
import { serializer } from "../../util/serializer.js";
import { Int8MultiRange } from "./Int8MultiRange.js";
import { Int8Range } from "./Int8Range.js";

describe("Int8MultiRangeConstructor", () => {
	test("_parse(...)", () => {
		const int8MultiRange = Int8MultiRange.from("{[1,3),[11,13),[21,23)}");
		expect(int8MultiRange).not.toBeNull();

		expect(() => {
			Int8MultiRange.from("{[1,3),[11,13),[21,23)");
		}).toThrowError("Expected '}', received ')'");

		const int8MultiRangeFromObject = Int8MultiRange.from({
			ranges: [Int8Range.from("[1,3)"), Int8Range.from("[11,13)"), Int8Range.from("[21,23)")],
		});
		expect(int8MultiRangeFromObject).not.toBeNull();

		expect(() => {
			Int8MultiRange.from({} as any);
		}).toThrowError("Missing key in object: 'ranges'");

		const int8MultiRangeFromObject2 = Int8MultiRange.from({
			ranges: [
				{
					lower: LowerRange.include,
					upper: UpperRange.exclude,
					values: [{ value: "1" }, { value: "3" }],
				},
				{
					lower: "(",
					upper: "]",
					values: [{ value: "11" }, { value: "13" }],
				},
				{
					lower: LowerRange.include,
					upper: "]",
					values: [{ value: "21" }, { value: "23" }],
				},
			],
		});
		expect(int8MultiRangeFromObject2).not.toBeNull();

		expect(() => {
			Int8MultiRange.from({
				ranges: ["range1", "range2"],
			} as any);
		}).toThrowError("Expected '[' | '(', received 'r'");

		const int8MultiRangeFromArray = Int8MultiRange.from([Int8Range.from("[1,3)"), Int8Range.from("[11,13)"), Int8Range.from("[21,23)")]);
		expect(int8MultiRangeFromArray).not.toBeNull();

		expect(() => {
			Int8MultiRange.from(["range1", "range2"] as any);
		}).toThrowError("Expected '[' | '(', received 'r'");

		const int8MultiRangeFromArgumentsArray = Int8MultiRange.from(Int8Range.from("[1,3)"), Int8Range.from("[11,13)"), Int8Range.from("[21,23)"));
		expect(int8MultiRangeFromArgumentsArray).not.toBeNull();

		expect(() => {
			Int8MultiRange.from(Int8Range.from("[1,3)"), "range2" as any);
		}).toThrowError("Expected '[' | '(', received 'r'");
	});

	test("isMultiRange(...)", () => {
		const int8MultiRange = Int8MultiRange.from(Int8Range.from("[1,3)"), Int8Range.from("[11,13)"), Int8Range.from("[21,23)"));
		expect(Int8MultiRange.isMultiRange(int8MultiRange)).toBe(true);
		expect(
			Int8MultiRange.isMultiRange({
				ranges: [Int8Range.from("[1,3)"), Int8Range.from("[11,13)"), Int8Range.from("[21,23)")],
			})
		).toBe(false);
	});
});

describe("Int8MultiRange", () => {
	test("_equals(...)", () => {
		const int8MultiRange = Int8MultiRange.from(Int8Range.from("[1,3)"), Int8Range.from("[11,13)"), Int8Range.from("[21,23)"));

		expect(int8MultiRange.equals(Int8MultiRange.from("{[1,3),[11,13),[21,23)}"))).toBe(true);
		expect(int8MultiRange.equals(Int8MultiRange.from("{[1,3),[11,99),[21,23)}"))).toBe(false);
		expect(int8MultiRange.equals(Int8MultiRange.from("{[1,3),[11,13),[21,23)}").toJSON())).toBe(true);
		expect(int8MultiRange.equals(Int8MultiRange.from("{[1,3),[11,99),[21,23)}").toJSON())).toBe(false);
		expect(int8MultiRange.equals(Int8MultiRange.from("{[1,3),[11,13),[21,23)}").toString())).toBe(true);
		expect(int8MultiRange.equals(Int8MultiRange.from("{[1,3),[11,99),[21,23)}").toString())).toBe(false);
		expect(int8MultiRange.equals([Int8Range.from("[1,3)"), Int8Range.from("[11,13)"), Int8Range.from("[21,23)")])).toBe(true);
		expect(int8MultiRange.equals([Int8Range.from("[1,3)"), Int8Range.from("[11,99)"), Int8Range.from("[21,23)")])).toBe(false);
	});

	test("toString()", () => {
		const int8MultiRange = Int8MultiRange.from(Int8Range.from("[1,3)"), Int8Range.from("[11,13)"), Int8Range.from("[21,23)"));
		expect(int8MultiRange.toString()).toBe("{[1,3),[11,13),[21,23)}");
	});

	test("toJSON()", () => {
		const int8MultiRange = Int8MultiRange.from(Int8Range.from("[1,3)"), Int8Range.from("[11,13)"), Int8Range.from("[21,23)"));
		expect(int8MultiRange.toJSON()).toEqual({
			ranges: [
				{
					lower: "[",
					upper: ")",
					values: [{ value: "1" }, { value: "3" }],
				},
				{
					lower: "[",
					upper: ")",
					values: [{ value: "11" }, { value: "13" }],
				},
				{
					lower: "[",
					upper: ")",
					values: [{ value: "21" }, { value: "23" }],
				},
			],
		});
	});

	test("get ranges()", () => {
		const int8MultiRange = Int8MultiRange.from(Int8Range.from("[1,3)"), Int8Range.from("[11,13)"), Int8Range.from("[21,23)"));
		expect(int8MultiRange.ranges).toHaveLength(3);
		expect(int8MultiRange.ranges[0].equals(Int8Range.from("[1,3)"))).toBe(true);
		expect(int8MultiRange.ranges[1].equals(Int8Range.from("[11,13)"))).toBe(true);
		expect(int8MultiRange.ranges[2].equals(Int8Range.from("[21,23)"))).toBe(true);
	});

	test("set ranges(...)", () => {
		const int8MultiRange = Int8MultiRange.from(Int8Range.from("[1,3)"), Int8Range.from("[11,13)"), Int8Range.from("[21,23)"));
		int8MultiRange.ranges = [Int8Range.from("[1,3)"), Int8Range.from("[11,15)"), Int8Range.from("[21,23)")];
		expect(int8MultiRange.ranges).toHaveLength(3);
		expect(int8MultiRange.ranges[0].equals(Int8Range.from("[1,3)"))).toBe(true);
		expect(int8MultiRange.ranges[1].equals(Int8Range.from("[11,15)"))).toBe(true);
		expect(int8MultiRange.ranges[2].equals(Int8Range.from("[21,23)"))).toBe(true);
	});

	test("get value()", () => {
		const int8MultiRange = Int8MultiRange.from("{[1,3),[11,13)}");
		expect(int8MultiRange.value).toBe("{[1,3),[11,13)}");
	});

	test("set value(...)", () => {
		const int8MultiRange = Int8MultiRange.from("{[1,3),[11,13)}");
		int8MultiRange.value = "{[3,5),[11,13)}";
		expect(int8MultiRange.value).toBe("{[3,5),[11,13)}");
		expect(() => {
			int8MultiRange.value = true as any;
		}).toThrowError("Expected 'string' | 'object' | 'array', received 'boolean'");
	});
});

describe("PostgreSQL", () => {
	it("should work with PostgreSQL's own tests", () => {
		//* https://github.com/postgres/postgres/blob/master/src/test/regress/sql/multirangetypes.sql#L61
		expect(() => Int8MultiRange.from("{[1,2],[4,5]}")).not.toThrowError();
		expect(() => Int8MultiRange.from("{[1,2],[4,5]")).toThrowError();
		expect(() => Int8MultiRange.from("{[1,2],[4,5]")).toThrowError();
		expect(() => Int8MultiRange.from("{[1,2],[4,zed]}")).toThrowError();
		expect(() => Int8MultiRange.from("{[1,2],[4,zed]}")).toThrowError();
	});

	it("should be returned from PostgreSQL", async () => {
		const client = new Client({
			application_name: "int8multirange.test.ts",
			database: "postgres",
			host: "localhost",
			password: "password",
			port: 5432,
			user: "postgres",
		});

		await client.connect();

		const version = await client.query<{
				version: string;
			}>("SELECT version()"),
			versionNumber = Number(version.rows[0].version.split(" ")[1].split(".")[0]);

		// Multirange types were introduced in PostgreSQL 14
		if (versionNumber < 14) {
			await client.end();
			return;
		}

		let error = null;
		try {
			await client.query(`
				CREATE TABLE public.vitestint8multirange (
					int8multirange int8multirange NULL,
					_int8multirange _int8multirange NULL
				)
			`);

			const [singleInput, arrayInput] = [
				serializer<Int8MultiRange>(Int8MultiRange)("{[1,3),[11,13),[21,23)}"),
				arraySerializer<Int8MultiRange>(Int8MultiRange)([Int8MultiRange.from("{[1,3),[11,13)}"), Int8MultiRange.from("{[21,23),[31,33)}")]),
			];

			expect(singleInput).toBe("{[1,3),[11,13),[21,23)}");
			expect(arrayInput).toBe('{"\\{[1\\,3)\\,[11\\,13)\\}","\\{[21\\,23)\\,[31\\,33)\\}"}');

			await client.query(
				`
				INSERT INTO public.vitestint8multirange (int8multirange, _int8multirange)
				VALUES (
					$1::int8multirange,
					$2::_int8multirange
				)
			`,
				[singleInput, arrayInput]
			);

			const result = await client.query(`
				SELECT * FROM public.vitestint8multirange
			`);

			result.rows[0].int8multirange = parser<Int8MultiRange>(Int8MultiRange)(result.rows[0].int8multirange);
			result.rows[0]._int8multirange = arrayParser<Int8MultiRange>(Int8MultiRange)(result.rows[0]._int8multirange);

			expect(result.rows[0].int8multirange.toString()).toStrictEqual(Int8MultiRange.from("{[1,3),[11,13),[21,23)}").toString());
			expect(result.rows[0]._int8multirange).toHaveLength(2);
			expect(result.rows[0]._int8multirange[0].toString()).toStrictEqual(Int8MultiRange.from("{[1,3),[11,13)}").toString());
			expect(result.rows[0]._int8multirange[1].toString()).toStrictEqual(Int8MultiRange.from("{[21,23),[31,33)}").toString());
		} catch (error_) {
			error = error_;
			// eslint-disable-next-line no-console
			console.error(error);
		}

		await client.query(`
			DROP TABLE public.vitestint8multirange
		`);

		await client.end();

		if (error) throw error;
	});
});
