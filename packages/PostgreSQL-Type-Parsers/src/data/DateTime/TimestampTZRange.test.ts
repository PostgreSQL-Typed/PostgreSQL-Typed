import { Client } from "pg";
import { describe, expect, it } from "vitest";

import { LowerRange, UpperRange } from "../../util/Range";
import { TimestampTZ } from "./TimestampTZ";
import { TimestampTZRange } from "./TimestampTZRange";

describe.todo("TimestampTZRange Class", () => {
	it("should create a timestamptz range from a string", () => {
		const timestampTZRange = TimestampTZRange.from("[2004-10-19 04:05:06.789 +01:00,2004-11-19 04:05:06.789 +01:00)");
		expect(timestampTZRange).not.toBeNull();
	});

	it("should error when creating a timestamptz range from an invalid string", () => {
		expect(() => {
			TimestampTZRange.from("2004-10-19 04:05:06.789 +01:00");
		}).toThrowError("Invalid TimestampTZRange string");
	});

	it("should create a timestamptz range from a object", () => {
		const timestampTZRange = TimestampTZRange.from({
			lower: LowerRange.include,
			upper: UpperRange.exclude,
			value: [TimestampTZ.from("2004-10-19 04:05:06.789 +01:00"), TimestampTZ.from("2004-11-19 04:05:06.789 +01:00")],
		});
		expect(timestampTZRange).not.toBeNull();
	});

	it("should error when creating a timestamptz range from an invalid object", () => {
		expect(() => {
			TimestampTZRange.from({
				lower: LowerRange.include,
				upper: UpperRange.exclude,
				value: [] as any,
			});
		}).toThrowError("Invalid TimestampTZRange object, too few values");

		expect(() => {
			TimestampTZRange.from({
				lower: LowerRange.include,
				upper: UpperRange.exclude,
				value: [
					TimestampTZ.from("2004-10-19 04:05:06.789 +01:00"),
					TimestampTZ.from("2004-10-19 04:05:06.789 +01:00"),
					TimestampTZ.from("2004-10-19 04:05:06.789 +01:00"),
				] as any,
			});
		}).toThrowError("Invalid TimestampTZRange object, too many values");

		expect(() => {
			TimestampTZRange.from({
				lower: "heya",
				upper: UpperRange.exclude,
				value: [TimestampTZ.from("2004-10-19 04:05:06.789 +01:00"), TimestampTZ.from("2004-11-19 04:05:06.789 +01:00")],
			} as any);
		}).toThrowError("Invalid TimestampTZRange object");
	});

	it("should create a timestamptz range from a raw object", () => {
		const timestampTZRange = TimestampTZRange.from({
			lower: LowerRange.include,
			upper: UpperRange.exclude,
			value: [
				{
					year: 2004,
					month: 10,
					day: 19,
					hour: 4,
					minute: 5,
					second: 6.789,
					offset: {
						hour: 1,
						minute: 0,
						direction: "plus",
					},
				},
				{
					year: 2004,
					month: 11,
					day: 19,
					hour: 4,
					minute: 5,
					second: 6.789,
					offset: {
						hour: 1,
						minute: 0,
						direction: "plus",
					},
				},
			],
		});
		expect(timestampTZRange).not.toBeNull();
	});

	it("should error when creating a timestamptz range from an invalid raw object", () => {
		expect(() => {
			TimestampTZRange.from({} as any);
		}).toThrowError("Invalid TimestampTZRange object");
	});

	it("should create a timestamptz range from arguments", () => {
		const timestampTZRange = TimestampTZRange.from(
			TimestampTZ.from({
				year: 2004,
				month: 10,
				day: 19,
				hour: 4,
				minute: 5,
				second: 6.789,
				offset: {
					hour: 1,
					minute: 0,
					direction: "plus",
				},
			}),
			TimestampTZ.from({
				year: 2004,
				month: 11,
				day: 19,
				hour: 4,
				minute: 5,
				second: 6.789,
				offset: {
					hour: 1,
					minute: 0,
					direction: "plus",
				},
			})
		);
		expect(timestampTZRange).not.toBeNull();
	});

	it("should error when creating a timestamptz range from an invalid arguments", () => {
		expect(() => {
			TimestampTZRange.from(
				TimestampTZ.from({
					year: 2004,
					month: 10,
					day: 19,
					hour: 4,
					minute: 5,
					second: 6.789,
					offset: {
						hour: 1,
						minute: 0,
						direction: "plus",
					},
				}),
				"timestamp" as any
			);
		}).toThrowError("Invalid TimestampTZRange array, invalid TimestampTZs");
	});

	it("should create a timestamptz range from array", () => {
		const timestampTZRange = TimestampTZRange.from([
			TimestampTZ.from({
				year: 2004,
				month: 10,
				day: 19,
				hour: 4,
				minute: 5,
				second: 6.789,
				offset: {
					hour: 1,
					minute: 0,
					direction: "plus",
				},
			}),
			TimestampTZ.from({
				year: 2004,
				month: 11,
				day: 19,
				hour: 4,
				minute: 5,
				second: 6.789,
				offset: {
					hour: 1,
					minute: 0,
					direction: "plus",
				},
			}),
		]);
		expect(timestampTZRange).not.toBeNull();
	});

	it("should error when creating a timestamptz range from an invalid array", () => {
		expect(() => {
			TimestampTZRange.from([] as any);
		}).toThrowError("Invalid TimestampTZRange array, too few values");

		expect(() => {
			TimestampTZRange.from([
				TimestampTZ.from("2004-10-19 04:05:06.789 +01:00"),
				TimestampTZ.from("2004-10-19 04:05:06.789 +01:00"),
				TimestampTZ.from("2004-10-19 04:05:06.789 +01:00"),
			] as any);
		}).toThrowError("Invalid TimestampTZRange array, too many values");

		expect(() => {
			TimestampTZRange.from(["timestamp", "timestamp"] as any);
		}).toThrowError("Invalid TimestampTZRange array, invalid TimestampTZs");
	});

	it("should create a timestamptz range from a DateRange", () => {
		const timestampTZRange = TimestampTZRange.from(TimestampTZRange.from("[2004-10-19 04:05:06.789 +01:00,2004-11-19 04:05:06.789 +01:00)"));
		expect(timestampTZRange).not.toBeNull();
	});

	it("isRange()", () => {
		const timestampTZRange = TimestampTZRange.from("[2004-10-19 04:05:06.789 +01:00,2004-11-19 04:05:06.789 +01:00)");
		expect(TimestampTZRange.isRange(timestampTZRange)).toBe(true);
		expect(
			TimestampTZRange.isRange({
				lower: LowerRange.include,
				upper: UpperRange.exclude,
				value: [TimestampTZ.from("2004-10-19 04:05:06.789 +01:00"), TimestampTZ.from("2004-11-19 04:05:06.789 +01:00")],
			})
		).toBe(false);
	});

	it("toString()", () => {
		const timestampTZRange1 = TimestampTZRange.from("[2004-10-19 04:05:06.789 +01:00,2004-11-19 04:05:06.789 +01:00)");
		expect(timestampTZRange1.toString()).toBe("[2004-10-19 04:05:06.789 +01:00,2004-11-19 04:05:06.789 +01:00)");

		const timestampTZRange2 = TimestampTZRange.from("[2004-10-19 04:05:06.789 +01:00,2004-11-19 04:05:06.789 +01:00]");
		expect(timestampTZRange2.toString()).toBe("[2004-10-19 04:05:06.789 +01:00,2004-11-19 04:05:06.789 +01:00]");

		const timestampTZRange3 = TimestampTZRange.from("(2004-10-19 04:05:06.789 +01:00,2004-11-19 04:05:06.789 +01:00)");
		expect(timestampTZRange3.toString()).toBe("(2004-10-19 04:05:06.789 +01:00,2004-11-19 04:05:06.789 +01:00)");

		const timestampTZRange4 = TimestampTZRange.from("(2004-10-19 04:05:06.789 +01:00,2004-11-19 04:05:06.789 +01:00]");
		expect(timestampTZRange4.toString()).toBe("(2004-10-19 04:05:06.789 +01:00,2004-11-19 04:05:06.789 +01:00]");
	});

	it("toJSON()", () => {
		const timestampTZRange1 = TimestampTZRange.from("[2004-10-19 04:05:06.789 +01:00,2004-11-19 04:05:06.789 +01:00)");
		expect(timestampTZRange1.toJSON()).toStrictEqual({
			lower: LowerRange.include,
			upper: UpperRange.exclude,
			value: [
				{
					year: 2004,
					month: 10,
					day: 19,
					hour: 4,
					minute: 5,
					second: 6.789,
					offset: {
						hour: 1,
						minute: 0,
						direction: "plus",
					},
				},
				{
					year: 2004,
					month: 11,
					day: 19,
					hour: 4,
					minute: 5,
					second: 6.789,
					offset: {
						hour: 1,
						minute: 0,
						direction: "plus",
					},
				},
			],
		});

		const timestampTZRange2 = TimestampTZRange.from("[2004-10-19 04:05:06.789 +01:00,2004-11-19 04:05:06.789 +01:00]");
		expect(timestampTZRange2.toJSON()).toStrictEqual({
			lower: LowerRange.include,
			upper: UpperRange.include,
			value: [
				{
					year: 2004,
					month: 10,
					day: 19,
					hour: 4,
					minute: 5,
					second: 6.789,
					offset: {
						hour: 1,
						minute: 0,
						direction: "plus",
					},
				},
				{
					year: 2004,
					month: 11,
					day: 19,
					hour: 4,
					minute: 5,
					second: 6.789,
					offset: {
						hour: 1,
						minute: 0,
						direction: "plus",
					},
				},
			],
		});

		const timestampTZRange3 = TimestampTZRange.from("(2004-10-19 04:05:06.789 +01:00,2004-11-19 04:05:06.789 +01:00)");
		expect(timestampTZRange3.toJSON()).toStrictEqual({
			lower: LowerRange.exclude,
			upper: UpperRange.exclude,
			value: [
				{
					year: 2004,
					month: 10,
					day: 19,
					hour: 4,
					minute: 5,
					second: 6.789,
					offset: {
						hour: 1,
						minute: 0,
						direction: "plus",
					},
				},
				{
					year: 2004,
					month: 11,
					day: 19,
					hour: 4,
					minute: 5,
					second: 6.789,
					offset: {
						hour: 1,
						minute: 0,
						direction: "plus",
					},
				},
			],
		});

		const timestampTZRange4 = TimestampTZRange.from("(2004-10-19 04:05:06.789 +01:00,2004-11-19 04:05:06.789 +01:00]");
		expect(timestampTZRange4.toJSON()).toStrictEqual({
			lower: LowerRange.exclude,
			upper: UpperRange.include,
			value: [
				{
					year: 2004,
					month: 10,
					day: 19,
					hour: 4,
					minute: 5,
					second: 6.789,
					offset: {
						hour: 1,
						minute: 0,
						direction: "plus",
					},
				},
				{
					year: 2004,
					month: 11,
					day: 19,
					hour: 4,
					minute: 5,
					second: 6.789,
					offset: {
						hour: 1,
						minute: 0,
						direction: "plus",
					},
				},
			],
		});
	});

	it("equals()", () => {
		const timestampTZRange = TimestampTZRange.from("[2004-10-19 04:05:06.789 +01:00,2004-11-19 04:05:06.789 +01:00)");
		expect(timestampTZRange.equals(TimestampTZRange.from("[2004-10-19 04:05:06.789 +01:00,2004-11-19 04:05:06.789 +01:00)"))).toBe(true);
		expect(timestampTZRange.equals(TimestampTZRange.from("[2004-10-19 04:05:06.789 +01:00,2004-11-19 04:05:06.789 +01:00]"))).toBe(false);
		expect(timestampTZRange.equals(TimestampTZRange.from("[2004-10-19 04:05:06.789 +01:00,2004-11-19 04:05:06.789 +01:00)").toString())).toBe(true);
		expect(timestampTZRange.equals(TimestampTZRange.from("[2004-10-19 04:05:06.789 +01:00,2004-11-19 04:05:06.789 +01:00]").toString())).toBe(false);
		expect(timestampTZRange.equals(TimestampTZRange.from("[2004-10-19 04:05:06.789 +01:00,2004-11-19 04:05:06.789 +01:00)").toJSON())).toBe(true);
		expect(timestampTZRange.equals(TimestampTZRange.from("[2004-10-19 04:05:06.789 +01:00,2004-11-19 04:05:06.789 +01:00]").toJSON())).toBe(false);
	});

	it("get lower()", () => {
		const timestampTZRange = TimestampTZRange.from("[2004-10-19 04:05:06.789 +01:00,2004-11-19 04:05:06.789 +01:00)");
		expect(timestampTZRange.lower).toBe("[");
	});

	it("set lower()", () => {
		const timestampTZRange = TimestampTZRange.from("[2004-10-19 04:05:06.789 +01:00,2004-11-19 04:05:06.789 +01:00)");
		timestampTZRange.lower = LowerRange.exclude;
		expect(timestampTZRange.lower).toBe("(");
	});

	it("get upper()", () => {
		const timestampTZRange = TimestampTZRange.from("[2004-10-19 04:05:06.789 +01:00,2004-11-19 04:05:06.789 +01:00)");
		expect(timestampTZRange.upper).toBe(")");
	});

	it("set upper()", () => {
		const timestampTZRange = TimestampTZRange.from("[2004-10-19 04:05:06.789 +01:00,2004-11-19 04:05:06.789 +01:00)");
		timestampTZRange.upper = UpperRange.include;
		expect(timestampTZRange.upper).toBe("]");
	});

	it("get value()", () => {
		const timestampTZRange = TimestampTZRange.from("[2004-10-19 04:05:06.789 +01:00,2004-11-19 04:05:06.789 +01:00)");
		expect(timestampTZRange.value).toStrictEqual([TimestampTZ.from("2004-10-19 04:05:06.789 +01:00"), TimestampTZ.from("2004-11-19 04:05:06.789 +01:00")]);
	});

	it("set value()", () => {
		const timestampTZRange = TimestampTZRange.from("[2004-10-19 04:05:06.789 +01:00,2004-11-19 04:05:06.789 +01:00)");
		timestampTZRange.value = [TimestampTZ.from("2011-10-19 10:23:54.678 +01:00"), TimestampTZ.from("2011-11-19 10:23:54.678 +01:00")];
		expect(timestampTZRange.value).toStrictEqual([TimestampTZ.from("2011-10-19 10:23:54.678 +01:00"), TimestampTZ.from("2011-11-19 10:23:54.678 +01:00")]);
	});

	it("get empty()", () => {
		const timestampTZRange1 = TimestampTZRange.from("[2004-10-19 04:05:06.789 +01:00,2004-11-19 04:05:06.789 +01:00)");
		expect(timestampTZRange1.empty).toBe(false);
		const timestampTZRange2 = TimestampTZRange.from("[2004-10-19 04:05:06.789 +01:00,2004-10-19 04:05:06.789 +01:00)");
		expect(timestampTZRange2.empty).toBe(true);
		const timestampTZRange3 = TimestampTZRange.from("(2004-10-19 04:05:06.789 +01:00,2004-10-19 04:05:06.789 +01:00]");
		expect(timestampTZRange3.empty).toBe(true);
		const timestampTZRange4 = TimestampTZRange.from("empty");
		expect(timestampTZRange4.empty).toBe(true);
	});

	it("isWithinRange()", () => {
		const timestampTZRange1 = TimestampTZRange.from("[2004-10-19 04:05:06.789 +01:00,2004-11-19 04:05:06.789 +01:00)");
		expect(timestampTZRange1.isWithinRange(TimestampTZ.from("2004-10-19 04:05:06.789 +01:00"))).toBe(true);
		expect(timestampTZRange1.isWithinRange(TimestampTZ.from("2004-10-25 01:45:21.321 +01:00"))).toBe(true);
		expect(timestampTZRange1.isWithinRange(TimestampTZ.from("2004-11-01 16:11:38.454 +01:00"))).toBe(true);
		expect(timestampTZRange1.isWithinRange(TimestampTZ.from("2004-11-19 04:05:06.789 +01:00"))).toBe(false);

		const timestampTZRange2 = TimestampTZRange.from("(2004-10-19 04:05:06.789 +01:00,2004-11-19 04:05:06.789 +01:00]");
		expect(timestampTZRange2.isWithinRange(TimestampTZ.from("2004-10-19 04:05:06.789 +01:00"))).toBe(false);
		expect(timestampTZRange2.isWithinRange(TimestampTZ.from("2004-10-25 01:45:21.321 +01:00"))).toBe(true);
		expect(timestampTZRange2.isWithinRange(TimestampTZ.from("2004-11-01 16:11:38.454 +01:00"))).toBe(true);
		expect(timestampTZRange2.isWithinRange(TimestampTZ.from("2004-11-19 04:05:06.789 +01:00"))).toBe(true);

		const timestampTZRange3 = TimestampTZRange.from("empty");
		expect(timestampTZRange3.isWithinRange(TimestampTZ.from("2004-10-19 04:05:06.789 +01:00"))).toBe(false);
		expect(timestampTZRange3.isWithinRange(TimestampTZ.from("2004-10-25 01:45:21.321 +01:00"))).toBe(false);
		expect(timestampTZRange3.isWithinRange(TimestampTZ.from("2004-11-01 16:11:38.454 +01:00"))).toBe(false);
		expect(timestampTZRange3.isWithinRange(TimestampTZ.from("2004-11-19 04:05:06.789 +01:00"))).toBe(false);

		const timestampTZRange4 = TimestampTZRange.from("[2004-10-19 04:05:06.789 +01:00,2004-11-19 04:05:06.789 +01:00]");
		expect(timestampTZRange4.isWithinRange(TimestampTZ.from("2004-10-19 04:05:06.789 +01:00"))).toBe(true);
		expect(timestampTZRange4.isWithinRange(TimestampTZ.from("2004-10-25 01:45:21.321 +01:00"))).toBe(true);
		expect(timestampTZRange4.isWithinRange(TimestampTZ.from("2004-11-01 16:11:38.454 +01:00"))).toBe(true);
		expect(timestampTZRange4.isWithinRange(TimestampTZ.from("2004-11-19 04:05:06.789 +01:00"))).toBe(true);

		const timestampTZRange5 = TimestampTZRange.from("(2004-10-19 04:05:06.789 +01:00,2004-11-19 04:05:06.789 +01:00)");
		expect(timestampTZRange5.isWithinRange(TimestampTZ.from("2004-10-19 04:05:06.789 +01:00"))).toBe(false);
		expect(timestampTZRange5.isWithinRange(TimestampTZ.from("2004-10-25 01:45:21.321 +01:00"))).toBe(true);
		expect(timestampTZRange5.isWithinRange(TimestampTZ.from("2004-11-01 16:11:38.454 +01:00"))).toBe(true);
		expect(timestampTZRange5.isWithinRange(TimestampTZ.from("2004-11-19 04:05:06.789 +01:00"))).toBe(false);
	});

	it("should be returned from PostgreSQL", async () => {
		const client = new Client({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			application_name: "timestamptzrange.test.ts",
		});

		await client.connect();

		let error = null;
		try {
			await client.query(`
				CREATE TABLE public.jesttimestamptzrange (
					tstzrange tstzrange NULL,
					_tstzrange _tstzrange NULL
				)
			`);

			await client.query(`
				INSERT INTO public.jesttimestamptzrange (tstzrange, _tstzrange)
				VALUES (
					'[2004-10-19 04:05:06.789 +01:00,2004-11-19 04:05:06.789 +01:00)',
					'{[2004-10-19 04:05:06.789 +01:00\\,2004-11-19 04:05:06.789 +01:00),[2015-09-08 09:08:07.678 +01:00\\,2016-05-29 09:12:32.762 +01:00)}'
				)
			`);

			const result = await client.query(`
				SELECT * FROM public.jesttimestamptzrange
			`);

			expect(result.rows[0].tstzrange).toStrictEqual(TimestampTZRange.from("[2004-10-19 03:05:06.789 +00:00,2004-11-19 03:05:06.789 +00:00)"));
			expect(result.rows[0]._tstzrange).toStrictEqual([
				TimestampTZRange.from("[2004-10-19 03:05:06.789 +00:00,2004-11-19 03:05:06.789 +00:00)"),
				TimestampTZRange.from("[2015-09-08 08:08:07.678 +00:00,2016-05-29 08:12:32.762 +00:00)"),
			]);
		} catch (err) {
			error = err;
		}

		await client.query(`
			DROP TABLE public.jesttimestamptzrange
		`);

		await client.end();

		if (error) throw error;
	});
});
