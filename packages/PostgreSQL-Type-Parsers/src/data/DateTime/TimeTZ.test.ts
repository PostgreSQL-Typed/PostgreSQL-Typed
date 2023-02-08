/* eslint-disable unicorn/filename-case */
import { DateTime } from "luxon";
import { Client } from "pg";
import { describe, expect, it } from "vitest";

import { TimeTZ } from "./TimeTZ.js";

describe.todo("TimeTZ Class", () => {
	it("should create a timetz from a string", () => {
		const timetz1 = TimeTZ.from("04:05:06.789+01:00");
		expect(timetz1).not.toBeNull();
		const timetz2 = TimeTZ.from("04:05:06.789-01:00");
		expect(timetz2).not.toBeNull();
		const timetz3 = TimeTZ.from("04:05:06.789+01");
		expect(timetz3).not.toBeNull();
		const timetz4 = TimeTZ.from("04:05:06.789-01");
		expect(timetz4).not.toBeNull();
		const timetz5 = TimeTZ.from("04:05:06.789 EST");
		expect(timetz5).not.toBeNull();
		const timetz6 = TimeTZ.from("04:05:06.789 Asia/Tokyo");
		expect(timetz6).not.toBeNull();
		const timetz7 = TimeTZ.from("04:05:06+01");
		expect(timetz7).not.toBeNull();
		const timetz8 = TimeTZ.from("04:05:06 Asia/Tokyo");
		expect(timetz8).not.toBeNull();
		expect(TimeTZ.from(TimeTZ.from("04:05:06.789+01:00"))).not.toBeNull();
	});

	it("should error when creating a timetz from an invalid string", () => {
		expect(() => TimeTZ.from("04:05:06.789")).toThrowError("Invalid TimeTZ string");
		expect(() => TimeTZ.from("04:05:06.789+01:")).toThrowError("Invalid TimeTZ string");
		expect(() => TimeTZ.from("04:05:06.789+01:0")).toThrowError("Invalid TimeTZ string");
		expect(() => TimeTZ.from("04:05:06.789 KST")).toThrowError("Invalid TimeTZ string");
	});

	it("should create a timetz from a object", () => {
		const timetz1 = TimeTZ.from({
			hour: 4,
			minute: 5,
			second: 6,
			offset: {
				hour: 1,
				minute: 0,
				direction: "plus",
			},
		});
		expect(timetz1).not.toBeNull();
		const timetz2 = TimeTZ.from({
			hour: 4,
			minute: 5,
			second: 6,
			offset: {
				hour: 1,
				minute: 0,
				direction: "minus",
			},
		});
		expect(timetz2).not.toBeNull();
	});

	it("should error when creating a timetz from an invalid object", () => {
		expect(() => TimeTZ.from({} as any)).toThrowError("Invalid TimeTZ object");
		expect(() =>
			TimeTZ.from({
				hour: 4,
				minute: 5,
				second: 6,
				offset: {
					hour: 1,
					minute: 0,
					direction: "invalid",
				},
			} as any)
		).toThrowError("Invalid TimeTZ object");
		expect(() =>
			TimeTZ.from({
				hour: 99,
				minute: 5,
				second: 6,
				offset: {
					hour: 1,
					minute: 0,
					direction: "plus",
				},
			})
		).toThrowError("Invalid TimeTZ object");
	});

	it("should create a timetz from numbers", () => {
		const timetz1 = TimeTZ.from(4, 5, 6, 1, 0, "plus");
		expect(timetz1).not.toBeNull();
		const timetz2 = TimeTZ.from(4, 5, 6, 1, 0, "minus");
		expect(timetz2).not.toBeNull();
	});

	it("should error when creating a timetz from invalid numbers", () => {
		expect(() => TimeTZ.from(4, 5, 6, 1, 0, "invalid" as any)).toThrowError("Invalid TimeTZ array, numbers and OffsetDirection");
		expect(() => TimeTZ.from(4, 5, "number" as any, 1, 0, "minus")).toThrowError("Invalid TimeTZ array, numbers and OffsetDirection");
		expect(() => TimeTZ.from(4, 5, 99, 1, 0, "minus")).toThrowError("Invalid TimeTZ array, numbers and OffsetDirection");
	});

	it("should create a timetz from a DateTime", () => {
		const timetz1 = TimeTZ.from(
			DateTime.fromObject({
				hour: 4,
				minute: 5,
				second: 6,
				millisecond: 789,
			}).setZone("America/New_York")
		);
		expect(timetz1).not.toBeNull();
		const timetz2 = TimeTZ.from(
			DateTime.fromObject({
				hour: 4,
				minute: 5,
				second: 6,
				millisecond: 789,
			}).setZone("UTC")
		);
		expect(timetz2).not.toBeNull();
	});

	it("should create a timetz from a JavaScript Date", () => {
		const timetz = TimeTZ.from(new globalThis.Date(2022, 9, 2, 4, 5, 6, 789));
		expect(timetz).not.toBeNull();
	});

	it("isTimeTZ()", () => {
		const timetz = TimeTZ.from("04:05:06.789+01:00");
		expect(TimeTZ.isTimeTZ(timetz)).toBe(true);
		expect(
			TimeTZ.isTimeTZ({
				hour: 4,
				minute: 5,
				second: 6,
				offset: {
					hour: 1,
					minute: 0,
					direction: "minus",
				},
			})
		).toBe(false);
	});

	it("toString()", () => {
		const timetz = TimeTZ.from({
			hour: 4,
			minute: 5,
			second: 6,
			offset: {
				hour: 1,
				minute: 0,
				direction: "minus",
			},
		});
		expect(timetz.toString()).toBe("04:05:06-01:00");
	});

	it("toJSON()", () => {
		const timetz = TimeTZ.from({
			hour: 4,
			minute: 5,
			second: 6,
			offset: {
				hour: 1,
				minute: 0,
				direction: "minus",
			},
		});
		expect(timetz.toJSON()).toEqual({
			hour: 4,
			minute: 5,
			second: 6,
			offset: {
				hour: 1,
				minute: 0,
				direction: "minus",
			},
		});
	});

	it("equals()", () => {
		const timetz = TimeTZ.from({
			hour: 4,
			minute: 5,
			second: 6,
			offset: {
				hour: 1,
				minute: 0,
				direction: "minus",
			},
		});

		expect(
			timetz.equals(
				TimeTZ.from({
					hour: 4,
					minute: 5,
					second: 6,
					offset: {
						hour: 1,
						minute: 0,
						direction: "minus",
					},
				})
			)
		).toBe(true);
		expect(
			timetz.equals(
				TimeTZ.from({
					hour: 4,
					minute: 5,
					second: 6,
					offset: {
						hour: 1,
						minute: 0,
						direction: "plus",
					},
				})
			)
		).toBe(false);
		expect(
			timetz.equals(
				TimeTZ.from({
					hour: 4,
					minute: 5,
					second: 6,
					offset: {
						hour: 1,
						minute: 0,
						direction: "minus",
					},
				}).toJSON()
			)
		).toBe(true);
		expect(
			timetz.equals(
				TimeTZ.from({
					hour: 4,
					minute: 5,
					second: 6,
					offset: {
						hour: 1,
						minute: 0,
						direction: "plus",
					},
				}).toJSON()
			)
		).toBe(false);
		expect(
			timetz.equals(
				TimeTZ.from({
					hour: 4,
					minute: 5,
					second: 6,
					offset: {
						hour: 1,
						minute: 0,
						direction: "minus",
					},
				}).toString()
			)
		).toBe(true);
		expect(
			timetz.equals(
				TimeTZ.from({
					hour: 4,
					minute: 5,
					second: 6,
					offset: {
						hour: 1,
						minute: 0,
						direction: "plus",
					},
				}).toString()
			)
		).toBe(false);
		expect(
			timetz.equals(
				TimeTZ.from({
					hour: 6,
					minute: 5,
					second: 6,
					offset: {
						hour: 1,
						minute: 0,
						direction: "plus",
					},
				})
			)
		).toBe(true);
		expect(
			timetz.equals(
				TimeTZ.from({
					hour: 6,
					minute: 5,
					second: 6,
					offset: {
						hour: 2,
						minute: 0,
						direction: "plus",
					},
				})
			)
		).toBe(false);
	});

	it("get hour", () => {
		const timetz = TimeTZ.from({
			hour: 4,
			minute: 5,
			second: 6,
			offset: {
				hour: 1,
				minute: 0,
				direction: "minus",
			},
		});
		expect(timetz.hour).toBe(4);
	});

	it("set hour", () => {
		const timetz = TimeTZ.from({
			hour: 4,
			minute: 5,
			second: 6,
			offset: {
				hour: 1,
				minute: 0,
				direction: "minus",
			},
		});
		timetz.hour = 12;
		expect(timetz.hour).toBe(12);
		expect(() => {
			timetz.hour = 24;
		}).toThrowError("Invalid hour");
		expect(() => {
			timetz.hour = -1;
		}).toThrowError("Invalid hour");
		expect(() => {
			timetz.hour = "a" as any;
		}).toThrowError("Invalid hour");
	});

	it("get minute", () => {
		const timetz = TimeTZ.from({
			hour: 4,
			minute: 5,
			second: 6,
			offset: {
				hour: 1,
				minute: 0,
				direction: "minus",
			},
		});
		expect(timetz.minute).toBe(5);
	});

	it("set minute", () => {
		const timetz = TimeTZ.from({
			hour: 4,
			minute: 5,
			second: 6,
			offset: {
				hour: 1,
				minute: 0,
				direction: "minus",
			},
		});
		timetz.minute = 10;
		expect(timetz.minute).toBe(10);
		expect(() => {
			timetz.minute = 60;
		}).toThrowError("Invalid minute");
		expect(() => {
			timetz.minute = -1;
		}).toThrowError("Invalid minute");
		expect(() => {
			timetz.minute = "a" as any;
		}).toThrowError("Invalid minute");
	});

	it("get second", () => {
		const timetz = TimeTZ.from({
			hour: 4,
			minute: 5,
			second: 6.123,
			offset: {
				hour: 1,
				minute: 0,
				direction: "minus",
			},
		});
		expect(timetz.second).toBe(6.123);
	});

	it("set second", () => {
		const timetz = TimeTZ.from({
			hour: 4,
			minute: 5,
			second: 6,
			offset: {
				hour: 1,
				minute: 0,
				direction: "minus",
			},
		});
		timetz.second = 3;
		expect(timetz.second).toBe(3);
		expect(() => {
			timetz.second = 60;
		}).toThrowError("Invalid second");
		expect(() => {
			timetz.second = -1;
		}).toThrowError("Invalid second");
		expect(() => {
			timetz.second = "a" as any;
		}).toThrowError("Invalid second");
	});

	it("get offset", () => {
		const timetz = TimeTZ.from({
			hour: 4,
			minute: 5,
			second: 6,
			offset: {
				hour: 1,
				minute: 0,
				direction: "minus",
			},
		});
		expect(timetz.offset).toEqual({
			hour: 1,
			minute: 0,
			direction: "minus",
		});
	});

	it("set offset", () => {
		const timetz = TimeTZ.from({
			hour: 4,
			minute: 5,
			second: 6,
			offset: {
				hour: 1,
				minute: 0,
				direction: "minus",
			},
		});
		timetz.offset = {
			hour: 2,
			minute: 0,
			direction: "plus",
		};
		expect(timetz.offset).toEqual({
			hour: 2,
			minute: 0,
			direction: "plus",
		});
		expect(() => {
			timetz.offset = {
				hour: 24,
				minute: 0,
				direction: "plus",
			};
		}).toThrowError("Invalid offset hour");
		expect(() => {
			timetz.offset = {
				hour: -1,
				minute: 0,
				direction: "plus",
			};
		}).toThrowError("Invalid offset hour");
		expect(() => {
			timetz.offset = {
				hour: "a" as any,
				minute: 0,
				direction: "plus",
			};
		}).toThrowError("Invalid offset hour");

		expect(() => {
			timetz.offset = {
				hour: 2,
				minute: 60,
				direction: "plus",
			};
		}).toThrowError("Invalid offset minute");
		expect(() => {
			timetz.offset = {
				hour: 2,
				minute: -1,
				direction: "plus",
			};
		}).toThrowError("Invalid offset minute");
		expect(() => {
			timetz.offset = {
				hour: 2,
				minute: "a" as any,
				direction: "plus",
			};
		}).toThrowError("Invalid offset minute");

		expect(() => {
			timetz.offset = {
				hour: 2,
				minute: 0,
				direction: "a" as any,
			};
		}).toThrowError("Invalid offset direction");
	});

	it("toDateTime()", () => {
		const timetz = TimeTZ.from({
			hour: 4,
			minute: 5,
			second: 6,
			offset: {
				hour: 1,
				minute: 0,
				direction: "minus",
			},
		});
		expect(timetz.toDateTime()).toStrictEqual(DateTime.fromISO(`${DateTime.now().toISODate()}T04:05:06-01:00`));
	});

	it("toJSDate()", () => {
		const timetz = TimeTZ.from({
			hour: 4,
			minute: 5,
			second: 6,
			offset: {
				hour: 1,
				minute: 0,
				direction: "minus",
			},
		});
		expect(timetz.toJSDate()).toBeInstanceOf(globalThis.Date);
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
				CREATE TABLE public.jesttimetz (
					timetz timetz NULL,
					_timetz _timetz NULL
				)
			`);

			await client.query(`
				INSERT INTO public.jesttimetz (timetz, _timetz)
				VALUES (
					'04:05:06.789-01:00',
					'{ 01:02:03.456+08:00, 04:05:06.789 EST }'
				)
			`);

			const result = await client.query(`
				SELECT * FROM public.jesttimetz
			`);

			expect(result.rows[0].timetz).toStrictEqual(TimeTZ.from("04:05:06.789-01:00"));
			expect(result.rows[0]._timetz).toStrictEqual([TimeTZ.from("01:02:03.456+08:00"), TimeTZ.from("04:05:06.789 EST")]);
		} catch (error_) {
			error = error_;
		}

		await client.query(`
			DROP TABLE public.jesttimetz
		`);

		await client.end();

		if (error) throw error;
	});
});
