import { DateTime, Zone } from "luxon";
import { types } from "pg";
import { DataType } from "postgresql-data-types";

import { arrayParser } from "../../util/arrayParser";
import { parser } from "../../util/parser";
import { Date } from "./Date";
import { Time } from "./Time";

interface TimestampObject {
	year: number;
	month: number;
	day: number;
	hour: number;
	minute: number;
	second: number;
}

interface Timestamp {
	toString(): string;
	toJSON(): TimestampObject;
	equals(otherTimestamp: string | Timestamp | TimestampObject): boolean;

	year: number;
	month: number;
	day: number;
	hour: number;
	minute: number;
	second: number;

	toISO(): string;
	toDate(): Date;
	toTime(): Time;

	/**
	 * @param zone The zone to convert the timestamp to. Defaults to 'local'.
	 */
	toDateTime(zone?: string | Zone | undefined): DateTime;

	/**
	 * @param zone The zone to convert the timestamp to. Defaults to 'local'.
	 */
	toJSDate(zone?: string | Zone | undefined): globalThis.Date;
}

interface TimestampConstructor {
	from(year: number, month: number, day: number, hour: number, minute: number, second: number): Timestamp;
	from(data: Timestamp | TimestampObject | globalThis.Date | DateTime): Timestamp;
	from(str: string): Timestamp;
	/**
	 * Returns `true` if `obj` is a `Timestamp`, `false` otherwise.
	 */
	isTimestamp(obj: any): obj is Timestamp;
}

const Timestamp: TimestampConstructor = {
	from(
		arg: string | Timestamp | TimestampObject | globalThis.Date | DateTime | number,
		month?: number,
		day?: number,
		hour?: number,
		minute?: number,
		second?: number
	): Timestamp {
		if (typeof arg === "string") {
			if (arg.match(/^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])(\s|T)([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])(\.[0-9]?[0-9]?[0-9])?/)) {
				const [date, , time] = arg.split(/(\s|T)/),
					[year, month, day] = date.split("-").map(c => parseInt(c)),
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					[hour, minute, second, milisecond] = time
						.match(/^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])(\.[0-9]?[0-9]?[0-9])?/)!
						.slice(1)
						.map(c => parseFloat(c));

				return new TimestampClass({
					year,
					month,
					day,
					hour,
					minute,
					second: second + (milisecond || 0),
				});
			}
			throw new Error("Invalid Timestamp string");
		} else if (Timestamp.isTimestamp(arg)) return new TimestampClass(arg.toJSON());
		else if (typeof arg === "number") {
			if (typeof month === "number" && typeof day === "number" && typeof hour === "number" && typeof minute === "number" && typeof second === "number") {
				const newlyMadeTimestamp = new TimestampClass({
					year: arg,
					month,
					day,
					hour,
					minute,
					second,
				});
				if (
					newlyMadeTimestamp
						.toString()
						.match(/^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])\s([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])(\.[0-9]?[0-9]?[0-9])?$/)
				)
					return newlyMadeTimestamp;
				throw new Error("Invalid Timestamp arguments");
			}
			throw new Error("Invalid Timestamp array, numbers only");
		} else if (arg instanceof DateTime) {
			return new TimestampClass({
				year: arg.year,
				month: arg.month,
				day: arg.day,
				hour: arg.hour,
				minute: arg.minute,
				second: arg.second + (arg.millisecond ? arg.millisecond / 1000 : 0),
			});
		} else if (arg instanceof globalThis.Date) {
			return new TimestampClass({
				year: arg.getFullYear(),
				month: arg.getMonth() + 1,
				day: arg.getDate(),
				hour: arg.getHours(),
				minute: arg.getMinutes(),
				second: arg.getSeconds() + arg.getMilliseconds() / 1000,
			});
		} else {
			if (
				!(
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
					typeof arg.second === "number"
				)
			)
				throw new Error("Invalid Timestamp object");

			const newlyMadeTimestamp = new TimestampClass(arg);
			if (
				newlyMadeTimestamp
					.toString()
					.match(/^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])\s([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])(\.[0-9]?[0-9]?[0-9])?$/)
			)
				return newlyMadeTimestamp;

			throw new Error("Invalid Timestamp object");
		}
	},
	isTimestamp(obj: any): obj is Timestamp {
		return obj instanceof TimestampClass;
	},
};

class TimestampClass implements Timestamp {
	private _year: number;
	private _month: number;
	private _day: number;
	private _hour: number;
	private _minute: number;
	private _second: number;

	constructor(data: TimestampObject) {
		this._year = parseInt(data.year.toString());
		this._month = parseInt(data.month.toString());
		this._day = parseInt(data.day.toString());
		this._hour = parseInt(data.hour.toString());
		this._minute = parseInt(data.minute.toString());
		this._second = parseFloat(data.second.toString());
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

	toString(): string {
		return `${this._formatDate()} ${this._formatTime()}`;
	}

	toISO(): string {
		return `${this._formatDate()}T${this._formatTime()}Z`;
	}

	toJSON(): TimestampObject {
		return {
			year: this._year,
			month: this._month,
			day: this._day,
			hour: this._hour,
			minute: this._minute,
			second: this._second,
		};
	}

	equals(otherTimestamp: string | Timestamp | TimestampObject): boolean {
		if (typeof otherTimestamp === "string") return otherTimestamp === this.toString();
		else if (Timestamp.isTimestamp(otherTimestamp)) return otherTimestamp.toString() === this.toString();
		else {
			return (
				otherTimestamp.year === this._year &&
				otherTimestamp.month === this._month &&
				otherTimestamp.day === this._day &&
				otherTimestamp.hour === this._hour &&
				otherTimestamp.minute === this._minute &&
				otherTimestamp.second === this._second
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

	toDate(): Date {
		return Date.from({
			year: this._year,
			month: this._month,
			day: this._day,
		});
	}

	toTime(): Time {
		return Time.from({
			hour: this._hour,
			minute: this._minute,
			second: this._second,
		});
	}

	toDateTime(zone?: string | Zone | undefined): DateTime {
		return DateTime.fromObject(
			{
				year: this._year,
				month: this._month,
				day: this._day,
				hour: this._hour,
				minute: this._minute,
				second: parseInt(this._second.toString().split(".")[0]),
				millisecond: parseInt(this._second.toString().split(".")[1]),
			},
			{ zone }
		);
	}

	toJSDate(zone?: string | Zone | undefined): globalThis.Date {
		return this.toDateTime(zone).toJSDate();
	}
}

types.setTypeParser(DataType.timestamp as any, parser(Timestamp));
types.setTypeParser(DataType._timestamp as any, arrayParser(Timestamp));

export { Timestamp, TimestampObject };
