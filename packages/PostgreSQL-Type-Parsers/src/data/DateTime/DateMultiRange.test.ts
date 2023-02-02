import { Client } from "pg";
import { describe, expect, it, test } from "vitest";

import { LowerRange, UpperRange } from "../../util/Range";
import { DateMultiRange } from "./DateMultiRange";
import { DateRange } from "./DateRange";

describe("DateMultiRangeConstructor", () => {
	test("_parse(...)", () => {
		const dateMultiRange = DateMultiRange.from("{[2021-01-01,2022-01-01),[2023-01-01,2024-01-01),[2025-01-01,2026-01-01)}");
		expect(dateMultiRange).not.toBeNull();

		expect(() => {
			DateMultiRange.from("{[1999-01-08,2022-01-01),[2023-01-08,2024-01-01),[2025-01-08,2026-01-01)");
		}).toThrowError("Expected '}', received ')'");

		const dateMultiRangeFromObject = DateMultiRange.from({
			ranges: [DateRange.from("[2021-01-01,2022-01-01)"), DateRange.from("[2023-01-01,2024-01-01)"), DateRange.from("[2025-01-01,2026-01-01)")],
		});
		expect(dateMultiRangeFromObject).not.toBeNull();

		expect(() => {
			DateMultiRange.from({} as any);
		}).toThrowError("Missing key in object: 'ranges'");

		const dateMultiRangeFromObject2 = DateMultiRange.from({
			ranges: [
				{
					lower: LowerRange.include,
					upper: UpperRange.exclude,
					value: [
						{
							year: 2021,
							month: 1,
							day: 1,
						},
						{
							year: 2022,
							month: 1,
							day: 1,
						},
					],
				},
				{
					lower: "(",
					upper: "]",
					value: [
						{
							year: 2023,
							month: 1,
							day: 1,
						},
						{
							year: 2024,
							month: 1,
							day: 1,
						},
					],
				},
				{
					lower: LowerRange.include,
					upper: "]",
					value: [
						{
							year: 2025,
							month: 1,
							day: 1,
						},
						{
							year: 2026,
							month: 1,
							day: 1,
						},
					],
				},
			],
		});
		expect(dateMultiRangeFromObject2).not.toBeNull();

		expect(() => {
			DateMultiRange.from({
				ranges: ["range1", "range2"],
			} as any);
		}).toThrowError("Expected '[' | '(', received 'r'");

		const dateMultiRangeFromArray = DateMultiRange.from([
			DateRange.from("[2021-01-01,2022-01-01)"),
			DateRange.from("[2023-01-01,2024-01-01)"),
			DateRange.from("[2025-01-01,2026-01-01)"),
		]);
		expect(dateMultiRangeFromArray).not.toBeNull();

		expect(() => {
			DateMultiRange.from(["range1", "range2"] as any);
		}).toThrowError("Expected '[' | '(', received 'r'");

		const dateMultiRangeFromArgsArray = DateMultiRange.from(
			DateRange.from("[2021-01-01,2022-01-01)"),
			DateRange.from("[2023-01-01,2024-01-01)"),
			DateRange.from("[2025-01-01,2026-01-01)")
		);
		expect(dateMultiRangeFromArgsArray).not.toBeNull();

		expect(() => {
			DateMultiRange.from(DateRange.from("[2021-01-01,2022-01-01)"), "range2" as any);
		}).toThrowError("Expected '[' | '(', received 'r'");
	});

	test("isMultiRange(...)", () => {
		const dateMultiRange = DateMultiRange.from(
			DateRange.from("[2021-01-01,2022-01-01)"),
			DateRange.from("[2023-01-01,2024-01-01)"),
			DateRange.from("[2025-01-01,2026-01-01)")
		);
		expect(DateMultiRange.isMultiRange(dateMultiRange)).toBe(true);
		expect(
			DateMultiRange.isMultiRange({
				ranges: [DateRange.from("[2021-01-01,2022-01-01)"), DateRange.from("[2023-01-01,2024-01-01)"), DateRange.from("[2025-01-01,2026-01-01)")],
			})
		).toBe(false);
	});
});

describe("DateMultiRange", () => {
	test("_equals(...)", () => {
		const dateMultiRange = DateMultiRange.from(
			DateRange.from("[2021-01-01,2022-01-01)"),
			DateRange.from("[2023-01-01,2024-01-01)"),
			DateRange.from("[2025-01-01,2026-01-01)")
		);

		expect(dateMultiRange.equals(DateMultiRange.from("{[2021-01-01,2022-01-01),[2023-01-01,2024-01-01),[2025-01-01,2026-01-01)}"))).toBe(true);
		expect(dateMultiRange.equals(DateMultiRange.from("{[2021-01-01,2022-01-01),[2023-01-08,2024-01-01),[2025-01-01,2026-01-01)}"))).toBe(false);
		expect(dateMultiRange.equals(DateMultiRange.from("{[2021-01-01,2022-01-01),[2023-01-01,2024-01-01),[2025-01-01,2026-01-01)}").toJSON())).toBe(true);
		expect(dateMultiRange.equals(DateMultiRange.from("{[2021-01-01,2022-01-01),[2023-01-08,2024-01-01),[2025-01-01,2026-01-01)}").toJSON())).toBe(false);
		expect(dateMultiRange.equals(DateMultiRange.from("{[2021-01-01,2022-01-01),[2023-01-01,2024-01-01),[2025-01-01,2026-01-01)}").toString())).toBe(true);
		expect(dateMultiRange.equals(DateMultiRange.from("{[2021-01-01,2022-01-01),[2023-01-08,2024-01-01),[2025-01-01,2026-01-01)}").toString())).toBe(false);
		expect(
			dateMultiRange.equals([DateRange.from("[2021-01-01,2022-01-01)"), DateRange.from("[2023-01-01,2024-01-01)"), DateRange.from("[2025-01-01,2026-01-01)")])
		).toBe(true);
		expect(
			dateMultiRange.equals([DateRange.from("[2021-01-01,2022-01-01)"), DateRange.from("[2023-01-08,2024-01-01)"), DateRange.from("[2025-01-01,2026-01-01)")])
		).toBe(false);
	});

	test("toString()", () => {
		const dateMultiRange = DateMultiRange.from(
			DateRange.from("[2021-01-01,2022-01-01)"),
			DateRange.from("[2023-01-01,2024-01-01)"),
			DateRange.from("[2025-01-01,2026-01-01)")
		);
		expect(dateMultiRange.toString()).toBe("{[2021-01-01,2022-01-01),[2023-01-01,2024-01-01),[2025-01-01,2026-01-01)}");
	});

	test("toJSON()", () => {
		const dateMultiRange = DateMultiRange.from(
			DateRange.from("[2021-01-01,2022-01-01)"),
			DateRange.from("[2023-01-01,2024-01-01)"),
			DateRange.from("[2025-01-01,2026-01-01)")
		);
		expect(dateMultiRange.toJSON()).toEqual({
			ranges: [
				{
					lower: "[",
					upper: ")",
					value: [
						{
							year: 2021,
							month: 1,
							day: 1,
						},
						{
							year: 2022,
							month: 1,
							day: 1,
						},
					],
				},
				{
					lower: "[",
					upper: ")",
					value: [
						{
							year: 2023,
							month: 1,
							day: 1,
						},
						{
							year: 2024,
							month: 1,
							day: 1,
						},
					],
				},
				{
					lower: "[",
					upper: ")",
					value: [
						{
							year: 2025,
							month: 1,
							day: 1,
						},
						{
							year: 2026,
							month: 1,
							day: 1,
						},
					],
				},
			],
		});
	});

	test("get ranges()", () => {
		const dateMultiRange = DateMultiRange.from(
			DateRange.from("[2021-01-01,2022-01-01)"),
			DateRange.from("[2023-01-01,2024-01-01)"),
			DateRange.from("[2025-01-01,2026-01-01)")
		);
		expect(dateMultiRange.ranges).toHaveLength(3);
		expect(dateMultiRange.ranges[0].equals(DateRange.from("[2021-01-01,2022-01-01)"))).toBe(true);
		expect(dateMultiRange.ranges[1].equals(DateRange.from("[2023-01-01,2024-01-01)"))).toBe(true);
		expect(dateMultiRange.ranges[2].equals(DateRange.from("[2025-01-01,2026-01-01)"))).toBe(true);
	});

	test("set ranges(...)", () => {
		const dateMultiRange = DateMultiRange.from(
			DateRange.from("[2021-01-01,2022-01-01)"),
			DateRange.from("[2023-01-01,2024-01-01)"),
			DateRange.from("[2025-01-01,2026-01-01)")
		);
		dateMultiRange.ranges = [DateRange.from("[2021-01-01,2022-01-01)"), DateRange.from("[2023-01-08,2024-12-12)"), DateRange.from("[2025-01-01,2026-01-01)")];
		expect(dateMultiRange.ranges).toHaveLength(3);
		expect(dateMultiRange.ranges[0].equals(DateRange.from("[2021-01-01,2022-01-01)"))).toBe(true);
		expect(dateMultiRange.ranges[1].equals(DateRange.from("[2023-01-08,2024-12-12)"))).toBe(true);
		expect(dateMultiRange.ranges[2].equals(DateRange.from("[2025-01-01,2026-01-01)"))).toBe(true);
	});
});

describe("PostgreSQL", () => {
	it.todo("should work with PostgreSQL's own tests", () => {
		//* https://github.com/postgres/postgres/blob/master/src/test/regress/sql/multirangetypes.sql
	});

	it("should be returned from PostgreSQL", async () => {
		const client = new Client({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			application_name: "datemultirange.test.ts",
		});

		await client.connect();

		let error = null;
		try {
			await client.query(`
				CREATE TABLE public.jestdatemultirange (
					datemultirange datemultirange NULL,
					_datemultirange _datemultirange NULL
				)
			`);

			await client.query(`
				INSERT INTO public.jestdatemultirange (datemultirange, _datemultirange)
				VALUES (
					'{[1999-01-08,2022-01-01),[2023-01-08,2024-01-01),[2025-01-08,2026-01-01)}',
					'{\\{[1999-01-08\\,2022-01-01)\\,[2023-01-08\\,2024-01-01)\\},\\{[2025-01-08\\,2026-01-01)\\,[2027-01-08\\,2028-01-01)\\}}'
				)
			`);

			const result = await client.query(`
				SELECT * FROM public.jestdatemultirange
			`);

			expect(result.rows[0].datemultirange.toString()).toStrictEqual(
				DateMultiRange.from("{[1999-01-08,2022-01-01),[2023-01-08,2024-01-01),[2025-01-08,2026-01-01)}").toString()
			);
			expect(result.rows[0]._datemultirange).toHaveLength(2);
			expect(result.rows[0]._datemultirange[0].toString()).toStrictEqual(DateMultiRange.from("{[1999-01-08,2022-01-01),[2023-01-08,2024-01-01)}").toString());
			expect(result.rows[0]._datemultirange[1].toString()).toStrictEqual(DateMultiRange.from("{[2025-01-08,2026-01-01),[2027-01-08,2028-01-01)}").toString());
		} catch (err) {
			error = err;
		}

		await client.query(`
			DROP TABLE public.jestdatemultirange
		`);

		await client.end();

		if (error) throw error;
	});
});
