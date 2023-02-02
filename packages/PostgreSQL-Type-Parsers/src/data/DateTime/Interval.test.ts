import { Client } from "pg";
import { describe, expect, it } from "vitest";

import { Interval } from "./Interval";

describe.todo("Interval Class", () => {
	it("should create a interval from a string", () => {
		const interval1 = Interval.from("01:02:03");
		expect(interval1).not.toBeNull();
		expect(
			interval1.equals({
				years: 0,
				months: 0,
				days: 0,
				hours: 1,
				minutes: 2,
				seconds: 3,
				milliseconds: 0,
			})
		).toBe(true);

		const interval2 = Interval.from("01:02:03.456");
		expect(interval2).not.toBeNull();
		expect(
			interval2.equals({
				years: 0,
				months: 0,
				days: 0,
				hours: 1,
				minutes: 2,
				seconds: 3,
				milliseconds: 456,
			})
		).toBe(true);

		const interval3 = Interval.from("1 year -32 days");
		expect(interval3).not.toBeNull();
		expect(
			interval3.equals({
				years: 1,
				months: 0,
				days: -32,
				hours: 0,
				minutes: 0,
				seconds: 0,
				milliseconds: 0,
			})
		).toBe(true);

		const interval4 = Interval.from("1 day -00:00:03");
		expect(interval4).not.toBeNull();
		expect(
			interval4.equals({
				years: 0,
				months: 0,
				days: 1,
				hours: 0,
				minutes: 0,
				seconds: -3,
				milliseconds: 0,
			})
		).toBe(true);

		const interval5 = Interval.from("1 day -00:00:03.456");
		expect(interval5).not.toBeNull();
		expect(
			interval5.equals({
				years: 0,
				months: 0,
				days: 1,
				hours: 0,
				minutes: 0,
				seconds: -3,
				milliseconds: -456,
			})
		).toBe(true);
		expect(Interval.from(Interval.from("01:02:03"))).not.toBeNull();
	});

	it("should create a interval from a ISO", () => {
		const interval = Interval.from("P0Y0M4DT1H2M3S");
		expect(interval).not.toBeNull();
		expect(
			interval.equals({
				years: 0,
				months: 0,
				days: 4,
				hours: 1,
				minutes: 2,
				seconds: 3,
				milliseconds: 0,
			})
		).toBe(true);
	});

	it("should create a interval from a short ISO", () => {
		const interval = Interval.from("P4DT1H2M3S");
		expect(interval).not.toBeNull();
		expect(
			interval.equals({
				years: 0,
				months: 0,
				days: 4,
				hours: 1,
				minutes: 2,
				seconds: 3,
				milliseconds: 0,
			})
		).toBe(true);
		expect(Interval.from("P1MT")).not.toBeNull();
	});

	it("should error when creating a interval from a invalid string", () => {
		expect(() => Interval.from("I guess 2 days seems fine")).toThrowError("Invalid Interval string");
	});

	it("should create a interval from numbers", () => {
		const interval = Interval.from(1, 2, 3, 4, 5, 6, 7);
		expect(interval).not.toBeNull();
		expect(
			interval.equals({
				years: 1,
				months: 2,
				days: 3,
				hours: 4,
				minutes: 5,
				seconds: 6,
				milliseconds: 7,
			})
		).toBe(true);
	});

	it("should error when creating a interval from a invalid numbers", () => {
		expect(() => Interval.from(1, 2, 3, 4, 5, 6, "7" as any)).toThrowError("Invalid Interval array, numbers only");
	});

	it("should create a interval from an object", () => {
		const interval = Interval.from({
			years: 1,
			months: 2,
			days: 3,
			hours: 4,
			minutes: 5,
			seconds: 6,
			milliseconds: 7,
		});
		expect(interval).not.toBeNull();
	});

	it("should error when creating a interval from a invalid object", () => {
		expect(() => Interval.from({} as any)).toThrowError("Invalid Interval object");
		expect(() =>
			Interval.from({
				years: 1,
				months: 2,
				days: 3,
				hours: 4,
				minutes: 5,
				seconds: 6,
				milliseconds: "7" as any,
			})
		).toThrowError("Invalid Interval object");
	});

	it("isInterval()", () => {
		const interval = Interval.from({
			seconds: 3,
			minutes: 2,
			hours: 1,
		});
		expect(Interval.isInterval(interval)).toBe(true);
		expect(
			Interval.isInterval({
				seconds: 3,
				minutes: 2,
				hours: 1,
			})
		).toBe(false);
	});

	it("toString()", () => {
		const interval1 = Interval.from({
			seconds: 3,
			minutes: 2,
			hours: 1,
		});
		expect(interval1.toString()).toBe("1 hour 2 minutes 3 seconds");
		const interval2 = Interval.from({
			milliseconds: 3,
			hours: 1,
		});
		expect(interval2.toString()).toBe("1 hour 0.003 seconds");
		const interval3 = Interval.from({
			seconds: 0,
		});
		expect(interval3.toString()).toBe("0 seconds");
	});

	it("toISOString()", () => {
		const interval1 = Interval.from({
			days: 4,
			seconds: 3,
			minutes: 2,
			hours: 1,
		});
		expect(interval1.toISOString()).toBe("P0Y0M4DT1H2M3S");
		const interval2 = Interval.from({
			years: 1,
			months: 2,
			days: 3,
		});
		expect(interval2.toISOString()).toBe("P1Y2M3DT0H0M0S");
		const interval3 = Interval.from({
			milliseconds: 3,
		});
		expect(interval3.toISOString()).toBe("P0Y0M0DT0H0M0.003S");
		const interval4 = Interval.from({
			seconds: 0,
		});
		expect(interval4.toISOString()).toBe("P0Y0M0DT0H0M0S");
	});

	it("toISOString(), short", () => {
		const interval1 = Interval.from({
			days: 4,
			seconds: 3,
			minutes: 2,
			hours: 1,
		});
		expect(interval1.toISOString(true)).toBe("P4DT1H2M3S");
		const interval2 = Interval.from({
			years: 1,
			months: 2,
			days: 3,
		});
		expect(interval2.toISOString(true)).toBe("P1Y2M3D");
		const interval3 = Interval.from({
			milliseconds: 3,
		});
		expect(interval3.toISOString(true)).toBe("PT0.003S");
		const interval4 = Interval.from({
			milliseconds: 0,
		});
		expect(interval4.toISOString(true)).toBe("PT0S");
	});

	it("toJSON()", () => {
		const interval = Interval.from({
			seconds: 3,
			minutes: 2,
			hours: 1,
		});
		expect(interval.toJSON()).toEqual({
			seconds: 3,
			minutes: 2,
			hours: 1,
		});
	});

	it("equals()", () => {
		const interval1 = Interval.from({
			seconds: 3,
			minutes: 2,
			hours: 1,
		});

		expect(
			interval1.equals(
				Interval.from({
					seconds: 3,
					minutes: 2,
					hours: 1,
				})
			)
		).toBe(true);
		expect(
			interval1.equals(
				Interval.from({
					seconds: 3,
					minutes: 2,
					hours: 2,
				}).toString()
			)
		).toBe(false);
		expect(
			interval1.equals(
				Interval.from({
					seconds: 3,
					minutes: 2,
					hours: 1,
				}).toJSON()
			)
		).toBe(true);
		expect(
			interval1.equals(
				Interval.from({
					seconds: 3,
					minutes: 2,
					hours: 2,
				}).toISOString()
			)
		).toBe(false);
		expect(
			interval1.equals(
				Interval.from({
					seconds: 3,
					minutes: 2,
					hours: 1,
				}).toISOString(true)
			)
		).toBe(true);
		expect(
			interval1.equals({
				seconds: 3,
				minutes: 2,
				hours: 2,
			})
		).toBe(false);
		expect(
			interval1.equals({
				seconds: 3,
				minutes: 2,
				hours: 1,
			})
		).toBe(true);
		const interval2 = Interval.from({
			years: 3,
			months: 2,
			days: 1,
		});
		expect(
			interval2.equals({
				years: 3,
				months: 2,
				days: 2,
			})
		).toBe(false);
		expect(
			interval2.equals({
				years: 3,
				months: 2,
				days: 1,
			})
		).toBe(true);
	});

	it("get years", () => {
		const interval1 = Interval.from({
			seconds: 3,
			minutes: 2,
			hours: 1,
		});
		expect(interval1.years).toBe(0);

		const interval2 = Interval.from({
			years: 1,
			seconds: 3,
			minutes: 2,
			hours: 1,
		});

		expect(interval2.years).toBe(1);
	});

	it("set years", () => {
		const interval = Interval.from({
			seconds: 3,
			minutes: 2,
			hours: 1,
		});
		interval.years = 1;

		expect(interval.years).toBe(1);
	});

	it("get months", () => {
		const interval1 = Interval.from({
			seconds: 3,
			minutes: 2,
			hours: 1,
		});
		expect(interval1.months).toBe(0);

		const interval2 = Interval.from({
			months: 1,
			seconds: 3,
			minutes: 2,
			hours: 1,
		});

		expect(interval2.months).toBe(1);
	});

	it("set months", () => {
		const interval = Interval.from({
			seconds: 3,
			minutes: 2,
			hours: 1,
		});
		interval.months = 1;

		expect(interval.months).toBe(1);
	});

	it("get days", () => {
		const interval1 = Interval.from({
			seconds: 3,
			minutes: 2,
			hours: 1,
		});
		expect(interval1.days).toBe(0);

		const interval2 = Interval.from({
			days: 1,
			seconds: 3,
			minutes: 2,
			hours: 1,
		});

		expect(interval2.days).toBe(1);
	});

	it("set days", () => {
		const interval = Interval.from({
			seconds: 3,
			minutes: 2,
			hours: 1,
		});
		interval.days = 1;

		expect(interval.days).toBe(1);
	});

	it("get hours", () => {
		const interval1 = Interval.from({
			seconds: 3,
			minutes: 2,
		});
		expect(interval1.hours).toBe(0);

		const interval2 = Interval.from({
			seconds: 3,
			minutes: 2,
			hours: 1,
		});

		expect(interval2.hours).toBe(1);
	});

	it("set hours", () => {
		const interval = Interval.from({
			seconds: 3,
			minutes: 2,
		});
		interval.hours = 1;

		expect(interval.hours).toBe(1);
	});

	it("get minutes", () => {
		const interval1 = Interval.from({
			seconds: 3,
		});
		expect(interval1.minutes).toBe(0);

		const interval2 = Interval.from({
			seconds: 3,
			minutes: 2,
		});

		expect(interval2.minutes).toBe(2);
	});

	it("set minutes", () => {
		const interval = Interval.from({
			seconds: 3,
		});
		interval.minutes = 2;

		expect(interval.minutes).toBe(2);
	});

	it("get seconds", () => {
		const interval = Interval.from({
			seconds: 3,
		});

		expect(interval.seconds).toBe(3);
	});

	it("set seconds", () => {
		const interval = Interval.from({
			seconds: 3,
		});
		interval.seconds = 2;

		expect(interval.seconds).toBe(2);
	});

	it("get milliseconds", () => {
		const interval = Interval.from({
			seconds: 3,
		});

		expect(interval.milliseconds).toBe(0);
	});

	it("set milliseconds", () => {
		const interval = Interval.from({
			seconds: 3,
		});
		interval.milliseconds = 2;

		expect(interval.milliseconds).toBe(2);
	});

	it("get totalMilliseconds", () => {
		const interval1 = Interval.from({
			milliseconds: 7,
			seconds: 6,
			minutes: 5,
			hours: 4,
			days: 3,
			months: 2,
			years: 1,
		});
		expect(interval1.totalMilliseconds).toBe(37065906007);
		const interval2 = Interval.from({
			milliseconds: 7,
		});
		expect(interval2.totalMilliseconds).toBe(7);
		const interval3 = Interval.from({
			seconds: 6,
		});
		expect(interval3.totalMilliseconds).toBe(6000);
	});

	it("get totalSeconds", () => {
		const interval = Interval.from({
			milliseconds: 7,
			seconds: 6,
			minutes: 5,
			hours: 4,
			days: 3,
			months: 2,
			years: 1,
		});

		expect(interval.totalSeconds).toBe(37065906.007);
	});

	it("get totalMinutes", () => {
		const interval = Interval.from({
			milliseconds: 7,
			seconds: 6,
			minutes: 5,
			hours: 4,
			days: 3,
			months: 2,
			years: 1,
		});

		expect(interval.totalMinutes).toBe(617765.1001166666);
	});

	it("get totalHours", () => {
		const interval = Interval.from({
			milliseconds: 7,
			seconds: 6,
			minutes: 5,
			hours: 4,
			days: 3,
			months: 2,
			years: 1,
		});

		expect(interval.totalHours).toBe(10296.085001944444);
	});

	it("get totalDays", () => {
		const interval = Interval.from({
			milliseconds: 7,
			seconds: 6,
			minutes: 5,
			hours: 4,
			days: 3,
			months: 2,
			years: 1,
		});

		expect(interval.totalDays).toBe(429.0035417476852);
	});

	it("get totalMonths", () => {
		const interval = Interval.from({
			milliseconds: 7,
			seconds: 6,
			minutes: 5,
			hours: 4,
			days: 3,
			months: 2,
			years: 1,
		});

		expect(interval.totalMonths).toBe(14.300118058256173);
	});

	it("get totalYears", () => {
		const interval = Interval.from({
			milliseconds: 7,
			seconds: 6,
			minutes: 5,
			hours: 4,
			days: 3,
			months: 2,
			years: 1,
		});

		expect(interval.totalYears).toBe(1.1916765048546811);
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

		// overflow each date/time field
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

		// overflow with date/time unit aliases
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
		} catch (err) {
			error = err;
		}

		await client.query(`
			DROP TABLE public.jestinterval
		`);

		await client.end();

		if (error) throw error;
	});
});

//Set get functions
