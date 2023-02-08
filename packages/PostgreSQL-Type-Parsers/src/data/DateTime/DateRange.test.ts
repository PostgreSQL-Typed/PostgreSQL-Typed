import { Client } from "pg";
import { describe, expect, it, test } from "vitest";

import { LowerRange, UpperRange } from "../../util/Range.js";
import { Date } from "./Date.js";
import { DateRange } from "./DateRange.js";

describe("DateRangeConstructor", () => {
	test("_parse(...)", () => {
		const dateRange = DateRange.from("[2022-09-02,2022-10-03)");
		expect(dateRange).not.toBeNull();

		expect(() => {
			DateRange.from("2022-09-02,2022-10-03");
		}).toThrowError("Expected '[' | '(', received '2'");

		const dateRangeFromObject = DateRange.from({
			lower: LowerRange.include,
			upper: UpperRange.exclude,
			value: [Date.from("2022-09-02"), Date.from("2022-10-03")],
		});
		expect(dateRangeFromObject).not.toBeNull();

		expect(() => {
			DateRange.from({
				lower: LowerRange.include,
				upper: UpperRange.exclude,
				value: [] as any,
			});
		}).toThrowError("Array must contain exactly 2 element(s)");

		expect(() => {
			DateRange.from({
				lower: LowerRange.include,
				upper: UpperRange.exclude,
				value: [Date.from("2022-09-02"), Date.from("2022-10-03"), Date.from("2022-11-04")] as any,
			});
		}).toThrowError("Array must contain exactly 2 element(s)");

		expect(() => {
			DateRange.from({
				lower: "heya",
				upper: UpperRange.exclude,
				value: [Date.from("2022-09-02"), Date.from("2022-10-03")],
			} as any);
		}).toThrowError("Expected '[' | '(', received 'heya'");

		const dateRangeFromObject2 = DateRange.from({
			lower: LowerRange.include,
			upper: UpperRange.exclude,
			value: [
				{
					year: 2022,
					month: 9,
					day: 2,
				},
				{
					year: 2022,
					month: 10,
					day: 3,
				},
			],
		});
		expect(dateRangeFromObject2).not.toBeNull();

		expect(() => {
			DateRange.from({} as any);
		}).toThrowError("Missing keys in object: 'lower', 'upper', 'value'");

		const dateRangeFromArgumentsArray = DateRange.from(
			Date.from({
				year: 2022,
				month: 9,
				day: 2,
			}),
			Date.from({
				year: 2022,
				month: 10,
				day: 3,
			})
		);
		expect(dateRangeFromArgumentsArray).not.toBeNull();

		expect(() => {
			DateRange.from(
				Date.from({
					year: 2022,
					month: 9,
					day: 2,
				}),
				BigInt(1) as any
			);
		}).toThrowError("Expected 'number' | 'string' | 'object' | 'globalThis.Date' | 'luxon.DateTime', received 'bigint'");

		const dateRangeFromArray = DateRange.from([
			Date.from({
				year: 2022,
				month: 9,
				day: 2,
			}),
			Date.from({
				year: 2022,
				month: 10,
				day: 3,
			}),
		]);
		expect(dateRangeFromArray).not.toBeNull();

		expect(() => {
			DateRange.from([] as any);
		}).toThrowError("Array must contain exactly 2 element(s)");

		expect(() => {
			DateRange.from([Date.from("2022-09-02"), Date.from("2022-10-03"), Date.from("2022-11-04")] as any);
		}).toThrowError("Array must contain exactly 2 element(s)");

		expect(() => {
			DateRange.from([{ brr: "1" }, "1"] as any);
		}).toThrowError("Unrecognized key in object: 'brr'");

		const dateRangeFromRange = DateRange.from(DateRange.from("[2022-09-02,2022-10-03)"));
		expect(dateRangeFromRange).not.toBeNull();
	});

	test("isRange(...)", () => {
		const dateRange = DateRange.from("[2022-09-02,2022-10-03)");
		expect(DateRange.isRange(dateRange)).toBe(true);
		expect(
			DateRange.isRange({
				lower: LowerRange.include,
				upper: UpperRange.exclude,
				value: [
					Date.from({
						year: 2022,
						month: 9,
						day: 2,
					}),
					Date.from({
						year: 2022,
						month: 10,
						day: 3,
					}),
				],
			})
		).toBe(false);
	});
});

describe("DateRange", () => {
	test("_equals(...)", () => {
		const dateRange = DateRange.from("[2022-09-02,2022-10-03)");
		expect(dateRange.equals(DateRange.from("[2022-09-02,2022-10-03)"))).toBe(true);
		expect(dateRange.equals(DateRange.from("[2022-09-02,2022-11-03)"))).toBe(false);
		expect(dateRange.equals(DateRange.from("[2022-09-02,2022-10-03)").toString())).toBe(true);
		expect(dateRange.equals(DateRange.from("[2022-09-02,2022-11-03)").toString())).toBe(false);
		expect(dateRange.equals(DateRange.from("[2022-09-02,2022-10-03)").toJSON())).toBe(true);
		expect(dateRange.equals(DateRange.from("[2022-09-02,2022-11-03)").toJSON())).toBe(false);
	});

	test("_isWithinRange(...)", () => {
		const dateRange1 = DateRange.from("[2022-09-02,2022-10-03)");
		expect(dateRange1.isWithinRange(Date.from("2022-09-02"))).toBe(true);
		expect(dateRange1.isWithinRange(Date.from("2022-09-03"))).toBe(true);
		expect(dateRange1.isWithinRange(Date.from("2022-10-02"))).toBe(true);
		expect(dateRange1.isWithinRange(Date.from("2022-10-03"))).toBe(false);

		const dateRange2 = DateRange.from("(2022-09-02,2022-10-03]");
		expect(dateRange2.isWithinRange(Date.from("2022-09-02"))).toBe(false);
		expect(dateRange2.isWithinRange(Date.from("2022-09-03"))).toBe(true);
		expect(dateRange2.isWithinRange(Date.from("2022-10-02"))).toBe(true);
		expect(dateRange2.isWithinRange(Date.from("2022-10-03"))).toBe(true);

		const dateRange3 = DateRange.from("empty");
		expect(dateRange3.isWithinRange(Date.from("2022-09-02"))).toBe(false);
		expect(dateRange3.isWithinRange(Date.from("2022-09-03"))).toBe(false);
		expect(dateRange3.isWithinRange(Date.from("2022-10-02"))).toBe(false);
		expect(dateRange3.isWithinRange(Date.from("2022-10-03"))).toBe(false);

		const dateRange4 = DateRange.from("[2022-09-02,2022-10-03]");
		expect(dateRange4.isWithinRange(Date.from("2022-09-02"))).toBe(true);
		expect(dateRange4.isWithinRange(Date.from("2022-09-03"))).toBe(true);
		expect(dateRange4.isWithinRange(Date.from("2022-10-02"))).toBe(true);
		expect(dateRange4.isWithinRange(Date.from("2022-10-03"))).toBe(true);

		const dateRange5 = DateRange.from("(2022-09-02,2022-10-03)");
		expect(dateRange5.isWithinRange(Date.from("2022-09-02"))).toBe(false);
		expect(dateRange5.isWithinRange(Date.from("2022-09-03"))).toBe(true);
		expect(dateRange5.isWithinRange(Date.from("2022-10-02"))).toBe(true);
		expect(dateRange5.isWithinRange(Date.from("2022-10-03"))).toBe(false);

		expect(dateRange5.isWithinRange("2022-09-03")).toBe(true);
	});

	test("toString()", () => {
		const dateRange1 = DateRange.from("[2022-09-02,2022-10-03)");
		expect(dateRange1.toString()).toBe("[2022-09-02,2022-10-03)");

		const dateRange2 = DateRange.from("[2022-09-02,2022-10-03]");
		expect(dateRange2.toString()).toBe("[2022-09-02,2022-10-03]");

		const dateRange3 = DateRange.from("(2022-09-02,2022-10-03)");
		expect(dateRange3.toString()).toBe("(2022-09-02,2022-10-03)");

		const dateRange4 = DateRange.from("(2022-09-02,2022-10-03]");
		expect(dateRange4.toString()).toBe("(2022-09-02,2022-10-03]");
	});

	test("toJSON()", () => {
		const dateRange1 = DateRange.from("[2022-09-02,2022-10-03)");
		expect(dateRange1.toJSON()).toStrictEqual({
			lower: LowerRange.include,
			upper: UpperRange.exclude,
			value: [
				{ year: 2022, month: 9, day: 2 },
				{ year: 2022, month: 10, day: 3 },
			],
		});

		const dateRange2 = DateRange.from("[2022-09-02,2022-10-03]");
		expect(dateRange2.toJSON()).toStrictEqual({
			lower: LowerRange.include,
			upper: UpperRange.include,
			value: [
				{ year: 2022, month: 9, day: 2 },
				{ year: 2022, month: 10, day: 3 },
			],
		});

		const dateRange3 = DateRange.from("(2022-09-02,2022-10-03)");
		expect(dateRange3.toJSON()).toStrictEqual({
			lower: LowerRange.exclude,
			upper: UpperRange.exclude,
			value: [
				{ year: 2022, month: 9, day: 2 },
				{ year: 2022, month: 10, day: 3 },
			],
		});

		const dateRange4 = DateRange.from("(2022-09-02,2022-10-03]");
		expect(dateRange4.toJSON()).toStrictEqual({
			lower: LowerRange.exclude,
			upper: UpperRange.include,
			value: [
				{ year: 2022, month: 9, day: 2 },
				{ year: 2022, month: 10, day: 3 },
			],
		});
	});

	test("get lower()", () => {
		const dateRange = DateRange.from("[2022-09-02,2022-10-03)");
		expect(dateRange.lower).toBe("[");
	});

	test("set lower(...)", () => {
		const dateRange = DateRange.from("[2022-09-02,2022-10-03)");
		dateRange.lower = LowerRange.exclude;
		expect(dateRange.lower).toBe("(");
	});

	test("get upper()", () => {
		const dateRange = DateRange.from("[2022-09-02,2022-10-03)");
		expect(dateRange.upper).toBe(")");
	});

	test("set upper(...)", () => {
		const dateRange = DateRange.from("[2022-09-02,2022-10-03)");
		dateRange.upper = UpperRange.include;
		expect(dateRange.upper).toBe("]");
	});

	test("get value()", () => {
		const dateRange = DateRange.from("[2022-09-02,2022-10-03)");
		expect(dateRange.value).toHaveLength(2);
		expect(
			dateRange.value?.[0].equals(
				Date.from({
					year: 2022,
					month: 9,
					day: 2,
				})
			)
		).toBe(true);
		expect(
			dateRange.value?.[1].equals(
				Date.from({
					year: 2022,
					month: 10,
					day: 3,
				})
			)
		).toBe(true);
	});

	test("set value(...)", () => {
		const dateRange = DateRange.from("[2022-09-02,2022-10-03)");
		dateRange.value = [Date.from("2022-11-04"), Date.from("2022-12-05")];
		expect(dateRange.value).toHaveLength(2);
		expect(
			dateRange.value?.[0].equals(
				Date.from({
					year: 2022,
					month: 11,
					day: 4,
				})
			)
		).toBe(true);
		expect(
			dateRange.value?.[1].equals(
				Date.from({
					year: 2022,
					month: 12,
					day: 5,
				})
			)
		).toBe(true);
	});

	test("get empty()", () => {
		const dateRange1 = DateRange.from("[2022-09-02,2022-10-03)");
		expect(dateRange1.empty).toBe(false);
		const dateRange2 = DateRange.from("[2022-09-02,2022-09-02)");
		expect(dateRange2.empty).toBe(true);
		const dateRange3 = DateRange.from("(2022-09-02,2022-09-02]");
		expect(dateRange3.empty).toBe(true);
		const dateRange4 = DateRange.from("empty");
		expect(dateRange4.empty).toBe(true);
	});
});

describe("PostgreSQL", () => {
	it.todo("should work with PostgreSQL's own tests", () => {
		//* https://github.com/postgres/postgres/blob/master/src/test/regress/sql/rangetypes.sql
	});

	it("should be returned from PostgreSQL", async () => {
		const client = new Client({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			application_name: "daterange.test.ts",
		});

		await client.connect();

		let error = null;
		try {
			await client.query(`
				CREATE TABLE public.jestdaterange (
					daterange daterange NULL,
					_daterange _daterange NULL
				)
			`);

			await client.query(`
				INSERT INTO public.jestdaterange (daterange, _daterange)
				VALUES (
					'[2022-09-02,2022-10-03)',
					'{[2022-09-02\\,2022-10-03),(2022-11-02\\,2022-12-03]}'
				)
			`);

			const result = await client.query(`
				SELECT * FROM public.jestdaterange
			`);

			expect(result.rows[0].daterange.toString()).toStrictEqual(DateRange.from("[2022-09-02,2022-10-03)").toString());
			expect(result.rows[0]._daterange).toHaveLength(2);
			expect(result.rows[0]._daterange[0].toString()).toStrictEqual(DateRange.from("[2022-09-02,2022-10-03)").toString());
			expect(result.rows[0]._daterange[1].toString()).toStrictEqual(DateRange.from("[2022-11-03,2022-12-04)").toString());
		} catch (error_) {
			error = error_;
		}

		await client.query(`
			DROP TABLE public.jestdaterange
		`);

		await client.end();

		if (error) throw error;
	});
});
