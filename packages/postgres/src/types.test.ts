import {
	Bit,
	BitVarying,
	Boolean,
	Box,
	Character,
	CharacterVarying,
	Circle,
	Date,
	DateMultiRange,
	DateRange,
	Float4,
	Float8,
	Int2,
	Int4,
	Int4MultiRange,
	Int4Range,
	Int8,
	Int8MultiRange,
	Int8Range,
	Interval,
	Line,
	LineSegment,
	Money,
	Name,
	OID,
	Path,
	Point,
	Polygon,
	Text,
	Time,
	Timestamp,
	TimestampMultiRange,
	TimestampRange,
	TimestampTZ,
	TimestampTZMultiRange,
	TimeTZ,
	UUID,
} from "@postgresql-typed/parsers";
import postgres from "postgres";
import { describe, expect, it } from "vitest";

import { types } from "./types.js";

//#region BitString
describe("BitString", () => {
	it("should be returned as a Bit", async () => {
		const client = postgres({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			types,
		});

		let error: Error | undefined;
		try {
			await client.unsafe(`
        CREATE TABLE IF NOT EXISTS public.vitestbit (
          bit bit NULL,
          bit2 bit(2) NULL,
          _bit _bit NULL
        )
      `);

			await client.unsafe(
				`
        INSERT INTO public.vitestbit (bit, bit2, _bit)
        VALUES (
          $1::bit,
					$2::bit(2),
					$3::_bit
        )
      `,
				["1", "11", "{0, 1}"]
			);

			const result = await client.unsafe(`
        SELECT * FROM public.vitestbit
      `);

			expect(Bit.isAnyBit([...result.values()][0].bit)).toBe(true);
			expect(Bit.from(1).equals(([...result.values()][0].bit as Bit<number>).value)).toBe(true);
			expect(Bit.isAnyBit([...result.values()][0].bit2)).toBe(true);
			expect(
				Bit.setN(2)
					.from(3)
					.equals(([...result.values()][0].bit2 as Bit<number>).value)
			).toBe(true);

			const [a, b] = [...result.values()][0]._bit as [Bit<number>, Bit<number>];
			expect([...result.values()][0]._bit).toHaveLength(2);
			expect(Bit.isAnyBit(a)).toBe(true);
			expect(Bit.from(0).equals(a.value)).toBe(true);
			expect(Bit.isAnyBit(b)).toBe(true);
			expect(Bit.from(1).equals(b.value)).toBe(true);
		} catch (error_) {
			error = error_;
		}

		await client.unsafe(`
      DROP TABLE public.vitestbit
    `);

		await client.end();

		if (error) throw error;
	});

	it("should be returned as a BitVarying", async () => {
		const client = postgres({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			types,
		});

		let error: Error | undefined;
		try {
			await client.unsafe(`
        CREATE TABLE IF NOT EXISTS public.vitestvarbit (
          varbit varbit NULL,
          _varbit _varbit NULL
        )
      `);

			await client.unsafe(
				`
        INSERT INTO public.vitestvarbit (varbit, _varbit)
        VALUES (
          $1::varbit,
					$2::_varbit
        )
      `,
				["1", "{0, 1}"]
			);

			const result = await client.unsafe(`
        SELECT * FROM public.vitestvarbit
      `);

			expect(BitVarying.isAnyBitVarying([...result.values()][0].varbit)).toBe(true);
			expect(BitVarying.from(1).equals([...result.values()][0].varbit)).toBe(true);

			const [a, b] = [...result.values()][0]._varbit;
			expect([...result.values()][0]._varbit).toHaveLength(2);
			expect(BitVarying.isAnyBitVarying(a)).toBe(true);
			expect(BitVarying.from(0).equals(a)).toBe(true);
			expect(BitVarying.isAnyBitVarying(b)).toBe(true);
			expect(BitVarying.from(1).equals(b)).toBe(true);
		} catch (error_) {
			error = error_;
		}

		await client.unsafe(`
      DROP TABLE public.vitestvarbit
    `);

		await client.end();

		if (error) throw error;
	});
});
//#endregion

//#region Boolean
describe("Boolean", () => {
	it("should be returned as a Boolean", async () => {
		const client = postgres({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			types,
		});

		try {
			await client.unsafe(`
        CREATE TABLE IF NOT EXISTS public.vitestboolean (
          boolean bool NULL,
          _boolean _bool NULL
        )
      `);

			await client.unsafe(
				`
        INSERT INTO public.vitestboolean (boolean, _boolean)
        VALUES (
          $1::bool,
					$2::_bool
        )
      `,
				["true", "{true, false}"]
			);
		} catch {
			expect.fail("Failed to connect to PostgreSQL");
		}

		const result = await client.unsafe(`
      SELECT * FROM public.vitestboolean
    `);

		expect(Boolean.isBoolean([...result.values()][0].boolean)).toBe(true);
		expect(Boolean.from(true).equals([...result.values()][0].boolean)).toBe(true);

		const [a, b] = [...result.values()][0]._boolean;
		expect([...result.values()][0]._boolean).toHaveLength(2);
		expect(Boolean.isBoolean(a)).toBe(true);
		expect(Boolean.from(true).equals(a)).toBe(true);
		expect(Boolean.isBoolean(b)).toBe(true);
		expect(Boolean.from(false).equals(b)).toBe(true);

		try {
			await client.unsafe(`
        DROP TABLE public.vitestboolean
      `);

			await client.end();
		} catch {
			expect.fail("Failed to disconnect from PostgreSQL");
		}
	});
});
//#endregion

//#region Character
describe("Character", () => {
	it("should be returned as a Character", async () => {
		const client = postgres({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			types,
		});

		let error: Error | undefined;
		try {
			await client.unsafe(`
        CREATE TABLE IF NOT EXISTS public.vitestchar (
          char "char" NULL,
          _char _char NULL,
          bpchar bpchar NULL,
          _bpchar _bpchar NULL
        )
      `);

			await client.unsafe(
				`
        INSERT INTO public.vitestchar (char, _char, bpchar, _bpchar)
        VALUES (
          $1::char,
					$2::_char,
					$3::bpchar,
					$4::_bpchar
        )
      `,
				["a", "{a, b}", "c", "{c, d}"]
			);

			const result = await client.unsafe(`
        SELECT * FROM public.vitestchar
      `);

			expect(Character.isAnyCharacter([...result.values()][0].char)).toBe(true);
			expect(Character.from("a").equals(([...result.values()][0].char as Character<number>).value)).toBe(true);

			expect(Character.isAnyCharacter([...result.values()][0].bpchar)).toBe(true);
			expect(Character.from("c").equals(([...result.values()][0].bpchar as Character<number>).value)).toBe(true);

			const [a, b] = [...result.values()][0]._char as [Character<number>, Character<number>];
			expect([...result.values()][0]._char).toHaveLength(2);
			expect(Character.isAnyCharacter(a)).toBe(true);
			expect(Character.from("a").equals(a.value)).toBe(true);
			expect(Character.isAnyCharacter(b)).toBe(true);
			expect(Character.from("b").equals(b.value)).toBe(true);

			const [c, d] = [...result.values()][0]._bpchar as [Character<number>, Character<number>];
			expect([...result.values()][0]._bpchar).toHaveLength(2);
			expect(Character.isAnyCharacter(c)).toBe(true);
			expect(Character.from("c").equals(c.value)).toBe(true);
			expect(Character.isAnyCharacter(d)).toBe(true);
			expect(Character.from("d").equals(d.value)).toBe(true);
		} catch (error_) {
			error = error_;
		}

		await client.unsafe(`
      DROP TABLE public.vitestchar
    `);

		await client.end();

		if (error) throw error;
	});

	it("should be returned as a CharacterVarying", async () => {
		const client = postgres({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			types,
		});

		let error: Error | undefined;
		try {
			await client.unsafe(`
        CREATE TABLE IF NOT EXISTS public.vitestvarchar (
          varchar varchar NULL,
          _varchar _varchar NULL
        )
      `);

			await client.unsafe(
				`
        INSERT INTO public.vitestvarchar (varchar, _varchar)
        VALUES (
          $1::varchar,
					$2::_varchar
        )
      `,
				["a", "{a, b}"]
			);

			const result = await client.unsafe(`
        SELECT * FROM public.vitestvarchar
      `);

			expect(CharacterVarying.isAnyCharacterVarying([...result.values()][0].varchar)).toBe(true);
			expect(CharacterVarying.from("a").equals([...result.values()][0].varchar)).toBe(true);

			const [a, b] = [...result.values()][0]._varchar;
			expect([...result.values()][0]._varchar).toHaveLength(2);
			expect(CharacterVarying.isAnyCharacterVarying(a)).toBe(true);
			expect(CharacterVarying.from("a").equals(a)).toBe(true);
			expect(CharacterVarying.isAnyCharacterVarying(b)).toBe(true);
			expect(CharacterVarying.from("b").equals(b)).toBe(true);
		} catch (error_) {
			error = error_;
		}

		await client.unsafe(`
      DROP TABLE public.vitestvarchar
    `);

		await client.end();

		if (error) throw error;
	});

	it("should be returned as a Name", async () => {
		const client = postgres({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			types,
		});

		let error: Error | undefined;
		try {
			await client.unsafe(`
        CREATE TABLE public.vitestname (
          name name NULL,
          _name _name NULL
        )
      `);

			await client.unsafe(
				`
        INSERT INTO public.vitestname (name, _name)
        VALUES (
          $1::name,
					$2::_name
        )
      `,
				["abc", "{abc, def}"]
			);

			const result = await client.unsafe(`
        SELECT * FROM public.vitestname
      `);

			expect([...result.values()][0].name.toString()).toStrictEqual(Name.from("abc").toString());
			expect([...result.values()][0]._name).toHaveLength(2);
			expect([...result.values()][0]._name[0].toString()).toStrictEqual(Name.from("abc").toString());
			expect([...result.values()][0]._name[1].toString()).toStrictEqual(Name.from("def").toString());
		} catch (error_) {
			error = error_;
		}

		await client.unsafe(`
      DROP TABLE public.vitestname
    `);

		await client.end();

		if (error) throw error;
	});

	it("should be returned as a Text", async () => {
		const client = postgres({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			types,
		});

		let error: Error | undefined;
		try {
			await client.unsafe(`
        CREATE TABLE public.vitesttext (
          text text NULL,
          _text _text NULL
        )
      `);

			await client.unsafe(
				`
        INSERT INTO public.vitesttext (text, _text)
        VALUES (
          $1::text,
					$2::_text
        )
      `,
				["abc", "{abc, def}"]
			);

			const result = await client.unsafe(`
        SELECT * FROM public.vitesttext
      `);

			expect([...result.values()][0].text.toString()).toStrictEqual(Text.from("abc").toString());
			expect([...result.values()][0]._text).toHaveLength(2);
			expect([...result.values()][0]._text[0].toString()).toStrictEqual(Text.from("abc").toString());
			expect([...result.values()][0]._text[1].toString()).toStrictEqual(Text.from("def").toString());
		} catch (error_) {
			error = error_;
		}

		await client.unsafe(`
      DROP TABLE public.vitesttext
    `);

		await client.end();

		if (error) throw error;
	});
});
//#endregion

//#region DateTime
describe("DateTime", () => {
	it("should be returned as a Date", async () => {
		const client = postgres({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			types,
		});

		let error: Error | undefined;
		try {
			await client.unsafe(`
        CREATE TABLE public.vitestdate (
          date date NULL,
          _date _date NULL
        )
      `);

			await client.unsafe(
				`
        INSERT INTO public.vitestdate (date, _date)
        VALUES (
          $1::date,
					$2::_date
        )
      `,
				["2022-09-02", "{ 1997-08-24, 2022-09-02 }"]
			);

			const result = await client.unsafe(`
        SELECT * FROM public.vitestdate
      `);

			expect([...result.values()][0].date.toString()).toStrictEqual(
				Date.from({
					year: 2022,
					month: 9,
					day: 2,
				}).toString()
			);
			expect([...result.values()][0]._date).toHaveLength(2);
			expect([...result.values()][0]._date[0].toString()).toStrictEqual(
				Date.from({
					year: 1997,
					month: 8,
					day: 24,
				}).toString()
			);
			expect([...result.values()][0]._date[1].toString()).toStrictEqual(
				Date.from({
					year: 2022,
					month: 9,
					day: 2,
				}).toString()
			);
		} catch (error_) {
			error = error_;
		}

		await client.unsafe(`
      DROP TABLE public.vitestdate
    `);

		await client.end();

		if (error) throw error;
	});

	it("should be returned as a DateMultiRange", async () => {
		const client = postgres({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				types,
			}),
			version = await client.unsafe<
				{
					version: Text;
				}[]
			>("SELECT version()"),
			versionNumber = Number(version[0].version.value.split(" ")[1].split(".")[0]);

		// Multirange types were introduced in PostgreSQL 14
		if (versionNumber < 14) {
			await client.end();
			return;
		}

		let error: Error | undefined;
		try {
			await client.unsafe(`
        CREATE TABLE public.vitestdatemultirange (
          datemultirange datemultirange NULL,
          _datemultirange _datemultirange NULL
        )
      `);

			await client.unsafe(
				`
        INSERT INTO public.vitestdatemultirange (datemultirange, _datemultirange)
        VALUES (
          $1::datemultirange,
					$2::_datemultirange
        )
      `,
				[
					"{[1999-01-08,2022-01-01),[2023-01-08,2024-01-01),[2025-01-08,2026-01-01)}",
					"{\\{[1999-01-08\\,2022-01-01)\\,[2023-01-08\\,2024-01-01)\\},\\{[2025-01-08\\,2026-01-01)\\,[2027-01-08\\,2028-01-01)\\}}",
				]
			);

			const result = await client.unsafe(`
        SELECT * FROM public.vitestdatemultirange
      `);

			expect([...result.values()][0].datemultirange.toString()).toStrictEqual(
				DateMultiRange.from("{[1999-01-08,2022-01-01),[2023-01-08,2024-01-01),[2025-01-08,2026-01-01)}").toString()
			);
			expect([...result.values()][0]._datemultirange).toHaveLength(2);
			expect([...result.values()][0]._datemultirange[0].toString()).toStrictEqual(
				DateMultiRange.from("{[1999-01-08,2022-01-01),[2023-01-08,2024-01-01)}").toString()
			);
			expect([...result.values()][0]._datemultirange[1].toString()).toStrictEqual(
				DateMultiRange.from("{[2025-01-08,2026-01-01),[2027-01-08,2028-01-01)}").toString()
			);
		} catch (error_) {
			error = error_;
		}

		await client.unsafe(`
      DROP TABLE public.vitestdatemultirange
    `);

		await client.end();

		if (error) throw error;
	});

	it("should be returned as a DateRange", async () => {
		const client = postgres({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			types,
		});

		let error: Error | undefined;
		try {
			await client.unsafe(`
        CREATE TABLE public.vitestdaterange (
          daterange daterange NULL,
          _daterange _daterange NULL
        )
      `);

			await client.unsafe(
				`
        INSERT INTO public.vitestdaterange (daterange, _daterange)
        VALUES (
          $1::daterange,
					$2::_daterange
        )
      `,
				["[2022-09-02,2022-10-03)", "{[2022-09-02\\,2022-10-03),(2022-11-02\\,2022-12-03]}"]
			);

			const result = await client.unsafe(`
        SELECT * FROM public.vitestdaterange
      `);

			expect([...result.values()][0].daterange.toString()).toStrictEqual(DateRange.from("[2022-09-02,2022-10-03)").toString());
			expect([...result.values()][0]._daterange).toHaveLength(2);
			expect([...result.values()][0]._daterange[0].toString()).toStrictEqual(DateRange.from("[2022-09-02,2022-10-03)").toString());
			expect([...result.values()][0]._daterange[1].toString()).toStrictEqual(DateRange.from("[2022-11-03,2022-12-04)").toString());
		} catch (error_) {
			error = error_;
		}

		await client.unsafe(`
      DROP TABLE public.vitestdaterange
    `);

		await client.end();

		if (error) throw error;
	});

	it("should be returned as an Interval", async () => {
		const client = postgres({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			types,
		});

		let error: Error | undefined;
		try {
			await client.unsafe(`
        CREATE TABLE public.vitestinterval (
          interval interval NULL,
          _interval _interval NULL
        )
      `);

			await client.unsafe(
				`
        INSERT INTO public.vitestinterval (interval, _interval)
        VALUES (
          $1::interval,
					$2::_interval
        )
      `,
				[
					"1 year 2 months 3 days 4 hours 5 minutes 6.007 seconds",
					"{ 1 year 2 months 3 days 4 hours 5 minutes 6.007 seconds, 7 years 6 months 5 days 4 hours 3 minutes 2.001 seconds }",
				]
			);

			const result = await client.unsafe(`
        SELECT * FROM public.vitestinterval
      `);

			expect([...result.values()][0].interval.toString()).toStrictEqual(
				Interval.from({
					milliseconds: 7,
					seconds: 6,
					minutes: 5,
					hours: 4,
					days: 3,
					months: 2,
					years: 1,
				}).toString()
			);
			expect([...result.values()][0]._interval).toHaveLength(2);
			expect([...result.values()][0]._interval[0].toString()).toStrictEqual(
				Interval.from({
					milliseconds: 7,
					seconds: 6,
					minutes: 5,
					hours: 4,
					days: 3,
					months: 2,
					years: 1,
				}).toString()
			);
			expect([...result.values()][0]._interval[1].toString()).toStrictEqual(
				Interval.from({
					milliseconds: 1,
					seconds: 2,
					minutes: 3,
					hours: 4,
					days: 5,
					months: 6,
					years: 7,
				}).toString()
			);
		} catch (error_) {
			error = error_;
		}

		await client.unsafe(`
      DROP TABLE public.vitestinterval
    `);

		await client.end();

		if (error) throw error;
	});

	it("should be returned as a Time", async () => {
		const client = postgres({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			types,
		});

		let error: Error | undefined;
		try {
			await client.unsafe(`
        CREATE TABLE public.vitesttime (
          time time NULL,
          _time _time NULL
        )
      `);

			await client.unsafe(
				`
        INSERT INTO public.vitesttime (time, _time)
        VALUES (
          $1::time,
					$2::_time
        )
      `,
				["04:05:06.789", "{ 01:02:03.456, 04:05:06.789 }"]
			);

			const result = await client.unsafe(`
        SELECT * FROM public.vitesttime
      `);

			expect([...result.values()][0].time.toString()).toStrictEqual(
				Time.from({
					hour: 4,
					minute: 5,
					second: 6.789,
				}).toString()
			);
			expect([...result.values()][0]._time).toHaveLength(2);
			expect([...result.values()][0]._time[0].toString()).toStrictEqual(
				Time.from({
					hour: 1,
					minute: 2,
					second: 3.456,
				}).toString()
			);
			expect([...result.values()][0]._time[1].toString()).toStrictEqual(
				Time.from({
					hour: 4,
					minute: 5,
					second: 6.789,
				}).toString()
			);
		} catch (error_) {
			error = error_;
		}

		await client.unsafe(`
      DROP TABLE public.vitesttime
    `);

		await client.end();

		if (error) throw error;
	});

	it("should be returned as a Timestamp", async () => {
		const client = postgres({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			types,
		});

		let error: Error | undefined;
		try {
			await client.unsafe(`
        CREATE TABLE public.vitesttimestamp (
          timestamp timestamp NULL,
          _timestamp _timestamp NULL
        )
      `);

			await client.unsafe(
				`
        INSERT INTO public.vitesttimestamp (timestamp, _timestamp)
        VALUES (
          $1::timestamp,
					$2::_timestamp
        )
      `,
				["2004-10-19 10:23:54.678", "{ 2019-01-02 03:04:05.678, 2022-09-08 07:06:05 }"]
			);

			const result = await client.unsafe(`
        SELECT * FROM public.vitesttimestamp
      `);

			expect([...result.values()][0].timestamp.toString()).toStrictEqual(
				Timestamp.from({
					year: 2004,
					month: 10,
					day: 19,
					hour: 10,
					minute: 23,
					second: 54.678,
				}).toString()
			);
			expect([...result.values()][0]._timestamp).toHaveLength(2);
			expect([...result.values()][0]._timestamp[0].toString()).toStrictEqual(
				Timestamp.from({
					year: 2019,
					month: 1,
					day: 2,
					hour: 3,
					minute: 4,
					second: 5.678,
				}).toString()
			);
			expect([...result.values()][0]._timestamp[1].toString()).toStrictEqual(
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
		}

		await client.unsafe(`
      DROP TABLE public.vitesttimestamp
    `);

		await client.end();

		if (error) throw error;
	});

	it("should be returned as a TimestampMultiRange", async () => {
		const client = postgres({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				types,
			}),
			version = await client.unsafe<
				{
					version: Text;
				}[]
			>("SELECT version()"),
			versionNumber = Number(version[0].version.value.split(" ")[1].split(".")[0]);

		// Multirange types were introduced in PostgreSQL 14
		if (versionNumber < 14) {
			await client.end();
			return;
		}

		let error: Error | undefined;
		try {
			await client.unsafe(`
        CREATE TABLE public.vitesttimestampmultirange (
          tsmultirange tsmultirange NULL,
          _tsmultirange _tsmultirange NULL
        )
      `);

			await client.unsafe(
				`
        INSERT INTO public.vitesttimestampmultirange (tsmultirange, _tsmultirange)
        VALUES (
          $1::tsmultirange,
					$2::_tsmultirange
        )
      `,
				[
					"{[1999-01-08 01:02:03.456,2022-01-01 02:03:04.567),[2023-01-08 01:02:03.456,2024-01-01 02:03:04.567),[2025-01-08 01:02:03,2026-01-01 02:03:04)}",
					"{\\{[1999-01-08 01:02:03.456\\,2022-01-01 02:03:04.567)\\,[2023-01-08 01:02:03.456\\,2024-01-01 02:03:04.567)\\},\\{[2025-01-08 01:02:03\\,2026-01-01 02:03:04)\\,[2027-01-08 03:04:05\\,2028-01-01 04:05:06)\\}}",
				]
			);

			const result = await client.unsafe(`
        SELECT * FROM public.vitesttimestampmultirange
      `);

			expect([...result.values()][0].tsmultirange.toString()).toStrictEqual(
				TimestampMultiRange.from(
					"{[1999-01-08 01:02:03.456,2022-01-01 02:03:04.567),[2023-01-08 01:02:03.456,2024-01-01 02:03:04.567),[2025-01-08 01:02:03,2026-01-01 02:03:04)}"
				).toString()
			);
			expect([...result.values()][0]._tsmultirange).toHaveLength(2);
			expect([...result.values()][0]._tsmultirange[0].toString()).toStrictEqual(
				TimestampMultiRange.from("{[1999-01-08 01:02:03.456,2022-01-01 02:03:04.567),[2023-01-08 01:02:03.456,2024-01-01 02:03:04.567)}").toString()
			);
			expect([...result.values()][0]._tsmultirange[1].toString()).toStrictEqual(
				TimestampMultiRange.from("{[2025-01-08 01:02:03,2026-01-01 02:03:04),[2027-01-08 03:04:05,2028-01-01 04:05:06)}").toString()
			);
		} catch (error_) {
			error = error_;
		}

		await client.unsafe(`
      DROP TABLE public.vitesttimestampmultirange
    `);

		await client.end();

		if (error) throw error;
	});

	it("should be returned as a TimestampRange", async () => {
		const client = postgres({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			types,
		});

		let error: Error | undefined;
		try {
			await client.unsafe(`
        CREATE TABLE public.vitesttimestamprange (
          tsrange tsrange NULL,
          _tsrange _tsrange NULL
        )
      `);

			await client.unsafe(
				`
        INSERT INTO public.vitesttimestamprange (tsrange, _tsrange)
        VALUES (
          $1::tsrange,
					$2::_tsrange
        )
      `,
				["[2022-09-02 01:02:03,2022-10-03 02:03:04)", "{[2022-09-02 01:02:03\\,2022-10-03 02:03:04),(2022-11-02 01:02:03\\,2022-12-03 04:05:06.789]}"]
			);

			const result = await client.unsafe(`
        SELECT * FROM public.vitesttimestamprange
      `);

			expect([...result.values()][0].tsrange.toString()).toStrictEqual(TimestampRange.from("[2022-09-02 01:02:03,2022-10-03 02:03:04)").toString());
			expect([...result.values()][0]._tsrange).toHaveLength(2);
			expect([...result.values()][0]._tsrange[0].toString()).toStrictEqual(TimestampRange.from("[2022-09-02 01:02:03,2022-10-03 02:03:04)").toString());
			expect([...result.values()][0]._tsrange[1].toString()).toStrictEqual(TimestampRange.from("(2022-11-02 01:02:03,2022-12-03 04:05:06.789]").toString());
		} catch (error_) {
			error = error_;
		}

		await client.unsafe(`
      DROP TABLE public.vitesttimestamprange
    `);

		await client.end();

		if (error) throw error;
	});

	it("should be returned as a TimestampTZ", async () => {
		const client = postgres({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			types,
		});

		let error: Error | undefined;
		try {
			await client.unsafe(`
        CREATE TABLE public.vitesttimestamptz (
          timestamptz timestamptz NULL,
          _timestamptz _timestamptz NULL
        )
      `);

			await client.unsafe(
				`
        INSERT INTO public.vitesttimestamptz (timestamptz, _timestamptz)
        VALUES (
          $1::timestamptz,
					$2::_timestamptz
        )
      `,
				["2004-10-19 04:05:06.789 -01:00", "{ 2004-10-19T04:05:06.789+01:00, 2004-10-19 10:23:54.678 EST }"]
			);

			const result = await client.unsafe(`
        SELECT * FROM public.vitesttimestamptz
      `);

			expect([...result.values()][0].timestamptz.toString()).toStrictEqual(TimestampTZ.from("2004-10-19 05:05:06.789 +00:00").toString());
			expect([...result.values()][0]._timestamptz).toHaveLength(2);
			expect([...result.values()][0]._timestamptz[0].toString()).toStrictEqual(TimestampTZ.from("2004-10-19 03:05:06.789Z").toString());
			expect([...result.values()][0]._timestamptz[1].toString()).toStrictEqual(TimestampTZ.from("2004-10-19 15:23:54.678Z").toString());
		} catch (error_) {
			error = error_;
		}

		await client.unsafe(`
      DROP TABLE public.vitesttimestamptz
    `);

		await client.end();

		if (error) throw error;
	});

	it("should be returned as a TimestampTZMultiRange", async () => {
		const client = postgres({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				types,
			}),
			version = await client.unsafe<
				{
					version: Text;
				}[]
			>("SELECT version()"),
			versionNumber = Number(version[0].version.value.split(" ")[1].split(".")[0]);

		// Multirange types were introduced in PostgreSQL 14
		if (versionNumber < 14) {
			await client.end();
			return;
		}

		let error: Error | undefined;
		try {
			await client.unsafe(`
        CREATE TABLE public.vitesttimestamptzmultirange (
          tstzmultirange tstzmultirange NULL,
          _tstzmultirange _tstzmultirange NULL
        )
      `);

			await client.unsafe(
				`
        INSERT INTO public.vitesttimestamptzmultirange (tstzmultirange, _tstzmultirange)
        VALUES (
          $1::tstzmultirange,
					$2::_tstzmultirange
        )
      `,
				[
					"{[1999-01-08 01:02:03.456-01:00,2022-01-01 02:03:04.567+02:00),[2023-01-08 01:02:03.456 EST,2024-01-01 02:03:04.567 GMT),[2025-01-08 01:02:03 +09:00,2026-01-01 02:03:04 -06:00)}",
					"{\\{[1999-01-08 01:02:03.456-01:00\\,2022-01-01 02:03:04.567+02:00)\\,[2023-01-08 01:02:03.456 EST\\,2024-01-01 02:03:04.567 GMT)\\},\\{[2025-01-08 01:02:03 +09:00\\,2026-01-01 02:03:04 -06:00)\\,[2027-01-08 03:04:05 EST\\,2028-01-01 04:05:06+01:00)\\}}",
				]
			);

			const result = await client.unsafe(`
        SELECT * FROM public.vitesttimestamptzmultirange
      `);

			expect([...result.values()][0].tstzmultirange.toString()).toStrictEqual(
				TimestampTZMultiRange.from(
					"{[1999-01-08T02:02:03.456Z,2022-01-01T00:03:04.567Z),[2023-01-08T06:02:03.456Z,2024-01-01T02:03:04.567Z),[2025-01-07T16:02:03Z,2026-01-01T08:03:04Z)}"
				).toString()
			);
			expect([...result.values()][0]._tstzmultirange).toHaveLength(2);
			expect([...result.values()][0]._tstzmultirange[0].toString()).toStrictEqual(
				TimestampTZMultiRange.from("{[1999-01-08T02:02:03.456Z,2022-01-01T00:03:04.567Z),[2023-01-08T06:02:03.456Z,2024-01-01T02:03:04.567Z)}").toString()
			);
			expect([...result.values()][0]._tstzmultirange[1].toString()).toStrictEqual(
				TimestampTZMultiRange.from("{[2025-01-07T16:02:03Z,2026-01-01T08:03:04Z),[2027-01-08T08:04:05Z,2028-01-01T03:05:06Z)}").toString()
			);
		} catch (error_) {
			error = error_;
		}

		await client.unsafe(`
      DROP TABLE public.vitesttimestamptzmultirange
    `);

		await client.end();

		if (error) throw error;
	});

	it("should be returned as a TimestampTZRange", async () => {
		const client = postgres({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			types,
		});

		let error: Error | undefined;
		try {
			await client.unsafe(`
        CREATE TABLE public.vitesttimestamptzrange (
          tstzrange tstzrange NULL,
          _tstzrange _tstzrange NULL
        )
      `);

			await client.unsafe(
				`
        INSERT INTO public.vitesttimestamptzrange (tstzrange, _tstzrange)
        VALUES (
          $1::tstzrange,
					$2::_tstzrange
        )
      `,
				[
					"[2022-09-02 01:02:03 +01:00,2022-10-03 02:03:04 EST)",
					"{[2022-09-02 01:02:03 -01:00\\,2022-10-03 02:03:04 GMT),(2022-11-02 01:02:03 +09:00\\,2022-12-03 04:05:06.789 -06:00]}",
				]
			);

			const result = await client.unsafe(`
        SELECT * FROM public.vitesttimestamptzrange
      `);

			expect([...result.values()][0].tstzrange.toString()).toStrictEqual(TimestampRange.from("[2022-09-02T00:02:03Z,2022-10-03T07:03:04Z)").toString());
			expect([...result.values()][0]._tstzrange).toHaveLength(2);
			expect([...result.values()][0]._tstzrange[0].toString()).toStrictEqual(TimestampRange.from("[2022-09-02T02:02:03Z,2022-10-03T02:03:04Z)").toString());
			expect([...result.values()][0]._tstzrange[1].toString()).toStrictEqual(TimestampRange.from("(2022-11-01T16:02:03Z,2022-12-03T10:05:06.789Z]").toString());
		} catch (error_) {
			error = error_;
		}

		await client.unsafe(`
      DROP TABLE public.vitesttimestamptzrange
    `);

		await client.end();

		if (error) throw error;
	});

	it("should be returned as a TimeTZ", async () => {
		const client = postgres({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			types,
		});

		let error: Error | undefined;
		try {
			await client.unsafe(`
        CREATE TABLE public.vitesttimetz (
          timetz timetz NULL,
          _timetz _timetz NULL
        )
      `);

			await client.unsafe(
				`
        INSERT INTO public.vitesttimetz (timetz, _timetz)
        VALUES (
          $1::timetz,
					$2::_timetz
        )
      `,
				["04:05:06.789-01:00", "{ 01:02:03.456+08:00, 04:05:06.789 EST }"]
			);

			const result = await client.unsafe(`
        SELECT * FROM public.vitesttimetz
      `);

			expect([...result.values()][0].timetz.toString()).toStrictEqual(TimeTZ.from("04:05:06.789-01:00").toString());
			expect([...result.values()][0]._timetz).toHaveLength(2);
			expect([...result.values()][0]._timetz[0].toString()).toStrictEqual(TimeTZ.from("01:02:03.456+08:00").toString());
			expect([...result.values()][0]._timetz[1].toString()).toStrictEqual(TimeTZ.from("04:05:06.789-05:00").toString());
		} catch (error_) {
			error = error_;
		}

		await client.unsafe(`
      DROP TABLE public.vitesttimetz
    `);

		await client.end();

		if (error) throw error;
	});
});
//#endregion

//#region Geometric
describe("Geometric", () => {
	it("should be returned as a Box", async () => {
		const client = postgres({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			types,
		});

		let error: Error | undefined;
		try {
			await client.unsafe(`
        CREATE TABLE public.vitestbox (
          box box NULL,
          _box _box NULL
        )
      `);

			await client.unsafe(
				`
        INSERT INTO public.vitestbox (box, _box)
        VALUES (
          $1::box,
					$2::_box
        )
      `,
				["(1,2),(3,4)", "{(1.1\\,2.2)\\,(3.3\\,4.4);(5.5\\,6.6)\\,(7.7\\,8.8)}"]
			);

			const result = await client.unsafe(`
        SELECT * FROM public.vitestbox
      `);

			expect([...result.values()][0].box.toString()).toStrictEqual(Box.from({ x1: 3, y1: 4, x2: 1, y2: 2 }).toString());
			expect([...result.values()][0]._box).toHaveLength(2);
			expect([...result.values()][0]._box[0].toString()).toStrictEqual(Box.from({ x1: 3.3, y1: 4.4, x2: 1.1, y2: 2.2 }).toString());
			expect([...result.values()][0]._box[1].toString()).toStrictEqual(Box.from({ x1: 7.7, y1: 8.8, x2: 5.5, y2: 6.6 }).toString());
		} catch (error_) {
			error = error_;
		}

		await client.unsafe(`
      DROP TABLE public.vitestbox
    `);

		await client.end();

		if (error) throw error;
	});

	it("should be returned as a Circle", async () => {
		const client = postgres({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			types,
		});

		let error: Error | undefined;
		try {
			await client.unsafe(`
        CREATE TABLE public.vitestcircle (
          circle circle NULL,
          _circle _circle NULL
        )
      `);

			await client.unsafe(
				`
        INSERT INTO public.vitestcircle (circle, _circle)
        VALUES (
          $1::circle,
					$2::_circle
        )
      `,
				["<(1,2),3>", "{ <(1.1\\,2.2)\\,3.3>, <(4\\,5)\\,6> }"]
			);

			const result = await client.unsafe(`
        SELECT * FROM public.vitestcircle
      `);

			expect([...result.values()][0].circle.toString()).toStrictEqual(Circle.from({ x: 1, y: 2, radius: 3 }).toString());
			expect([...result.values()][0]._circle).toHaveLength(2);
			expect([...result.values()][0]._circle[0].toString()).toStrictEqual(Circle.from({ x: 1.1, y: 2.2, radius: 3.3 }).toString());
			expect([...result.values()][0]._circle[1].toString()).toStrictEqual(Circle.from({ x: 4, y: 5, radius: 6 }).toString());
		} catch (error_) {
			error = error_;
		}

		await client.unsafe(`
      DROP TABLE public.vitestcircle
    `);

		await client.end();

		if (error) throw error;
	});

	it("should be returned as a Line", async () => {
		const client = postgres({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			types,
		});

		let error: Error | undefined;
		try {
			await client.unsafe(`
        CREATE TABLE public.vitestline (
          line line NULL,
          _line _line NULL
        )
      `);

			await client.unsafe(
				`
        INSERT INTO public.vitestline (line, _line)
        VALUES (
          $1::line,
					$2::_line
        )
      `,
				["{1.1,2.2,3.3}", "{\\{1.1\\,2.2\\,3.3\\},\\{4.4\\,5.5\\,6.6\\}}"]
			);

			const result = await client.unsafe(`
        SELECT * FROM public.vitestline
      `);

			expect([...result.values()][0].line.toString()).toStrictEqual(
				Line.from({
					a: 1.1,
					b: 2.2,
					c: 3.3,
				}).toString()
			);
			expect([...result.values()][0]._line).toHaveLength(2);
			expect([...result.values()][0]._line[0].toString()).toStrictEqual(
				Line.from({
					a: 1.1,
					b: 2.2,
					c: 3.3,
				}).toString()
			);
			expect([...result.values()][0]._line[1].toString()).toStrictEqual(
				Line.from({
					a: 4.4,
					b: 5.5,
					c: 6.6,
				}).toString()
			);
		} catch (error_) {
			error = error_;
		}

		await client.unsafe(`
      DROP TABLE public.vitestline
    `);

		await client.end();

		if (error) throw error;
	});

	it("should be returned as a LineSegment", async () => {
		const client = postgres({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			types,
		});

		let error: Error | undefined;
		try {
			await client.unsafe(`
        CREATE TABLE public.vitestlseg (
          lseg lseg NULL,
          _lseg _lseg NULL
        )
      `);

			await client.unsafe(
				`
        INSERT INTO public.vitestlseg (lseg, _lseg)
        VALUES (
          $1::lseg,
					$2::_lseg
        )
      `,
				["[(1.1,2.2),(3.3,4.4)]", "{ \\[(1.1\\,2.2)\\,(3.3\\,4.4)\\], \\[(5.5\\,6.6)\\,(7.7\\,8.8)\\] }"]
			);

			const result = await client.unsafe(`
        SELECT * FROM public.vitestlseg
      `);

			expect([...result.values()][0].lseg.toString()).toStrictEqual(
				LineSegment.from({
					a: Point.from(1.1, 2.2),
					b: Point.from(3.3, 4.4),
				}).toString()
			);
			expect([...result.values()][0]._lseg).toHaveLength(2);
			expect([...result.values()][0]._lseg[0].toString()).toStrictEqual(
				LineSegment.from({
					a: Point.from(1.1, 2.2),
					b: Point.from(3.3, 4.4),
				}).toString()
			);
			expect([...result.values()][0]._lseg[1].toString()).toStrictEqual(
				LineSegment.from({
					a: Point.from(5.5, 6.6),
					b: Point.from(7.7, 8.8),
				}).toString()
			);
		} catch (error_) {
			error = error_;
		}

		await client.unsafe(`
      DROP TABLE public.vitestlseg
    `);

		await client.end();

		if (error) throw error;
	});

	it("should be returned as a Path", async () => {
		const client = postgres({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			types,
		});

		let error: Error | undefined;
		try {
			await client.unsafe(`
        CREATE TABLE public.vitestpath (
          path path NULL,
          _path _path NULL
        )
      `);

			await client.unsafe(
				`
        INSERT INTO public.vitestpath (path, _path)
        VALUES (
          $1::path,
					$2::_path
        )
      `,
				["((1.1,2.2),(3.3,4.4))", "{((1.1\\,2.2)\\,(3.3\\,4.4)),[(5.5\\,6.6)\\,(7.7\\,8.8)]}"]
			);

			const result = await client.unsafe(`
        SELECT * FROM public.vitestpath
      `);

			expect([...result.values()][0].path.toString()).toStrictEqual(
				Path.from({
					points: [Point.from({ x: 1.1, y: 2.2 }), Point.from({ x: 3.3, y: 4.4 })],
					connection: "closed",
				}).toString()
			);
			expect([...result.values()][0]._path).toHaveLength(2);
			expect([...result.values()][0]._path[0].toString()).toStrictEqual(
				Path.from({
					points: [Point.from({ x: 1.1, y: 2.2 }), Point.from({ x: 3.3, y: 4.4 })],
					connection: "closed",
				}).toString()
			);
			expect([...result.values()][0]._path[1].toString()).toStrictEqual(
				Path.from({
					points: [Point.from({ x: 5.5, y: 6.6 }), Point.from({ x: 7.7, y: 8.8 })],
					connection: "open",
				}).toString()
			);
		} catch (error_) {
			error = error_;
		}

		await client.unsafe(`
      DROP TABLE public.vitestpath
    `);

		await client.end();

		if (error) throw error;
	});

	it("should be returned as a Point", async () => {
		const client = postgres({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			types,
		});

		let error: Error | undefined;
		try {
			await client.unsafe(`
        CREATE TABLE public.vitestpoint (
          point point NULL,
          _point _point NULL
        )
      `);

			await client.unsafe(
				`
        INSERT INTO public.vitestpoint (point, _point)
        VALUES (
          $1::point,
					$2::_point
        )
      `,
				["(1,2)", "{ (1.1\\,2.2), (3.3\\,4.4) }"]
			);

			const result = await client.unsafe(`
        SELECT * FROM public.vitestpoint
      `);

			expect([...result.values()][0].point.toString()).toStrictEqual(Point.from({ x: 1, y: 2 }).toString());
			expect([...result.values()][0]._point).toHaveLength(2);
			expect([...result.values()][0]._point[0].toString()).toStrictEqual(Point.from({ x: 1.1, y: 2.2 }).toString());
			expect([...result.values()][0]._point[1].toString()).toStrictEqual(Point.from({ x: 3.3, y: 4.4 }).toString());
		} catch (error_) {
			error = error_;
		}

		await client.unsafe(`
      DROP TABLE public.vitestpoint
    `);

		await client.end();

		if (error) throw error;
	});

	it("should be returned as a Polygon", async () => {
		const client = postgres({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			types,
		});

		let error: Error | undefined;
		try {
			await client.unsafe(`
        CREATE TABLE public.vitestpolygon (
          polygon polygon NULL,
          _polygon _polygon NULL
        )
      `);

			await client.unsafe(
				`
        INSERT INTO public.vitestpolygon (polygon, _polygon)
        VALUES (
          $1::polygon,
					$2::_polygon
        )
      `,
				["((1.1,2.2),(3.3,4.4))", "{((1.1\\,2.2)\\,(3.3\\,4.4)),((5.5\\,6.6)\\,(7.7\\,8.8))}"]
			);

			const result = await client.unsafe(`
        SELECT * FROM public.vitestpolygon
      `);

			expect([...result.values()][0].polygon.toString()).toStrictEqual(
				Polygon.from({
					points: [Point.from({ x: 1.1, y: 2.2 }), Point.from({ x: 3.3, y: 4.4 })],
				}).toString()
			);
			expect([...result.values()][0]._polygon).toHaveLength(2);
			expect([...result.values()][0]._polygon[0].toString()).toStrictEqual(
				Polygon.from({
					points: [Point.from({ x: 1.1, y: 2.2 }), Point.from({ x: 3.3, y: 4.4 })],
				}).toString()
			);
			expect([...result.values()][0]._polygon[1].toString()).toStrictEqual(
				Polygon.from({
					points: [Point.from({ x: 5.5, y: 6.6 }), Point.from({ x: 7.7, y: 8.8 })],
				}).toString()
			);
		} catch (error_) {
			error = error_;
		}

		await client.unsafe(`
      DROP TABLE public.vitestpolygon
    `);

		await client.end();

		if (error) throw error;
	});
});
//#endregion

//#region Monetary
describe("Monetary", () => {
	it("should be returned as a Money", async () => {
		const client = postgres({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			types,
		});

		let error: Error | undefined;
		try {
			await client.unsafe(`
        CREATE TABLE IF NOT EXISTS public.vitestmoney (
          money money NULL,
          _money _money NULL
        )
      `);

			await client.unsafe(
				`
        INSERT INTO public.vitestmoney (money, _money)
        VALUES (
          $1::money,
					$2::_money
        )
      `,
				[1, "{2, 3}"]
			);

			const result = await client.unsafe(`
        SELECT * FROM public.vitestmoney
      `);

			expect(Money.isMoney([...result.values()][0].money)).toBe(true);
			expect(Money.from(1).equals([...result.values()][0].money)).toBe(true);

			const [a, b] = [...result.values()][0]._money;
			expect([...result.values()][0]._money).toHaveLength(2);
			expect(Money.isMoney(a)).toBe(true);
			expect(Money.from(2).equals(a)).toBe(true);
			expect(Money.isMoney(b)).toBe(true);
			expect(Money.from(3).equals(b)).toBe(true);
		} catch (error_) {
			error = error_;
		}

		await client.unsafe(`
      DROP TABLE public.vitestmoney
    `);

		await client.end();

		if (error) throw error;
	});
});
//#endregion

//#region Numeric
describe("Numeric", () => {
	it("should be returned as a Float4", async () => {
		const client = postgres({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			types,
		});

		let error: Error | undefined;
		try {
			await client.unsafe(`
        CREATE TABLE IF NOT EXISTS public.vitestfloat4 (
          float4 float4 NULL,
          _float4 _float4 NULL
        )
      `);

			await client.unsafe(
				`
        INSERT INTO public.vitestfloat4 (float4, _float4)
        VALUES (
          $1::float4,
					$2::_float4
        )
      `,
				[1, "{2, 3}"]
			);

			const result = await client.unsafe(`
        SELECT * FROM public.vitestfloat4
      `);

			expect(Float4.isFloat4([...result.values()][0].float4)).toBe(true);
			expect(Float4.from(1).equals([...result.values()][0].float4)).toBe(true);

			const [a, b] = [...result.values()][0]._float4;
			expect([...result.values()][0]._float4).toHaveLength(2);
			expect(Float4.isFloat4(a)).toBe(true);
			expect(Float4.from(2).equals(a)).toBe(true);
			expect(Float4.isFloat4(b)).toBe(true);
			expect(Float4.from(3).equals(b)).toBe(true);
		} catch (error_) {
			error = error_;
		}

		await client.unsafe(`
      DROP TABLE public.vitestfloat4
    `);

		await client.end();

		if (error) throw error;
	});

	it("should be returned as a Float8", async () => {
		const client = postgres({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			types,
		});

		let error: Error | undefined;
		try {
			await client.unsafe(`
        CREATE TABLE IF NOT EXISTS public.vitestfloat8 (
          float8 float8 NULL,
          _float8 _float8 NULL
        )
      `);

			await client.unsafe(
				`
        INSERT INTO public.vitestfloat8 (float8, _float8)
        VALUES (
          $1::float8,
					$2::_float8
        )
      `,
				[1, "{2, 3}"]
			);

			const result = await client.unsafe(`
        SELECT * FROM public.vitestfloat8
      `);

			expect(Float8.isFloat8([...result.values()][0].float8)).toBe(true);
			expect(Float8.from(1).equals([...result.values()][0].float8)).toBe(true);

			const [a, b] = [...result.values()][0]._float8;
			expect([...result.values()][0]._float8).toHaveLength(2);
			expect(Float8.isFloat8(a)).toBe(true);
			expect(Float8.from(2).equals(a)).toBe(true);
			expect(Float8.isFloat8(b)).toBe(true);
			expect(Float8.from(3).equals(b)).toBe(true);
		} catch (error_) {
			error = error_;
		}

		await client.unsafe(`
      DROP TABLE public.vitestfloat8
    `);

		await client.end();

		if (error) throw error;
	});

	it("should be returned as a Int2", async () => {
		const client = postgres({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			types,
		});

		try {
			await client.unsafe(`
        CREATE TABLE IF NOT EXISTS public.vitestint2 (
          int2 int2 NULL,
          _int2 _int2 NULL
        )
      `);

			await client.unsafe(
				`
        INSERT INTO public.vitestint2 (int2, _int2)
        VALUES (
          $1::int2,
					$2::_int2
        )
      `,
				[1, "{2, 3}"]
			);
		} catch {
			expect.fail("Failed to connect to PostgreSQL");
		}

		const result = await client.unsafe(`
      SELECT * FROM public.vitestint2
    `);

		expect(Int2.isInt2([...result.values()][0].int2)).toBe(true);
		expect(Int2.from(1).equals([...result.values()][0].int2)).toBe(true);

		const [a, b] = [...result.values()][0]._int2;
		expect([...result.values()][0]._int2).toHaveLength(2);
		expect(Int2.isInt2(a)).toBe(true);
		expect(Int2.from(2).equals(a)).toBe(true);
		expect(Int2.isInt2(b)).toBe(true);
		expect(Int2.from(3).equals(b)).toBe(true);

		try {
			await client.unsafe(`
        DROP TABLE public.vitestint2
      `);

			await client.end();
		} catch {
			expect.fail("Failed to disconnect from PostgreSQL");
		}
	});

	it("should be returned as a Int4", async () => {
		const client = postgres({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			types,
		});

		try {
			await client.unsafe(`
        CREATE TABLE IF NOT EXISTS public.vitestint4 (
          int4 int4 NULL,
          _int4 _int4 NULL
        )
      `);

			await client.unsafe(
				`
        INSERT INTO public.vitestint4 (int4, _int4)
        VALUES (
          $1::int4,
					$2::_int4
        )
      `,
				[1, "{2, 3}"]
			);
		} catch {
			expect.fail("Failed to connect to PostgreSQL");
		}

		const result = await client.unsafe(`
      SELECT * FROM public.vitestint4
    `);

		expect(Int4.isInt4([...result.values()][0].int4)).toBe(true);
		expect(Int4.from(1).equals([...result.values()][0].int4)).toBe(true);

		const [a, b] = [...result.values()][0]._int4;
		expect([...result.values()][0]._int4).toHaveLength(2);
		expect(Int4.isInt4(a)).toBe(true);
		expect(Int4.from(2).equals(a)).toBe(true);
		expect(Int4.isInt4(b)).toBe(true);
		expect(Int4.from(3).equals(b)).toBe(true);

		try {
			await client.unsafe(`
        DROP TABLE public.vitestint4
      `);

			await client.end();
		} catch {
			expect.fail("Failed to disconnect from PostgreSQL");
		}
	});

	it("should be returned as a Int4MultiRange", async () => {
		const client = postgres({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				types,
			}),
			version = await client.unsafe<
				{
					version: Text;
				}[]
			>("SELECT version()"),
			versionNumber = Number(version[0].version.value.split(" ")[1].split(".")[0]);

		// Multirange types were introduced in PostgreSQL 14
		if (versionNumber < 14) {
			await client.end();
			return;
		}

		let error: Error | undefined;
		try {
			await client.unsafe(`
        CREATE TABLE public.vitestint4multirange (
          int4multirange int4multirange NULL,
          _int4multirange _int4multirange NULL
        )
      `);

			await client.unsafe(
				`
        INSERT INTO public.vitestint4multirange (int4multirange, _int4multirange)
        VALUES (
          $1::int4multirange,
					$2::_int4multirange
        )
      `,
				["{[1,3),[11,13),[21,23)}", "{\\{[1\\,3)\\,[11\\,13)\\},\\{[21\\,23)\\,[31\\,33)\\}}"]
			);

			const result = await client.unsafe(`
        SELECT * FROM public.vitestint4multirange
      `);

			expect([...result.values()][0].int4multirange.toString()).toStrictEqual(Int4MultiRange.from("{[1,3),[11,13),[21,23)}").toString());
			expect([...result.values()][0]._int4multirange).toHaveLength(2);
			expect([...result.values()][0]._int4multirange[0].toString()).toStrictEqual(Int4MultiRange.from("{[1,3),[11,13)}").toString());
			expect([...result.values()][0]._int4multirange[1].toString()).toStrictEqual(Int4MultiRange.from("{[21,23),[31,33)}").toString());
		} catch (error_) {
			error = error_;
		}

		await client.unsafe(`
      DROP TABLE public.vitestint4multirange
    `);

		await client.end();

		if (error) throw error;
	});

	it("should be returned as a Int4Range", async () => {
		const client = postgres({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			types,
		});

		let error: Error | undefined;
		try {
			await client.unsafe(`
        CREATE TABLE public.vitestint4range (
          int4range int4range NULL,
          _int4range _int4range NULL
        )
      `);

			await client.unsafe(
				`
        INSERT INTO public.vitestint4range (int4range, _int4range)
        VALUES (
          $1::int4range,
					$2::_int4range
        )
      `,
				["[1,3)", "{[1\\,3),(5\\,7]}"]
			);

			const result = await client.unsafe(`
        SELECT * FROM public.vitestint4range
      `);

			expect([...result.values()][0].int4range.toString()).toStrictEqual(Int4Range.from("[1,3)").toString());
			expect([...result.values()][0]._int4range).toHaveLength(2);
			expect([...result.values()][0]._int4range[0].toString()).toStrictEqual(Int4Range.from("[1,3)").toString());
			expect([...result.values()][0]._int4range[1].toString()).toStrictEqual(Int4Range.from("[6,8)").toString());
		} catch (error_) {
			error = error_;
		}

		await client.unsafe(`
      DROP TABLE public.vitestint4range
    `);

		await client.end();

		if (error) throw error;
	});

	it("should be returned as a Int8", async () => {
		const client = postgres({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			types,
		});

		let error: Error | undefined;
		try {
			await client.unsafe(`
        CREATE TABLE IF NOT EXISTS public.vitestint8 (
          int8 int8 NULL,
          _int8 _int8 NULL
        )
      `);

			await client.unsafe(
				`
        INSERT INTO public.vitestint8 (int8, _int8)
        VALUES (
          $1::int8,
					$2::_int8
        )
      `,
				[1, "{2, 3}"]
			);

			const result = await client.unsafe(`
        SELECT * FROM public.vitestint8
      `);

			expect(Int8.isInt8([...result.values()][0].int8)).toBe(true);
			expect(Int8.from(1).equals([...result.values()][0].int8)).toBe(true);

			const [a, b] = [...result.values()][0]._int8;
			expect([...result.values()][0]._int8).toHaveLength(2);
			expect(Int8.isInt8(a)).toBe(true);
			expect(Int8.from(2).equals(a)).toBe(true);
			expect(Int8.isInt8(b)).toBe(true);
			expect(Int8.from(3).equals(b)).toBe(true);
		} catch (error_) {
			error = error_;
		}
		await client.unsafe(`
      DROP TABLE public.vitestint8
    `);

		await client.end();

		if (error) throw error;
	});

	it("should be returned as a Int8MultiRange", async () => {
		const client = postgres({
				password: "password",
				host: "localhost",
				user: "postgres",
				database: "postgres",
				port: 5432,
				types,
			}),
			version = await client.unsafe<
				{
					version: Text;
				}[]
			>("SELECT version()"),
			versionNumber = Number(version[0].version.value.split(" ")[1].split(".")[0]);

		// Multirange types were introduced in PostgreSQL 14
		if (versionNumber < 14) {
			await client.end();
			return;
		}

		let error: Error | undefined;
		try {
			await client.unsafe(`
        CREATE TABLE public.vitestint8multirange (
          int8multirange int8multirange NULL,
          _int8multirange _int8multirange NULL
        )
      `);

			await client.unsafe(
				`
        INSERT INTO public.vitestint8multirange (int8multirange, _int8multirange)
        VALUES (
          $1::int8multirange,
					$2::_int8multirange
        )
      `,
				["{[1,3),[11,13),[21,23)}", "{\\{[1\\,3)\\,[11\\,13)\\},\\{[21\\,23)\\,[31\\,33)\\}}"]
			);

			const result = await client.unsafe(`
        SELECT * FROM public.vitestint8multirange
      `);

			expect([...result.values()][0].int8multirange.toString()).toStrictEqual(Int8MultiRange.from("{[1,3),[11,13),[21,23)}").toString());
			expect([...result.values()][0]._int8multirange).toHaveLength(2);
			expect([...result.values()][0]._int8multirange[0].toString()).toStrictEqual(Int8MultiRange.from("{[1,3),[11,13)}").toString());
			expect([...result.values()][0]._int8multirange[1].toString()).toStrictEqual(Int8MultiRange.from("{[21,23),[31,33)}").toString());
		} catch (error_) {
			error = error_;
		}

		await client.unsafe(`
      DROP TABLE public.vitestint8multirange
    `);

		await client.end();

		if (error) throw error;
	});

	it("should be returned as a Int8Range", async () => {
		const client = postgres({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			types,
		});

		let error: Error | undefined;
		try {
			await client.unsafe(`
        CREATE TABLE public.vitestint8range (
          int8range int8range NULL,
          _int8range _int8range NULL
        )
      `);

			await client.unsafe(
				`
        INSERT INTO public.vitestint8range (int8range, _int8range)
        VALUES (
          $1::int8range,
					$2::_int8range
        )
      `,
				["[1,3)", "{[1\\,3),(5\\,7]}"]
			);

			const result = await client.unsafe(`
        SELECT * FROM public.vitestint8range
      `);

			expect([...result.values()][0].int8range.toString()).toStrictEqual(Int8Range.from("[1,3)").toString());
			expect([...result.values()][0]._int8range).toHaveLength(2);
			expect([...result.values()][0]._int8range[0].toString()).toStrictEqual(Int8Range.from("[1,3)").toString());
			expect([...result.values()][0]._int8range[1].toString()).toStrictEqual(Int8Range.from("[6,8)").toString());
		} catch (error_) {
			error = error_;
		}

		await client.unsafe(`
      DROP TABLE public.vitestint8range
    `);

		await client.end();

		if (error) throw error;
	});
});
//#endregion

//#region ObjectIdentifier
describe("ObjectIdentifier", () => {
	it("should be returned as an OID", async () => {
		const client = postgres({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			types,
		});

		try {
			await client.unsafe(`
				CREATE TABLE IF NOT EXISTS public.vitestoid (
					oid oid NULL,
					_oid _oid NULL
				)
			`);

			await client.unsafe(
				`
				INSERT INTO public.vitestoid (oid, _oid)
				VALUES (
					$1::oid,
					$2::_oid
				)
			`,
				[1, "{2, 3}"]
			);
		} catch {
			expect.fail("Failed to connect to PostgreSQL");
		}

		const result = await client.unsafe(`
				SELECT * FROM public.vitestoid
			`);

		expect(OID.isOID([...result.values()][0].oid)).toBe(true);
		expect(OID.from(1).equals([...result.values()][0].oid)).toBe(true);

		const [a, b] = [...result.values()][0]._oid;
		expect([...result.values()][0]._oid).toHaveLength(2);
		expect(OID.isOID(a)).toBe(true);
		expect(OID.from(2).equals(a)).toBe(true);
		expect(OID.isOID(b)).toBe(true);
		expect(OID.from(3).equals(b)).toBe(true);

		try {
			await client.unsafe(`
				DROP TABLE public.vitestoid
			`);

			await client.end();
		} catch {
			expect.fail("Failed to disconnect from PostgreSQL");
		}
	});
});
//#endregion

//#region UUID
describe("UUID", () => {
	it("should be returned as an UUID", async () => {
		const client = postgres({
			password: "password",
			host: "localhost",
			user: "postgres",
			database: "postgres",
			port: 5432,
			types,
		});

		let error: Error | undefined;
		try {
			await client.unsafe(`
				CREATE TABLE public.vitestuuid (
					uuid uuid NULL,
					_uuid _uuid NULL
				)
			`);

			await client.unsafe(
				`
				INSERT INTO public.vitestuuid (uuid, _uuid)
				VALUES (
					$1::uuid,
					$2::_uuid
				)
			`,
				["A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11", "{A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11, A0EEBC99-8C0B-4EF8-BB6D-6BB9BD380A11}"]
			);

			const result = await client.unsafe(`
				SELECT * FROM public.vitestuuid
			`);

			expect([...result.values()][0].uuid.toString()).toStrictEqual(UUID.from("A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11").toString());
			expect([...result.values()][0]._uuid).toHaveLength(2);
			expect([...result.values()][0]._uuid[0].toString()).toStrictEqual(UUID.from("A0EEBC99-9C0B-4EF8-BB6D-6BB9BD380A11").toString());
			expect([...result.values()][0]._uuid[1].toString()).toStrictEqual(UUID.from("A0EEBC99-8C0B-4EF8-BB6D-6BB9BD380A11").toString());
		} catch (error_) {
			error = error_;
		}

		await client.unsafe(`
			DROP TABLE public.vitestuuid
		`);

		await client.end();

		if (error) throw error;
	});
});
//#endregion
