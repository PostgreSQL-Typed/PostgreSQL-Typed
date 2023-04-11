import { DateTime } from "luxon";
import { Client, types } from "pg";
import { describe, expect, it, test } from "vitest";

import { arrayParser } from "../../util/arrayParser.js";
import { parser } from "../../util/parser.js";
import { Date } from "./Date.js";

describe("DateConstructor", () => {
	test("_parse(...)", () => {
		expect(Date.safeFrom("2022-09-02").success).toBe(true);
		expect(
			Date.safeFrom({
				year: 2022,
				month: 9,
				day: 2,
			}).success
		).toBe(true);
		expect(Date.safeFrom(2022, 9, 2).success).toBe(true);
		expect(Date.safeFrom(Date.from("2022-09-02")).success).toBe(true);
		expect(Date.safeFrom(DateTime.fromISO("2022-09-02")).success).toBe(true);
		expect(Date.safeFrom(new globalThis.Date(2022, 9, 2)).success).toBe(true);

		//@ts-expect-error - this is a test
		expect(() => Date.from()).toThrowError("Function must have exactly 1 argument(s)");
		//@ts-expect-error - this is a test
		expect(() => Date.from("a", "b")).toThrowError("Function must have exactly 1 argument(s)");
		//@ts-expect-error - this is a test
		expect(() => Date.from(BigInt("1"))).toThrowError("Expected 'number' | 'string' | 'object' | 'globalThis.Date' | 'luxon.DateTime', received 'bigint'");
		expect(() => Date.from("()")).toThrowError("Expected 'LIKE YYYY-MM-DD', received '()'");
		expect(() => Date.from({} as any)).toThrowError("Missing keys in object: 'year', 'month', 'day'");
		expect(() =>
			Date.from({
				year: 2022,
				month: 9,
				day: "2",
			} as any)
		).toThrowError("Expected 'number' for key 'day', received 'string'");
		expect(() =>
			Date.from({
				year: 2022,
				month: 9,
				day: 2,
				minute: 0,
			} as any)
		).toThrowError("Unrecognized key in object: 'minute'");
		expect(() => Date.from(1, 2, "a" as any)).toThrowError("Expected 'number', received 'string'");
		//@ts-expect-error - this is a test
		expect(() => Date.from(1, 2)).toThrowError("Function must have exactly 3 argument(s)");
		//@ts-expect-error - this is a test
		expect(() => Date.from(1, 2, 3, 4)).toThrowError("Function must have exactly 3 argument(s)");
		expect(() => Date.from(new globalThis.Date("foo"))).toThrowError("Invalid globalThis.Date");
		expect(() => Date.from(DateTime.fromISO("foo"))).toThrowError("Invalid luxon.DateTime");
	});

	test("isDate(...)", () => {
		const date = Date.from({
			year: 2022,
			month: 9,
			day: 2,
		});
		expect(Date.isDate(date)).toBe(true);
		expect(
			Date.isDate({
				year: 2022,
				month: 9,
				day: 2,
			})
		).toBe(false);
	});
});

describe("Date", () => {
	test("_equals(...)", () => {
		const date = Date.from({ year: 2022, month: 9, day: 2 });

		expect(date.equals(Date.from({ year: 2022, month: 9, day: 2 }))).toBe(true);
		expect(date.equals(Date.from({ year: 2022, month: 9, day: 3 }))).toBe(false);
		expect(date.equals(Date.from({ year: 2022, month: 9, day: 2 }).toJSON())).toBe(true);
		expect(date.equals(Date.from({ year: 2022, month: 9, day: 3 }).toJSON())).toBe(false);
		expect(date.equals(Date.from({ year: 2022, month: 9, day: 2 }).toString())).toBe(true);
		expect(date.equals(Date.from({ year: 2022, month: 9, day: 3 }).toString())).toBe(false);
		//@ts-expect-error - this is a test
		expect(() => date.equals(BigInt(1))).toThrowError("Expected 'number' | 'string' | 'object' | 'globalThis.Date' | 'luxon.DateTime', received 'bigint'");
	});

	test("toString()", () => {
		const date = Date.from({ year: 2022, month: 9, day: 2 });
		expect(date.toString()).toBe("2022-09-02");
	});

	test("toNumber()", () => {
		const timestamptz = Date.from("2022-09-02");
		expect(timestamptz.toNumber()).toBe(1_662_076_800_000);
	});

	test("toJSON()", () => {
		const date = Date.from({ year: 2022, month: 9, day: 2 });
		expect(date.toJSON()).toEqual({ year: 2022, month: 9, day: 2 });
	});

	test("toDateTime(...)", () => {
		const date = Date.from({ year: 2022, month: 9, day: 2 });
		expect(date.toDateTime().toISODate()).toBe("2022-09-02");
	});

	test("toJSDate(...)", () => {
		const date = Date.from({ year: 2022, month: 9, day: 2 });
		expect(date.toJSDate().toDateString()).toBe("Fri Sep 02 2022");
	});

	test("get year()", () => {
		const date = Date.from({ year: 2022, month: 9, day: 2 });
		expect(date.year).toBe(2022);
	});

	test("set year(...)", () => {
		const date = Date.from({ year: 2022, month: 9, day: 2 });
		expect(() => {
			date.year = "a" as any;
		}).toThrowError("Expected 'number', received 'string'");
		expect(() => {
			date.year = 0;
		}).toThrowError("Number must be greater than or equal to 1");
		expect(() => {
			date.year = 10_000;
		}).toThrowError("Number must be less than or equal to 9999");
		expect(() => {
			date.year = 2.5;
		}).toThrowError("Number must be whole");
		date.year = 2023;
		expect(date.year).toBe(2023);
	});

	test("get month()", () => {
		const date = Date.from({ year: 2022, month: 9, day: 2 });
		expect(date.month).toBe(9);
	});

	test("set month()", () => {
		const date = Date.from({ year: 2022, month: 9, day: 2 });
		expect(() => {
			date.month = "a" as any;
		}).toThrowError("Expected 'number', received 'string'");
		expect(() => {
			date.month = 0;
		}).toThrowError("Number must be greater than or equal to 1");
		expect(() => {
			date.month = 13;
		}).toThrowError("Number must be less than or equal to 12");
		expect(() => {
			date.month = 2.5;
		}).toThrowError("Number must be whole");
		date.month = 5;
		expect(date.month).toBe(5);
	});

	test("get day()", () => {
		const date = Date.from({ year: 2022, month: 9, day: 2 });
		expect(date.day).toBe(2);
	});

	test("set day()", () => {
		const date = Date.from({ year: 2022, month: 9, day: 2 });
		expect(() => {
			date.day = "a" as any;
		}).toThrowError("Expected 'number', received 'string'");
		expect(() => {
			date.day = 0;
		}).toThrowError("Number must be greater than or equal to 1");
		expect(() => {
			date.day = 32;
		}).toThrowError("Number must be less than or equal to 31");
		expect(() => {
			date.day = 2.5;
		}).toThrowError("Number must be whole");
		date.day = 5;
		expect(date.day).toBe(5);
	});

	test("get value()", () => {
		const date = Date.from("2022-09-02");
		expect(date.value).toBe(1_662_076_800_000);
	});

	test("set value(...)", () => {
		const date = Date.from("2022-09-02");
		date.value = 1_693_612_800_000;
		expect(date.value).toBe(1_693_612_800_000);
		expect(() => {
			date.value = true as any;
		}).toThrowError("Expected 'number' | 'string' | 'object' | 'globalThis.Date' | 'luxon.DateTime', received 'boolean'");
	});

	test("get postgres()", () => {
		const date = Date.from("2022-09-02");
		expect(date.postgres).toBe("2022-09-02");
	});

	test("set postgres(...)", () => {
		const date = Date.from("2022-09-02");
		date.postgres = "2023-09-02";
		expect(date.postgres).toBe("2023-09-02");
		expect(() => {
			date.postgres = true as any;
		}).toThrowError("Expected 'number' | 'string' | 'object' | 'globalThis.Date' | 'luxon.DateTime', received 'boolean'");
	});
});

describe("PostgreSQL", () => {
	it.todo("should work with PostgreSQL's own tests", () => {
		//* https://github.com/postgres/postgres/blob/master/src/test/regress/sql/date.sql
	});

	it("should be returned from PostgreSQL", async () => {
		const client = new Client({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			application_name: "date.test.ts",
		});

		await client.connect();

		//* PG has a native parser for the 'date' and '_date' types
		types.setTypeParser(1082 as any, value => value);
		types.setTypeParser(1182 as any, value => value);

		let error = null;
		try {
			await client.query(`
				CREATE TABLE public.vitestdate (
					date date NULL,
					_date _date NULL
				)
			`);

			await client.query(`
				INSERT INTO public.vitestdate (date, _date)
				VALUES (
					'2022-09-02',
					'{ 1997-08-24, 2022-09-02 }'
				)
			`);

			const result = await client.query(`
				SELECT * FROM public.vitestdate
			`);

			result.rows[0].date = parser<Date>(Date)(result.rows[0].date);
			result.rows[0]._date = arrayParser<Date>(Date, ",")(result.rows[0]._date);

			expect(result.rows[0].date.toString()).toStrictEqual(
				Date.from({
					year: 2022,
					month: 9,
					day: 2,
				}).toString()
			);
			expect(result.rows[0]._date).toHaveLength(2);
			expect(result.rows[0]._date[0].toString()).toStrictEqual(
				Date.from({
					year: 1997,
					month: 8,
					day: 24,
				}).toString()
			);
			expect(result.rows[0]._date[1].toString()).toStrictEqual(
				Date.from({
					year: 2022,
					month: 9,
					day: 2,
				}).toString()
			);
		} catch (error_) {
			error = error_;
			// eslint-disable-next-line no-console
			console.error(error);
		}

		await client.query(`
			DROP TABLE public.vitestdate
		`);

		await client.end();

		if (error) throw error;
	});
});
