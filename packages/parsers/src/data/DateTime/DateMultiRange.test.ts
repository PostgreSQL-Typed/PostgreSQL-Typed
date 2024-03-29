import { Client } from "pg";
import { describe, expect, it, test } from "vitest";

import { arrayParser } from "../../util/arrayParser.js";
import { arraySerializer } from "../../util/arraySerializer.js";
import { parser } from "../../util/parser.js";
import { LowerRange, UpperRange } from "../../util/Range.js";
import { serializer } from "../../util/serializer.js";
import { DateMultiRange } from "./DateMultiRange.js";
import { DateRange } from "./DateRange.js";

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
					values: [
						{
							day: 1,
							month: 1,
							year: 2021,
						},
						{
							day: 1,
							month: 1,
							year: 2022,
						},
					],
				},
				{
					lower: "(",
					upper: "]",
					values: [
						{
							day: 1,
							month: 1,
							year: 2023,
						},
						{
							day: 1,
							month: 1,
							year: 2024,
						},
					],
				},
				{
					lower: LowerRange.include,
					upper: "]",
					values: [
						{
							day: 1,
							month: 1,
							year: 2025,
						},
						{
							day: 1,
							month: 1,
							year: 2026,
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

		const dateMultiRangeFromArgumentsArray = DateMultiRange.from(
			DateRange.from("[2021-01-01,2022-01-01)"),
			DateRange.from("[2023-01-01,2024-01-01)"),
			DateRange.from("[2025-01-01,2026-01-01)")
		);
		expect(dateMultiRangeFromArgumentsArray).not.toBeNull();

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
					values: [
						{
							day: 1,
							month: 1,
							year: 2021,
						},
						{
							day: 1,
							month: 1,
							year: 2022,
						},
					],
				},
				{
					lower: "[",
					upper: ")",
					values: [
						{
							day: 1,
							month: 1,
							year: 2023,
						},
						{
							day: 1,
							month: 1,
							year: 2024,
						},
					],
				},
				{
					lower: "[",
					upper: ")",
					values: [
						{
							day: 1,
							month: 1,
							year: 2025,
						},
						{
							day: 1,
							month: 1,
							year: 2026,
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

	test("get value()", () => {
		const dateMultiRange = DateMultiRange.from(
			DateRange.from("[2021-01-01,2022-01-01)"),
			DateRange.from("[2023-01-01,2024-01-01)"),
			DateRange.from("[2025-01-01,2026-01-01)")
		);
		expect(dateMultiRange.value).toBe("{[2021-01-01,2022-01-01),[2023-01-01,2024-01-01),[2025-01-01,2026-01-01)}");
	});

	test("set value(...)", () => {
		const dateMultiRange = DateMultiRange.from(
			DateRange.from("[2021-01-01,2022-01-01)"),
			DateRange.from("[2023-01-01,2024-01-01)"),
			DateRange.from("[2025-01-01,2026-01-01)")
		);
		dateMultiRange.value = "{[2021-01-01,2022-01-01),[2023-01-08,2024-12-12),[2025-01-01,2026-01-01)}";
		expect(dateMultiRange.ranges).toHaveLength(3);
		expect(dateMultiRange.ranges[0].equals(DateRange.from("[2021-01-01,2022-01-01)"))).toBe(true);
		expect(dateMultiRange.ranges[1].equals(DateRange.from("[2023-01-08,2024-12-12)"))).toBe(true);
		expect(dateMultiRange.ranges[2].equals(DateRange.from("[2025-01-01,2026-01-01)"))).toBe(true);
	});

	test("get postgres()", () => {
		const dateMultiRange = DateMultiRange.from(
			DateRange.from("[2021-01-01,2022-01-01)"),
			DateRange.from("[2023-01-01,2024-01-01)"),
			DateRange.from("[2025-01-01,2026-01-01)")
		);
		expect(dateMultiRange.postgres).toBe("{[2021-01-01,2022-01-01),[2023-01-01,2024-01-01),[2025-01-01,2026-01-01)}");
	});

	test("set postgres(...)", () => {
		const dateMultiRange = DateMultiRange.from(
			DateRange.from("[2021-01-01,2022-01-01)"),
			DateRange.from("[2023-01-01,2024-01-01)"),
			DateRange.from("[2025-01-01,2026-01-01)")
		);
		dateMultiRange.postgres = "{[2021-01-01,2022-01-01),[2023-01-08,2024-12-12),[2025-01-01,2026-01-01)}";
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
			application_name: "datemultirange.test.ts",
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
				CREATE TABLE public.vitestdatemultirange (
					datemultirange datemultirange NULL,
					_datemultirange _datemultirange NULL
				)
			`);

			const [singleInput, arrayInput] = [
				serializer<DateMultiRange>(DateMultiRange)(
					DateMultiRange.from(DateRange.from("[1999-01-08,2022-01-01)"), DateRange.from("[2023-01-08,2024-01-01)"), DateRange.from("[2025-01-08,2026-01-01)"))
				),
				arraySerializer<DateMultiRange>(DateMultiRange)([
					DateMultiRange.from(DateRange.from("[1999-01-08,2022-01-01)"), DateRange.from("[2023-01-08,2024-01-01)")),
					DateMultiRange.from(DateRange.from("[2025-01-08,2026-01-01)"), DateRange.from("[2027-01-08,2028-01-01)")),
				]),
			];

			expect(singleInput).toBe("{[1999-01-08,2022-01-01),[2023-01-08,2024-01-01),[2025-01-08,2026-01-01)}");
			expect(arrayInput).toBe('{"\\{[1999-01-08\\,2022-01-01)\\,[2023-01-08\\,2024-01-01)\\}","\\{[2025-01-08\\,2026-01-01)\\,[2027-01-08\\,2028-01-01)\\}"}');

			await client.query(
				`
				INSERT INTO public.vitestdatemultirange (datemultirange, _datemultirange)
				VALUES (
					$1::datemultirange,
					$2::_datemultirange
				)
			`,
				[singleInput, arrayInput]
			);

			const result = await client.query(`
				SELECT * FROM public.vitestdatemultirange
			`);

			result.rows[0].datemultirange = parser<DateMultiRange>(DateMultiRange)(result.rows[0].datemultirange);
			result.rows[0]._datemultirange = arrayParser<DateMultiRange>(DateMultiRange)(result.rows[0]._datemultirange);

			expect(result.rows[0].datemultirange.toString()).toStrictEqual(
				DateMultiRange.from("{[1999-01-08,2022-01-01),[2023-01-08,2024-01-01),[2025-01-08,2026-01-01)}").toString()
			);
			expect(result.rows[0]._datemultirange).toHaveLength(2);
			expect(result.rows[0]._datemultirange[0].toString()).toStrictEqual(DateMultiRange.from("{[1999-01-08,2022-01-01),[2023-01-08,2024-01-01)}").toString());
			expect(result.rows[0]._datemultirange[1].toString()).toStrictEqual(DateMultiRange.from("{[2025-01-08,2026-01-01),[2027-01-08,2028-01-01)}").toString());
		} catch (error_) {
			error = error_;
			// eslint-disable-next-line no-console
			console.error(error);
		}

		await client.query(`
			DROP TABLE public.vitestdatemultirange
		`);

		await client.end();

		if (error) throw error;
	});
});
