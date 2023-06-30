/* eslint-disable unicorn/filename-case */
import { DateTime } from "luxon";
import { Client, types } from "pg";
import { describe, expect, it, test } from "vitest";

import { arrayParser } from "../../util/arrayParser.js";
import { arraySerializer } from "../../util/arraySerializer.js";
import { parser } from "../../util/parser.js";
import { serializer } from "../../util/serializer.js";
import { Date } from "./Date.js";
import { Time } from "./Time.js";
import { Timestamp } from "./Timestamp.js";
import { TimestampStyle, TimestampTZ } from "./TimestampTZ.js";
import { TimeTZ } from "./TimeTZ.js";

describe("TimestampTZStyle", () => {
	it("should have all Timestamp styles", () => {
		expect([
			"ISO",
			"ISO-Date",
			"ISO-Time",
			"ISO-Duration",
			"ISO-Duration-Short",
			"ISO-Duration-Basic",
			"ISO-Duration-Extended",
			"POSIX",
			"PostgreSQL",
			"PostgreSQL-Short",
			"SQL",
		]).toStrictEqual([
			TimestampStyle.ISO,
			TimestampStyle.ISODate,
			TimestampStyle.ISOTime,
			TimestampStyle.ISODuration,
			TimestampStyle.ISODurationShort,
			TimestampStyle.ISODurationBasic,
			TimestampStyle.ISODurationExtended,
			TimestampStyle.POSIX,
			TimestampStyle.PostgreSQL,
			TimestampStyle.PostgreSQLShort,
			TimestampStyle.SQL,
		]);
	});
});

describe("TimestampTZConstructor", () => {
	test("_parse(...)", () => {
		expect(TimestampTZ.safeFrom("2023-01-01T22:10:09Z").success).toBe(true);
		expect(
			TimestampTZ.safeFrom({
				year: 2022,
				month: 9,
				day: 2,
				hour: 1,
				minute: 2,
				second: 3,
				offset: { hour: 0, minute: 0, direction: "plus" },
			}).success
		).toBe(true);
		expect(TimestampTZ.safeFrom(2022, 9, 2, 1, 2, 3, 4, 5, "plus").success).toBe(true);
		expect(TimestampTZ.safeFrom(TimestampTZ.from("2023-01-01T22:10:09Z")).success).toBe(true);
		expect(TimestampTZ.safeFrom(new globalThis.Date()).success).toBe(true);
		expect(TimestampTZ.safeFrom(DateTime.now()).success).toBe(true);

		//@ts-expect-error - this is a test
		expect(() => TimestampTZ.from()).toThrowError("Function must have exactly 1 argument(s)");
		//@ts-expect-error - this is a test
		expect(() => TimestampTZ.from("a", "b")).toThrowError("Function must have exactly 1 argument(s)");
		//@ts-expect-error - this is a test
		expect(() => TimestampTZ.from(BigInt("1"))).toThrowError(
			"Expected 'number' | 'string' | 'object' | 'globalThis.Date' | 'luxon.DateTime', received 'bigint'"
		);
		expect(() => TimestampTZ.from("()")).toThrowError("Expected 'LIKE YYYY-MM-DD HH:MM:SS+HH:MM', received '()'");
		expect(() => TimestampTZ.from({} as any)).toThrowError("Missing keys in object: 'year', 'month', 'day', 'hour', 'minute', 'second', 'offset'");
		expect(() =>
			TimestampTZ.from({
				year: 2022,
				month: 9,
				day: "2",
				hour: 1,
				minute: 2,
				second: 3,
				offset: { hour: 0, minute: 0, direction: "plus" },
			} as any)
		).toThrowError("Expected 'number' for key 'day', received 'string'");
		expect(() =>
			TimestampTZ.from({
				year: 2022,
				month: 9,
				day: 2,
				week: 0,
				hour: 1,
				minute: 2,
				second: 3,
				offset: { hour: 0, minute: 0, direction: "plus" },
			} as any)
		).toThrowError("Unrecognized key in object: 'week'");
		expect(() =>
			TimestampTZ.from({
				year: 2022,
				month: 9,
				day: 2,
				hour: 1,
				minute: 2,
				second: 3,
				offset: {},
			} as any)
		).toThrowError("Missing keys in object: 'hour', 'minute', 'direction'");
		expect(() =>
			TimestampTZ.from({
				year: 2022,
				month: 9,
				day: 2,
				hour: 1,
				minute: 2,
				second: 3,
				offset: { hour: 0, minute: 0, direction: "a" as any },
			} as any)
		).toThrowError("Expected 'minus' | 'plus', received 'a'");
		expect(() =>
			TimestampTZ.from({
				year: 2022,
				month: 9,
				day: 2,
				hour: 1,
				minute: 2,
				second: 3,
				offset: { hour: 0, minute: 0, direction: "plus", second: 1 },
			} as any)
		).toThrowError("Unrecognized key in object: 'second'");
		expect(() =>
			TimestampTZ.from({
				year: 2022,
				month: 9,
				day: 2,
				hour: 1,
				minute: 2,
				second: 3,
				offset: { hour: 0, minute: "0", direction: "plus" },
			} as any)
		).toThrowError("Expected 'number' for key 'minute', received 'string'");
		expect(() => TimestampTZ.from(1, 2, "a" as any, 4, 5, 6, 7, 8, "minus")).toThrowError("Expected 'number' for key 'day', received 'string'");
		//@ts-expect-error - this is a test
		expect(() => TimestampTZ.from(1, 2, 3, 4, 5, 6)).toThrowError("Function must have exactly 9 argument(s)");
		//@ts-expect-error - this is a test
		expect(() => TimestampTZ.from(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)).toThrowError("Function must have exactly 9 argument(s)");
		expect(() => TimestampTZ.from(new globalThis.Date("a"))).toThrowError("Invalid globalThis.Date");
		expect(() => TimestampTZ.from(DateTime.fromISO("a"))).toThrowError("Invalid luxon.DateTime");

		// Test all string formats
		expect(TimestampTZ.safeFrom("2023-01-01T22:10:09-02:00").success).toBe(true);
		expect(TimestampTZ.safeFrom("2023-01-01T22:10:09-02").success).toBe(true);
		expect(TimestampTZ.safeFrom("2023-01-01").success).toBe(true);
		expect(TimestampTZ.safeFrom("22:10:09-02:00").success).toBe(true);
		expect(TimestampTZ.safeFrom("22:10+02:00").success).toBe(true);
		expect(TimestampTZ.safeFrom("22:10:09-02").success).toBe(true);
		expect(TimestampTZ.safeFrom("22:10:09").success).toBe(true);
		expect(TimestampTZ.safeFrom("22:10").success).toBe(true);
		expect(TimestampTZ.safeFrom("P2023Y1M1DT22H10M9S").success).toBe(true);
		expect(TimestampTZ.safeFrom("P20230101T221009").success).toBe(true);
		expect(TimestampTZ.safeFrom("P2023-01-01T22:10:09").success).toBe(true);
		expect(TimestampTZ.safeFrom("2023-01-01 22:10:09-02:00").success).toBe(true);
		expect(TimestampTZ.safeFrom("Sunday January 01 2023 22:10:09 GMT-02:00").success).toBe(true);
		expect(TimestampTZ.safeFrom("Sun Jan 01 2023 22:10:09 GMT-02:00").success).toBe(true);
		expect(TimestampTZ.safeFrom("2023-01 01 22:10:09").success).toBe(true);
		expect(TimestampTZ.safeFrom(DateTime.fromISO("2023-01-01T22:10:09-02:00", { setZone: true })).success).toBe(true);
		expect(TimestampTZ.safeFrom(DateTime.fromISO("2023-01-01T22:10:09+02:00", { setZone: true })).success).toBe(true);
		expect(TimestampTZ.safeFrom(new globalThis.Date("2023-01-01T22:10:09-02:00")).success).toBe(true);
		expect(TimestampTZ.safeFrom(new globalThis.Date("2023-01-01T22:10:09+02:00")).success).toBe(true);

		// Test with AM/PM
		expect(TimestampTZ.safeFrom("2023-01-01 10:10PM-02:00").success).toBe(true);
		expect(TimestampTZ.safeFrom("2023-01-01 10:10:09AM-02:00").success).toBe(true);
		expect(TimestampTZ.safeFrom("Sunday January 01 2023 10:10:09PM GMT-02:00").success).toBe(true);
		expect(TimestampTZ.safeFrom("Sunday January 01 2023 10:10:09AM GMT-02:00").success).toBe(true);
		expect(TimestampTZ.safeFrom("Sun Jan 01 2023 10:10:09PM GMT-02:00").success).toBe(true);
		expect(TimestampTZ.safeFrom("Sun Jan 01 2023 10:10:09AM GMT-02:00").success).toBe(true);
		expect(TimestampTZ.safeFrom("10:10PM PST-02:00").success).toBe(true);
		expect(TimestampTZ.safeFrom("10:10:09AM PST+02:00").success).toBe(true);
		expect(TimestampTZ.safeFrom("10:10PM PST-02").success).toBe(true);
		expect(TimestampTZ.safeFrom("10:10:09AM PST+02").success).toBe(true);
		expect(TimestampTZ.safeFrom("10:10:09PM BC").success).toBe(true);

		expect(TimestampTZ.safeFrom("10:10:09PM ABC-02:00").success).toBe(false);

		expect(() =>
			TimestampTZ.from({
				year: 2022.2,
				month: 9,
				day: 2,
				hour: 1,
				minute: 2,
				second: 3,
				offset: { hour: 0, minute: 0, direction: "plus" },
			})
		).toThrowError("Number must be whole");
		expect(() =>
			TimestampTZ.from({
				year: 2022,
				month: 9.2,
				day: 2,
				hour: 1,
				minute: 2,
				second: 3,
				offset: { hour: 0, minute: 0, direction: "plus" },
			})
		).toThrowError("Number must be whole");
		expect(() =>
			TimestampTZ.from({
				year: 2022,
				month: 0,
				day: 2,
				hour: 1,
				minute: 2,
				second: 3,
				offset: { hour: 0, minute: 0, direction: "plus" },
			})
		).toThrowError("Number must be greater than or equal to 1");
		expect(() =>
			TimestampTZ.from({
				year: 2022,
				month: 13,
				day: 2,
				hour: 1,
				minute: 2,
				second: 3,
				offset: { hour: 0, minute: 0, direction: "plus" },
			})
		).toThrowError("Number must be less than or equal to 12");
		expect(() =>
			TimestampTZ.from({
				year: 2022,
				month: 9,
				day: 2.2,
				hour: 1,
				minute: 2,
				second: 3,
				offset: { hour: 0, minute: 0, direction: "plus" },
			})
		).toThrowError("Number must be whole");
		expect(() =>
			TimestampTZ.from({
				year: 2022,
				month: 9,
				day: 0,
				hour: 1,
				minute: 2,
				second: 3,
				offset: { hour: 0, minute: 0, direction: "plus" },
			})
		).toThrowError("Number must be greater than or equal to 1");
		expect(() =>
			TimestampTZ.from({
				year: 2022,
				month: 9,
				day: 32,
				hour: 1,
				minute: 2,
				second: 3,
				offset: { hour: 0, minute: 0, direction: "plus" },
			})
		).toThrowError("Number must be less than or equal to 31");
		expect(() =>
			TimestampTZ.from({
				year: 2022,
				month: 9,
				day: 2,
				hour: 1.2,
				minute: 2,
				second: 3,
				offset: { hour: 0, minute: 0, direction: "plus" },
			})
		).toThrowError("Number must be whole");
		expect(() =>
			TimestampTZ.from({
				year: 2022,
				month: 9,
				day: 2,
				hour: 24,
				minute: 2,
				second: 3,
				offset: { hour: 0, minute: 0, direction: "plus" },
			})
		).toThrowError("Number must be less than or equal to 23");
		expect(() =>
			TimestampTZ.from({
				year: 2022,
				month: 9,
				day: 2,
				hour: -1,
				minute: 2,
				second: 3,
				offset: { hour: 0, minute: 0, direction: "plus" },
			})
		).toThrowError("Number must be greater than or equal to 0");
		expect(() =>
			TimestampTZ.from({
				year: 2022,
				month: 9,
				day: 2,
				hour: 1,
				minute: 1.2,
				second: 3,
				offset: { hour: 0, minute: 0, direction: "plus" },
			})
		).toThrowError("Number must be whole");
		expect(() =>
			TimestampTZ.from({
				year: 2022,
				month: 9,
				day: 2,
				hour: 1,
				minute: 60,
				second: 3,
				offset: { hour: 0, minute: 0, direction: "plus" },
			})
		).toThrowError("Number must be less than or equal to 59");
		expect(() =>
			TimestampTZ.from({
				year: 2022,
				month: 9,
				day: 2,
				hour: 1,
				minute: -1,
				second: 3,
				offset: { hour: 0, minute: 0, direction: "plus" },
			})
		).toThrowError("Number must be greater than or equal to 0");
		expect(() =>
			TimestampTZ.from({
				year: 2022,
				month: 9,
				day: 2,
				hour: 1,
				minute: 2,
				second: -1,
				offset: { hour: 0, minute: 0, direction: "plus" },
			})
		).toThrowError("Number must be greater than or equal to 0");
		expect(() =>
			TimestampTZ.from({
				year: 2022,
				month: 9,
				day: 2,
				hour: 1,
				minute: 2,
				second: 60,
				offset: { hour: 0, minute: 0, direction: "plus" },
			})
		).toThrowError("Number must be less than or equal to 59");
		expect(() =>
			TimestampTZ.from({
				year: 2022,
				month: 9,
				day: 2,
				hour: 1,
				minute: 2,
				second: 3,
				offset: { hour: 1.2, minute: 0, direction: "plus" },
			})
		).toThrowError("Number must be whole");
		expect(() =>
			TimestampTZ.from({
				year: 2022,
				month: 9,
				day: 2,
				hour: 1,
				minute: 2,
				second: 3,
				offset: { hour: 24, minute: 0, direction: "plus" },
			})
		).toThrowError("Number must be less than or equal to 23");
		expect(() =>
			TimestampTZ.from({
				year: 2022,
				month: 9,
				day: 2,
				hour: 1,
				minute: 2,
				second: 3,
				offset: { hour: -1, minute: 0, direction: "plus" },
			})
		).toThrowError("Number must be greater than or equal to 0");
		expect(() =>
			TimestampTZ.from({
				year: 2022,
				month: 9,
				day: 2,
				hour: 1,
				minute: 2,
				second: 3,
				offset: { hour: 0, minute: 1.2, direction: "plus" },
			})
		).toThrowError("Number must be whole");
		expect(() =>
			TimestampTZ.from({
				year: 2022,
				month: 9,
				day: 2,
				hour: 1,
				minute: 2,
				second: 3,
				offset: { hour: 0, minute: 60, direction: "plus" },
			})
		).toThrowError("Number must be less than or equal to 59");
		expect(() =>
			TimestampTZ.from({
				year: 2022,
				month: 9,
				day: 2,
				hour: 1,
				minute: 2,

				second: 3,
				offset: { hour: 0, minute: -1, direction: "plus" },
			})
		).toThrowError("Number must be greater than or equal to 0");
	});

	test("isTimestampTZ(...)", () => {
		const timestamptz = TimestampTZ.from({
			year: 2022,
			month: 9,
			day: 2,
			hour: 1,
			minute: 2,
			second: 3,
			offset: { hour: 0, minute: 0, direction: "plus" },
		});
		expect(TimestampTZ.isTimestampTZ(timestamptz)).toBe(true);
		expect(
			TimestampTZ.isTimestampTZ({
				year: 2022,
				month: 9,
				day: 2,
				hour: 1,
				minute: 2,
				second: 3,
				offset: { hour: 0, minute: 0, direction: "plus" },
			})
		).toBe(false);
	});
});

describe("TimestampTZ", () => {
	test("_equals(...)", () => {
		const timestamptz = TimestampTZ.from("2023-01-01T22:10:09Z");

		expect(timestamptz.equals(TimestampTZ.from("2023-01-01T22:10:09Z"))).toBe(true);
		expect(timestamptz.equals(TimestampTZ.from("2023-01-02T22:10:09Z"))).toBe(false);
		expect(timestamptz.equals(TimestampTZ.from("2023-01-01T22:10:09Z").toJSON())).toBe(true);
		expect(timestamptz.equals(TimestampTZ.from("2023-01-02T22:10:09Z").toJSON())).toBe(false);
		expect(timestamptz.equals(TimestampTZ.from("2023-01-01T22:10:09Z").toString())).toBe(true);
		expect(timestamptz.equals(TimestampTZ.from("2023-01-02T22:10:09Z").toString())).toBe(false);
		//@ts-expect-error - this is a test
		expect(() => timestamptz.equals(BigInt(1))).toThrowError(
			"Expected 'number' | 'string' | 'object' | 'globalThis.Date' | 'luxon.DateTime', received 'bigint'"
		);
	});

	test("toString(...)", () => {
		const timestamptz1 = TimestampTZ.from("2023-01-01T22:10:09Z");
		expect(timestamptz1.toString()).toBe("2023-01-01T22:10:09Z");
		expect(timestamptz1.toString("ISO")).toBe(timestamptz1.toString());
		expect(timestamptz1.toString("ISO-Date")).toBe("2023-01-01");
		expect(timestamptz1.toString("ISO-Time")).toBe("22:10:09Z");
		expect(timestamptz1.toString("ISO-Duration")).toBe("P2023Y1M1DT22H10M9S");
		expect(timestamptz1.toString("ISO-Duration-Basic")).toBe("P20230101T221009");
		expect(timestamptz1.toString("ISO-Duration-Extended")).toBe("P2023-01-01T22:10:09");
		expect(timestamptz1.toString("ISO-Duration-Short")).toBe("P2023Y1M1DT22H10M9S");
		expect(timestamptz1.toString("POSIX")).toBe("2023-01-01 22:10:09");
		expect(timestamptz1.toString("PostgreSQL")).toBe("Sunday January 01 2023 22:10:09 GMT");
		expect(timestamptz1.toString("PostgreSQL-Short")).toBe("Sun Jan 01 2023 22:10:09 GMT");
		expect(timestamptz1.toString("SQL")).toBe("2023-1 1 22:10:09");

		const timestamptz2 = TimestampTZ.from("2023-01-01T22:10:09+02:00");
		expect(timestamptz2.toString()).toBe("2023-01-01T22:10:09+02:00");
		expect(timestamptz2.toString("ISO")).toBe(timestamptz2.toString());
		expect(timestamptz2.toString("ISO-Date")).toBe("2023-01-01");
		expect(timestamptz2.toString("ISO-Time")).toBe("22:10:09+02:00");
		expect(timestamptz2.toString("ISO-Duration")).toBe("P2023Y1M1DT22H10M9S");
		expect(timestamptz2.toString("ISO-Duration-Basic")).toBe("P20230101T221009");
		expect(timestamptz2.toString("ISO-Duration-Extended")).toBe("P2023-01-01T22:10:09");
		expect(timestamptz2.toString("ISO-Duration-Short")).toBe("P2023Y1M1DT22H10M9S");
		expect(timestamptz2.toString("POSIX")).toBe("2023-01-01 22:10:09+02:00");
		expect(timestamptz2.toString("PostgreSQL")).toBe("Sunday January 01 2023 22:10:09 GMT+02:00");
		expect(timestamptz2.toString("PostgreSQL-Short")).toBe("Sun Jan 01 2023 22:10:09 GMT+02:00");
		expect(timestamptz2.toString("SQL")).toBe("2023-1 1 22:10:09+02:00");

		const timestamptz3 = TimestampTZ.from("2023-01-01T22:10:09-02:00");
		expect(timestamptz3.toString()).toBe("2023-01-01T22:10:09-02:00");
		expect(timestamptz3.toString("ISO")).toBe(timestamptz3.toString());
		expect(timestamptz3.toString("ISO-Date")).toBe("2023-01-01");
		expect(timestamptz3.toString("ISO-Time")).toBe("22:10:09-02:00");
		expect(timestamptz3.toString("ISO-Duration")).toBe("P2023Y1M1DT22H10M9S");
		expect(timestamptz3.toString("ISO-Duration-Basic")).toBe("P20230101T221009");
		expect(timestamptz3.toString("ISO-Duration-Extended")).toBe("P2023-01-01T22:10:09");
		expect(timestamptz3.toString("ISO-Duration-Short")).toBe("P2023Y1M1DT22H10M9S");
		expect(timestamptz3.toString("POSIX")).toBe("2023-01-01 22:10:09-02:00");
		expect(timestamptz3.toString("PostgreSQL")).toBe("Sunday January 01 2023 22:10:09 GMT-02:00");
		expect(timestamptz3.toString("PostgreSQL-Short")).toBe("Sun Jan 01 2023 22:10:09 GMT-02:00");
		expect(timestamptz3.toString("SQL")).toBe("2023-1 1 22:10:09-02:00");

		expect(() => timestamptz3.toString("any" as any)).toThrowError(
			"Expected 'ISO' | 'ISO-Date' | 'ISO-Time' | 'ISO-Duration' | 'ISO-Duration-Short' | 'ISO-Duration-Basic' | 'ISO-Duration-Extended' | 'POSIX' | 'PostgreSQL' | 'PostgreSQL-Short' | 'SQL', received 'any'"
		);
		expect(TimestampTZ.from("2023-01-01T00:00:00Z").toString("ISO-Duration-Short")).toBe("P2023Y1M1D");
		expect(TimestampTZ.from("PT0S").toString("ISO-Duration-Short")).toBe("PT0S");
	});

	test("toNumber()", () => {
		const timestamptz = TimestampTZ.from("2023-01-01T22:10:09-02:00");
		expect(timestamptz.toNumber()).toBe(1_672_618_209_000);
	});

	test("toJSON()", () => {
		const timestamptz = TimestampTZ.from("2023-01-01T22:10:09-02:00");
		expect(timestamptz.toJSON()).toEqual({
			year: 2023,
			month: 1,
			day: 1,
			hour: 22,
			minute: 10,
			second: 9,
			offset: { direction: "minus", hour: 2, minute: 0 },
		});
	});

	test("toDate()", () => {
		const timestamptz = TimestampTZ.from("2023-01-01T22:10:09-02:00");
		expect(Date.isDate(timestamptz.toDate())).toBe(true);
	});

	test("toTime()", () => {
		const timestamptz = TimestampTZ.from("2023-01-01T22:10:09-02:00");
		expect(Time.isTime(timestamptz.toTime())).toBe(true);
	});

	test("toTimeTZ()", () => {
		const timestamptz = TimestampTZ.from("2023-01-01T22:10:09-02:00");
		expect(TimeTZ.isTimeTZ(timestamptz.toTimeTZ())).toBe(true);
	});

	test("toTimestamp()", () => {
		const timestamptz = TimestampTZ.from("2023-01-01T22:10:09-02:00");
		expect(Timestamp.isTimestamp(timestamptz.toTimestamp())).toBe(true);
	});

	test("toDateTime()", () => {
		const timestamptz = TimestampTZ.from("2023-01-01T22:10:09-02:00");
		expect(timestamptz.toDateTime().isValid).toBe(true);
	});

	test("toJSDate()", () => {
		const timestamptz = TimestampTZ.from("2023-01-01T22:10:09-02:00");
		expect(timestamptz.toJSDate() instanceof globalThis.Date).toBe(true);
	});

	test("get year()", () => {
		const timestamptz = TimestampTZ.from("2023-01-01T22:10:09-02:00");
		expect(timestamptz.year).toBe(2023);
	});

	test("set year(...)", () => {
		const timestamptz = TimestampTZ.from("2023-01-01T22:10:09-02:00");
		expect(() => {
			timestamptz.year = "a" as any;
		}).toThrowError("Expected 'number', received 'string'");
		expect(() => {
			timestamptz.year = 2.5;
		}).toThrowError("Number must be whole");
		timestamptz.year = 2022;
		expect(timestamptz.year).toBe(2022);
	});

	test("get month()", () => {
		const timestamptz = TimestampTZ.from("2023-01-01T22:10:09-02:00");
		expect(timestamptz.month).toBe(1);
	});

	test("set month()", () => {
		const timestamptz = TimestampTZ.from("2023-01-01T22:10:09-02:00");
		expect(() => {
			timestamptz.month = "a" as any;
		}).toThrowError("Expected 'number', received 'string'");
		expect(() => {
			timestamptz.month = 2.5;
		}).toThrowError("Number must be whole");
		expect(() => {
			timestamptz.month = 0;
		}).toThrowError("Number must be greater than or equal to 1");
		expect(() => {
			timestamptz.month = 13;
		}).toThrowError("Number must be less than or equal to 12");
		timestamptz.month = 5;
		expect(timestamptz.month).toBe(5);
	});

	test("get day()", () => {
		const timestamptz = TimestampTZ.from("2023-01-01T22:10:09-02:00");
		expect(timestamptz.day).toBe(1);
	});

	test("set day()", () => {
		const timestamptz = TimestampTZ.from("2023-01-01T22:10:09-02:00");
		expect(() => {
			timestamptz.day = "a" as any;
		}).toThrowError("Expected 'number', received 'string'");
		expect(() => {
			timestamptz.day = 2.5;
		}).toThrowError("Number must be whole");
		expect(() => {
			timestamptz.day = 0;
		}).toThrowError("Number must be greater than or equal to 1");
		expect(() => {
			timestamptz.day = 32;
		}).toThrowError("Number must be less than or equal to 31");
		timestamptz.day = 5;
		expect(timestamptz.day).toBe(5);
	});

	test("get hour()", () => {
		const timestamptz = TimestampTZ.from("2023-01-01T22:10:09-02:00");
		expect(timestamptz.hour).toBe(22);
	});

	test("set hour()", () => {
		const timestamptz = TimestampTZ.from("2023-01-01T22:10:09-02:00");
		expect(() => {
			timestamptz.hour = "a" as any;
		}).toThrowError("Expected 'number', received 'string'");
		expect(() => {
			timestamptz.hour = 2.5;
		}).toThrowError("Number must be whole");
		expect(() => {
			timestamptz.hour = -1;
		}).toThrowError("Number must be greater than or equal to 0");
		expect(() => {
			timestamptz.hour = 24;
		}).toThrowError("Number must be less than or equal to 23");
		timestamptz.hour = 5;
		expect(timestamptz.hour).toBe(5);
	});

	test("get minute()", () => {
		const timestamptz = TimestampTZ.from("2023-01-01T22:10:09-02:00");
		expect(timestamptz.minute).toBe(10);
	});

	test("set minute()", () => {
		const timestamptz = TimestampTZ.from("2023-01-01T22:10:09-02:00");
		expect(() => {
			timestamptz.minute = "a" as any;
		}).toThrowError("Expected 'number', received 'string'");
		expect(() => {
			timestamptz.minute = 2.5;
		}).toThrowError("Number must be whole");
		expect(() => {
			timestamptz.minute = -1;
		}).toThrowError("Number must be greater than or equal to 0");
		expect(() => {
			timestamptz.minute = 60;
		}).toThrowError("Number must be less than or equal to 59");
		timestamptz.minute = 5;
		expect(timestamptz.minute).toBe(5);
	});

	test("get second()", () => {
		const timestamptz = TimestampTZ.from("2023-01-01T22:10:09-02:00");
		expect(timestamptz.second).toBe(9);
	});

	test("set second()", () => {
		const timestamptz = TimestampTZ.from("2023-01-01T22:10:09-02:00");
		expect(() => {
			timestamptz.second = "a" as any;
		}).toThrowError("Expected 'number', received 'string'");
		expect(() => {
			timestamptz.second = -1;
		}).toThrowError("Number must be greater than or equal to 0");
		expect(() => {
			timestamptz.second = 60;
		}).toThrowError("Number must be less than or equal to 59");
		timestamptz.second = 5;
		expect(timestamptz.second).toBe(5);
	});

	test("get offset()", () => {
		const timestamptz = TimestampTZ.from("2023-01-01T22:10:09-02:00");
		expect(timestamptz.offset.direction).toBe("minus");
		expect(timestamptz.offset.hour).toBe(2);
		expect(timestamptz.offset.minute).toBe(0);
	});

	test("set offset()", () => {
		const timestamptz = TimestampTZ.from("2023-01-01T22:10:09-02:00");
		expect(() => {
			timestamptz.offset = "a" as any;
		}).toThrowError("Expected 'object', received 'string'");
		expect(() => {
			timestamptz.offset = {} as any;
		}).toThrowError("Missing keys in object: 'hour', 'minute', 'direction'");
		expect(() => {
			timestamptz.offset = { hour: 2, minute: 0, direction: 1 } as any;
		}).toThrowError("Expected 'string' for key 'direction', received 'number'");
		expect(() => {
			timestamptz.offset = { hour: 2, minute: 0, direction: "plus", second: 1 } as any;
		}).toThrowError("Unrecognized key in object: 'second'");
		expect(() => {
			timestamptz.offset = { hour: 2, minute: 0, direction: "+" as any };
		}).toThrowError("Expected 'minus' | 'plus', received '+'");
		expect(() => {
			timestamptz.offset = { hour: 2.5, minute: 0, direction: "plus" };
		}).toThrowError("Number must be whole");
		expect(() => {
			timestamptz.offset = { hour: -1, minute: 0, direction: "plus" };
		}).toThrowError("Number must be greater than or equal to 0");
		expect(() => {
			timestamptz.offset = { hour: 24, minute: 0, direction: "plus" };
		}).toThrowError("Number must be less than or equal to 23");
		expect(() => {
			timestamptz.offset = { hour: 2, minute: 0.5, direction: "plus" };
		}).toThrowError("Number must be whole");
		expect(() => {
			timestamptz.offset = { hour: 2, minute: -1, direction: "plus" };
		}).toThrowError("Number must be greater than or equal to 0");
		expect(() => {
			timestamptz.offset = { hour: 2, minute: 60, direction: "plus" };
		}).toThrowError("Number must be less than or equal to 59");
		timestamptz.offset = { hour: 2, minute: 0, direction: "plus" };
		expect(timestamptz.offset).toEqual({
			direction: "plus",
			hour: 2,
			minute: 0,
		});
	});

	test("get value()", () => {
		const timestamp = TimestampTZ.from("2023-01-01T22:10:09+02:00");
		expect(timestamp.value).toBe("2023-01-01T22:10:09+02:00");
	});

	test("set value()", () => {
		const timestamp = TimestampTZ.from("2023-01-01T22:10:09 +02:00");
		expect(() => {
			timestamp.value = "a" as any;
		}).toThrowError("Expected 'LIKE YYYY-MM-DD HH:MM:SS+HH:MM', received 'a'");
		timestamp.value = "2024-01-01T22:10:09 +02:00";
		expect(timestamp.value).toBe("2024-01-01T22:10:09+02:00");
		timestamp.value = 1_704_139_809_000 as any;
		expect(timestamp.value).toBe("2024-01-01T20:10:09Z");
	});

	test("get postgres()", () => {
		const timestamp = TimestampTZ.from("2023-01-01T22:10:09+02:00");
		expect(timestamp.postgres).toBe("2023-01-01T22:10:09+02:00");
	});

	test("set postgres()", () => {
		const timestamp = TimestampTZ.from("2023-01-01T22:10:09 +02:00");
		expect(() => {
			timestamp.postgres = "a" as any;
		}).toThrowError("Expected 'LIKE YYYY-MM-DD HH:MM:SS+HH:MM', received 'a'");
		timestamp.postgres = "2024-01-01T22:10:09 +02:00";
		expect(timestamp.postgres).toBe("2024-01-01T22:10:09+02:00");
	});
});

describe("PostgreSQL", () => {
	it("should work with PostgreSQL's own tests", () => {
		//* https://github.com/postgres/postgres/blob/master/src/test/regress/sql/timestamptz.sql

		// Postgres v6.0 standard output format
		expect(() => TimestampTZ.from("Mon Feb 10 17:32:01 1997 PST")).not.toThrowError();

		// Variations on Postgres v6.1 standard output format
		expect(() => TimestampTZ.from("Mon Feb 10 17:32:01.000001 1997 PST")).not.toThrowError();
		expect(() => TimestampTZ.from("Mon Feb 10 17:32:01.999999 1997 PST")).not.toThrowError();
		expect(() => TimestampTZ.from("Mon Feb 10 17:32:01.4 1997 PST")).not.toThrowError();
		expect(() => TimestampTZ.from("Mon Feb 10 17:32:01.5 1997 PST")).not.toThrowError();
		expect(() => TimestampTZ.from("Mon Feb 10 17:32:01.6 1997 PST")).not.toThrowError();

		// ISO 8601 format
		expect(() => TimestampTZ.from("1997-01-02")).not.toThrowError();
		expect(() => TimestampTZ.from("1997-01-02 03:04:05")).not.toThrowError();
		expect(() => TimestampTZ.from("1997-02-10 17:32:01-08")).not.toThrowError();
		expect(() => TimestampTZ.from("1997-02-10 17:32:01-0800")).not.toThrowError();
		expect(() => TimestampTZ.from("1997-02-10 17:32:01 -08:00")).not.toThrowError();
		expect(() => TimestampTZ.from("19970210 173201 -0800")).not.toThrowError();
		expect(() => TimestampTZ.from("1997-06-10 17:32:01 -07:00")).not.toThrowError();
		expect(() => TimestampTZ.from("2001-09-22T18:19:20")).not.toThrowError();

		// POSIX format (note that the timezone abbrev is just decoration here)
		expect(() => TimestampTZ.from("2000-03-15 08:14:01 GMT+8")).not.toThrowError();
		expect(() => TimestampTZ.from("2000-03-15 13:14:02 GMT-1")).not.toThrowError();
		expect(() => TimestampTZ.from("2000-03-15 12:14:03 GMT-2")).not.toThrowError();
		expect(() => TimestampTZ.from("2000-03-15 03:14:04 PST+8")).not.toThrowError();
		expect(() => TimestampTZ.from("2000-03-15 02:14:05 MST+7:00")).not.toThrowError();

		// Check date conversion and date arithmetic
		expect(() => TimestampTZ.from("1997-06-10 18:32:01 PST")).not.toThrowError();

		expect(() => TimestampTZ.from("Feb 10 17:32:01 1997")).not.toThrowError();
		expect(() => TimestampTZ.from("Feb 11 17:32:01 1997")).not.toThrowError();
		expect(() => TimestampTZ.from("Feb 12 17:32:01 1997")).not.toThrowError();
		expect(() => TimestampTZ.from("Feb 13 17:32:01 1997")).not.toThrowError();
		expect(() => TimestampTZ.from("Feb 14 17:32:01 1997")).not.toThrowError();
		expect(() => TimestampTZ.from("Feb 15 17:32:01 1997")).not.toThrowError();
		expect(() => TimestampTZ.from("Feb 16 17:32:01 1997")).not.toThrowError();

		expect(() => TimestampTZ.from("Feb 16 17:32:01 0097 BC")).not.toThrowError();
		expect(() => TimestampTZ.from("Feb 16 17:32:01 0097")).not.toThrowError();
		expect(() => TimestampTZ.from("Feb 16 17:32:01 0597")).not.toThrowError();
		expect(() => TimestampTZ.from("Feb 16 17:32:01 1097")).not.toThrowError();
		expect(() => TimestampTZ.from("Feb 16 17:32:01 1697")).not.toThrowError();
		expect(() => TimestampTZ.from("Feb 16 17:32:01 1797")).not.toThrowError();
		expect(() => TimestampTZ.from("Feb 16 17:32:01 1897")).not.toThrowError();
		expect(() => TimestampTZ.from("Feb 16 17:32:01 1997")).not.toThrowError();
		expect(() => TimestampTZ.from("Feb 16 17:32:01 2097")).not.toThrowError();

		expect(() => TimestampTZ.from("Feb 28 17:32:01 1996")).not.toThrowError();
		expect(() => TimestampTZ.from("Feb 29 17:32:01 1996")).not.toThrowError();
		expect(() => TimestampTZ.from("Mar 01 17:32:01 1996")).not.toThrowError();
		expect(() => TimestampTZ.from("Dec 30 17:32:01 1996")).not.toThrowError();
		expect(() => TimestampTZ.from("Dec 31 17:32:01 1996")).not.toThrowError();
		expect(() => TimestampTZ.from("Jan 01 17:32:01 1997")).not.toThrowError();
		expect(() => TimestampTZ.from("Feb 28 17:32:01 1997")).not.toThrowError();
		expect(() => TimestampTZ.from("Feb 29 17:32:01 1997")).not.toThrowError();
		expect(() => TimestampTZ.from("Mar 01 17:32:01 1997")).not.toThrowError();
		expect(() => TimestampTZ.from("Dec 30 17:32:01 1997")).not.toThrowError();
		expect(() => TimestampTZ.from("Dec 31 17:32:01 1997")).not.toThrowError();
		expect(() => TimestampTZ.from("Dec 31 17:32:01 1999")).not.toThrowError();
		expect(() => TimestampTZ.from("Jan 01 17:32:01 2000")).not.toThrowError();
		expect(() => TimestampTZ.from("Dec 31 17:32:01 2000")).not.toThrowError();
		expect(() => TimestampTZ.from("Jan 01 17:32:01 2001")).not.toThrowError();

		// with regular and POSIXy timezone specs
		expect(() => TimestampTZ.from("Wed Jul 11 10:51:14 2001 America/New_York")).not.toThrowError();
		expect(() => TimestampTZ.from("Wed Jul 11 10:51:14 2001 GMT-4")).not.toThrowError();
		expect(() => TimestampTZ.from("Wed Jul 11 10:51:14 2001 GMT+4")).not.toThrowError();
		expect(() => TimestampTZ.from("Wed Jul 11 10:51:14 2001 PST-03:00")).not.toThrowError();
		expect(() => TimestampTZ.from("Wed Jul 11 10:51:14 2001 PST+03:00")).not.toThrowError();

		// Check behavior at the boundaries of the timestamp range
		expect(() => TimestampTZ.from("4714-11-24 00:00:00+00 BC")).not.toThrowError();
		expect(() => TimestampTZ.from("4714-11-23 16:00:00-08 BC")).not.toThrowError();
		expect(() => TimestampTZ.from("Sun Nov 23 16:00:00 4714 PST BC")).not.toThrowError();
		expect(() => TimestampTZ.from("294276-12-31 23:59:59+00")).toThrowError();
		expect(() => TimestampTZ.from("294276-12-31 15:59:59-08")).toThrowError();

		expect(() => TimestampTZ.from("2011-03-27 00:00:00 Europe/Moscow")).not.toThrowError();
		expect(() => TimestampTZ.from("2011-03-27 01:00:00 Europe/Moscow")).not.toThrowError();
		expect(() => TimestampTZ.from("2011-03-27 01:59:59 Europe/Moscow")).not.toThrowError();
		expect(() => TimestampTZ.from("2011-03-27 02:00:00 Europe/Moscow")).not.toThrowError();
		expect(() => TimestampTZ.from("2011-03-27 02:00:01 Europe/Moscow")).not.toThrowError();
		expect(() => TimestampTZ.from("2011-03-27 02:59:59 Europe/Moscow")).not.toThrowError();
		expect(() => TimestampTZ.from("2011-03-27 03:00:00 Europe/Moscow")).not.toThrowError();
		expect(() => TimestampTZ.from("2011-03-27 03:00:01 Europe/Moscow")).not.toThrowError();
		expect(() => TimestampTZ.from("2011-03-27 04:00:00 Europe/Moscow")).not.toThrowError();

		expect(() => TimestampTZ.from("2011-03-27 00:00:00 EST")).not.toThrowError();
		expect(() => TimestampTZ.from("2011-03-27 01:00:00 EST")).not.toThrowError();
		expect(() => TimestampTZ.from("2011-03-27 01:59:59 EST")).not.toThrowError();
		expect(() => TimestampTZ.from("2011-03-27 02:00:00 EST")).not.toThrowError();
		expect(() => TimestampTZ.from("2011-03-27 02:00:01 EST")).not.toThrowError();
		expect(() => TimestampTZ.from("2011-03-27 02:59:59 EST")).not.toThrowError();
		expect(() => TimestampTZ.from("2011-03-27 03:00:00 EST")).not.toThrowError();
		expect(() => TimestampTZ.from("2011-03-27 03:00:01 EST")).not.toThrowError();
		expect(() => TimestampTZ.from("2011-03-27 04:00:00 EST")).not.toThrowError();
		expect(() => TimestampTZ.from("2011-03-27 04:00:00 MSK")).toThrowError();
	});

	it("should be returned from PostgreSQL", async () => {
		const client = new Client({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			application_name: "timestamptz.test.ts",
		});

		await client.connect();

		//* PG has a native parser for the 'timestamptz' and '_timestamptz' types
		types.setTypeParser(1184 as any, value => value);
		types.setTypeParser(1185 as any, value => value);

		let error = null;
		try {
			await client.query(`
				CREATE TABLE public.vitesttimestamptz (
					timestamptz timestamptz NULL,
					_timestamptz _timestamptz NULL
				)
			`);

			const [singleInput, arrayInput] = [
				serializer<TimestampTZ>(TimestampTZ)("2004-10-19 04:05:06.789 -01:00"),
				arraySerializer<TimestampTZ>(TimestampTZ)(["2004-10-19T04:05:06.789+01:00", "2004-10-19 10:23:54.678 EST"]),
			];

			expect(singleInput).toStrictEqual("2004-10-19T04:05:06.789-01:00");
			expect(arrayInput).toStrictEqual('{"2004-10-19T04:05:06.789+01:00","2004-10-19T10:23:54.678-05:00"}');

			await client.query(
				`
				INSERT INTO public.vitesttimestamptz (timestamptz, _timestamptz)
				VALUES (
					$1::timestamptz,
					$2::_timestamptz
				)
			`,
				[singleInput, arrayInput]
			);

			const result = await client.query(`
				SELECT * FROM public.vitesttimestamptz
			`);

			result.rows[0].timestamptz = parser<TimestampTZ>(TimestampTZ)(result.rows[0].timestamptz);
			result.rows[0]._timestamptz = arrayParser<TimestampTZ>(TimestampTZ)(result.rows[0]._timestamptz);

			expect(result.rows[0].timestamptz.toString()).toStrictEqual(TimestampTZ.from("2004-10-19 05:05:06.789 +00:00").toString());
			expect(result.rows[0]._timestamptz).toHaveLength(2);
			expect(result.rows[0]._timestamptz[0].toString()).toStrictEqual(TimestampTZ.from("2004-10-19 03:05:06.789Z").toString());
			expect(result.rows[0]._timestamptz[1].toString()).toStrictEqual(TimestampTZ.from("2004-10-19 15:23:54.678Z").toString());
		} catch (error_) {
			error = error_;
			// eslint-disable-next-line no-console
			console.error(error);
		}

		await client.query(`
			DROP TABLE public.vitesttimestamptz
		`);

		await client.end();

		if (error) throw error;
	});
});
