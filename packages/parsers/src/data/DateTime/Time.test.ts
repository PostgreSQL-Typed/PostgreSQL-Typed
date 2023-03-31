import { DateTime } from "luxon";
import { Client } from "pg";
import { describe, expect, it, test } from "vitest";

import { Time } from "./Time.js";

describe("TimeConstructor", () => {
	test("_parse(...)", () => {
		expect(Time.safeFrom("22:10:09").success).toBe(true);
		expect(
			Time.safeFrom({
				hour: 1,
				minute: 2,
				second: 3,
			}).success
		).toBe(true);
		expect(Time.safeFrom(1, 2, 3).success).toBe(true);
		expect(Time.safeFrom(Time.from("22:10:09")).success).toBe(true);
		expect(Time.safeFrom(new globalThis.Date()).success).toBe(true);
		expect(Time.safeFrom(DateTime.now()).success).toBe(true);

		//@ts-expect-error - this is a test
		expect(() => Time.from()).toThrowError("Function must have exactly 1 argument(s)");
		//@ts-expect-error - this is a test
		expect(() => Time.from("a", "b")).toThrowError("Function must have exactly 1 argument(s)");
		//@ts-expect-error - this is a test
		expect(() => Time.from(BigInt("1"))).toThrowError("Expected 'number' | 'string' | 'object' | 'globalThis.Date' | 'luxon.DateTime', received 'bigint'");
		expect(() => Time.from("()")).toThrowError("Expected 'LIKE HH:MM:SS', received '()'");
		expect(() => Time.from({} as any)).toThrowError("Missing keys in object: 'hour', 'minute', 'second'");
		expect(() =>
			Time.from({
				hour: "1",
				minute: 2,
				second: 3,
			} as any)
		).toThrowError("Expected 'number' for key 'hour', received 'string'");
		expect(() =>
			Time.from({
				week: 0,
				hour: 1,
				minute: 2,
				second: 3,
			} as any)
		).toThrowError("Unrecognized key in object: 'week'");
		expect(() => Time.from(1, 2, "a" as any)).toThrowError("Expected 'number', received 'string'");
		//@ts-expect-error - this is a test
		expect(() => Time.from(1, 2)).toThrowError("Function must have exactly 3 argument(s)");
		//@ts-expect-error - this is a test
		expect(() => Time.from(1, 2, 3, 4)).toThrowError("Function must have exactly 3 argument(s)");
		expect(() => Time.from(new globalThis.Date("a"))).toThrowError("Invalid globalThis.Date");
		expect(() => Time.from(DateTime.fromISO("a"))).toThrowError("Invalid luxon.DateTime");

		expect(() =>
			Time.from({
				hour: 1.2,
				minute: 2,
				second: 3,
			})
		).toThrowError("Number must be whole");
		expect(() =>
			Time.from({
				hour: 24,
				minute: 2,
				second: 3,
			})
		).toThrowError("Number must be less than or equal to 23");
		expect(() =>
			Time.from({
				hour: -1,
				minute: 2,
				second: 3,
			})
		).toThrowError("Number must be greater than or equal to 0");
		expect(() =>
			Time.from({
				hour: 1,
				minute: 1.2,
				second: 3,
			})
		).toThrowError("Number must be whole");
		expect(() =>
			Time.from({
				hour: 1,
				minute: 60,
				second: 3,
			})
		).toThrowError("Number must be less than or equal to 59");
		expect(() =>
			Time.from({
				hour: 1,
				minute: -1,
				second: 3,
			})
		).toThrowError("Number must be greater than or equal to 0");
		expect(() =>
			Time.from({
				hour: 1,
				minute: 2,
				second: -1,
			})
		).toThrowError("Number must be greater than or equal to 0");
		expect(() =>
			Time.from({
				hour: 1,
				minute: 2,
				second: 60,
			})
		).toThrowError("Number must be less than or equal to 59");
	});

	test("isTime(...)", () => {
		const time = Time.from({
			hour: 1,
			minute: 2,
			second: 3,
		});
		expect(Time.isTime(time)).toBe(true);
		expect(
			Time.isTime({
				hour: 1,
				minute: 2,
				second: 3,
			})
		).toBe(false);
	});
});

describe("Time", () => {
	test("_equals(...)", () => {
		const time = Time.from("22:10:09");

		expect(time.equals(Time.from("22:10:09"))).toBe(true);
		expect(time.equals(Time.from("22:10:09.456"))).toBe(false);
		expect(time.equals(Time.from("22:10:09").toJSON())).toBe(true);
		expect(time.equals(Time.from("22:10:09.456").toJSON())).toBe(false);
		expect(time.equals(Time.from("22:10:09").toString())).toBe(true);
		expect(time.equals(Time.from("22:10:09.456").toString())).toBe(false);
		//@ts-expect-error - this is a test
		expect(() => time.equals(BigInt(1))).toThrowError("Expected 'number' | 'string' | 'object' | 'globalThis.Date' | 'luxon.DateTime', received 'bigint'");
	});

	test("toString()", () => {
		const time = Time.from("22:10:09");
		expect(time.toString()).toBe("22:10:09");
	});

	test("toJSON()", () => {
		const time = Time.from("22:10:09");
		expect(time.toJSON()).toEqual({
			hour: 22,
			minute: 10,
			second: 9,
		});
	});

	test("toDateTime()", () => {
		const time = Time.from("22:10:09");
		expect(time.toDateTime().isValid).toBe(true);
	});

	test("toJSDate()", () => {
		const time = Time.from("22:10:09");
		expect(time.toJSDate() instanceof globalThis.Date).toBe(true);
	});

	test("get hour()", () => {
		const time = Time.from("22:10:09");
		expect(time.hour).toBe(22);
	});

	test("set hour()", () => {
		const time = Time.from("22:10:09");
		expect(() => {
			time.hour = "a" as any;
		}).toThrowError("Expected 'number', received 'string'");
		expect(() => {
			time.hour = 2.5;
		}).toThrowError("Number must be whole");
		expect(() => {
			time.hour = -1;
		}).toThrowError("Number must be greater than or equal to 0");
		expect(() => {
			time.hour = 24;
		}).toThrowError("Number must be less than or equal to 23");
		time.hour = 5;
		expect(time.hour).toBe(5);
	});

	test("get minute()", () => {
		const time = Time.from("22:10:09");
		expect(time.minute).toBe(10);
	});

	test("set minute()", () => {
		const time = Time.from("22:10:09");
		expect(() => {
			time.minute = "a" as any;
		}).toThrowError("Expected 'number', received 'string'");
		expect(() => {
			time.minute = 2.5;
		}).toThrowError("Number must be whole");
		expect(() => {
			time.minute = -1;
		}).toThrowError("Number must be greater than or equal to 0");
		expect(() => {
			time.minute = 60;
		}).toThrowError("Number must be less than or equal to 59");
		time.minute = 5;
		expect(time.minute).toBe(5);
	});

	test("get second()", () => {
		const time = Time.from("22:10:09");
		expect(time.second).toBe(9);
	});

	test("set second()", () => {
		const time = Time.from("22:10:09");
		expect(() => {
			time.second = "a" as any;
		}).toThrowError("Expected 'number', received 'string'");
		expect(() => {
			time.second = -1;
		}).toThrowError("Number must be greater than or equal to 0");
		expect(() => {
			time.second = 60;
		}).toThrowError("Number must be less than or equal to 59");
		time.second = 5;
		expect(time.second).toBe(5);
	});

	test("get value()", () => {
		const time = Time.from("22:10:09");
		expect(time.value).toBe("22:10:09");
	});

	test("set value(...)", () => {
		const time = Time.from("22:10:09");
		time.value = "11:22:33";
		expect(time.value).toBe("11:22:33");
		expect(() => {
			time.value = true as any;
		}).toThrowError("Expected 'number' | 'string' | 'object' | 'globalThis.Date' | 'luxon.DateTime', received 'boolean'");
	});
});

describe("PostgreSQL", () => {
	it("should work with PostgreSQL's own tests", () => {
		//* https://github.com/postgres/postgres/blob/master/src/test/regress/sql/time.sql
		//expect(() => Time.from("00:00")).not.toThrowError();
		expect(() => Time.from("01:00")).not.toThrowError();
		// as of 7.4, timezone spec should be accepted and ignored
		expect(() => Time.from("02:03 PST")).not.toThrowError();
		expect(() => Time.from("11:59 GMT")).not.toThrowError();
		expect(() => Time.from("12:00")).not.toThrowError();
		expect(() => Time.from("12:01")).not.toThrowError();
		expect(() => Time.from("23:59")).not.toThrowError();
		expect(() => Time.from("11:59:59.99 PM")).not.toThrowError();
		expect(() => Time.from("2003-03-07 15:36:39 America/New_York")).not.toThrowError();
		expect(() => Time.from("2003-07-07 15:36:39 America/New_York")).not.toThrowError();
	});

	it("should be returned from PostgreSQL", async () => {
		const client = new Client({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			application_name: "time.test.ts",
		});

		await client.connect();

		let error = null;
		try {
			await client.query(`
				CREATE TABLE public.vitesttime (
					time time NULL,
					_time _time NULL
				)
			`);

			await client.query(`
				INSERT INTO public.vitesttime (time, _time)
				VALUES (
					'04:05:06.789',
					'{ 01:02:03.456, 04:05:06.789 }'
				)
			`);

			const result = await client.query(`
				SELECT * FROM public.vitesttime
			`);

			expect(result.rows[0].time.toString()).toStrictEqual(
				Time.from({
					hour: 4,
					minute: 5,
					second: 6.789,
				}).toString()
			);
			expect(result.rows[0]._time).toHaveLength(2);
			expect(result.rows[0]._time[0].toString()).toStrictEqual(
				Time.from({
					hour: 1,
					minute: 2,
					second: 3.456,
				}).toString()
			);
			expect(result.rows[0]._time[1].toString()).toStrictEqual(
				Time.from({
					hour: 4,
					minute: 5,
					second: 6.789,
				}).toString()
			);
		} catch (error_) {
			error = error_;
			// eslint-disable-next-line no-console
			console.error(error);
		}

		await client.query(`
			DROP TABLE public.vitesttime
		`);

		await client.end();

		if (error) throw error;
	});
});
