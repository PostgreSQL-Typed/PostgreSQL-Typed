import { describe, expect, test } from "vitest";

import { REGEXES } from "./regexes";

describe("regexes", () => {
	test("TraditionalPostgreSQLInterval", () => {
		const { match } = REGEXES.TraditionalPostgreSQLInterval;
		// A successful match
		expect(match(" 1 millennium 2 centuries 3 decades 4 year 5 months 6 days 7 hours 8 minutes 9 seconds 10 milliseconds 11 microseconds")).not.toBe(null);

		// A failed match
		expect(match(" 1 millennium 2 centuries 3 decades 4 year 5 months 6 days 7 hours 8 minutes 9 seconds 10 milliseconds 11 microseconds 12 nanoseconds")).toBe(
			null
		);
	});

	test("TraditionalPostgreSQLTimeInterval", () => {
		const { match } = REGEXES.TraditionalPostgreSQLTimeInterval;
		// A successful match
		expect(match(" 1 millennium 2 centuries 3 decades 4 year 5 months 6 days 07:08:09.10")).not.toBe(null);

		// A failed match
		expect(match(" 1 millennium 2 centuries 3 decades 4 year 5 months 6 days 7 hours 8 minutes 9 seconds 10 milliseconds 11 microseconds")).toBe(null);
	});

	test("ISO8601DurationsDesignators", () => {
		const { match } = REGEXES.ISO8601DurationsDesignators;
		// A successful match
		expect(match("P1Y2M3DT4H5M6S")).not.toBe(null);

		// A failed match
		expect(match("P1Y2M3DT4H5M6S7")).toBe(null);
	});

	test("ISO8601DurationsBasic", () => {
		const { match } = REGEXES.ISO8601DurationsBasic;
		// A successful match
		expect(match("P20230101T235959")).not.toBe(null);

		// A failed match
		expect(match("P1Y2M3DT4H5M6S7")).toBe(null);
	});

	test("ISO8601DurationsExtended", () => {
		const { match } = REGEXES.ISO8601DurationsExtended;
		// A successful match
		expect(match("P2023-01-01T23:59:59")).not.toBe(null);

		// A failed match
		expect(match("P1Y2M3DT4H5M6S7")).toBe(null);
	});

	test("SQLYearToSecond", () => {
		const { match } = REGEXES.SQLYearToSecond;
		// A successful match
		expect(match(" 2023-01 01 23:59:59.123456")).not.toBe(null);

		// A failed match
		expect(match("P1Y2M3DT4H5M6S7")).toBe(null);
	});

	test("SQLYearToMonth", () => {
		const { match } = REGEXES.SQLYearToMonth;
		// A successful match
		expect(match(" 2023-01")).not.toBe(null);

		// A failed match
		expect(match("P1Y2M3DT4H5M6S7")).toBe(null);
	});

	test("SQLDayToSecond", () => {
		const { match } = REGEXES.SQLDayToSecond;
		// A successful match
		expect(match(" 01 23:59:59.123456")).not.toBe(null);

		// A failed match
		expect(match("P1Y2M3DT4H5M6S7")).toBe(null);
	});

	test("SQLHourToSecond", () => {
		const { match } = REGEXES.SQLHourToSecond;
		// A successful match
		expect(match(" 23:59:59.123456")).not.toBe(null);

		// A failed match
		expect(match("P1Y2M3DT4H5M6S7")).toBe(null);
	});

	test("SQLMinuteToSecond", () => {
		const { match } = REGEXES.SQLMinuteToSecond;
		// A successful match
		expect(match(" 59:59.123456")).not.toBe(null);

		// A failed match
		expect(match("P1Y2M3DT4H5M6S7")).toBe(null);
	});

	test("SQLSecond", () => {
		const { match } = REGEXES.SQLSecond;
		// A successful match
		expect(match(" 59.123456")).not.toBe(null);

		// A failed match
		expect(match("P1Y2M3DT4H5M6S7")).toBe(null);
	});

	test("ISO8601Date", () => {
		const { match } = REGEXES.ISO8601Date;
		// A successful match
		expect(match("2023-01-01")).not.toBe(null);
		expect(match("01-01-2023")).not.toBe(null);
		expect(match("20230101")).not.toBe(null);
		expect(match("01012023")).not.toBe(null);

		// A failed match
		expect(match("2023-01-01 20:01:23")).toBe(null);
	});

	test("ISO8601Time", () => {
		const { match } = REGEXES.ISO8601Time;
		// A successful match
		expect(match("20:01:23")).not.toBe(null);
		expect(match("20:01:23.123456")).not.toBe(null);
		expect(match("20:01:23.123456+01:00")).not.toBe(null);
		expect(match("20:01:23.123456-01:00")).not.toBe(null);
		expect(match("20:01:23.123456Z")).not.toBe(null);

		// A failed match
		expect(match("2023-01-01 20:01:23")).toBe(null);
	});

	test("ISO8601DateTime", () => {
		const { match } = REGEXES.ISO8601DateTime;
		// A successful match
		expect(match("2023-01-01 20:01:23")).not.toBe(null);
		expect(match("2023-01-01 20:01:23.123456")).not.toBe(null);
		expect(match("2023-01-01 20:01:23.123456+01:00")).not.toBe(null);
		expect(match("2023-01-01 20:01:23.123456-01:00")).not.toBe(null);
		expect(match("2023-01-01 20:01:23.123456Z")).not.toBe(null);
		// Test with date format 01-01-2023
		expect(match("01-01-2023 20:01:23")).not.toBe(null);
		expect(match("01-01-2023 20:01:23.123456")).not.toBe(null);
		expect(match("01-01-2023 20:01:23.123456+01:00")).not.toBe(null);
		expect(match("01-01-2023 20:01:23.123456-01:00")).not.toBe(null);
		expect(match("01-01-2023 20:01:23.123456Z")).not.toBe(null);

		// A failed match
		expect(match("2023-01-01")).toBe(null);
	});

	test("POSIXDateTime", () => {
		const { match } = REGEXES.POSIXDateTime;
		// A successful match
		expect(match("2023-01-01 20:01:23")).not.toBe(null);
		expect(match("2023-01-01 20:01:23.123456")).not.toBe(null);
		expect(match("2023-01-01 20:01:23.123456 PST")).not.toBe(null);
		expect(match("2023-01-01 20:01:23.123456 Europe/Amsterdam")).not.toBe(null);
		expect(match("2023-01-01 20:01:23.123456 PST-05:00")).not.toBe(null);
		expect(match("2023-01-01 20:01:23.123456 PST+05:00")).not.toBe(null);
		// Test with date format 01-01-2023
		expect(match("01-01-2023 20:01:23")).not.toBe(null);
		expect(match("01-01-2023 20:01:23.123456")).not.toBe(null);
		expect(match("01-01-2023 20:01:23.123456 PST")).not.toBe(null);
		expect(match("01-01-2023 20:01:23.123456 Europe/Amsterdam")).not.toBe(null);
		expect(match("01-01-2023 20:01:23.123456 PST-05:00")).not.toBe(null);
		expect(match("01-01-2023 20:01:23.123456 PST+05:00")).not.toBe(null);

		// A failed match
		expect(match("2023-01-01")).toBe(null);
	});

	test("POSIXTime", () => {
		const { match } = REGEXES.POSIXTime;
		// A successful match
		expect(match("20:01:23")).not.toBe(null);
		expect(match("20:01:23.123456")).not.toBe(null);
		expect(match("20:01:23.123456 PST")).not.toBe(null);
		expect(match("20:01:23.123456 Europe/Amsterdam")).not.toBe(null);
		expect(match("20:01:23.123456 PST-05:00")).not.toBe(null);
		expect(match("20:01:23.123456 PST+05:00")).not.toBe(null);
		// A failed match
		expect(match("2023-01-01 20:01:23")).toBe(null);
	});

	test("PostgreSQLDateTime", () => {
		const { match } = REGEXES.PostgreSQLDateTime;
		// A successful match
		expect(match("Mon Jan 01 2023 20:01:23 GMT+01:00")).not.toBe(null);
		expect(match("Mon Jan 01 2023 20:01:23 GMT-01:00")).not.toBe(null);
		expect(match("Mon Jan 01 20:01:23 2023 GMT+01:00")).not.toBe(null);
		expect(match("Mon Jan 01 20:01:23 2023 GMT-01:00")).not.toBe(null);
		// Test each day of week and month
		expect(match("Sun Jan 01 2023 20:01:23 GMT+01:00")).not.toBe(null);
		expect(match("Mon Feb 01 2023 20:01:23 GMT-01:00")).not.toBe(null);
		expect(match("Tue Mar 01 20:01:23 2023 GMT+01:00")).not.toBe(null);
		expect(match("Wed Apr 01 20:01:23 2023 GMT-01:00")).not.toBe(null);
		expect(match("Thu May 01 20:01:23 2023 GMT+01:00")).not.toBe(null);
		expect(match("Fri Jun 01 20:01:23 2023 GMT-01:00")).not.toBe(null);
		expect(match("Sat Jul 01 20:01:23 2023 GMT+01:00")).not.toBe(null);
		expect(match("Sun Aug 01 20:01:23 2023 GMT-01:00")).not.toBe(null);
		expect(match("Mon Sep 01 20:01:23 2023 GMT+01:00")).not.toBe(null);
		expect(match("Tue Oct 01 20:01:23 2023 GMT-01:00")).not.toBe(null);
		expect(match("Wed Nov 01 20:01:23 2023 GMT+01:00")).not.toBe(null);
		expect(match("Thu Dec 01 20:01:23 2023 GMT-01:00")).not.toBe(null);
		// With Day of Week and Month in full
		expect(match("Monday January 01 2023 20:01:23 GMT+01:00")).not.toBe(null);
		expect(match("Monday January 01 2023 20:01:23 GMT-01:00")).not.toBe(null);
		expect(match("Monday January 01 20:01:23 2023 GMT+01:00")).not.toBe(null);
		expect(match("Monday January 01 20:01:23 2023 GMT-01:00")).not.toBe(null);
		// Test each day of week and month
		expect(match("Sunday January 01 2023 20:01:23 GMT+01:00")).not.toBe(null);
		expect(match("Monday February 01 2023 20:01:23 GMT-01:00")).not.toBe(null);
		expect(match("Tuesday March 01 20:01:23 2023 GMT+01:00")).not.toBe(null);
		expect(match("Wednesday April 01 20:01:23 2023 GMT-01:00")).not.toBe(null);
		expect(match("Thursday May 01 2023 20:01:23 GMT+01:00")).not.toBe(null);
		expect(match("Friday June 01 2023 20:01:23 GMT-01:00")).not.toBe(null);
		expect(match("Saturday July 01 20:01:23 2023 GMT+01:00")).not.toBe(null);
		expect(match("Sunday August 01 20:01:23 2023 GMT-01:00")).not.toBe(null);
		expect(match("Monday September 01 2023 20:01:23 GMT+01:00")).not.toBe(null);
		expect(match("Tuesday October 01 2023 20:01:23 GMT-01:00")).not.toBe(null);
		expect(match("Wednesday November 01 20:01:23 2023 GMT+01:00")).not.toBe(null);
		expect(match("Thursday December 01 20:01:23 2023 GMT-01:00")).not.toBe(null);

		// A failed match
		expect(match("2023-01-01")).toBe(null);
	});
});
