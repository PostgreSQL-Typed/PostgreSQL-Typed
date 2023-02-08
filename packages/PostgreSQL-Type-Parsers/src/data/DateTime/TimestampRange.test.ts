import { Client } from "pg";
import { describe, expect, it } from "vitest";

import { LowerRange, UpperRange } from "../../util/Range.js";
import { Timestamp } from "./Timestamp.js";
import { TimestampRange } from "./TimestampRange.js";

describe.todo("TimestampRange Class", () => {
	it("should create a timestamp range from a string", () => {
		const timestampRange = TimestampRange.from("[2004-10-19T10:23:54.678Z,2004-11-19T10:23:54.678Z)");
		expect(timestampRange).not.toBeNull();
	});

	it("should error when creating a timestamp range from an invalid string", () => {
		expect(() => {
			TimestampRange.from("2004-10-19T10:23:54.678Z");
		}).toThrowError("Invalid TimestampRange string");
	});

	it("should create a timestamp range from a object", () => {
		const timestampRange = TimestampRange.from({
			lower: LowerRange.include,
			upper: UpperRange.exclude,
			value: [Timestamp.from("2004-10-19T10:23:54.678Z"), Timestamp.from("2004-11-19T10:23:54.678Z")],
		});
		expect(timestampRange).not.toBeNull();
	});

	it("should error when creating a timestamp range from an invalid object", () => {
		expect(() => {
			TimestampRange.from({
				lower: LowerRange.include,
				upper: UpperRange.exclude,
				value: [] as any,
			});
		}).toThrowError("Invalid TimestampRange object, too few values");

		expect(() => {
			TimestampRange.from({
				lower: LowerRange.include,
				upper: UpperRange.exclude,
				value: [Timestamp.from("2004-10-19 04:05:06.789"), Timestamp.from("2004-10-19 04:05:06.789"), Timestamp.from("2004-10-19 04:05:06.789")] as any,
			});
		}).toThrowError("Invalid TimestampRange object, too many values");

		expect(() => {
			TimestampRange.from({
				lower: "heya",
				upper: UpperRange.exclude,
				value: [Timestamp.from("2004-10-19 04:05:06.789"), Timestamp.from("2004-11-19 04:05:06.789")],
			} as any);
		}).toThrowError("Invalid TimestampRange object");
	});

	it("should create a timestamp range from a raw object", () => {
		const timestampRange = TimestampRange.from({
			lower: LowerRange.include,
			upper: UpperRange.exclude,
			value: [
				{
					year: 2004,
					month: 10,
					day: 19,
					hour: 10,
					minute: 23,
					second: 54.678,
				},
				{
					year: 2004,
					month: 11,
					day: 19,
					hour: 10,
					minute: 23,
					second: 54.678,
				},
			],
		});
		expect(timestampRange).not.toBeNull();
	});

	it("should error when creating a timestamp range from an invalid raw object", () => {
		expect(() => {
			TimestampRange.from({} as any);
		}).toThrowError("Invalid TimestampRange object");
	});

	it("should create a timestamp range from arguments", () => {
		const timestampRange = TimestampRange.from(
			Timestamp.from({
				year: 2004,
				month: 10,
				day: 19,
				hour: 10,
				minute: 23,
				second: 54.678,
			}),
			Timestamp.from({
				year: 2004,
				month: 11,
				day: 19,
				hour: 10,
				minute: 23,
				second: 54.678,
			})
		);
		expect(timestampRange).not.toBeNull();
	});

	it("should error when creating a timestamp range from an invalid arguments", () => {
		expect(() => {
			TimestampRange.from(
				Timestamp.from({
					year: 2004,
					month: 10,
					day: 19,
					hour: 4,
					minute: 5,
					second: 6.789,
				}),
				"timestamp" as any
			);
		}).toThrowError("Invalid TimestampRange array, invalid Timestamps");
	});

	it("should create a timestamp range from array", () => {
		const timestampRange = TimestampRange.from([
			Timestamp.from({
				year: 2004,
				month: 10,
				day: 19,
				hour: 10,
				minute: 23,
				second: 54.678,
			}),
			Timestamp.from({
				year: 2004,
				month: 11,
				day: 19,
				hour: 10,
				minute: 23,
				second: 54.678,
			}),
		]);
		expect(timestampRange).not.toBeNull();
	});

	it("should error when creating a timestamptz range from an invalid array", () => {
		expect(() => {
			TimestampRange.from([] as any);
		}).toThrowError("Invalid TimestampRange array, too few values");

		expect(() => {
			TimestampRange.from([
				Timestamp.from("2004-10-19 04:05:06.789"),
				Timestamp.from("2004-10-19 04:05:06.789"),
				Timestamp.from("2004-10-19 04:05:06.789"),
			] as any);
		}).toThrowError("Invalid TimestampRange array, too many values");

		expect(() => {
			TimestampRange.from(["timestamp", "timestamp"] as any);
		}).toThrowError("Invalid TimestampRange array, invalid Timestamps");
	});

	it("should create a timestamp range from a DateRange", () => {
		const timestampRange = TimestampRange.from(TimestampRange.from("[2004-10-19T10:23:54.678Z,2004-11-19T10:23:54.678Z)"));
		expect(timestampRange).not.toBeNull();
	});

	it("isRange()", () => {
		const timestampRange = TimestampRange.from("[2004-10-19T10:23:54.678Z,2004-11-19T10:23:54.678Z)");
		expect(TimestampRange.isRange(timestampRange)).toBe(true);
		expect(
			TimestampRange.isRange({
				lower: LowerRange.include,
				upper: UpperRange.exclude,
				value: [Timestamp.from("2004-10-19T10:23:54.678Z"), Timestamp.from("2004-11-19T10:23:54.678Z")],
			})
		).toBe(false);
	});

	it("toString()", () => {
		const timestampRange1 = TimestampRange.from("[2004-10-19T10:23:54.678Z,2004-11-19T10:23:54.678Z)");
		expect(timestampRange1.toString()).toBe("[2004-10-19 10:23:54.678,2004-11-19 10:23:54.678)");

		const timestampRange2 = TimestampRange.from("[2004-10-19T10:23:54.678Z,2004-11-19T10:23:54.678Z]");
		expect(timestampRange2.toString()).toBe("[2004-10-19 10:23:54.678,2004-11-19 10:23:54.678]");

		const timestampRange3 = TimestampRange.from("(2004-10-19T10:23:54.678Z,2004-11-19T10:23:54.678Z)");
		expect(timestampRange3.toString()).toBe("(2004-10-19 10:23:54.678,2004-11-19 10:23:54.678)");

		const timestampRange4 = TimestampRange.from("(2004-10-19T10:23:54.678Z,2004-11-19T10:23:54.678Z]");
		expect(timestampRange4.toString()).toBe("(2004-10-19 10:23:54.678,2004-11-19 10:23:54.678]");
	});

	it("toJSON()", () => {
		const timestampRange1 = TimestampRange.from("[2004-10-19T10:23:54.678Z,2004-11-19T10:23:54.678Z)");
		expect(timestampRange1.toJSON()).toStrictEqual({
			lower: LowerRange.include,
			upper: UpperRange.exclude,
			value: [
				{
					year: 2004,
					month: 10,
					day: 19,
					hour: 10,
					minute: 23,
					second: 54.678,
				},
				{
					year: 2004,
					month: 11,
					day: 19,
					hour: 10,
					minute: 23,
					second: 54.678,
				},
			],
		});

		const timestampRange2 = TimestampRange.from("[2004-10-19T10:23:54.678Z,2004-11-19T10:23:54.678Z]");
		expect(timestampRange2.toJSON()).toStrictEqual({
			lower: LowerRange.include,
			upper: UpperRange.include,
			value: [
				{
					year: 2004,
					month: 10,
					day: 19,
					hour: 10,
					minute: 23,
					second: 54.678,
				},
				{
					year: 2004,
					month: 11,
					day: 19,
					hour: 10,
					minute: 23,
					second: 54.678,
				},
			],
		});

		const timestampRange3 = TimestampRange.from("(2004-10-19T10:23:54.678Z,2004-11-19T10:23:54.678Z)");
		expect(timestampRange3.toJSON()).toStrictEqual({
			lower: LowerRange.exclude,
			upper: UpperRange.exclude,
			value: [
				{
					year: 2004,
					month: 10,
					day: 19,
					hour: 10,
					minute: 23,
					second: 54.678,
				},
				{
					year: 2004,
					month: 11,
					day: 19,
					hour: 10,
					minute: 23,
					second: 54.678,
				},
			],
		});

		const timestampRange4 = TimestampRange.from("(2004-10-19T10:23:54.678Z,2004-11-19T10:23:54.678Z]");
		expect(timestampRange4.toJSON()).toStrictEqual({
			lower: LowerRange.exclude,
			upper: UpperRange.include,
			value: [
				{
					year: 2004,
					month: 10,
					day: 19,
					hour: 10,
					minute: 23,
					second: 54.678,
				},
				{
					year: 2004,
					month: 11,
					day: 19,
					hour: 10,
					minute: 23,
					second: 54.678,
				},
			],
		});
	});

	it("equals()", () => {
		const timestampRange = TimestampRange.from("[2004-10-19T10:23:54.678Z,2004-11-19T10:23:54.678Z)");
		expect(timestampRange.equals(TimestampRange.from("[2004-10-19T10:23:54.678Z,2004-11-19T10:23:54.678Z)"))).toBe(true);
		expect(timestampRange.equals(TimestampRange.from("[2004-10-19T10:23:54.678Z,2004-11-19T10:23:54.678Z]"))).toBe(false);
		expect(timestampRange.equals(TimestampRange.from("[2004-10-19T10:23:54.678Z,2004-11-19T10:23:54.678Z)").toString())).toBe(true);
		expect(timestampRange.equals(TimestampRange.from("[2004-10-19T10:23:54.678Z,2004-11-19T10:23:54.678Z]").toString())).toBe(false);
		expect(timestampRange.equals(TimestampRange.from("[2004-10-19T10:23:54.678Z,2004-11-19T10:23:54.678Z)").toJSON())).toBe(true);
		expect(timestampRange.equals(TimestampRange.from("[2004-10-19T10:23:54.678Z,2004-11-19T10:23:54.678Z]").toJSON())).toBe(false);
	});

	it("get lower()", () => {
		const timestampRange = TimestampRange.from("[2004-10-19T10:23:54.678Z,2004-11-19T10:23:54.678Z)");
		expect(timestampRange.lower).toBe("[");
	});

	it("set lower()", () => {
		const timestampRange = TimestampRange.from("[2004-10-19T10:23:54.678Z,2004-11-19T10:23:54.678Z)");
		timestampRange.lower = LowerRange.exclude;
		expect(timestampRange.lower).toBe("(");
	});

	it("get upper()", () => {
		const timestampRange = TimestampRange.from("[2004-10-19T10:23:54.678Z,2004-11-19T10:23:54.678Z)");
		expect(timestampRange.upper).toBe(")");
	});

	it("set upper()", () => {
		const timestampRange = TimestampRange.from("[2004-10-19T10:23:54.678Z,2004-11-19T10:23:54.678Z)");
		timestampRange.upper = UpperRange.include;
		expect(timestampRange.upper).toBe("]");
	});

	it("get value()", () => {
		const timestampRange = TimestampRange.from("[2004-10-19T10:23:54.678Z,2004-11-19T10:23:54.678Z)");
		expect(timestampRange.value).toStrictEqual([Timestamp.from("2004-10-19T10:23:54.678Z"), Timestamp.from("2004-11-19T10:23:54.678Z")]);
	});

	it("set value()", () => {
		const timestampRange = TimestampRange.from("[2004-10-19T10:23:54.678Z,2004-11-19T10:23:54.678Z)");
		timestampRange.value = [Timestamp.from("2011-10-19T10:23:54.678Z"), Timestamp.from("2011-11-19T10:23:54.678Z")];
		expect(timestampRange.value).toStrictEqual([Timestamp.from("2011-10-19T10:23:54.678Z"), Timestamp.from("2011-11-19T10:23:54.678Z")]);
	});

	it("get empty()", () => {
		const timestampRange1 = TimestampRange.from("[2004-10-19T10:23:54.678Z,2004-11-19T10:23:54.678Z)");
		expect(timestampRange1.empty).toBe(false);
		const timestampRange2 = TimestampRange.from("[2004-10-19T10:23:54.678Z,2004-10-19T10:23:54.678Z)");
		expect(timestampRange2.empty).toBe(true);
		const timestampRange3 = TimestampRange.from("(2004-10-19T10:23:54.678Z,2004-10-19T10:23:54.678Z]");
		expect(timestampRange3.empty).toBe(true);
		const timestampRange4 = TimestampRange.from("empty");
		expect(timestampRange4.empty).toBe(true);
	});

	it("isWithinRange()", () => {
		const timestampRange1 = TimestampRange.from("[2004-10-19T10:23:54.678Z,2004-11-19T10:23:54.678Z)");
		expect(timestampRange1.isWithinRange(Timestamp.from("2004-10-19T10:23:54.678Z"))).toBe(true);
		expect(timestampRange1.isWithinRange(Timestamp.from("2004-10-25T01:45:21.321Z"))).toBe(true);
		expect(timestampRange1.isWithinRange(Timestamp.from("2004-11-01T16:11:38.454Z"))).toBe(true);
		expect(timestampRange1.isWithinRange(Timestamp.from("2004-11-19T10:23:54.678Z"))).toBe(false);

		const timestampRange2 = TimestampRange.from("(2004-10-19T10:23:54.678Z,2004-11-19T10:23:54.678Z]");
		expect(timestampRange2.isWithinRange(Timestamp.from("2004-10-19T10:23:54.678Z"))).toBe(false);
		expect(timestampRange2.isWithinRange(Timestamp.from("2004-10-25T01:45:21.321Z"))).toBe(true);
		expect(timestampRange2.isWithinRange(Timestamp.from("2004-11-01T16:11:38.454Z"))).toBe(true);
		expect(timestampRange2.isWithinRange(Timestamp.from("2004-11-19T10:23:54.678Z"))).toBe(true);

		const timestampRange3 = TimestampRange.from("empty");
		expect(timestampRange3.isWithinRange(Timestamp.from("2004-10-19T10:23:54.678Z"))).toBe(false);
		expect(timestampRange3.isWithinRange(Timestamp.from("2004-10-25T01:45:21.321Z"))).toBe(false);
		expect(timestampRange3.isWithinRange(Timestamp.from("2004-11-01T16:11:38.454Z"))).toBe(false);
		expect(timestampRange3.isWithinRange(Timestamp.from("2004-11-19T10:23:54.678Z"))).toBe(false);

		const timestampRange4 = TimestampRange.from("[2004-10-19T10:23:54.678Z,2004-11-19T10:23:54.678Z]");
		expect(timestampRange4.isWithinRange(Timestamp.from("2004-10-19T10:23:54.678Z"))).toBe(true);
		expect(timestampRange4.isWithinRange(Timestamp.from("2004-10-25T01:45:21.321Z"))).toBe(true);
		expect(timestampRange4.isWithinRange(Timestamp.from("2004-11-01T16:11:38.454Z"))).toBe(true);
		expect(timestampRange4.isWithinRange(Timestamp.from("2004-11-19T10:23:54.678Z"))).toBe(true);

		const timestampRange5 = TimestampRange.from("(2004-10-19T10:23:54.678Z,2004-11-19T10:23:54.678Z)");
		expect(timestampRange5.isWithinRange(Timestamp.from("2004-10-19T10:23:54.678Z"))).toBe(false);
		expect(timestampRange5.isWithinRange(Timestamp.from("2004-10-25T01:45:21.321Z"))).toBe(true);
		expect(timestampRange5.isWithinRange(Timestamp.from("2004-11-01T16:11:38.454Z"))).toBe(true);
		expect(timestampRange5.isWithinRange(Timestamp.from("2004-11-19T10:23:54.678Z"))).toBe(false);
	});

	it("should be returned from PostgreSQL", async () => {
		const client = new Client({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			application_name: "timestamprange.test.ts",
		});

		await client.connect();

		let error = null;
		try {
			await client.query(`
				CREATE TABLE public.jesttimestamprange (
					tsrange tsrange NULL,
					_tsrange _tsrange NULL
				)
			`);

			await client.query(`
				INSERT INTO public.jesttimestamprange (tsrange, _tsrange)
				VALUES (
					'[2004-10-19T10:23:54.678Z,2004-11-19T10:23:54.678Z)',
					'{[2004-10-19T10:23:54.678Z\\,2004-11-19T10:23:54.678Z),[2015-09-08T09:08:07.678Z\\,2016-05-29T09:12:32.762Z)}'
				)
			`);

			const result = await client.query(`
				SELECT * FROM public.jesttimestamprange
			`);

			expect(result.rows[0].tsrange).toStrictEqual(TimestampRange.from("[2004-10-19T10:23:54.678Z,2004-11-19T10:23:54.678Z)"));
			expect(result.rows[0]._tsrange).toStrictEqual([
				TimestampRange.from("[2004-10-19T10:23:54.678Z,2004-11-19T10:23:54.678Z)"),
				TimestampRange.from("[2015-09-08T09:08:07.678Z,2016-05-29T09:12:32.762Z)"),
			]);
		} catch (error_) {
			error = error_;
		}

		await client.query(`
			DROP TABLE public.jesttimestamprange
		`);

		await client.end();

		if (error) throw error;
	});
});
