import { DateTime, Zone } from "luxon";
import { types } from "pg";
import { DataType } from "postgresql-data-types";

import { arrayParser } from "../../util/arrayParser.js";
import { parser } from "../../util/parser.js";
import { Date } from "./Date.js";
import { Time } from "./Time.js";

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
	from(string: string): Timestamp;
	/**
	 * Returns `true` if `object` is a `Timestamp`, `false` otherwise.
	 */
	isTimestamp(object: any): object is Timestamp;
}

const Timestamp: TimestampConstructor = {
	from(
		argument: string | Timestamp | TimestampObject | globalThis.Date | DateTime | number,
		month?: number,
		day?: number,
		hour?: number,
		minute?: number,
		second?: number
	): Timestamp {
		if (typeof argument === "string") {
			if (/^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])([\sT])([01]\d|2[0-3]):([0-5]\d):([0-5]\d)(\.\d{1,3})?/.test(argument)) {
				const [date, , time] = argument.split(/(\s|T)/),
					[year, month, day] = date.split("-").map(c => Number.parseInt(c)),
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					[hour, minute, second, milisecond] = time
						.match(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)(\.\d{1,3})?/)!
						.slice(1)
						.map(c => Number.parseFloat(c));

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
		} else if (Timestamp.isTimestamp(argument)) return new TimestampClass(argument.toJSON());
		else if (typeof argument === "number") {
			if (typeof month === "number" && typeof day === "number" && typeof hour === "number" && typeof minute === "number" && typeof second === "number") {
				const newlyMadeTimestamp = new TimestampClass({
					year: argument,
					month,
					day,
					hour,
					minute,
					second,
				});
				if (/^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])\s([01]\d|2[0-3]):([0-5]\d):([0-5]\d)(\.\d{1,3})?$/.test(newlyMadeTimestamp.toString()))
					return newlyMadeTimestamp;
				throw new Error("Invalid Timestamp arguments");
			}
			throw new Error("Invalid Timestamp array, numbers only");
		} else if (argument instanceof DateTime) {
			return new TimestampClass({
				year: argument.year,
				month: argument.month,
				day: argument.day,
				hour: argument.hour,
				minute: argument.minute,
				second: argument.second + (argument.millisecond ? argument.millisecond / 1000 : 0),
			});
		} else if (argument instanceof globalThis.Date) {
			return new TimestampClass({
				year: argument.getFullYear(),
				month: argument.getMonth() + 1,
				day: argument.getDate(),
				hour: argument.getHours(),
				minute: argument.getMinutes(),
				second: argument.getSeconds() + argument.getMilliseconds() / 1000,
			});
		} else {
			if (
				!(
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
					typeof argument.second === "number"
				)
			)
				throw new Error("Invalid Timestamp object");

			const newlyMadeTimestamp = new TimestampClass(argument);
			if (/^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])\s([01]\d|2[0-3]):([0-5]\d):([0-5]\d)(\.\d{1,3})?$/.test(newlyMadeTimestamp.toString()))
				return newlyMadeTimestamp;

			throw new Error("Invalid Timestamp object");
		}
	},
	isTimestamp(object: any): object is Timestamp {
		return object instanceof TimestampClass;
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
		this._year = Number.parseInt(data.year.toString());
		this._month = Number.parseInt(data.month.toString());
		this._day = Number.parseInt(data.day.toString());
		this._hour = Number.parseInt(data.hour.toString());
		this._minute = Number.parseInt(data.minute.toString());
		this._second = Number.parseFloat(data.second.toString());
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
				second: Number.parseInt(this._second.toString().split(".")[0]),
				millisecond: Number.parseInt(this._second.toString().split(".")[1]),
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
