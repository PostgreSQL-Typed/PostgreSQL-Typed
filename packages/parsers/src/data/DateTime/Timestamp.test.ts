import { DateTime } from "luxon";
import { Client } from "pg";
import { describe, expect, it, test } from "vitest";

import { Date } from "./Date.js";
import { Time } from "./Time.js";
import { Timestamp } from "./Timestamp.js";

describe("TimestampConstructor", () => {
	test("_parse(...)", () => {
		expect(Timestamp.safeFrom("2023-01-01T22:10:09Z").success).toBe(true);
		expect(
			Timestamp.safeFrom({
				year: 2022,
				month: 9,
				day: 2,
				hour: 1,
				minute: 2,
				second: 3,
			}).success
		).toBe(true);
		expect(Timestamp.safeFrom(2022, 9, 2, 1, 2, 3).success).toBe(true);
		expect(Timestamp.safeFrom(Timestamp.from("2023-01-01T22:10:09Z")).success).toBe(true);
		expect(Timestamp.safeFrom(new globalThis.Date()).success).toBe(true);
		expect(Timestamp.safeFrom(DateTime.now()).success).toBe(true);

		//@ts-expect-error - this is a test
		expect(() => Timestamp.from()).toThrowError("Function must have exactly 1 argument(s)");
		//@ts-expect-error - this is a test
		expect(() => Timestamp.from("a", "b")).toThrowError("Function must have exactly 1 argument(s)");
		//@ts-expect-error - this is a test
		expect(() => Timestamp.from(BigInt("1"))).toThrowError("Expected 'number' | 'string' | 'object' | 'globalThis.Date' | 'luxon.DateTime', received 'bigint'");
		expect(() => Timestamp.from("()")).toThrowError("Expected 'LIKE YYYY-MM-DD HH:MM:SS', received '()'");
		expect(() => Timestamp.from({} as any)).toThrowError("Missing keys in object: 'year', 'month', 'day', 'hour', 'minute', 'second'");
		expect(() =>
			Timestamp.from({
				year: 2022,
				month: 9,
				day: "2",
				hour: 1,
				minute: 2,
				second: 3,
			} as any)
		).toThrowError("Expected 'number' for key 'day', received 'string'");
		expect(() =>
			Timestamp.from({
				year: 2022,
				month: 9,
				day: 2,
				week: 0,
				hour: 1,
				minute: 2,
				second: 3,
			} as any)
		).toThrowError("Unrecognized key in object: 'week'");
		expect(() => Timestamp.from(1, 2, "a" as any, 4, 5, 6)).toThrowError("Expected 'number', received 'string'");
		//@ts-expect-error - this is a test
		expect(() => Timestamp.from(1, 2, 3, 4, 5)).toThrowError("Function must have exactly 6 argument(s)");
		//@ts-expect-error - this is a test
		expect(() => Timestamp.from(1, 2, 3, 4, 5, 6, 7)).toThrowError("Function must have exactly 6 argument(s)");
		expect(() => Timestamp.from(new globalThis.Date("a"))).toThrowError("Invalid globalThis.Date");
		expect(() => Timestamp.from(DateTime.fromISO("a"))).toThrowError("Invalid luxon.DateTime");

		// Test all string formats
		expect(Timestamp.safeFrom("2023-01-01T22:10:09").success).toBe(true);
		expect(Timestamp.safeFrom("2023-01-01").success).toBe(true);
		expect(Timestamp.safeFrom("22:10:09").success).toBe(true);
		expect(Timestamp.safeFrom("P2023Y1M1DT22H10M9S").success).toBe(true);
		expect(Timestamp.safeFrom("P20230101T221009").success).toBe(true);
		expect(Timestamp.safeFrom("P2023-01-01T22:10:09").success).toBe(true);
		expect(Timestamp.safeFrom("2023-01-01 22:10:09").success).toBe(true);
		expect(Timestamp.safeFrom("Sunday January 01 2023 22:10:09 GMT").success).toBe(true);
		expect(Timestamp.safeFrom("Sun Jan 01 2023 22:10:09 GMT").success).toBe(true);
		expect(Timestamp.safeFrom(DateTime.fromISO("2023-01-01T22:10:09Z")).success).toBe(true);
		expect(Timestamp.safeFrom(new globalThis.Date("2023-01-01T22:10:09Z")).success).toBe(true);

		expect(() =>
			Timestamp.from({
				year: 2022.2,
				month: 9,
				day: 2,
				hour: 1,
				minute: 2,
				second: 3,
			})
		).toThrowError("Number must be whole");
		expect(() =>
			Timestamp.from({
				year: 2022,
				month: 9.2,
				day: 2,
				hour: 1,
				minute: 2,
				second: 3,
			})
		).toThrowError("Number must be whole");
		expect(() =>
			Timestamp.from({
				year: 2022,
				month: 0,
				day: 2,
				hour: 1,
				minute: 2,
				second: 3,
			})
		).toThrowError("Number must be greater than or equal to 1");
		expect(() =>
			Timestamp.from({
				year: 2022,
				month: 13,
				day: 2,
				hour: 1,
				minute: 2,
				second: 3,
			})
		).toThrowError("Number must be less than or equal to 12");
		expect(() =>
			Timestamp.from({
				year: 2022,
				month: 9,
				day: 2.2,
				hour: 1,
				minute: 2,
				second: 3,
			})
		).toThrowError("Number must be whole");
		expect(() =>
			Timestamp.from({
				year: 2022,
				month: 9,
				day: 0,
				hour: 1,
				minute: 2,
				second: 3,
			})
		).toThrowError("Number must be greater than or equal to 1");
		expect(() =>
			Timestamp.from({
				year: 2022,
				month: 9,
				day: 32,
				hour: 1,
				minute: 2,
				second: 3,
			})
		).toThrowError("Number must be less than or equal to 31");
		expect(() =>
			Timestamp.from({
				year: 2022,
				month: 9,
				day: 2,
				hour: 1.2,
				minute: 2,
				second: 3,
			})
		).toThrowError("Number must be whole");
		expect(() =>
			Timestamp.from({
				year: 2022,
				month: 9,
				day: 2,
				hour: 24,
				minute: 2,
				second: 3,
			})
		).toThrowError("Number must be less than or equal to 23");
		expect(() =>
			Timestamp.from({
				year: 2022,
				month: 9,
				day: 2,
				hour: -1,
				minute: 2,
				second: 3,
			})
		).toThrowError("Number must be greater than or equal to 0");
		expect(() =>
			Timestamp.from({
				year: 2022,
				month: 9,
				day: 2,
				hour: 1,
				minute: 1.2,
				second: 3,
			})
		).toThrowError("Number must be whole");
		expect(() =>
			Timestamp.from({
				year: 2022,
				month: 9,
				day: 2,
				hour: 1,
				minute: 60,
				second: 3,
			})
		).toThrowError("Number must be less than or equal to 59");
		expect(() =>
			Timestamp.from({
				year: 2022,
				month: 9,
				day: 2,
				hour: 1,
				minute: -1,
				second: 3,
			})
		).toThrowError("Number must be greater than or equal to 0");
		expect(() =>
			Timestamp.from({
				year: 2022,
				month: 9,
				day: 2,
				hour: 1,
				minute: 2,
				second: -1,
			})
		).toThrowError("Number must be greater than or equal to 0");
		expect(() =>
			Timestamp.from({
				year: 2022,
				month: 9,
				day: 2,
				hour: 1,
				minute: 2,
				second: 60,
			})
		).toThrowError("Number must be less than or equal to 59");
	});

	test("isTimestamp(...)", () => {
		const timestamp = Timestamp.from({
			year: 2022,
			month: 9,
			day: 2,
			hour: 1,
			minute: 2,
			second: 3,
		});
		expect(Timestamp.isTimestamp(timestamp)).toBe(true);
		expect(
			Timestamp.isTimestamp({
				year: 2022,
				month: 9,
				day: 2,
				hour: 1,
				minute: 2,
				second: 3,
			})
		).toBe(false);
	});
});

describe("Timestamp", () => {
	test("_equals(...)", () => {
		const timestamp = Timestamp.from("2023-01-01T22:10:09Z");

		expect(timestamp.equals(Timestamp.from("2023-01-01T22:10:09Z"))).toBe(true);
		expect(timestamp.equals(Timestamp.from("2023-01-02T22:10:09Z"))).toBe(false);
		expect(timestamp.equals(Timestamp.from("2023-01-01T22:10:09Z").toJSON())).toBe(true);
		expect(timestamp.equals(Timestamp.from("2023-01-02T22:10:09Z").toJSON())).toBe(false);
		expect(timestamp.equals(Timestamp.from("2023-01-01T22:10:09Z").toString())).toBe(true);
		expect(timestamp.equals(Timestamp.from("2023-01-02T22:10:09Z").toString())).toBe(false);
		//@ts-expect-error - this is a test
		expect(() => timestamp.equals(BigInt(1))).toThrowError("Expected 'number' | 'string' | 'object' | 'globalThis.Date' | 'luxon.DateTime', received 'bigint'");
	});

	test("toString(...)", () => {
		const timestamp1 = Timestamp.from("2023-01-01T22:10:09Z");
		expect(timestamp1.toString()).toBe("2023-01-01T22:10:09Z");
		expect(timestamp1.toString("ISO")).toBe(timestamp1.toString());
		expect(timestamp1.toString("ISO-Date")).toBe("2023-01-01");
		expect(timestamp1.toString("ISO-Time")).toBe("22:10:09Z");
		expect(timestamp1.toString("ISO-Duration")).toBe("P2023Y1M1DT22H10M9S");
		expect(timestamp1.toString("ISO-Duration-Basic")).toBe("P20230101T221009");
		expect(timestamp1.toString("ISO-Duration-Extended")).toBe("P2023-01-01T22:10:09");
		expect(timestamp1.toString("ISO-Duration-Short")).toBe("P2023Y1M1DT22H10M9S");
		expect(timestamp1.toString("POSIX")).toBe("2023-01-01 22:10:09");
		expect(timestamp1.toString("PostgreSQL")).toBe("Sunday January 01 2023 22:10:09 GMT");
		expect(timestamp1.toString("PostgreSQL-Short")).toBe("Sun Jan 01 2023 22:10:09 GMT");
		expect(timestamp1.toString("SQL")).toBe("2023-1 1 22:10:09");

		expect(() => timestamp1.toString("any" as any)).toThrowError(
			"Expected 'ISO' | 'ISO-Date' | 'ISO-Time' | 'ISO-Duration' | 'ISO-Duration-Short' | 'ISO-Duration-Basic' | 'ISO-Duration-Extended' | 'POSIX' | 'PostgreSQL' | 'PostgreSQL-Short' | 'SQL', received 'any'"
		);
		expect(Timestamp.from("2023-01-01T00:00:00Z").toString("ISO-Duration-Short")).toBe("P2023Y1M1D");
	});

	test("toJSON()", () => {
		const timestamp = Timestamp.from("2023-01-01T22:10:09Z");
		expect(timestamp.toJSON()).toEqual({
			year: 2023,
			month: 1,
			day: 1,
			hour: 22,
			minute: 10,
			second: 9,
		});
	});

	test("toDate()", () => {
		const timestamp = Timestamp.from("2023-01-01T22:10:09");
		expect(Date.isDate(timestamp.toDate())).toBe(true);
	});

	test("toTime()", () => {
		const timestamp = Timestamp.from("2023-01-01T22:10:09");
		expect(Time.isTime(timestamp.toTime())).toBe(true);
	});

	test("toDateTime()", () => {
		const timestamp = Timestamp.from("2023-01-01T22:10:09");
		expect(timestamp.toDateTime().isValid).toBe(true);
	});

	test("toJSDate()", () => {
		const timestamp = Timestamp.from("2023-01-01T22:10:09");
		expect(timestamp.toJSDate() instanceof globalThis.Date).toBe(true);
	});

	test("get year()", () => {
		const timestamp = Timestamp.from("2023-01-01T22:10:09");
		expect(timestamp.year).toBe(2023);
	});

	test("set year(...)", () => {
		const timestamp = Timestamp.from("2023-01-01T22:10:09");
		expect(() => {
			timestamp.year = "a" as any;
		}).toThrowError("Expected 'number', received 'string'");
		expect(() => {
			timestamp.year = 2.5;
		}).toThrowError("Number must be whole");
		timestamp.year = 2022;
		expect(timestamp.year).toBe(2022);
	});

	test("get month()", () => {
		const timestamp = Timestamp.from("2023-01-01T22:10:09");
		expect(timestamp.month).toBe(1);
	});

	test("set month()", () => {
		const timestamp = Timestamp.from("2023-01-01T22:10:09");
		expect(() => {
			timestamp.month = "a" as any;
		}).toThrowError("Expected 'number', received 'string'");
		expect(() => {
			timestamp.month = 2.5;
		}).toThrowError("Number must be whole");
		expect(() => {
			timestamp.month = 0;
		}).toThrowError("Number must be greater than or equal to 1");
		expect(() => {
			timestamp.month = 13;
		}).toThrowError("Number must be less than or equal to 12");
		timestamp.month = 5;
		expect(timestamp.month).toBe(5);
	});

	test("get day()", () => {
		const timestamp = Timestamp.from("2023-01-01T22:10:09");
		expect(timestamp.day).toBe(1);
	});

	test("set day()", () => {
		const timestamp = Timestamp.from("2023-01-01T22:10:09");
		expect(() => {
			timestamp.day = "a" as any;
		}).toThrowError("Expected 'number', received 'string'");
		expect(() => {
			timestamp.day = 2.5;
		}).toThrowError("Number must be whole");
		expect(() => {
			timestamp.day = 0;
		}).toThrowError("Number must be greater than or equal to 1");
		expect(() => {
			timestamp.day = 32;
		}).toThrowError("Number must be less than or equal to 31");
		timestamp.day = 5;
		expect(timestamp.day).toBe(5);
	});

	test("get hour()", () => {
		const timestamp = Timestamp.from("2023-01-01T22:10:09");
		expect(timestamp.hour).toBe(22);
	});

	test("set hour()", () => {
		const timestamp = Timestamp.from("2023-01-01T22:10:09");
		expect(() => {
			timestamp.hour = "a" as any;
		}).toThrowError("Expected 'number', received 'string'");
		expect(() => {
			timestamp.hour = 2.5;
		}).toThrowError("Number must be whole");
		expect(() => {
			timestamp.hour = -1;
		}).toThrowError("Number must be greater than or equal to 0");
		expect(() => {
			timestamp.hour = 24;
		}).toThrowError("Number must be less than or equal to 23");
		timestamp.hour = 5;
		expect(timestamp.hour).toBe(5);
	});

	test("get minute()", () => {
		const timestamp = Timestamp.from("2023-01-01T22:10:09");
		expect(timestamp.minute).toBe(10);
	});

	test("set minute()", () => {
		const timestamp = Timestamp.from("2023-01-01T22:10:09");
		expect(() => {
			timestamp.minute = "a" as any;
		}).toThrowError("Expected 'number', received 'string'");
		expect(() => {
			timestamp.minute = 2.5;
		}).toThrowError("Number must be whole");
		expect(() => {
			timestamp.minute = -1;
		}).toThrowError("Number must be greater than or equal to 0");
		expect(() => {
			timestamp.minute = 60;
		}).toThrowError("Number must be less than or equal to 59");
		timestamp.minute = 5;
		expect(timestamp.minute).toBe(5);
	});

	test("get second()", () => {
		const timestamp = Timestamp.from("2023-01-01T22:10:09");
		expect(timestamp.second).toBe(9);
	});

	test("set second()", () => {
		const timestamp = Timestamp.from("2023-01-01T22:10:09");
		expect(() => {
			timestamp.second = "a" as any;
		}).toThrowError("Expected 'number', received 'string'");
		expect(() => {
			timestamp.second = -1;
		}).toThrowError("Number must be greater than or equal to 0");
		expect(() => {
			timestamp.second = 60;
		}).toThrowError("Number must be less than or equal to 59");
		timestamp.second = 5;
		expect(timestamp.second).toBe(5);
	});
});

describe("PostgreSQL", () => {
	it("should work with PostgreSQL's own tests", () => {
		//* https://github.com/postgres/postgres/blob/master/src/test/regress/sql/timestamp.sql
		// Variations on Postgres v6.1 standard output format
		expect(() => Timestamp.from("Mon Feb 10 17:32:01.000001 1997 PST")).not.toThrowError();
		expect(() => Timestamp.from("Mon Feb 10 17:32:01.999999 1997 PST")).not.toThrowError();
		expect(() => Timestamp.from("Mon Feb 10 17:32:01.4 1997 PST")).not.toThrowError();
		expect(() => Timestamp.from("Mon Feb 10 17:32:01.5 1997 PST")).not.toThrowError();
		expect(() => Timestamp.from("Mon Feb 10 17:32:01.6 1997 PST")).not.toThrowError();

		// ISO 8601 format
		expect(() => Timestamp.from("1997-01-02")).not.toThrowError();
		expect(() => Timestamp.from("1997-01-02 03:04:05")).not.toThrowError();
		expect(() => Timestamp.from("1997-02-10 17:32:01-08")).not.toThrowError();
		expect(() => Timestamp.from("1997-02-10 17:32:01-0800")).not.toThrowError();
		expect(() => Timestamp.from("1997-02-10 17:32:01 -08:00")).not.toThrowError();
		expect(() => Timestamp.from("19970210 173201 -0800")).not.toThrowError();
		expect(() => Timestamp.from("1997-06-10 17:32:01 -07:00")).not.toThrowError();
		expect(() => Timestamp.from("2001-09-22T18:19:20")).not.toThrowError();

		// POSIX format (note that the timezone abbrev is just decoration here)
		expect(() => Timestamp.from("2000-03-15 08:14:01 GMT+8")).not.toThrowError();
		expect(() => Timestamp.from("2000-03-15 13:14:02 GMT-1")).not.toThrowError();
		expect(() => Timestamp.from("2000-03-15 12:14:03 GMT-2")).not.toThrowError();
		expect(() => Timestamp.from("2000-03-15 03:14:04 PST+8")).not.toThrowError();
		expect(() => Timestamp.from("2000-03-15 02:14:05 MST+7:00")).not.toThrowError();

		// Variations for acceptable input formats
		expect(() => Timestamp.from("Feb 10 1997 17:32:01 -08:00")).not.toThrowError();
		expect(() => Timestamp.from("Feb 10 17:32:01 1997")).not.toThrowError();
		expect(() => Timestamp.from("1997/02/10 17:32:01-0800")).not.toThrowError();
		expect(() => Timestamp.from("1997-02-10 17:32:01 PST")).not.toThrowError();
		expect(() => Timestamp.from("02-10-1997 17:32:01 PST")).not.toThrowError();
		expect(() => Timestamp.from("19970210 173201 PST")).not.toThrowError();

		// Check date conversion and date arithmetic
		expect(() => Timestamp.from("1997-06-10 18:32:01 PST")).not.toThrowError();

		expect(() => Timestamp.from("Feb 10 17:32:01 1997")).not.toThrowError();
		expect(() => Timestamp.from("Feb 11 17:32:01 1997")).not.toThrowError();
		expect(() => Timestamp.from("Feb 12 17:32:01 1997")).not.toThrowError();
		expect(() => Timestamp.from("Feb 13 17:32:01 1997")).not.toThrowError();
		expect(() => Timestamp.from("Feb 14 17:32:01 1997")).not.toThrowError();
		expect(() => Timestamp.from("Feb 15 17:32:01 1997")).not.toThrowError();
		expect(() => Timestamp.from("Feb 16 17:32:01 1997")).not.toThrowError();

		expect(() => Timestamp.from("Feb 16 17:32:01 0097 BC")).not.toThrowError();
		expect(() => Timestamp.from("Feb 16 17:32:01 0097")).not.toThrowError();
		expect(() => Timestamp.from("Feb 16 17:32:01 0597")).not.toThrowError();
		expect(() => Timestamp.from("Feb 16 17:32:01 1097")).not.toThrowError();
		expect(() => Timestamp.from("Feb 16 17:32:01 1697")).not.toThrowError();
		expect(() => Timestamp.from("Feb 16 17:32:01 1797")).not.toThrowError();
		expect(() => Timestamp.from("Feb 16 17:32:01 1897")).not.toThrowError();
		expect(() => Timestamp.from("Feb 16 17:32:01 1997")).not.toThrowError();
		expect(() => Timestamp.from("Feb 16 17:32:01 2097")).not.toThrowError();

		expect(() => Timestamp.from("Feb 28 17:32:01 1996")).not.toThrowError();
		expect(() => Timestamp.from("Feb 29 17:32:01 1996")).not.toThrowError();
		expect(() => Timestamp.from("Mar 01 17:32:01 1996")).not.toThrowError();
		expect(() => Timestamp.from("Dec 30 17:32:01 1996")).not.toThrowError();
		expect(() => Timestamp.from("Dec 31 17:32:01 1996")).not.toThrowError();
		expect(() => Timestamp.from("Jan 01 17:32:01 1997")).not.toThrowError();
		expect(() => Timestamp.from("Feb 28 17:32:01 1997")).not.toThrowError();
		expect(() => Timestamp.from("Feb 29 17:32:01 1997")).not.toThrowError();
		expect(() => Timestamp.from("Mar 01 17:32:01 1997")).not.toThrowError();
		expect(() => Timestamp.from("Dec 30 17:32:01 1997")).not.toThrowError();
		expect(() => Timestamp.from("Dec 31 17:32:01 1997")).not.toThrowError();
		expect(() => Timestamp.from("Dec 31 17:32:01 1999")).not.toThrowError();
		expect(() => Timestamp.from("Jan 01 17:32:01 2000")).not.toThrowError();
		expect(() => Timestamp.from("Dec 31 17:32:01 2000")).not.toThrowError();
		expect(() => Timestamp.from("Jan 01 17:32:01 2001")).not.toThrowError();
	});

	it("should be returned from PostgreSQL", async () => {
		const client = new Client({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			application_name: "timestamp.test.ts",
		});

		await client.connect();

		let error = null;
		try {
			await client.query(`
				CREATE TABLE public.vitesttimestamp (
					timestamp timestamp NULL,
					_timestamp _timestamp NULL
				)
			`);

			await client.query(`
				INSERT INTO public.vitesttimestamp (timestamp, _timestamp)
				VALUES (
					'2004-10-19 10:23:54.678',
					'{ 2019-01-02 03:04:05.678, 2022-09-08 07:06:05 }'
				)
			`);

			const result = await client.query(`
				SELECT * FROM public.vitesttimestamp
			`);

			expect(result.rows[0].timestamp.toString()).toStrictEqual(
				Timestamp.from({
					year: 2004,
					month: 10,
					day: 19,
					hour: 10,
					minute: 23,
					second: 54.678,
				}).toString()
			);
			expect(result.rows[0]._timestamp).toHaveLength(2);
			expect(result.rows[0]._timestamp[0].toString()).toStrictEqual(
				Timestamp.from({
					year: 2019,
					month: 1,
					day: 2,
					hour: 3,
					minute: 4,
					second: 5.678,
				}).toString()
			);
			expect(result.rows[0]._timestamp[1].toString()).toStrictEqual(
				Timestamp.from({
					year: 2022,
					month: 9,
					day: 8,
					hour: 7,
					minute: 6,
					second: 5,
				}).toString()
			);
		} catch (error_) {
			error = error_;
			// eslint-disable-next-line no-console
			console.error(error);
		}

		await client.query(`
			DROP TABLE public.vitesttimestamp
		`);

		await client.end();

		if (error) throw error;
	});
});