import { DateTime } from "luxon";
import { Client } from "pg";
import { describe, expect, it } from "vitest";

import { Date } from "./Date";
import { Time } from "./Time";
import { Timestamp } from "./Timestamp";

describe.todo("Timestamp Class", () => {
	it("should create a timestamp from a string", () => {
		const timestamp1 = Timestamp.from("2004-10-19T10:23:54.678Z");
		expect(timestamp1).not.toBeNull();
		const timestamp2 = Timestamp.from("2004-10-19T10:23:54.678+01:00");
		expect(timestamp2).not.toBeNull();
		const timestamp3 = Timestamp.from("2004-10-19 10:23:54.678");
		expect(timestamp3).not.toBeNull();
		const timestamp4 = Timestamp.from("2004-10-19 10:23:54");
		expect(timestamp4).not.toBeNull();
		expect(Timestamp.from(Timestamp.from("2004-10-19 10:23:54"))).not.toBeNull();
	});

	it("should error when creating a timestamp from an invalid string", () => {
		expect(() => Timestamp.from("2004-10-19ABC04:05:06.789")).toThrowError("Invalid Timestamp string");
	});

	it("should create a timestamp from a object", () => {
		const timestamp1 = Timestamp.from({
			year: 2004,
			month: 10,
			day: 19,
			hour: 10,
			minute: 23,
			second: 54.678,
		});
		expect(timestamp1).not.toBeNull();
		const timestamp2 = Timestamp.from({
			year: 2004,
			month: 10,
			day: 19,
			hour: 10,
			minute: 23,
			second: 54,
		});
		expect(timestamp2).not.toBeNull();
	});

	it("should error when creating a timestamp from an invalid object", () => {
		expect(() => Timestamp.from({} as any)).toThrowError("Invalid Timestamp object");
		expect(() =>
			Timestamp.from({
				year: 2004,
				month: 10,
				day: 19,
				hour: 4,
				minute: 5,
				second: "6",
			} as any)
		).toThrowError("Invalid Timestamp object");
		expect(() =>
			Timestamp.from({
				year: 10000,
				month: 10,
				day: 19,
				hour: 4,
				minute: 5,
				second: 6,
			} as any)
		).toThrowError("Invalid Timestamp object");
	});

	it("should create a timestamp from numbers", () => {
		const timestamp1 = Timestamp.from(2004, 10, 19, 10, 23, 54.678);
		expect(timestamp1).not.toBeNull();
		const timestamp2 = Timestamp.from(2004, 10, 19, 10, 23, 54);
		expect(timestamp2).not.toBeNull();
	});

	it("should error when creating a timestamp from invalid numbers", () => {
		expect(() => Timestamp.from(2004, 10, 19, 4, 5, "invalid" as any)).toThrowError("Invalid Timestamp array, numbers only");
		expect(() => Timestamp.from(10000, 10, 19, 4, 5, 6)).toThrowError("Invalid Timestamp arguments");
	});

	it("should create a timestamp from a DateTime", () => {
		const timestamp1 = Timestamp.from(
			DateTime.fromObject({
				year: 2004,
				month: 10,
				day: 19,
				hour: 10,
				minute: 23,
				second: 54,
				millisecond: 678,
			})
		);
		expect(timestamp1).not.toBeNull();
		const timestamp2 = Timestamp.from(
			DateTime.fromObject({
				year: 2004,
				month: 10,
				day: 19,
				hour: 10,
				minute: 23,
				second: 54,
			})
		);
		expect(timestamp2).not.toBeNull();
	});

	it("should create a timestamp from a JavaScript Date", () => {
		const timestamp1 = Timestamp.from(new globalThis.Date(2004, 10, 19, 10, 23, 54.678));
		expect(timestamp1).not.toBeNull();
		const timestamp2 = Timestamp.from(new globalThis.Date(2004, 10, 19, 10, 23, 54));
		expect(timestamp2).not.toBeNull();
	});

	it("isTimestamp()", () => {
		const timestamp = Timestamp.from({
			year: 2004,
			month: 10,
			day: 19,
			hour: 10,
			minute: 23,
			second: 54.678,
		});
		expect(Timestamp.isTimestamp(timestamp)).toBe(true);
		expect(
			Timestamp.isTimestamp({
				year: 2004,
				month: 10,
				day: 19,
				hour: 10,
				minute: 23,
				second: 54.678,
			})
		).toBe(false);
	});

	it("toString()", () => {
		const timestamp = Timestamp.from({
			year: 2004,
			month: 10,
			day: 19,
			hour: 10,
			minute: 23,
			second: 54.678,
		});
		expect(timestamp.toString()).toBe("2004-10-19 10:23:54.678");
	});

	it("toISO()", () => {
		const timestamp = Timestamp.from({
			year: 2004,
			month: 10,
			day: 19,
			hour: 10,
			minute: 23,
			second: 54.678,
		});
		expect(timestamp.toISO()).toBe("2004-10-19T10:23:54.678Z");
	});

	it("toJSON()", () => {
		const timestamp = Timestamp.from({
			year: 2004,
			month: 10,
			day: 19,
			hour: 10,
			minute: 23,
			second: 54.678,
		});
		expect(timestamp.toJSON()).toEqual({
			year: 2004,
			month: 10,
			day: 19,
			hour: 10,
			minute: 23,
			second: 54.678,
		});
	});

	it("equals()", () => {
		const timestamp = Timestamp.from({
			year: 2004,
			month: 10,
			day: 19,
			hour: 10,
			minute: 23,
			second: 54.678,
		});

		expect(
			timestamp.equals(
				Timestamp.from({
					year: 2004,
					month: 10,
					day: 19,
					hour: 10,
					minute: 23,
					second: 54.678,
				})
			)
		).toBe(true);
		expect(
			timestamp.equals(
				Timestamp.from({
					year: 2004,
					month: 10,
					day: 20,
					hour: 10,
					minute: 23,
					second: 54.678,
				})
			)
		).toBe(false);
		expect(
			timestamp.equals(
				Timestamp.from({
					year: 2004,
					month: 10,
					day: 19,
					hour: 10,
					minute: 23,
					second: 54.678,
				}).toJSON()
			)
		).toBe(true);
		expect(
			timestamp.equals(
				Timestamp.from({
					year: 2004,
					month: 10,
					day: 20,
					hour: 10,
					minute: 23,
					second: 54.678,
				}).toJSON()
			)
		).toBe(false);
		expect(
			timestamp.equals(
				Timestamp.from({
					year: 2004,
					month: 10,
					day: 19,
					hour: 10,
					minute: 23,
					second: 54.678,
				}).toString()
			)
		).toBe(true);
		expect(
			timestamp.equals(
				Timestamp.from({
					year: 2004,
					month: 10,
					day: 20,
					hour: 10,
					minute: 23,
					second: 54.678,
				}).toString()
			)
		).toBe(false);
	});

	it("get year", () => {
		const timestamp = Timestamp.from({
			year: 2004,
			month: 10,
			day: 19,
			hour: 10,
			minute: 23,
			second: 54.678,
		});
		expect(timestamp.year).toBe(2004);
	});

	it("set year", () => {
		const timestamp = Timestamp.from({
			year: 2004,
			month: 10,
			day: 19,
			hour: 10,
			minute: 23,
			second: 54.678,
		});
		timestamp.year = 2005;
		expect(timestamp.year).toBe(2005);
		expect(() => {
			timestamp.year = 10000;
		}).toThrowError("Invalid year");
		expect(() => {
			timestamp.year = 0;
		}).toThrowError("Invalid year");
		expect(() => {
			timestamp.year = "a" as any;
		}).toThrowError("Invalid year");
	});

	it("get month", () => {
		const timestamp = Timestamp.from({
			year: 2004,
			month: 10,
			day: 19,
			hour: 10,
			minute: 23,
			second: 54.678,
		});
		expect(timestamp.month).toBe(10);
	});

	it("set month", () => {
		const timestamp = Timestamp.from({
			year: 2004,
			month: 10,
			day: 19,
			hour: 10,
			minute: 23,
			second: 54.678,
		});
		timestamp.month = 11;
		expect(timestamp.month).toBe(11);
		expect(() => {
			timestamp.month = 13;
		}).toThrowError("Invalid month");
		expect(() => {
			timestamp.month = 0;
		}).toThrowError("Invalid month");
		expect(() => {
			timestamp.month = "a" as any;
		}).toThrowError("Invalid month");
	});

	it("get day", () => {
		const timestamp = Timestamp.from({
			year: 2004,
			month: 10,
			day: 19,
			hour: 10,
			minute: 23,
			second: 54.678,
		});
		expect(timestamp.day).toBe(19);
	});

	it("set day", () => {
		const timestamp = Timestamp.from({
			year: 2004,
			month: 10,
			day: 19,
			hour: 10,
			minute: 23,
			second: 54.678,
		});
		timestamp.day = 20;
		expect(timestamp.day).toBe(20);
		expect(() => {
			timestamp.day = 32;
		}).toThrowError("Invalid day");
		expect(() => {
			timestamp.day = 0;
		}).toThrowError("Invalid day");
		expect(() => {
			timestamp.day = "a" as any;
		}).toThrowError("Invalid day");
	});

	it("get hour", () => {
		const timestamp = Timestamp.from({
			year: 2004,
			month: 10,
			day: 19,
			hour: 10,
			minute: 23,
			second: 54.678,
		});
		expect(timestamp.hour).toBe(10);
	});

	it("set hour", () => {
		const timestamp = Timestamp.from({
			year: 2004,
			month: 10,
			day: 19,
			hour: 10,
			minute: 23,
			second: 54.678,
		});
		timestamp.hour = 12;
		expect(timestamp.hour).toBe(12);
		expect(() => {
			timestamp.hour = 24;
		}).toThrowError("Invalid hour");
		expect(() => {
			timestamp.hour = -1;
		}).toThrowError("Invalid hour");
		expect(() => {
			timestamp.hour = "a" as any;
		}).toThrowError("Invalid hour");
	});

	it("get minute", () => {
		const timestamp = Timestamp.from({
			year: 2004,
			month: 10,
			day: 19,
			hour: 10,
			minute: 23,
			second: 54.678,
		});
		expect(timestamp.minute).toBe(23);
	});

	it("set minute", () => {
		const timestamp = Timestamp.from({
			year: 2004,
			month: 10,
			day: 19,
			hour: 10,
			minute: 23,
			second: 54.678,
		});
		timestamp.minute = 10;
		expect(timestamp.minute).toBe(10);
		expect(() => {
			timestamp.minute = 60;
		}).toThrowError("Invalid minute");
		expect(() => {
			timestamp.minute = -1;
		}).toThrowError("Invalid minute");
		expect(() => {
			timestamp.minute = "a" as any;
		}).toThrowError("Invalid minute");
	});

	it("get second", () => {
		const timestamp = Timestamp.from({
			year: 2004,
			month: 10,
			day: 19,
			hour: 10,
			minute: 23,
			second: 54.678,
		});
		expect(timestamp.second).toBe(54.678);
	});

	it("set second", () => {
		const timestamp = Timestamp.from({
			year: 2004,
			month: 10,
			day: 19,
			hour: 10,
			minute: 23,
			second: 54.678,
		});
		timestamp.second = 3;
		expect(timestamp.second).toBe(3);
		expect(() => {
			timestamp.second = 60;
		}).toThrowError("Invalid second");
		expect(() => {
			timestamp.second = -1;
		}).toThrowError("Invalid second");
		expect(() => {
			timestamp.second = "a" as any;
		}).toThrowError("Invalid second");
	});

	it("toDate()", () => {
		const timestamp = Timestamp.from({
			year: 2004,
			month: 10,
			day: 19,
			hour: 10,
			minute: 23,
			second: 54.678,
		});
		expect(timestamp.toDate()).toEqual(
			Date.from({
				year: 2004,
				month: 10,
				day: 19,
			})
		);
	});

	it("toTime()", () => {
		const timestamp = Timestamp.from({
			year: 2004,
			month: 10,
			day: 19,
			hour: 10,
			minute: 23,
			second: 54.678,
		});
		expect(timestamp.toTime()).toEqual(
			Time.from({
				hour: 10,
				minute: 23,
				second: 54.678,
			})
		);
	});

	it("toDateTime()", () => {
		const timestamp = Timestamp.from({
			year: 2004,
			month: 10,
			day: 19,
			hour: 10,
			minute: 23,
			second: 54.678,
		});
		expect(timestamp.toDateTime()).toStrictEqual(
			DateTime.fromObject(
				{
					year: 2004,
					month: 10,
					day: 19,
					hour: 10,
					minute: 23,
					second: 54,
					millisecond: 678,
				},
				{ zone: "local" }
			)
		);
	});

	it("toJSDate()", () => {
		const timestamp = Timestamp.from({
			year: 2004,
			month: 10,
			day: 19,
			hour: 10,
			minute: 23,
			second: 54.678,
		});
		expect(timestamp.toJSDate()).toBeInstanceOf(globalThis.Date);
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
				CREATE TABLE public.jesttimestamp (
					timestamp timestamp NULL,
					_timestamp _timestamp NULL
				)
			`);

			await client.query(`
				INSERT INTO public.jesttimestamp (timestamp, _timestamp)
				VALUES (
					'2004-10-19 10:23:54.678',
					'{ 2019-01-02 03:04:05.678, 2022-09-08 07:06:05 }'
				)
			`);

			const result = await client.query(`
				SELECT * FROM public.jesttimestamp
			`);

			expect(result.rows[0].timestamp).toStrictEqual(
				Timestamp.from({
					year: 2004,
					month: 10,
					day: 19,
					hour: 10,
					minute: 23,
					second: 54.678,
				})
			);
			expect(result.rows[0]._timestamp).toStrictEqual([
				Timestamp.from({
					year: 2019,
					month: 1,
					day: 2,
					hour: 3,
					minute: 4,
					second: 5.678,
				}),
				Timestamp.from({
					year: 2022,
					month: 9,
					day: 8,
					hour: 7,
					minute: 6,
					second: 5,
				}),
			]);
		} catch (err) {
			error = err;
		}

		await client.query(`
			DROP TABLE public.jesttimestamp
		`);

		await client.end();

		if (error) throw error;
	});
});
