/* eslint-disable unicorn/filename-case */
import { DateTime, Zone } from "luxon";
import { types } from "pg";
import { DataType } from "postgresql-data-types";

import { Offset } from "../../types/Offset.js";
import { OffsetDirection, OffsetDirectionType } from "../../types/OffsetDirection.js";
import { arrayParser } from "../../util/arrayParser.js";
import { isISOEquivalent } from "../../util/isISOEquivalent.js";
import { parser } from "../../util/parser.js";
import { validateTimeZone } from "../../util/validateTimeZone.js";
import { Date } from "./Date.js";
import { TimeTZ } from "./TimeTZ.js";

interface TimestampTZObject {
	year: number;
	month: number;
	day: number;
	hour: number;
	minute: number;
	second: number;
	offset: Offset;
}

interface TimestampTZ {
	toString(): string;
	toJSON(): TimestampTZObject;
	equals(otherTimestampTZ: string | TimestampTZ | TimestampTZObject): boolean;

	year: number;
	month: number;
	day: number;
	hour: number;
	minute: number;
	second: number;
	offset: Offset;

	toISO(): string;
	toDate(): Date;
	toTimeTZ(): TimeTZ;

	/**
	 * @param zone The zone to convert the timestamp to. Defaults to 'local'.
	 */
	toDateTime(zone?: string | Zone | undefined): DateTime;

	/**
	 * @param zone The zone to convert the timestamp to. Defaults to 'local'.
	 */
	toJSDate(zone?: string | Zone | undefined): globalThis.Date;
}

interface TimestampTZConstructor {
	from(
		year: number,
		month: number,
		day: number,
		hour: number,
		minute: number,
		second: number,
		offsetHour: number,
		offsetMinute: number,
		offsetDirection: OffsetDirection | OffsetDirectionType
	): TimestampTZ;
	from(data: TimestampTZ | TimestampTZObject | globalThis.Date | DateTime): TimestampTZ;
	from(string: string): TimestampTZ;
	/**
	 * Returns `true` if `object` is a `TimestampTZ`, `false` otherwise.
	 */
	isTimestampTZ(object: any): object is TimestampTZ;
}

const TimestampTZ: TimestampTZConstructor = {
	from(
		argument: string | TimestampTZ | TimestampTZObject | globalThis.Date | DateTime | number,
		month?: number,
		day?: number,
		hour?: number,
		minute?: number,
		second?: number,
		offsetHour?: number,
		offsetMinute?: number,
		offsetDirection?: OffsetDirection | OffsetDirectionType
	): TimestampTZ {
		if (typeof argument === "string") {
			if (
				/^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])([\sT])([01]\d|2[0-3]):([0-5]\d):([0-5]\d)(\.\d{1,3})?(Z|\s?[+-]([01]\d|2[0-3])(:([0-5]\d))?)$/.test(
					argument
				)
			) {
				const [date, , timeRaw] = argument.split(/(\s|T)(?![+-])/),
					[time, operator, offsetRaw] = timeRaw.split(/(Z|\s?[+-])/),
					direction = operator.trim() === "Z" || operator.trim() === "+" ? OffsetDirection.plus : OffsetDirection.minus,
					[year, month, day] = date.split("-").map(c => Number.parseInt(c)),
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					[hour, minute, second, milisecond] = time
						.match(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)(\.\d{1,3})?$/)!
						.slice(1)
						.map(c => Number.parseFloat(c)),
					[offsetHour, offsetMinute] = offsetRaw.split(":").map(c => Number.parseInt(c));

				return new TimestampTZClass({
					year,
					month,
					day,
					hour,
					minute,
					second: second + (milisecond || 0),
					offset: {
						hour: offsetHour || 0,
						minute: offsetMinute || 0,
						direction,
					},
				});
			}

			if (/^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])\s([01]\d|2[0-3]):([0-5]\d):([0-5]\d)(\.\d{1,3})?\s(([\w/])*)$/.test(argument)) {
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				const matches = argument.match(/^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])\s([01]\d|2[0-3]):([0-5]\d):([0-5]\d)(\.\d{1,3})?\s(([\w/])*)$/)!,
					zone = matches[8],
					[year, month, day, hour, minute, second, milisecond] = matches.slice(1, 8).map(x => Number.parseFloat(x)),
					offset = validateTimeZone(zone);

				if (offset === false) throw new Error("Invalid TimestampTZ string");

				const offsetHour = Math.floor(Math.abs(offset) / 60),
					offsetMinute = Math.abs(offset) % 60;

				return new TimestampTZClass({
					year,
					month,
					day,
					hour,
					minute,
					second: second + (milisecond || 0),
					offset: {
						hour: offsetHour,
						minute: offsetMinute,
						direction: Math.sign(offset) === -1 ? OffsetDirection.minus : OffsetDirection.plus,
					},
				});
			}
			throw new Error("Invalid TimestampTZ string");
		} else if (TimestampTZ.isTimestampTZ(argument)) return new TimestampTZClass(argument.toJSON());
		else if (typeof argument === "number") {
			if (
				typeof month === "number" &&
				typeof day === "number" &&
				typeof hour === "number" &&
				typeof minute === "number" &&
				typeof second === "number" &&
				typeof offsetHour === "number" &&
				typeof offsetMinute === "number" &&
				typeof offsetDirection === "string" &&
				(offsetDirection === OffsetDirection.plus || offsetDirection === OffsetDirection.minus)
			) {
				const newlyMadeTimestampTZ = new TimestampTZClass({
					year: argument,
					month,
					day,
					hour,
					minute,
					second,
					offset: {
						hour: offsetHour,
						minute: offsetMinute,
						direction: offsetDirection,
					},
				});
				if (
					/^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])\s([01]\d|2[0-3]):([0-5]\d):([0-5]\d)(\.\d{1,3})?\s[+-]([01]\d|2[0-3])(:([0-5]\d))?$/.test(
						newlyMadeTimestampTZ.toString()
					)
				)
					return newlyMadeTimestampTZ;
				throw new Error("Invalid TimestampTZ array, numbers and OffsetDirection");
			}
			throw new Error("Invalid TimestampTZ array, numbers and OffsetDirection");
		} else if (argument instanceof DateTime || argument instanceof globalThis.Date)
			return TimestampTZ.from(argument instanceof DateTime ? argument.toISO() : argument.toISOString());
		else {
			if (
				typeof argument === "object" &&
				"year" in argument &&
				typeof argument.year === "number" &&
				"month" in argument &&
				typeof argument.month === "number" &&
				"day" in argument &&
				typeof argument.day === "number" &&
				"hour" in argument &&
				typeof argument.hour === "number" &&
				"minute" in argument &&
				typeof argument.minute === "number" &&
				"second" in argument &&
				typeof argument.second === "number" &&
				"offset" in argument &&
				typeof argument.offset === "object" &&
				"hour" in argument.offset &&
				typeof argument.offset.hour === "number" &&
				"minute" in argument.offset &&
				typeof argument.offset.minute === "number" &&
				"direction" in argument.offset &&
				typeof argument.offset.direction === "string" &&
				(argument.offset.direction === OffsetDirection.plus || argument.offset.direction === OffsetDirection.minus)
			) {
				const newlyMadeTimestamp = new TimestampTZClass(argument);
				if (
					/^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])\s([01]\d|2[0-3]):([0-5]\d):([0-5]\d)(\.\d{1,3})?\s[+-]([01]\d|2[0-3])(:([0-5]\d))?$/.test(
						newlyMadeTimestamp.toString()
					)
				)
					return newlyMadeTimestamp;
			}

			throw new Error("Invalid TimestampTZ object");
		}
	},
	isTimestampTZ(object: any): object is TimestampTZ {
		return object instanceof TimestampTZClass;
	},
};

class TimestampTZClass implements TimestampTZ {
	private _year: number;
	private _month: number;
	private _day: number;
	private _hour: number;
	private _minute: number;
	private _second: number;
	private _offset: Offset;

	constructor(data: TimestampTZObject) {
		this._year = Number.parseInt(data.year.toString());
		this._month = Number.parseInt(data.month.toString());
		this._day = Number.parseInt(data.day.toString());
		this._hour = Number.parseInt(data.hour.toString());
		this._minute = Number.parseInt(data.minute.toString());
		this._second = Number.parseFloat(data.second.toString());
		this._offset = {
			hour: Number.parseInt(data.offset.hour.toString()),
			minute: Number.parseInt(data.offset.minute.toString()),
			direction: data.offset.direction,
		};
	}

	private _prefix(number: number): string {
		return number < 10 ? `0${number}` : `${number}`;
	}

	private _formatDate(): string {
		return `${this._year}-${this._prefix(this._month)}-${this._prefix(this._day)}`;
	}

	private _formatTime(): string {
		return `${this._prefix(this._hour)}:${this._prefix(this._minute)}:${this._prefix(this._second)}`;
	}

	private _formatOffset(): string {
		return `${this._offset.direction === OffsetDirection.minus ? "-" : "+"}${this._prefix(this._offset.hour)}:${this._prefix(this._offset.minute)}`;
	}

	toString(): string {
		return `${this._formatDate()} ${this._formatTime()} ${this._formatOffset()}`;
	}

	toISO(): string {
		return `${this._formatDate()}T${this._formatTime()}${this._formatOffset()}`;
	}

	toJSON(): TimestampTZObject {
		return {
			year: this._year,
			month: this._month,
			day: this._day,
			hour: this._hour,
			minute: this._minute,
			second: this._second,
			offset: this._offset,
		};
	}

	equals(otherTimestampTZ: string | TimestampTZ | TimestampTZObject): boolean {
		if (typeof otherTimestampTZ === "string") return otherTimestampTZ === this.toString();
		else if (TimestampTZ.isTimestampTZ(otherTimestampTZ)) return isISOEquivalent(otherTimestampTZ.toISO(), this.toISO());
		else {
			return (
				otherTimestampTZ.year === this._year &&
				otherTimestampTZ.month === this._month &&
				otherTimestampTZ.day === this._day &&
				otherTimestampTZ.hour === this._hour &&
				otherTimestampTZ.minute === this._minute &&
				otherTimestampTZ.second === this._second &&
				otherTimestampTZ.offset.hour === this._offset.hour &&
				otherTimestampTZ.offset.minute === this._offset.minute &&
				otherTimestampTZ.offset.direction === this._offset.direction
			);
		}
	}

	get year(): number {
		return this._year;
	}

	set year(year: number) {
		year = Number.parseInt(year.toString());
		if (Number.isNaN(year) || year < 1 || year > 9999) throw new Error("Invalid year");

		this._year = year;
	}

	get month(): number {
		return this._month;
	}

	set month(month: number) {
		month = Number.parseInt(month.toString());
		if (Number.isNaN(month) || month < 1 || month > 12) throw new Error("Invalid month");

		this._month = month;
	}

	get day(): number {
		return this._day;
	}

	set day(day: number) {
		day = Number.parseInt(day.toString());
		if (Number.isNaN(day) || day < 1 || day > 31) throw new Error("Invalid day");

		this._day = day;
	}

	get hour(): number {
		return this._hour;
	}

	set hour(hour: number) {
		hour = Number.parseInt(hour.toString());
		if (Number.isNaN(hour) || hour < 0 || hour > 23) throw new Error("Invalid hour");

		this._hour = hour;
	}

	get minute(): number {
		return this._minute;
	}

	set minute(minute: number) {
		minute = Number.parseInt(minute.toString());
		if (Number.isNaN(minute) || minute < 0 || minute > 59) throw new Error("Invalid minute");

		this._minute = minute;
	}

	get second(): number {
		return this._second;
	}

	set second(second: number) {
		second = Number.parseInt(second.toString());
		if (Number.isNaN(second) || second < 0 || second > 59) throw new Error("Invalid second");

		this._second = second;
	}

	get offset(): Offset {
		return this._offset;
	}

	set offset(offset: Offset) {
		offset.hour = Number.parseInt(offset.hour.toString());
		if (Number.isNaN(offset.hour) || offset.hour < 0 || offset.hour > 23) throw new Error("Invalid offset hour");
		offset.minute = Number.parseInt(offset.minute.toString());
		if (Number.isNaN(offset.minute) || offset.minute < 0 || offset.minute > 59) throw new Error("Invalid offset minute");
		if (!([OffsetDirection.minus, OffsetDirection.plus] as string[]).includes(offset.direction)) throw new Error("Invalid offset direction");

		this._offset = offset;
	}

	toDate(): Date {
		return Date.from({
			year: this._year,
			month: this._month,
			day: this._day,
		});
	}

	toTimeTZ(): TimeTZ {
		return TimeTZ.from({
			hour: this._hour,
			minute: this._minute,
			second: this._second,
			offset: this._offset,
		});
	}

	toDateTime(zone?: string | Zone | undefined): DateTime {
		return DateTime.fromISO(this.toISO()).setZone(zone);
	}

	toJSDate(zone?: string | Zone | undefined): globalThis.Date {
		return this.toDateTime(zone).toJSDate();
	}
}

types.setTypeParser(DataType.timestamptz as any, parser(TimestampTZ));
types.setTypeParser(DataType._timestamptz as any, arrayParser(TimestampTZ));

export { TimestampTZ, TimestampTZObject };
