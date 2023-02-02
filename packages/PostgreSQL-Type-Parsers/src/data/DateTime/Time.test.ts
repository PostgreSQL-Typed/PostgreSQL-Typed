import { DateTime } from "luxon";
import { Client } from "pg";
import { describe, expect, it } from "vitest";

import { Time } from "./Time";

describe.todo("Time Class", () => {
	it("should create a time from a string", () => {
		const time1 = Time.from("04:05:06.789");
		expect(time1).not.toBeNull();
		const time2 = Time.from("04:05:06");
		expect(time2).not.toBeNull();
		expect(Time.from(Time.from("04:05:06"))).not.toBeNull();
	});

	it("should error when creating a time from an invalid string", () => {
		expect(() => Time.from("04:abc:06.789")).toThrowError("Invalid Time string");
	});

	it("should create a time from a object", () => {
		const time1 = Time.from({
			hour: 4,
			minute: 5,
			second: 6,
		});
		expect(time1).not.toBeNull();
		const time2 = Time.from({
			hour: 4,
			minute: 5,
			second: 6.789,
		});
		expect(time2).not.toBeNull();
	});

	it("should error when creating a time from an invalid object", () => {
		expect(() => Time.from({} as any)).toThrowError("Invalid Time object");
		expect(() =>
			Time.from({
				hour: 4,
				minute: 5,
				second: "invalid",
			} as any)
		).toThrowError("Invalid Time object");
		expect(() =>
			Time.from({
				hour: 99,
				minute: 5,
				second: 1,
			})
		).toThrowError("Invalid Time object");
	});

	it("should create a time from numbers", () => {
		const time1 = Time.from(4, 5, 6);
		expect(time1).not.toBeNull();
		const time2 = Time.from(4, 5, 6.789);
		expect(time2).not.toBeNull();
	});

	it("should error when creating a time from invalid numbers", () => {
		expect(() => Time.from(4, 5, "number" as any)).toThrowError("Invalid Time array, numbers only");
		expect(() => Time.from(4, 5, 99)).toThrowError("Invalid Time array, numbers only");
	});

	it("should create a time from a DateTime", () => {
		const time1 = Time.from(
			DateTime.fromObject({
				hour: 4,
				minute: 5,
				second: 6,
				millisecond: 789,
			})
		);
		expect(time1).not.toBeNull();
		const time2 = Time.from(
			DateTime.fromObject({
				hour: 4,
				minute: 5,
				second: 6,
			})
		);
		expect(time2).not.toBeNull();
	});

	it("should create a time from a JavaScript Date", () => {
		const time1 = Time.from(new globalThis.Date(2022, 9, 2, 4, 5, 6, 789));
		expect(time1).not.toBeNull();
		const time2 = Time.from(new globalThis.Date(2022, 9, 2, 4, 5, 6));
		expect(time2).not.toBeNull();
	});

	it("isTime()", () => {
		const time = Time.from({
			hour: 4,
			minute: 5,
			second: 6,
		});
		expect(Time.isTime(time)).toBe(true);
		expect(
			Time.isTime({
				hour: 4,
				minute: 5,
				second: 6,
			})
		).toBe(false);
	});

	it("toString()", () => {
		const time = Time.from({
			hour: 4,
			minute: 5,
			second: 6.789,
		});
		expect(time.toString()).toBe("04:05:06");
	});

	it("toJSON()", () => {
		const time = Time.from({
			hour: 4,
			minute: 5,
			second: 6.789,
		});
		expect(time.toJSON()).toEqual({
			hour: 4,
			minute: 5,
			second: 6,
		});
	});

	it("equals()", () => {
		const time = Time.from({
			hour: 4,
			minute: 5,
			second: 6.789,
		});

		expect(
			time.equals(
				Time.from({
					hour: 4,
					minute: 5,
					second: 6,
				})
			)
		).toBe(true);
		expect(
			time.equals(
				Time.from({
					hour: 4,
					minute: 6,
					second: 6,
				})
			)
		).toBe(false);
		expect(
			time.equals(
				Time.from({
					hour: 4,
					minute: 5,
					second: 6,
				}).toJSON()
			)
		).toBe(true);
		expect(
			time.equals(
				Time.from({
					hour: 4,
					minute: 6,
					second: 6,
				}).toJSON()
			)
		).toBe(false);
		expect(
			time.equals(
				Time.from({
					hour: 4,
					minute: 5,
					second: 6,
				}).toString()
			)
		).toBe(true);
		expect(
			time.equals(
				Time.from({
					hour: 4,
					minute: 6,
					second: 6,
				}).toString()
			)
		).toBe(false);
	});

	it("get hour", () => {
		const time = Time.from({
			hour: 4,
			minute: 5,
			second: 6,
		});
		expect(time.hour).toBe(4);
	});

	it("set hour", () => {
		const time = Time.from({
			hour: 4,
			minute: 5,
			second: 6,
		});
		time.hour = 12;
		expect(time.hour).toBe(12);
		expect(() => {
			time.hour = 24;
		}).toThrowError("Invalid hour");
		expect(() => {
			time.hour = -1;
		}).toThrowError("Invalid hour");
		expect(() => {
			time.hour = "a" as any;
		}).toThrowError("Invalid hour");
	});

	it("get minute", () => {
		const time = Time.from({
			hour: 4,
			minute: 5,
			second: 6,
		});
		expect(time.minute).toBe(5);
	});

	it("set minute", () => {
		const time = Time.from({
			hour: 4,
			minute: 5,
			second: 6,
		});
		time.minute = 10;
		expect(time.minute).toBe(10);
		expect(() => {
			time.minute = 60;
		}).toThrowError("Invalid minute");
		expect(() => {
			time.minute = -1;
		}).toThrowError("Invalid minute");
		expect(() => {
			time.minute = "a" as any;
		}).toThrowError("Invalid minute");
	});

	it("get second", () => {
		const time = Time.from({
			hour: 4,
			minute: 5,
			second: 6.789,
		});
		expect(time.second).toBe(6);
	});

	it("set second", () => {
		const time = Time.from({
			hour: 4,
			minute: 5,
			second: 6,
		});
		time.second = 3;
		expect(time.second).toBe(3);
		expect(() => {
			time.second = 60;
		}).toThrowError("Invalid second");
		expect(() => {
			time.second = -1;
		}).toThrowError("Invalid second");
		expect(() => {
			time.second = "a" as any;
		}).toThrowError("Invalid second");
	});

	it("toDateTime()", () => {
		const time = Time.from({
			hour: 4,
			minute: 5,
			second: 6,
		});
		expect(time.toDateTime()).toStrictEqual(
			DateTime.fromObject(
				{
					hour: 4,
					minute: 5,
					second: 6,
				},
				{ zone: "local" }
			)
		);
	});

	it("toJSDate()", () => {
		const time = Time.from({
			hour: 4,
			minute: 5,
			second: 6,
		});
		expect(time.toJSDate()).toBeInstanceOf(globalThis.Date);
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
				CREATE TABLE public.jesttime (
					time time NULL,
					_time _time NULL
				)
			`);

			await client.query(`
				INSERT INTO public.jesttime (time, _time)
				VALUES (
					'04:05:06.789',
					'{ 01:02:03.456, 04:05:06.789 }'
				)
			`);

			const result = await client.query(`
				SELECT * FROM public.jesttime
			`);

			expect(result.rows[0].time).toStrictEqual(
				Time.from({
					hour: 4,
					minute: 5,
					second: 6,
				})
			);
			expect(result.rows[0]._time).toStrictEqual([
				Time.from({
					hour: 1,
					minute: 2,
					second: 3,
				}),
				Time.from({
					hour: 4,
					minute: 5,
					second: 6,
				}),
			]);
		} catch (err) {
			error = err;
		}

		await client.query(`
			DROP TABLE public.jesttime
		`);

		await client.end();

		if (error) throw error;
	});
});
