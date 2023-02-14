/* eslint-disable unicorn/filename-case */
import { DateTime } from "luxon";
import { Client } from "pg";
import { describe, expect, it, test } from "vitest";

import { Time } from "./Time.js";
import { TimeTZ } from "./TimeTZ.js";

describe("TimeTZConstructor", () => {
	test("_parse(...)", () => {
		expect(TimeTZ.safeFrom("22:10:09Z").success).toBe(true);
		expect(
			TimeTZ.safeFrom({
				hour: 1,
				minute: 2,
				second: 3,
				offset: { hour: 0, minute: 0, direction: "plus" },
			}).success
		).toBe(true);
		expect(TimeTZ.safeFrom(1, 2, 3, 4, 5, "plus").success).toBe(true);
		expect(TimeTZ.safeFrom(TimeTZ.from("2023-01-01T22:10:09Z")).success).toBe(true);
		expect(TimeTZ.safeFrom(new globalThis.Date()).success).toBe(true);
		expect(TimeTZ.safeFrom(DateTime.now()).success).toBe(true);

		//@ts-expect-error - this is a test
		expect(() => TimeTZ.from()).toThrowError("Function must have exactly 1 argument(s)");
		//@ts-expect-error - this is a test
		expect(() => TimeTZ.from("a", "b")).toThrowError("Function must have exactly 1 argument(s)");
		//@ts-expect-error - this is a test
		expect(() => TimeTZ.from(BigInt("1"))).toThrowError("Expected 'number' | 'string' | 'object' | 'globalThis.Date' | 'luxon.DateTime', received 'bigint'");
		expect(() => TimeTZ.from("()")).toThrowError("Expected 'LIKE HH:MM:SS+HH:MM', received '()'");
		expect(() => TimeTZ.from({} as any)).toThrowError("Missing keys in object: 'hour', 'minute', 'second', 'offset'");
		expect(() =>
			TimeTZ.from({
				hour: "1",
				minute: 2,
				second: 3,
				offset: { hour: 0, minute: 0, direction: "plus" },
			} as any)
		).toThrowError("Expected 'number' for key 'hour', received 'string'");
		expect(() =>
			TimeTZ.from({
				week: 0,
				hour: 1,
				minute: 2,
				second: 3,
				offset: { hour: 0, minute: 0, direction: "plus" },
			} as any)
		).toThrowError("Unrecognized key in object: 'week'");
		expect(() =>
			TimeTZ.from({
				hour: 1,
				minute: 2,
				second: 3,
				offset: {},
			} as any)
		).toThrowError("Missing keys in object: 'hour', 'minute', 'direction'");
		expect(() =>
			TimeTZ.from({
				hour: 1,
				minute: 2,
				second: 3,
				offset: { hour: 0, minute: 0, direction: "a" as any },
			} as any)
		).toThrowError("Expected 'minus' | 'plus', received 'a'");
		expect(() =>
			TimeTZ.from({
				hour: 1,
				minute: 2,
				second: 3,
				offset: { hour: 0, minute: 0, direction: "plus", second: 1 },
			} as any)
		).toThrowError("Unrecognized key in object: 'second'");
		expect(() =>
			TimeTZ.from({
				hour: 1,
				minute: 2,
				second: 3,
				offset: { hour: 0, minute: "0", direction: "plus" },
			} as any)
		).toThrowError("Expected 'number' for key 'minute', received 'string'");
		expect(() => TimeTZ.from(4, "5" as any, 6, 7, 8, "minus")).toThrowError("Expected 'number' for key 'minute', received 'string'");
		//@ts-expect-error - this is a test
		expect(() => TimeTZ.from(1, 2, 3, 4, 5)).toThrowError("Function must have exactly 6 argument(s)");
		//@ts-expect-error - this is a test
		expect(() => TimeTZ.from(1, 2, 3, 4, 5, 6, 7)).toThrowError("Function must have exactly 6 argument(s)");
		expect(() => TimeTZ.from(new globalThis.Date("a"))).toThrowError("Invalid globalThis.Date");
		expect(() => TimeTZ.from(DateTime.fromISO("a"))).toThrowError("Invalid luxon.DateTime");

		// Test all string formats
		expect(TimeTZ.safeFrom("2023-01-01T22:10:09-02:00").success).toBe(true);
		expect(TimeTZ.safeFrom("2023-01-01T22:10:09-02").success).toBe(true);
		expect(TimeTZ.safeFrom("2023-01-01").success).toBe(true);
		expect(TimeTZ.safeFrom("22:10:09-02:00").success).toBe(true);
		expect(TimeTZ.safeFrom("22:10+02:00").success).toBe(true);
		expect(TimeTZ.safeFrom("22:10:09-02").success).toBe(true);
		expect(TimeTZ.safeFrom("22:10:09").success).toBe(true);
		expect(TimeTZ.safeFrom("22:10").success).toBe(true);
		expect(TimeTZ.safeFrom("P2023Y1M1DT22H10M9S").success).toBe(true);
		expect(TimeTZ.safeFrom("P20230101T221009").success).toBe(true);
		expect(TimeTZ.safeFrom("P2023-01-01T22:10:09").success).toBe(true);
		expect(TimeTZ.safeFrom("2023-01-01 22:10:09-02:00").success).toBe(true);
		expect(TimeTZ.safeFrom("Sunday January 01 2023 22:10:09 GMT-02:00").success).toBe(true);
		expect(TimeTZ.safeFrom("Sun Jan 01 2023 22:10:09 GMT-02:00").success).toBe(true);
		expect(TimeTZ.safeFrom("2023-01 01 22:10:09").success).toBe(true);
		expect(TimeTZ.safeFrom(DateTime.fromISO("2023-01-01T22:10:09-02:00", { setZone: true })).success).toBe(true);
		expect(TimeTZ.safeFrom(DateTime.fromISO("2023-01-01T22:10:09+02:00", { setZone: true })).success).toBe(true);
		expect(TimeTZ.safeFrom(new globalThis.Date("2023-01-01T22:10:09-02:00")).success).toBe(true);
		expect(TimeTZ.safeFrom(new globalThis.Date("2023-01-01T22:10:09+02:00")).success).toBe(true);

		// Test with AM/PM
		expect(TimeTZ.safeFrom("2023-01-01 10:10PM-02:00").success).toBe(true);
		expect(TimeTZ.safeFrom("2023-01-01 10:10:09AM-02:00").success).toBe(true);
		expect(TimeTZ.safeFrom("Sunday January 01 2023 10:10:09PM GMT-02:00").success).toBe(true);
		expect(TimeTZ.safeFrom("Sunday January 01 2023 10:10:09AM GMT-02:00").success).toBe(true);
		expect(TimeTZ.safeFrom("Sun Jan 01 2023 10:10:09PM GMT-02:00").success).toBe(true);
		expect(TimeTZ.safeFrom("Sun Jan 01 2023 10:10:09AM GMT-02:00").success).toBe(true);
		expect(TimeTZ.safeFrom("10:10PM PST-02:00").success).toBe(true);
		expect(TimeTZ.safeFrom("10:10:09AM PST+02:00").success).toBe(true);
		expect(TimeTZ.safeFrom("10:10PM PST-02").success).toBe(true);
		expect(TimeTZ.safeFrom("10:10:09AM PST+02").success).toBe(true);
		expect(TimeTZ.safeFrom("10:10:09PM BC").success).toBe(true);

		expect(TimeTZ.safeFrom("10:10:09PM ABC-02:00").success).toBe(false);

		expect(() =>
			TimeTZ.from({
				hour: 1.2,
				minute: 2,
				second: 3,
				offset: { hour: 0, minute: 0, direction: "plus" },
			})
		).toThrowError("Number must be whole");
		expect(() =>
			TimeTZ.from({
				hour: 24,
				minute: 2,
				second: 3,
				offset: { hour: 0, minute: 0, direction: "plus" },
			})
		).toThrowError("Number must be less than or equal to 23");
		expect(() =>
			TimeTZ.from({
				hour: -1,
				minute: 2,
				second: 3,
				offset: { hour: 0, minute: 0, direction: "plus" },
			})
		).toThrowError("Number must be greater than or equal to 0");
		expect(() =>
			TimeTZ.from({
				hour: 1,
				minute: 1.2,
				second: 3,
				offset: { hour: 0, minute: 0, direction: "plus" },
			})
		).toThrowError("Number must be whole");
		expect(() =>
			TimeTZ.from({
				hour: 1,
				minute: 60,
				second: 3,
				offset: { hour: 0, minute: 0, direction: "plus" },
			})
		).toThrowError("Number must be less than or equal to 59");
		expect(() =>
			TimeTZ.from({
				hour: 1,
				minute: -1,
				second: 3,
				offset: { hour: 0, minute: 0, direction: "plus" },
			})
		).toThrowError("Number must be greater than or equal to 0");
		expect(() =>
			TimeTZ.from({
				hour: 1,
				minute: 2,
				second: -1,
				offset: { hour: 0, minute: 0, direction: "plus" },
			})
		).toThrowError("Number must be greater than or equal to 0");
		expect(() =>
			TimeTZ.from({
				hour: 1,
				minute: 2,
				second: 60,
				offset: { hour: 0, minute: 0, direction: "plus" },
			})
		).toThrowError("Number must be less than or equal to 59");
		expect(() =>
			TimeTZ.from({
				hour: 1,
				minute: 2,
				second: 3,
				offset: { hour: 1.2, minute: 0, direction: "plus" },
			})
		).toThrowError("Number must be whole");
		expect(() =>
			TimeTZ.from({
				hour: 1,
				minute: 2,
				second: 3,
				offset: { hour: 24, minute: 0, direction: "plus" },
			})
		).toThrowError("Number must be less than or equal to 23");
		expect(() =>
			TimeTZ.from({
				hour: 1,
				minute: 2,
				second: 3,
				offset: { hour: -1, minute: 0, direction: "plus" },
			})
		).toThrowError("Number must be greater than or equal to 0");
		expect(() =>
			TimeTZ.from({
				hour: 1,
				minute: 2,
				second: 3,
				offset: { hour: 0, minute: 1.2, direction: "plus" },
			})
		).toThrowError("Number must be whole");
		expect(() =>
			TimeTZ.from({
				hour: 1,
				minute: 2,
				second: 3,
				offset: { hour: 0, minute: 60, direction: "plus" },
			})
		).toThrowError("Number must be less than or equal to 59");
		expect(() =>
			TimeTZ.from({
				hour: 1,
				minute: 2,
				second: 3,
				offset: { hour: 0, minute: -1, direction: "plus" },
			})
		).toThrowError("Number must be greater than or equal to 0");
	});

	test("isTimeTZ(...)", () => {
		const timetz = TimeTZ.from({
			hour: 1,
			minute: 2,
			second: 3,
			offset: { hour: 0, minute: 0, direction: "plus" },
		});
		expect(TimeTZ.isTimeTZ(timetz)).toBe(true);
		expect(
			TimeTZ.isTimeTZ({
				hour: 1,
				minute: 2,
				second: 3,
				offset: { hour: 0, minute: 0, direction: "plus" },
			})
		).toBe(false);
	});
});

describe("TimeTZ", () => {
	test("_equals(...)", () => {
		const timetz = TimeTZ.from("2023-01-01T22:10:09Z");

		expect(timetz.equals(TimeTZ.from("2023-01-01T22:10:09Z"))).toBe(true);
		expect(timetz.equals(TimeTZ.from("2023-01-02T22:11:09Z"))).toBe(false);
		expect(timetz.equals(TimeTZ.from("2023-01-01T22:10:09Z").toJSON())).toBe(true);
		expect(timetz.equals(TimeTZ.from("2023-01-02T22:11:09Z").toJSON())).toBe(false);
		expect(timetz.equals(TimeTZ.from("2023-01-01T22:10:09Z").toString())).toBe(true);
		expect(timetz.equals(TimeTZ.from("2023-01-02T22:11:09Z").toString())).toBe(false);
		//@ts-expect-error - this is a test
		expect(() => timetz.equals(BigInt(1))).toThrowError("Expected 'number' | 'string' | 'object' | 'globalThis.Date' | 'luxon.DateTime', received 'bigint'");
	});

	test("toString()", () => {
		const timestamptz1 = TimeTZ.from("22:10:09+02:00");
		expect(timestamptz1.toString()).toBe("22:10:09+02:00");
	});

	test("toJSON()", () => {
		const timestamptz = TimeTZ.from("2023-01-01T22:10:09-02:00");
		expect(timestamptz.toJSON()).toEqual({
			hour: 22,
			minute: 10,
			second: 9,
			offset: { direction: "minus", hour: 2, minute: 0 },
		});
	});

	test("toTime()", () => {
		const timestamptz = TimeTZ.from("2023-01-01T22:10:09-02:00");
		expect(Time.isTime(timestamptz.toTime())).toBe(true);
	});

	test("toDateTime()", () => {
		const timestamptz = TimeTZ.from("2023-01-01T22:10:09-02:00");
		expect(timestamptz.toDateTime().isValid).toBe(true);
	});

	test("toJSDate()", () => {
		const timestamptz = TimeTZ.from("2023-01-01T22:10:09-02:00");
		expect(timestamptz.toJSDate() instanceof globalThis.Date).toBe(true);
	});

	test("get hour()", () => {
		const timestamptz = TimeTZ.from("2023-01-01T22:10:09-02:00");
		expect(timestamptz.hour).toBe(22);
	});

	test("set hour()", () => {
		const timestamptz = TimeTZ.from("2023-01-01T22:10:09-02:00");
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
		const timestamptz = TimeTZ.from("2023-01-01T22:10:09-02:00");
		expect(timestamptz.minute).toBe(10);
	});

	test("set minute()", () => {
		const timestamptz = TimeTZ.from("2023-01-01T22:10:09-02:00");
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
		const timestamptz = TimeTZ.from("2023-01-01T22:10:09-02:00");
		expect(timestamptz.second).toBe(9);
	});

	test("set second()", () => {
		const timestamptz = TimeTZ.from("2023-01-01T22:10:09-02:00");
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
		const timestamptz = TimeTZ.from("2023-01-01T22:10:09-02:00");
		expect(timestamptz.offset.direction).toBe("minus");
		expect(timestamptz.offset.hour).toBe(2);
		expect(timestamptz.offset.minute).toBe(0);
	});

	test("set offset()", () => {
		const timestamptz = TimeTZ.from("2023-01-01T22:10:09-02:00");
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
});

describe("PostgreSQL", () => {
	it("should work with PostgreSQL's own tests", () => {
		//* https://github.com/postgres/postgres/blob/master/src/test/regress/sql/timetz.sql
		expect(() => TimeTZ.from("00:01 PDT"));
		expect(() => TimeTZ.from("01:00 PDT"));
		expect(() => TimeTZ.from("02:03 PDT"));
		expect(() => TimeTZ.from("07:07 PST"));
		expect(() => TimeTZ.from("08:08 EDT"));
		expect(() => TimeTZ.from("11:59 PDT"));
		expect(() => TimeTZ.from("12:00 PDT"));
		expect(() => TimeTZ.from("12:01 PDT"));
		expect(() => TimeTZ.from("23:59 PDT"));
		expect(() => TimeTZ.from("11:59:59.99 PM PDT"));

		expect(() => TimeTZ.from("2003-03-07 15:36:39 America/New_York"));
		expect(() => TimeTZ.from("2003-07-07 15:36:39 America/New_York"));
	});

	it("should be returned from PostgreSQL", async () => {
		const client = new Client({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			application_name: "timetz.test.ts",
		});

		await client.connect();

		let error = null;
		try {
			await client.query(`
				CREATE TABLE public.vitesttimetz (
					timetz timetz NULL,
					_timetz _timetz NULL
				)
			`);

			await client.query(`
				INSERT INTO public.vitesttimetz (timetz, _timetz)
				VALUES (
					'04:05:06.789-01:00',
					'{ 01:02:03.456+08:00, 04:05:06.789 EST }'
				)
			`);

			const result = await client.query(`
				SELECT * FROM public.vitesttimetz
			`);

			expect(result.rows[0].timetz.toString()).toStrictEqual(TimeTZ.from("04:05:06.789-01:00").toString());
			expect(result.rows[0]._timetz).toHaveLength(2);
			expect(result.rows[0]._timetz[0].toString()).toStrictEqual(TimeTZ.from("01:02:03.456+08:00").toString());
			expect(result.rows[0]._timetz[1].toString()).toStrictEqual(TimeTZ.from("04:05:06.789-05:00").toString());
		} catch (error_) {
			error = error_;
			// eslint-disable-next-line no-console
			console.error(error);
		}

		await client.query(`
			DROP TABLE public.vitesttimetz
		`);

		await client.end();

		if (error) throw error;
	});
});
