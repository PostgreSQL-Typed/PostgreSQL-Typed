import { DateTime, Zone } from "luxon";
import { types } from "pg";
import { DataType } from "postgresql-data-types";

import { Offset } from "../../types/Offset";
import { OffsetDirection, OffsetDirectionType } from "../../types/OffsetDirection";
import { arrayParser } from "../../util/arrayParser";
import { isISOEquivalent } from "../../util/isISOEquivalent";
import { parser } from "../../util/parser";
import { validateTimeZone } from "../../util/validateTimeZone";

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
	from(str: string): TimeTZ;
	/**
	 * Returns `true` if `obj` is a `TimeTZ`, `false` otherwise.
	 */
	isTimeTZ(obj: any): obj is TimeTZ;
}

const TimeTZ: TimeTZConstructor = {
	from(
		arg: string | TimeTZ | TimeTZObject | globalThis.Date | DateTime | number,
		minute?: number,
		second?: number,
		offsetHour?: number,
		offsetMinute?: number,
		offsetDirection?: OffsetDirection | OffsetDirectionType
	): TimeTZ {
		if (typeof arg === "string") {
			if (
				arg.match(
					/^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])(\.[0-9]?[0-9]?[0-9])?[+-]([0-1][0-9]|2[0-3])(:([0-5][0-9]))?(:([0-5][0-9]))?(\.[0-9]?[0-9]?[0-9])?$/
				)
			) {
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				const [, hour, minute, second, milisecond, offsetHour, , offsetMinute] = arg
					.match(
						/^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])(\.[0-9]?[0-9]?[0-9])?[+-]([0-1][0-9]|2[0-3])(:([0-5][0-9]))?(:([0-5][0-9]))?(\.[0-9]?[0-9]?[0-9])?$/
					)!
					.map(x => parseFloat(x));
				return new TimeTZClass({
					hour,
					minute,
					second: second + (milisecond || 0),
					offset: {
						hour: offsetHour,
						minute: offsetMinute || 0,
						direction: arg.includes("-") ? OffsetDirection.minus : OffsetDirection.plus,
					},
				});
			}

			if (arg.match(/^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])(\.[0-9]?[0-9]?[0-9])?\s((\/|\w)*)$/)) {
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				const matches = arg.match(/^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])(\.[0-9]?[0-9]?[0-9])?\s((\/|\w)*)$/)!,
					zone = matches[5],
					[hour, minute, second, milisecond] = matches.slice(1, 5).map(x => parseFloat(x)),
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
		} else if (TimeTZ.isTimeTZ(arg)) return new TimeTZClass(arg.toJSON());
		else if (typeof arg === "number") {
			if (
				typeof minute === "number" &&
				typeof second === "number" &&
				typeof offsetHour === "number" &&
				typeof offsetMinute === "number" &&
				typeof offsetDirection === "string" &&
				(offsetDirection === OffsetDirection.plus || offsetDirection === OffsetDirection.minus)
			) {
				const newlyMadeTime = new TimeTZClass({
					hour: arg,
					minute,
					second,
					offset: {
						hour: offsetHour,
						minute: offsetMinute,
						direction: offsetDirection,
					},
				});
				if (newlyMadeTime.toString().match(/^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])(\.[0-9]?[0-9]?[0-9])?[+-]([0-1][0-9]|2[0-3])(:([0-5][0-9]))?$/))
					return newlyMadeTime;
				throw new Error("Invalid TimeTZ array, numbers and OffsetDirection");
			}
			throw new Error("Invalid TimeTZ array, numbers and OffsetDirection");
		} else if (arg instanceof DateTime || arg instanceof globalThis.Date) {
			arg = arg instanceof DateTime ? arg : DateTime.fromJSDate(arg);
			const isoString = arg.toISO().split("T")[1];
			if (isoString.endsWith("Z")) return TimeTZ.from(`${isoString.slice(0, -1)}+00:00`);
			else return TimeTZ.from(isoString);
		} else {
			if (
				!(
					typeof arg === "object" &&
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
				)
			)
				throw new Error("Invalid TimeTZ object");

			const newlyMadeTime = new TimeTZClass(arg);
			if (newlyMadeTime.toString().match(/^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])(\.[0-9]?[0-9]?[0-9])?[+-]([0-1][0-9]|2[0-3])(:([0-5][0-9]))?$/))
				return newlyMadeTime;

			throw new Error("Invalid TimeTZ object");
		}
	},
	isTimeTZ(obj: any): obj is TimeTZ {
		return obj instanceof TimeTZClass;
	},
};

class TimeTZClass implements TimeTZ {
	private _hour: number;
	private _minute: number;
	private _second: number;
	private _offset: Offset;

	constructor(data: TimeTZObject) {
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
