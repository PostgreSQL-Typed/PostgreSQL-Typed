import { DateTime, Zone } from "luxon";
import { types } from "pg";
import { DataType } from "postgresql-data-types";

import { Offset } from "../../types/Offset";
import { OffsetDirection, OffsetDirectionType } from "../../types/OffsetDirection";
import { arrayParser } from "../../util/arrayParser";
import { isISOEquivalent } from "../../util/isISOEquivalent";
import { parser } from "../../util/parser";
import { validateTimeZone } from "../../util/validateTimeZone";
import { Date } from "./Date";
import { TimeTZ } from "./TimeTZ";

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
	from(str: string): TimestampTZ;
	/**
	 * Returns `true` if `obj` is a `TimestampTZ`, `false` otherwise.
	 */
	isTimestampTZ(obj: any): obj is TimestampTZ;
}

const TimestampTZ: TimestampTZConstructor = {
	from(
		arg: string | TimestampTZ | TimestampTZObject | globalThis.Date | DateTime | number,
		month?: number,
		day?: number,
		hour?: number,
		minute?: number,
		second?: number,
		offsetHour?: number,
		offsetMinute?: number,
		offsetDirection?: OffsetDirection | OffsetDirectionType
	): TimestampTZ {
		if (typeof arg === "string") {
			if (
				arg.match(
					/^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])(\s|T)([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])(\.[0-9]?[0-9]?[0-9])?(Z|\s?[+-]([0-1][0-9]|2[0-3])(:([0-5][0-9]))?)$/
				)
			) {
				const [date, , timeRaw] = arg.split(/(\s|T)(?![+-])/),
					[time, operator, offsetRaw] = timeRaw.split(/(Z|\s?[+-])/),
					direction = operator.trim() === "Z" || operator.trim() === "+" ? OffsetDirection.plus : OffsetDirection.minus,
					[year, month, day] = date.split("-").map(c => parseInt(c)),
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					[hour, minute, second, milisecond] = time
						.match(/^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])(\.[0-9]?[0-9]?[0-9])?$/)!
						.slice(1)
						.map(c => parseFloat(c)),
					[offsetHour, offsetMinute] = offsetRaw.split(":").map(c => parseInt(c));

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

			if (arg.match(/^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])\s([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])(\.[0-9]?[0-9]?[0-9])?\s((\/|\w)*)$/)) {
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				const matches = arg.match(
						/^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])\s([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])(\.[0-9]?[0-9]?[0-9])?\s((\/|\w)*)$/
					)!,
					zone = matches[8],
					[year, month, day, hour, minute, second, milisecond] = matches.slice(1, 8).map(x => parseFloat(x)),
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
		} else if (TimestampTZ.isTimestampTZ(arg)) return new TimestampTZClass(arg.toJSON());
		else if (typeof arg === "number") {
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
					year: arg,
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
					newlyMadeTimestampTZ
						.toString()
						.match(
							/^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])\s([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])(\.[0-9]?[0-9]?[0-9])?\s[+-]([0-1][0-9]|2[0-3])(:([0-5][0-9]))?$/
						)
				)
					return newlyMadeTimestampTZ;
				throw new Error("Invalid TimestampTZ array, numbers and OffsetDirection");
			}
			throw new Error("Invalid TimestampTZ array, numbers and OffsetDirection");
		} else if (arg instanceof DateTime || arg instanceof globalThis.Date) return TimestampTZ.from(arg instanceof DateTime ? arg.toISO() : arg.toISOString());
		else {
			if (
				typeof arg === "object" &&
				"year" in arg &&
				typeof arg.year === "number" &&
				"month" in arg &&
				typeof arg.month === "number" &&
				"day" in arg &&
				typeof arg.day === "number" &&
				"hour" in arg &&
				typeof arg.hour === "number" &&
				"minute" in arg &&
				typeof arg.minute === "number" &&
				"second" in arg &&
				typeof arg.second === "number" &&
				"offset" in arg &&
				typeof arg.offset === "object" &&
				"hour" in arg.offset &&
				typeof arg.offset.hour === "number" &&
				"minute" in arg.offset &&
				typeof arg.offset.minute === "number" &&
				"direction" in arg.offset &&
				typeof arg.offset.direction === "string" &&
				(arg.offset.direction === OffsetDirection.plus || arg.offset.direction === OffsetDirection.minus)
			) {
				const newlyMadeTimestamp = new TimestampTZClass(arg);
				if (
					newlyMadeTimestamp
						.toString()
						.match(
							/^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])\s([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])(\.[0-9]?[0-9]?[0-9])?\s[+-]([0-1][0-9]|2[0-3])(:([0-5][0-9]))?$/
						)
				)
					return newlyMadeTimestamp;
			}

			throw new Error("Invalid TimestampTZ object");
		}
	},
	isTimestampTZ(obj: any): obj is TimestampTZ {
		return obj instanceof TimestampTZClass;
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
		this._year = parseInt(data.year.toString());
		this._month = parseInt(data.month.toString());
		this._day = parseInt(data.day.toString());
		this._hour = parseInt(data.hour.toString());
		this._minute = parseInt(data.minute.toString());
		this._second = parseFloat(data.second.toString());
		this._offset = {
			hour: parseInt(data.offset.hour.toString()),
			minute: parseInt(data.offset.minute.toString()),
			direction: data.offset.direction,
		};
	}

	private _prefix(num: number): string {
		return num < 10 ? `0${num}` : `${num}`;
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
		year = parseInt(year.toString());
		if (isNaN(year) || year < 1 || year > 9999) throw new Error("Invalid year");

		this._year = year;
	}

	get month(): number {
		return this._month;
	}

	set month(month: number) {
		month = parseInt(month.toString());
		if (isNaN(month) || month < 1 || month > 12) throw new Error("Invalid month");

		this._month = month;
	}

	get day(): number {
		return this._day;
	}

	set day(day: number) {
		day = parseInt(day.toString());
		if (isNaN(day) || day < 1 || day > 31) throw new Error("Invalid day");

		this._day = day;
	}

	get hour(): number {
		return this._hour;
	}

	set hour(hour: number) {
		hour = parseInt(hour.toString());
		if (isNaN(hour) || hour < 0 || hour > 23) throw new Error("Invalid hour");

		this._hour = hour;
	}

	get minute(): number {
		return this._minute;
	}

	set minute(minute: number) {
		minute = parseInt(minute.toString());
		if (isNaN(minute) || minute < 0 || minute > 59) throw new Error("Invalid minute");

		this._minute = minute;
	}

	get second(): number {
		return this._second;
	}

	set second(second: number) {
		second = parseInt(second.toString());
		if (isNaN(second) || second < 0 || second > 59) throw new Error("Invalid second");

		this._second = second;
	}

	get offset(): Offset {
		return this._offset;
	}

	set offset(offset: Offset) {
		offset.hour = parseInt(offset.hour.toString());
		if (isNaN(offset.hour) || offset.hour < 0 || offset.hour > 23) throw new Error("Invalid offset hour");
		offset.minute = parseInt(offset.minute.toString());
		if (isNaN(offset.minute) || offset.minute < 0 || offset.minute > 59) throw new Error("Invalid offset minute");
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
