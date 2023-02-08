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

interface TimeTZObject {
	hour: number;
	minute: number;
	second: number;
	offset: Offset;
}

interface TimeTZ {
	toString(): string;
	toJSON(): TimeTZObject;
	equals(otherTimeTZ: string | TimeTZ | TimeTZObject): boolean;

	hour: number;
	minute: number;
	second: number;
	offset: Offset;

	/**
	 * @param zone The zone to convert the time to. Defaults to 'local'.
	 */
	toDateTime(zone?: string | Zone | undefined): DateTime;

	/**
	 * @param zone The zone to convert the time to. Defaults to 'local'.
	 */
	toJSDate(zone?: string | Zone | undefined): globalThis.Date;
}

interface TimeTZConstructor {
	from(hour: number, minute: number, second: number, offsetHour: number, offsetMinute: number, offsetDirection: OffsetDirection | OffsetDirectionType): TimeTZ;
	from(data: TimeTZ | TimeTZObject | globalThis.Date | DateTime): TimeTZ;
	from(string: string): TimeTZ;
	/**
	 * Returns `true` if `object` is a `TimeTZ`, `false` otherwise.
	 */
	isTimeTZ(object: any): object is TimeTZ;
}

const TimeTZ: TimeTZConstructor = {
	from(
		argument: string | TimeTZ | TimeTZObject | globalThis.Date | DateTime | number,
		minute?: number,
		second?: number,
		offsetHour?: number,
		offsetMinute?: number,
		offsetDirection?: OffsetDirection | OffsetDirectionType
	): TimeTZ {
		if (typeof argument === "string") {
			if (/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)(\.\d{1,3})?[+-]([01]\d|2[0-3])(:([0-5]\d))?(:([0-5]\d))?(\.\d{1,3})?$/.test(argument)) {
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				const [, hour, minute, second, milisecond, offsetHour, , offsetMinute] = argument
					.match(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)(\.\d{1,3})?[+-]([01]\d|2[0-3])(:([0-5]\d))?(:([0-5]\d))?(\.\d{1,3})?$/)!
					.map(x => Number.parseFloat(x));
				return new TimeTZClass({
					hour,
					minute,
					second: second + (milisecond || 0),
					offset: {
						hour: offsetHour,
						minute: offsetMinute || 0,
						direction: argument.includes("-") ? OffsetDirection.minus : OffsetDirection.plus,
					},
				});
			}

			if (/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)(\.\d{1,3})?\s(([\w/])*)$/.test(argument)) {
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				const matches = argument.match(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)(\.\d{1,3})?\s(([\w/])*)$/)!,
					zone = matches[5],
					[hour, minute, second, milisecond] = matches.slice(1, 5).map(x => Number.parseFloat(x)),
					offset = validateTimeZone(zone);

				if (offset === false) throw new Error("Invalid TimeTZ string");

				const offsetHour = Math.floor(Math.abs(offset) / 60),
					offsetMinute = Math.abs(offset) % 60;

				return new TimeTZClass({
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
			throw new Error("Invalid TimeTZ string");
		} else if (TimeTZ.isTimeTZ(argument)) return new TimeTZClass(argument.toJSON());
		else if (typeof argument === "number") {
			if (
				typeof minute === "number" &&
				typeof second === "number" &&
				typeof offsetHour === "number" &&
				typeof offsetMinute === "number" &&
				typeof offsetDirection === "string" &&
				(offsetDirection === OffsetDirection.plus || offsetDirection === OffsetDirection.minus)
			) {
				const newlyMadeTime = new TimeTZClass({
					hour: argument,
					minute,
					second,
					offset: {
						hour: offsetHour,
						minute: offsetMinute,
						direction: offsetDirection,
					},
				});
				if (/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)(\.\d{1,3})?[+-]([01]\d|2[0-3])(:([0-5]\d))?$/.test(newlyMadeTime.toString())) return newlyMadeTime;
				throw new Error("Invalid TimeTZ array, numbers and OffsetDirection");
			}
			throw new Error("Invalid TimeTZ array, numbers and OffsetDirection");
		} else if (argument instanceof DateTime || argument instanceof globalThis.Date) {
			argument = argument instanceof DateTime ? argument : DateTime.fromJSDate(argument);
			const isoString = argument.toISO().split("T")[1];
			return isoString.endsWith("Z") ? TimeTZ.from(`${isoString.slice(0, -1)}+00:00`) : TimeTZ.from(isoString);
		} else {
			if (
				!(
					typeof argument === "object" &&
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
				)
			)
				throw new Error("Invalid TimeTZ object");

			const newlyMadeTime = new TimeTZClass(argument);
			if (/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)(\.\d{1,3})?[+-]([01]\d|2[0-3])(:([0-5]\d))?$/.test(newlyMadeTime.toString())) return newlyMadeTime;

			throw new Error("Invalid TimeTZ object");
		}
	},
	isTimeTZ(object: any): object is TimeTZ {
		return object instanceof TimeTZClass;
	},
};

class TimeTZClass implements TimeTZ {
	private _hour: number;
	private _minute: number;
	private _second: number;
	private _offset: Offset;

	constructor(data: TimeTZObject) {
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

	private _format(): string {
		return `${this._prefix(this._hour)}:${this._prefix(this._minute)}:${this._prefix(this._second)}${this._formatOffset()}`;
	}

	private _formatOffset(): string {
		return `${this._offset.direction === OffsetDirection.minus ? "-" : "+"}${this._prefix(this._offset.hour)}:${this._prefix(this._offset.minute)}`;
	}

	toString(): string {
		return this._format();
	}

	toJSON(): TimeTZObject {
		return {
			hour: this._hour,
			minute: this._minute,
			second: this._second,
			offset: this._offset,
		};
	}

	equals(otherTimeTZ: string | TimeTZ | TimeTZObject): boolean {
		if (typeof otherTimeTZ === "string") return otherTimeTZ === this.toString();
		else if (TimeTZ.isTimeTZ(otherTimeTZ))
			return isISOEquivalent(`${DateTime.now().toISODate()}T${otherTimeTZ.toString()}`, `${DateTime.now().toISODate()}T${this.toString()}`);
		else {
			return (
				otherTimeTZ.hour === this._hour &&
				otherTimeTZ.minute === this._minute &&
				otherTimeTZ.second === this._second &&
				otherTimeTZ.offset.hour === this._offset.hour &&
				otherTimeTZ.offset.minute === this._offset.minute &&
				otherTimeTZ.offset.direction === this._offset.direction
			);
		}
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

	toDateTime(zone?: string | Zone | undefined): DateTime {
		return DateTime.fromISO(`${DateTime.now().toISODate()}T${this._format()}`).setZone(zone);
	}

	toJSDate(zone?: string | Zone | undefined): globalThis.Date {
		return this.toDateTime(zone).toJSDate();
	}
}

types.setTypeParser(DataType.timetz as any, parser(TimeTZ));
types.setTypeParser(DataType._timetz as any, arrayParser(TimeTZ, ","));

export { TimeTZ, TimeTZObject };
