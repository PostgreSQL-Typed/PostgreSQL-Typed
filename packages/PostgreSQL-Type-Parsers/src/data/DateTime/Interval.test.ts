import { Client } from "pg";
import { describe, expect, it, test } from "vitest";

import { Interval, IntervalStyle } from "./Interval.js";

describe("IntervalStyle", () => {
	it("should have all Interval styles", () => {
		expect([
			"PostgreSQL",
			"PostgreSQL-Short",
			"PostgreSQL-Time",
			"PostgreSQL-Time-Short",
			"ISO",
			"ISO-Short",
			"ISO-Basic",
			"ISO-Extended",
			"SQL",
		]).toStrictEqual([
			IntervalStyle.PostgreSQL,
			IntervalStyle.PostgreSQLShort,
			IntervalStyle.PostgreSQLTime,
			IntervalStyle.PostgreSQLTimeShort,
			IntervalStyle.ISO,
			IntervalStyle.ISOShort,
			IntervalStyle.ISOBasic,
			IntervalStyle.ISOExtended,
			IntervalStyle.SQL,
		]);
	});
});

describe("IntervalConstructor", () => {
	test("_parse(...)", () => {
		expect(Interval.safeFrom("1 second").success).toBe(true);
		expect(
			Interval.safeFrom({
				years: 2022,
				months: 9,
				days: 2,
			}).success
		).toBe(true);
		expect(Interval.safeFrom(2022, 9, 2, 1, 2, 3, 4).success).toBe(true);
		expect(Interval.safeFrom(Interval.from("1 second")).success).toBe(true);
		expect(Interval.safeFrom("1 millennium 1 century 1 decade 1week 1microsecond ago").success).toBe(true);

		//@ts-expect-error - this is a test
		expect(() => Interval.from()).toThrowError("Function must have exactly 1 argument(s)");
		//@ts-expect-error - this is a test
		expect(() => Interval.from("a", "b")).toThrowError("Function must have exactly 1 argument(s)");
		//@ts-expect-error - this is a test
		expect(() => Interval.from(BigInt("1"))).toThrowError("Expected 'number' | 'string' | 'object', received 'bigint'");
		expect(() => Interval.from("()")).toThrowError("Expected 'LIKE P1Y2M3W4DT5H6M7S', received '()'");
		expect(() => Interval.from({} as any)).toThrowError("Missing keys in object: 'years', 'months', 'days', 'hours', 'minutes', 'seconds', 'milliseconds'");
		expect(() =>
			Interval.from({
				years: 2022,
				months: 9,
				days: "2",
			} as any)
		).toThrowError("Expected 'number' | 'undefined' for key 'days', received 'string'");
		expect(() =>
			Interval.from({
				years: 2022,
				months: 9,
				days: 2,
				weeks: 0,
			} as any)
		).toThrowError("Unrecognized key in object: 'weeks'");
		expect(() => Interval.from(1, 2, "a" as any, 4, 5, 6, 7)).toThrowError("Expected 'number', received 'string'");
		//@ts-expect-error - this is a test
		expect(() => Interval.from(1, 2, 3, 4, 5, 6)).toThrowError("Function must have exactly 7 argument(s)");
		//@ts-expect-error - this is a test
		expect(() => Interval.from(1, 2, 3, 4, 5, 6, 7, 8)).toThrowError("Function must have exactly 7 argument(s)");
	});

	test("isInterval(...)", () => {
		const interval = Interval.from({
			years: 2022,
			months: 9,
			days: 2,
		});
		expect(Interval.isInterval(interval)).toBe(true);
		expect(
			Interval.isInterval({
				years: 2022,
				months: 9,
				days: 2,
			})
		).toBe(false);
	});
});

describe("Interval", () => {
	test("_equals(...)", () => {
		const interval = Interval.from({ years: 2022, months: 9, days: 2 });

		expect(interval.equals(Interval.from({ years: 2022, months: 9, days: 2 }))).toBe(true);
		expect(interval.equals(Interval.from({ years: 2022, months: 9, days: 3 }))).toBe(false);
		expect(interval.equals(Interval.from({ years: 2022, months: 9, days: 2 }).toJSON())).toBe(true);
		expect(interval.equals(Interval.from({ years: 2022, months: 9, days: 3 }).toJSON())).toBe(false);
		expect(interval.equals(Interval.from({ years: 2022, months: 9, days: 2 }).toString())).toBe(true);
		expect(interval.equals(Interval.from({ years: 2022, months: 9, days: 3 }).toString())).toBe(false);
		//@ts-expect-error - this is a test
		expect(() => interval.equals(BigInt(1))).toThrowError("Expected 'number' | 'string' | 'object', received 'bigint'");
	});

	test("toString(...)", () => {
		const interval1 = Interval.from({ years: 2022, months: 9, days: 2 });
		expect(interval1.toString()).toBe("2022 years 9 months 2 days");
		expect(interval1.toString("PostgreSQL")).toBe(interval1.toString());
		expect(interval1.toString("PostgreSQL-Short")).toBe("2022 yrs 9 mons 2 days");
		expect(interval1.toString("PostgreSQL-Time")).toBe("2022 years 9 months 2 days");
		expect(interval1.toString("PostgreSQL-Time-Short")).toBe("2022 yrs 9 mons 2 days");
		expect(interval1.toString("ISO")).toBe("P2022Y9M2DT0H0M0S");
		expect(interval1.toString("ISO-Short")).toBe("P2022Y9M2D");
		expect(interval1.toString("ISO-Basic")).toBe("P20220902T000000");
		expect(interval1.toString("ISO-Extended")).toBe("P2022-09-02T00:00:00");
		expect(interval1.toString("SQL")).toBe("2022-9 2 00:00:00");

		const interval2 = Interval.from({ years: 2022, days: 2, hours: 1, minutes: 2, seconds: 3, milliseconds: 4 });
		expect(interval2.toString()).toBe("2022 years 2 days 1 hours 2 minutes 3 seconds 4 milliseconds");
		expect(interval2.toString("PostgreSQL")).toBe(interval2.toString());
		expect(interval2.toString("PostgreSQL-Short")).toBe("2022 yrs 2 days 1 hrs 2 mins 3 secs 4 msecs");
		expect(interval2.toString("PostgreSQL-Time")).toBe("2022 years 2 days 01:02:03.004");
		expect(interval2.toString("PostgreSQL-Time-Short")).toBe("2022 yrs 2 days 01:02:03.004");
		expect(interval2.toString("ISO")).toBe("P2022Y0M2DT1H2M3.004S");
		expect(interval2.toString("ISO-Short")).toBe("P2022Y2DT1H2M3.004S");
		expect(interval2.toString("ISO-Basic")).toBe("P20220002T010203.004");
		expect(interval2.toString("ISO-Extended")).toBe("P2022-00-02T01:02:03.004");
		expect(interval2.toString("SQL")).toBe("2022-0 2 01:02:03.004");

		// Test some edge cases
		const interval3 = Interval.from({ days: 400, hours: 100, minutes: 100, seconds: 100, milliseconds: 10_000 });
		expect(interval3.toString()).toBe("1 years 39 days 5 hours 41 minutes 50 seconds");

		const interval4 = Interval.from({ years: 1.5, months: 1.5, days: 1.5, hours: 1.5, minutes: 1.5, seconds: 1.5, milliseconds: 1.5 });
		expect(interval4.toString()).toBe("1 years 1 months 198.5 days 13 hours 31 minutes 31 seconds 501.5 milliseconds");

		const interval5 = Interval.from({ milliseconds: 0 });
		expect(interval5.toString()).toBe("0");
		expect(interval5.toString("PostgreSQL")).toBe(interval5.toString());
		expect(interval5.toString("PostgreSQL-Short")).toBe("0");
		expect(interval5.toString("PostgreSQL-Time")).toBe("0");
		expect(interval5.toString("PostgreSQL-Time-Short")).toBe("0");
		expect(interval5.toString("ISO")).toBe("P0Y0M0DT0H0M0S");
		expect(interval5.toString("ISO-Short")).toBe("PT0S");
		expect(interval5.toString("ISO-Basic")).toBe("P00000000T000000");
		expect(interval5.toString("ISO-Extended")).toBe("P0000-00-00T00:00:00");
		expect(interval5.toString("SQL")).toBe("0-0 0 00:00:00");

		// Test all sql formats
		// year to month
		expect(Interval.from({ years: 2022, months: 9 }).toString("SQL")).toBe("2022-9");

		// day to second
		expect(Interval.from({ days: 2, hours: 1, minutes: 2, seconds: 3, milliseconds: 4 }).toString("SQL")).toBe("2 01:02:03.004");
		expect(Interval.from({ days: 2, hours: 1, minutes: 2, milliseconds: 4 }).toString("SQL")).toBe("2 01:02:00.004");

		// year to second
		expect(Interval.from({ years: 2022, months: 9, days: 2, hours: 1, minutes: 2, seconds: 3, milliseconds: 4 }).toString("SQL")).toBe("2022-9 2 01:02:03.004");
		expect(Interval.from({ years: 2022, months: 9, days: 2, hours: 1, minutes: 2, milliseconds: 4 }).toString("SQL")).toBe("2022-9 2 01:02:00.004");
		expect(Interval.from({ years: 2022, minutes: 2 }).toString("SQL")).toBe("2022-0 0 00:02:00");
		expect(Interval.from({ months: 3, milliseconds: 2 }).toString("SQL")).toBe("0-3 0 00:00:00.002");

		// hour to minute
		expect(Interval.from({ hours: 1, minutes: 2 }).toString("SQL")).toBe("01:02");

		// hour to second
		expect(Interval.from({ hours: 1, minutes: 2, seconds: 3, milliseconds: 4 }).toString("SQL")).toBe("01:02:03.004");
		expect(Interval.from({ hours: 1, minutes: 2, milliseconds: 4 }).toString("SQL")).toBe("01:02:00.004");

		// second
		expect(Interval.from({ seconds: 3, milliseconds: 4 }).toString("SQL")).toBe("3.004");
		expect(Interval.from({ milliseconds: 3 }).toString("SQL")).toBe("0.003");

		expect(() => interval1.toString("wdabedowa" as any)).toThrowError();

		expect(Interval.from({ days: 2, hours: 1, minutes: 2, milliseconds: 4 }).toString("ISO-Basic")).toBe("P00000002T010200.004");
		expect(Interval.from({ hours: 1 }).toString("PostgreSQL")).toBe("1 hours");
		expect(Interval.from({ milliseconds: 1 }).toString("PostgreSQL-Time")).toBe("00:00:00.001");
		expect(Interval.from({ minutes: 1 }).toString("PostgreSQL-Time")).toBe("00:01:00");
	});

	test("toJSON()", () => {
		const interval = Interval.from({ years: 2022, months: 9, days: 2 });
		expect(interval.toJSON()).toEqual({ years: 2022, months: 9, days: 2 });
	});

	test("get years()", () => {
		const interval = Interval.from({ years: 2022, months: 9, days: 2 });
		expect(interval.years).toBe(2022);
	});

	test("set years(...)", () => {
		const interval = Interval.from({ years: 2022, months: 9, days: 2 });
		expect(() => {
			interval.years = "a" as any;
		}).toThrowError("Expected 'number', received 'string'");
		expect(() => {
			interval.years = 2.5;
		}).toThrowError("Number must be whole");
		interval.years = 2023;
		expect(interval.years).toBe(2023);
	});

	test("get months()", () => {
		const interval = Interval.from({ years: 2022, months: 9, days: 2 });
		expect(interval.months).toBe(9);
	});

	test("set months()", () => {
		const interval = Interval.from({ years: 2022, months: 9, days: 2 });
		expect(() => {
			interval.months = "a" as any;
		}).toThrowError("Expected 'number', received 'string'");
		expect(() => {
			interval.months = 2.5;
		}).toThrowError("Number must be whole");
		interval.months = 5;
		expect(interval.months).toBe(5);
	});

	test("get days()", () => {
		const interval = Interval.from({ years: 2022, months: 9, days: 2 });
		expect(interval.days).toBe(2);
	});

	test("set days()", () => {
		const interval = Interval.from({ years: 2022, months: 9, days: 2 });
		expect(() => {
			interval.days = "a" as any;
		}).toThrowError("Expected 'number', received 'string'");
		expect(() => {
			interval.days = 2.5;
		}).toThrowError("Number must be whole");
		interval.days = 5;
		expect(interval.days).toBe(5);
	});

	test("get hours()", () => {
		const interval = Interval.from({ years: 2022, months: 9, days: 2, hours: 2 });
		expect(interval.hours).toBe(2);
	});

	test("set hours()", () => {
		const interval = Interval.from({ years: 2022, months: 9, days: 2, hours: 2 });
		expect(() => {
			interval.hours = "a" as any;
		}).toThrowError("Expected 'number', received 'string'");
		expect(() => {
			interval.hours = 2.5;
		}).toThrowError("Number must be whole");
		interval.hours = 5;
		expect(interval.hours).toBe(5);
	});

	test("get minutes()", () => {
		const interval = Interval.from({ years: 2022, months: 9, days: 2, minutes: 2 });
		expect(interval.minutes).toBe(2);
	});

	test("set minutes()", () => {
		const interval = Interval.from({ years: 2022, months: 9, days: 2, minutes: 2 });
		expect(() => {
			interval.minutes = "a" as any;
		}).toThrowError("Expected 'number', received 'string'");
		expect(() => {
			interval.minutes = 2.5;
		}).toThrowError("Number must be whole");
		interval.minutes = 5;
		expect(interval.minutes).toBe(5);
	});

	test("get seconds()", () => {
		const interval = Interval.from({ years: 2022, months: 9, days: 2, seconds: 2 });
		expect(interval.seconds).toBe(2);
	});

	test("set seconds()", () => {
		const interval = Interval.from({ years: 2022, months: 9, days: 2, seconds: 2 });
		expect(() => {
			interval.seconds = "a" as any;
		}).toThrowError("Expected 'number', received 'string'");
		expect(() => {
			interval.seconds = 2.5;
		}).toThrowError("Number must be whole");
		interval.seconds = 5;
		expect(interval.seconds).toBe(5);
	});

	test("get milliseconds()", () => {
		const interval = Interval.from({ years: 2022, months: 9, days: 2, milliseconds: 2 });
		expect(interval.milliseconds).toBe(2);
	});

	test("set milliseconds()", () => {
		const interval = Interval.from({ years: 2022, months: 9, days: 2, milliseconds: 2 });
		expect(() => {
			interval.milliseconds = "a" as any;
		}).toThrowError("Expected 'number', received 'string'");
		interval.milliseconds = 5;
		expect(interval.milliseconds).toBe(5);
	});
});

describe("PostgreSQL", () => {
	it("should work with PostgreSQL's own tests", () => {
		//* https://github.com/postgres/postgres/blob/master/src/test/regress/sql/interval.sql

		// check acceptance of "time zone style"
		expect(() => Interval.from("01:00")).not.toThrowError();
		expect(() => Interval.from("+02:00")).not.toThrowError();
		expect(() => Interval.from("-08:00")).not.toThrowError();
		expect(() => Interval.from("-1 +02:03")).not.toThrowError();
		expect(() => Interval.from("-1 days +02:03")).not.toThrowError();
		expect(() => Interval.from("1.5 weeks")).not.toThrowError();
		expect(() => Interval.from("1.5 months")).not.toThrowError();
		expect(() => Interval.from("10 years -11 month -12 days +13:14")).not.toThrowError();
		expect(() => Interval.from("1 day 01:23:45.6789")).not.toThrowError();

		expect(() => Interval.from("@ 1 minute")).not.toThrowError();
		expect(() => Interval.from("@ 5 hour")).not.toThrowError();
		expect(() => Interval.from("@ 10 day")).not.toThrowError();
		expect(() => Interval.from("@ 34 year")).not.toThrowError();
		expect(() => Interval.from("@ 3 months")).not.toThrowError();
		expect(() => Interval.from("@ 14 seconds ago")).not.toThrowError();
		expect(() => Interval.from("1 day 2 hours 3 minutes 4 seconds")).not.toThrowError();
		expect(() => Interval.from("6 years")).not.toThrowError();
		expect(() => Interval.from("5 months")).not.toThrowError();
		expect(() => Interval.from("5 months 12 hours")).not.toThrowError();

		// Check handling of fractional fields in ISO8601 format.
		expect(() => Interval.from("P1Y0M3DT4H5M6S")).not.toThrowError();
		expect(() => Interval.from("P1.0Y0M3DT4H5M6S")).not.toThrowError();
		expect(() => Interval.from("P1.1Y0M3DT4H5M6S")).not.toThrowError();
		expect(() => Interval.from("P1.Y0M3DT4H5M6S")).not.toThrowError();
		expect(() => Interval.from("P.1Y0M3DT4H5M6S")).not.toThrowError();
		expect(() => Interval.from("P.Y0M3DT4H5M6S")).toThrowError(); // error

		// test fractional second input, and detection of duplicate units
		expect(() => Interval.from("1 millisecond")).not.toThrowError();
		expect(() => Interval.from("1 microsecond")).not.toThrowError();
		expect(() => Interval.from("500 seconds 99 milliseconds 51 microseconds")).not.toThrowError();
		expect(() => Interval.from("3 days 5 milliseconds")).not.toThrowError();

		expect(() => Interval.from("1 second 2 seconds")).toThrowError(); // error
		expect(() => Interval.from("10 milliseconds 20 milliseconds")).toThrowError(); // error
		expect(() => Interval.from("1:20:05 5 microseconds")).toThrowError(); // error
		expect(() => Interval.from("1 day 1 day")).toThrowError(); // error

		expect(() => Interval.from("1 day 01:23:45.6789")).not.toThrowError();
		expect(() => Interval.from("12:34.5678")).not.toThrowError();

		// cases that trigger sign-matching rules in the sql style
		expect(() => Interval.from("-23 hours 45 min 12.34 sec")).not.toThrowError();
		expect(() => Interval.from("-1 day 23 hours 45 min 12.34 sec")).not.toThrowError();
		expect(() => Interval.from("-1 year 2 months 1 day 23 hours 45 min 12.34 sec")).not.toThrowError();
		expect(() => Interval.from("-1 year 2 months 1 day 23 hours 45 min +12.34 sec")).not.toThrowError();

		// test output of couple non-standard interval values in the sql style
		expect(() => Interval.from("1 day -1 hours")).not.toThrowError();
		expect(() => Interval.from("-1 days +1 hours")).not.toThrowError();
		expect(() => Interval.from("1 years 2 months -3 days 4 hours 5 minutes 6.789 seconds")).not.toThrowError();
		expect(() => Interval.from("1 years 2 months -3 days 4 hours 5 minutes 6.789 seconds")).not.toThrowError();

		// cases that trigger sign-matching rules in the sql style
		expect(() => Interval.from("-23 hours 45 min 12.34 sec")).not.toThrowError();
		expect(() => Interval.from("-1 day 23 hours 45 min 12.34 sec")).not.toThrowError();
		expect(() => Interval.from("-1 year 2 months 1 day 23 hours 45 min 12.34 sec")).not.toThrowError();
		expect(() => Interval.from("-1 year 2 months 1 day 23 hours 45 min +12.34 sec")).not.toThrowError();

		// test inputting ISO 8601 4.4.2.1 "Format With Time Unit Designators"
		expect(() => Interval.from("P0Y")); // zero
		expect(() => Interval.from("P1Y2M")); // a year 2 months
		expect(() => Interval.from("P1W")); // a week
		expect(() => Interval.from("P1DT2H3M4S")); // a bit over a day
		expect(() => Interval.from("P1Y2M3DT4H5M6.7S")); // all fields
		expect(() => Interval.from("P-1Y-2M-3DT-4H-5M-6.7S")); // negative
		expect(() => Interval.from("PT-0.1S")); // fractional second

		// test inputting ISO 8601 4.4.2.2 "Alternative Format"
		expect(() => Interval.from("P00021015T103020")); // ISO8601 Basic Format
		expect(() => Interval.from("P0002-10-15T10:30:20")); // ISO8601 Extended Format

		// Make sure optional ISO8601 alternative format fields are optional.
		expect(() => Interval.from("P0002")); // year only
		expect(() => Interval.from("P0002-10")); // year month
		expect(() => Interval.from("P0002-10-15")); // year month day
		expect(() => Interval.from("P0002T1S")); // year only plus time
		expect(() => Interval.from("P0002-10T1S")); // year month plus time
		expect(() => Interval.from("P0002-10-15T1S")); // year month day plus time
		expect(() => Interval.from("PT10")); // hour only
		expect(() => Interval.from("PT10:30")); // hour minute

		// Check handling of fractional fields in ISO8601 format.
		expect(() => Interval.from("P1Y0M3DT4H5M6S")).not.toThrowError();
		expect(() => Interval.from("P1.0Y0M3DT4H5M6S")).not.toThrowError();
		expect(() => Interval.from("P1.1Y0M3DT4H5M6S")).not.toThrowError();
		expect(() => Interval.from("P1.Y0M3DT4H5M6S")).not.toThrowError();
		expect(() => Interval.from("P.1Y0M3DT4H5M6S")).not.toThrowError();
		expect(() => Interval.from("P.Y0M3DT4H5M6S")).toThrowError(); // error

		// test a couple rounding cases that changed since 8.3 w/ HAVE_INT64_TIMESTAMP.
		expect(() => Interval.from("-10 mons -3 days +03:55:06.70")).not.toThrowError();
		expect(() => Interval.from("1 year 2 mons 3 days 04:05:06.699999")).not.toThrowError();
		expect(() => Interval.from("0:0:0.7")).not.toThrowError();
		expect(() => Interval.from("@ 0.70 secs")).not.toThrowError();
		expect(() => Interval.from("0.7 seconds")).not.toThrowError();

		// test time fields using entire 64 bit microseconds range
		expect(() => Interval.from("2562047788.01521550194 hours")).not.toThrowError();
		expect(() => Interval.from("-2562047788.01521550222 hours")).not.toThrowError();
		expect(() => Interval.from("153722867280.912930117 minutes")).not.toThrowError();
		expect(() => Interval.from("-153722867280.912930133 minutes")).not.toThrowError();
		expect(() => Interval.from("9223372036854.775807 seconds")).not.toThrowError();
		expect(() => Interval.from("-9223372036854.775808 seconds")).not.toThrowError();
		expect(() => Interval.from("9223372036854775.807 milliseconds")).not.toThrowError();
		expect(() => Interval.from("-9223372036854775.808 milliseconds")).not.toThrowError();
		expect(() => Interval.from("9223372036854775807 microseconds")).not.toThrowError();
		expect(() => Interval.from("-9223372036854775808 microseconds")).not.toThrowError();

		expect(() => Interval.from("PT2562047788H54.775807S")).not.toThrowError();
		expect(() => Interval.from("PT-2562047788H-54.775808S")).not.toThrowError();

		expect(() => Interval.from("PT2562047788:00:54.775807")).not.toThrowError();

		expect(() => Interval.from("PT2562047788.0152155019444")).not.toThrowError();
		expect(() => Interval.from("PT-2562047788.0152155022222")).not.toThrowError();

		// overflow each interval/time field
		expect(() => Interval.from("2147483648 years")).not.toThrowError();
		expect(() => Interval.from("-2147483649 years")).not.toThrowError();
		expect(() => Interval.from("2147483648 months")).not.toThrowError();
		expect(() => Interval.from("-2147483649 months")).not.toThrowError();
		expect(() => Interval.from("2147483648 days")).not.toThrowError();
		expect(() => Interval.from("-2147483649 days")).not.toThrowError();
		expect(() => Interval.from("2562047789 hours")).not.toThrowError();
		expect(() => Interval.from("-2562047789 hours")).not.toThrowError();
		expect(() => Interval.from("153722867281 minutes")).not.toThrowError();
		expect(() => Interval.from("-153722867281 minutes")).not.toThrowError();
		expect(() => Interval.from("9223372036855 seconds")).not.toThrowError();
		expect(() => Interval.from("-9223372036855 seconds")).not.toThrowError();
		expect(() => Interval.from("9223372036854777 millisecond")).not.toThrowError();
		expect(() => Interval.from("-9223372036854777 millisecond")).not.toThrowError();
		expect(() => Interval.from("9223372036854775808 microsecond")).not.toThrowError();
		expect(() => Interval.from("-9223372036854775809 microsecond")).not.toThrowError();

		expect(() => Interval.from("P2147483648")).toThrowError();
		expect(() => Interval.from("P-2147483649")).toThrowError();
		expect(() => Interval.from("P1-2147483647-2147483647")).toThrowError();
		expect(() => Interval.from("PT2562047789")).not.toThrowError();
		expect(() => Interval.from("PT-2562047789")).not.toThrowError();

		// overflow with interval/time unit aliases
		expect(() => Interval.from("2147483647 weeks")).not.toThrowError();
		expect(() => Interval.from("-2147483648 weeks")).not.toThrowError();
		expect(() => Interval.from("2147483647 decades")).not.toThrowError();
		expect(() => Interval.from("-2147483648 decades")).not.toThrowError();
		expect(() => Interval.from("2147483647 centuries")).not.toThrowError();
		expect(() => Interval.from("-2147483648 centuries")).not.toThrowError();
		expect(() => Interval.from("2147483647 millennium")).not.toThrowError();
		expect(() => Interval.from("-2147483648 millennium")).not.toThrowError();

		expect(() => Interval.from("1 week 2147483647 days")).not.toThrowError();
		expect(() => Interval.from("-1 week -2147483648 days")).not.toThrowError();
		expect(() => Interval.from("2147483647 days 1 week")).not.toThrowError();
		expect(() => Interval.from("-2147483648 days -1 week")).not.toThrowError();

		expect(() => Interval.from("P1W2147483647D")).not.toThrowError();
		expect(() => Interval.from("P-1W-2147483648D")).not.toThrowError();
		expect(() => Interval.from("P2147483647D1W")).not.toThrowError();
		expect(() => Interval.from("P-2147483648D-1W")).not.toThrowError();

		expect(() => Interval.from("1 decade 2147483647 years")).not.toThrowError();
		expect(() => Interval.from("1 century 2147483647 years")).not.toThrowError();
		expect(() => Interval.from("1 millennium 2147483647 years")).not.toThrowError();
		expect(() => Interval.from("-1 decade -2147483648 years")).not.toThrowError();
		expect(() => Interval.from("-1 century -2147483648 years")).not.toThrowError();
		expect(() => Interval.from("-1 millennium -2147483648 years")).not.toThrowError();

		expect(() => Interval.from("2147483647 years 1 decade")).not.toThrowError();
		expect(() => Interval.from("2147483647 years 1 century")).not.toThrowError();
		expect(() => Interval.from("2147483647 years 1 millennium")).not.toThrowError();
		expect(() => Interval.from("-2147483648 years -1 decade")).not.toThrowError();
		expect(() => Interval.from("-2147483648 years -1 century")).not.toThrowError();
		expect(() => Interval.from("-2147483648 years -1 millennium")).not.toThrowError();

		// overflowing with fractional fields - postgres format
		expect(() => Interval.from("0.1 millennium 2147483647 months")).not.toThrowError();
		expect(() => Interval.from("0.1 centuries 2147483647 months")).not.toThrowError();
		expect(() => Interval.from("0.1 decades 2147483647 months")).not.toThrowError();
		expect(() => Interval.from("0.1 yrs 2147483647 months")).not.toThrowError();
		expect(() => Interval.from("-0.1 millennium -2147483648 months")).not.toThrowError();
		expect(() => Interval.from("-0.1 centuries -2147483648 months")).not.toThrowError();
		expect(() => Interval.from("-0.1 decades -2147483648 months")).not.toThrowError();
		expect(() => Interval.from("-0.1 yrs -2147483648 months")).not.toThrowError();

		expect(() => Interval.from("2147483647 months 0.1 millennium")).not.toThrowError();
		expect(() => Interval.from("2147483647 months 0.1 centuries")).not.toThrowError();
		expect(() => Interval.from("2147483647 months 0.1 decades")).not.toThrowError();
		expect(() => Interval.from("2147483647 months 0.1 yrs")).not.toThrowError();
		expect(() => Interval.from("-2147483648 months -0.1 millennium")).not.toThrowError();
		expect(() => Interval.from("-2147483648 months -0.1 centuries")).not.toThrowError();
		expect(() => Interval.from("-2147483648 months -0.1 decades")).not.toThrowError();
		expect(() => Interval.from("-2147483648 months -0.1 yrs")).not.toThrowError();

		expect(() => Interval.from("0.1 months 2147483647 days")).not.toThrowError();
		expect(() => Interval.from("-0.1 months -2147483648 days")).not.toThrowError();
		expect(() => Interval.from("2147483647 days 0.1 months")).not.toThrowError();
		expect(() => Interval.from("-2147483648 days -0.1 months")).not.toThrowError();

		expect(() => Interval.from("0.5 weeks 2147483647 days")).not.toThrowError();
		expect(() => Interval.from("-0.5 weeks -2147483648 days")).not.toThrowError();
		expect(() => Interval.from("2147483647 days 0.5 weeks")).not.toThrowError();
		expect(() => Interval.from("-2147483648 days -0.5 weeks")).not.toThrowError();

		expect(() => Interval.from("0.01 months 9223372036854775807 microseconds")).not.toThrowError();
		expect(() => Interval.from("-0.01 months -9223372036854775808 microseconds")).not.toThrowError();
		expect(() => Interval.from("9223372036854775807 microseconds 0.01 months")).not.toThrowError();
		expect(() => Interval.from("-9223372036854775808 microseconds -0.01 months")).not.toThrowError();

		expect(() => Interval.from("0.1 weeks 9223372036854775807 microseconds")).not.toThrowError();
		expect(() => Interval.from("-0.1 weeks -9223372036854775808 microseconds")).not.toThrowError();
		expect(() => Interval.from("9223372036854775807 microseconds 0.1 weeks")).not.toThrowError();
		expect(() => Interval.from("-9223372036854775808 microseconds -0.1 weeks")).not.toThrowError();

		expect(() => Interval.from("0.1 days 9223372036854775807 microseconds")).not.toThrowError();
		expect(() => Interval.from("-0.1 days -9223372036854775808 microseconds")).not.toThrowError();
		expect(() => Interval.from("9223372036854775807 microseconds 0.1 days")).not.toThrowError();
		expect(() => Interval.from("-9223372036854775808 microseconds -0.1 days")).not.toThrowError();

		// overflowing with fractional fields - ISO8601 format
		expect(() => Interval.from("P0.1Y2147483647M")).not.toThrowError();
		expect(() => Interval.from("P-0.1Y-2147483648M")).not.toThrowError();
		expect(() => Interval.from("P2147483647M0.1Y")).not.toThrowError();
		expect(() => Interval.from("P-2147483648M-0.1Y")).not.toThrowError();

		expect(() => Interval.from("P0.1M2147483647D")).not.toThrowError();
		expect(() => Interval.from("P-0.1M-2147483648D")).not.toThrowError();
		expect(() => Interval.from("P2147483647D0.1M")).not.toThrowError();
		expect(() => Interval.from("P-2147483648D-0.1M")).not.toThrowError();

		expect(() => Interval.from("P0.5W2147483647D")).not.toThrowError();
		expect(() => Interval.from("P-0.5W-2147483648D")).not.toThrowError();
		expect(() => Interval.from("P2147483647D0.5W")).not.toThrowError();
		expect(() => Interval.from("P-2147483648D-0.5W")).not.toThrowError();

		expect(() => Interval.from("P0.01MT2562047788H54.775807S")).not.toThrowError();
		expect(() => Interval.from("P-0.01MT-2562047788H-54.775808S")).not.toThrowError();

		expect(() => Interval.from("P0.1DT2562047788H54.775807S")).not.toThrowError();
		expect(() => Interval.from("P-0.1DT-2562047788H-54.775808S")).not.toThrowError();

		expect(() => Interval.from("PT2562047788.1H54.775807S")).not.toThrowError();
		expect(() => Interval.from("PT-2562047788.1H-54.775808S")).not.toThrowError();

		expect(() => Interval.from("PT2562047788H0.1M54.775807S")).not.toThrowError();
		expect(() => Interval.from("PT-2562047788H-0.1M-54.775808S")).not.toThrowError();

		// overflowing with fractional fields - ISO8601 alternative format
		expect(() => Interval.from("P0.1-2147483647-00")).toThrowError();
		expect(() => Interval.from("P00-0.1-2147483647")).toThrowError();
		expect(() => Interval.from("P00-0.01-00T2562047788:00:54.775807")).not.toThrowError();
		expect(() => Interval.from("P00-00-0.1T2562047788:00:54.775807")).not.toThrowError();
		expect(() => Interval.from("PT2562047788.1:00:54.775807")).not.toThrowError();
		expect(() => Interval.from("PT2562047788:01.:54.775807")).not.toThrowError();

		// overflowing with fractional fields - SQL standard format
		expect(() => Interval.from("0.1 2562047788:0:54.775807")).not.toThrowError();
		expect(() => Interval.from("0.1 2562047788:0:54.775808 ago")).not.toThrowError();

		expect(() => Interval.from("2562047788.1:0:54.775807")).not.toThrowError();
		expect(() => Interval.from("2562047788.1:0:54.775808 ago")).not.toThrowError();

		expect(() => Interval.from("2562047788:0.1:54.775807")).not.toThrowError();
		expect(() => Interval.from("2562047788:0.1:54.775808 ago")).not.toThrowError();
	});

	it("should be returned from PostgreSQL", async () => {
		const client = new Client({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			application_name: "interval.test.ts",
		});

		await client.connect();

		let error = null;
		try {
			await client.query(`
				CREATE TABLE public.jestinterval (
					interval interval NULL,
					_interval _interval NULL
				)
			`);

			await client.query(`
				INSERT INTO public.jestinterval (interval, _interval)
				VALUES (
					'1 year 2 months 3 days 4 hours 5 minutes 6.007 seconds',
					'{ 1 year 2 months 3 days 4 hours 5 minutes 6.007 seconds, 7 years 6 months 5 days 4 hours 3 minutes 2.001 seconds }'
				)
			`);

			const result = await client.query(`
				SELECT * FROM public.jestinterval
			`);

			expect(result.rows[0].interval.toString()).toStrictEqual(
				Interval.from({
					milliseconds: 7,
					seconds: 6,
					minutes: 5,
					hours: 4,
					days: 3,
					months: 2,
					years: 1,
				}).toString()
			);
			expect(result.rows[0]._interval).toHaveLength(2);
			expect(result.rows[0]._interval[0].toString()).toStrictEqual(
				Interval.from({
					milliseconds: 7,
					seconds: 6,
					minutes: 5,
					hours: 4,
					days: 3,
					months: 2,
					years: 1,
				}).toString()
			);
			expect(result.rows[0]._interval[1].toString()).toStrictEqual(
				Interval.from({
					milliseconds: 1,
					seconds: 2,
					minutes: 3,
					hours: 4,
					days: 5,
					months: 6,
					years: 7,
				}).toString()
			);
		} catch (error_) {
			error = error_;
		}

		await client.query(`
			DROP TABLE public.jestinterval
		`);

		await client.end();

		if (error) throw error;
	});
});

//Set get functions
