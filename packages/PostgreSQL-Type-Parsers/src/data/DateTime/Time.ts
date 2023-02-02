import { DateTime, Zone } from "luxon";
import { types } from "pg";
import { DataType } from "postgresql-data-types";

import { arrayParser } from "../../util/arrayParser";
import { parser } from "../../util/parser";

interface TimeObject {
	hour: number;
	minute: number;
	second: number;
}

interface Time {
	toString(): string;
	toJSON(): TimeObject;
	equals(otherTime: string | Time | TimeObject): boolean;

	hour: number;
	minute: number;
	second: number;

	/**
	 * @param zone The zone to convert the time to. Defaults to 'local'.
	 */
	toDateTime(zone?: string | Zone | undefined): DateTime;

	/**
	 * @param zone The zone to convert the time to. Defaults to 'local'.
	 */
	toJSDate(zone?: string | Zone | undefined): globalThis.Date;
}

interface TimeConstructor {
	from(hour: number, minute: number, second: number): Time;
	from(data: Time | TimeObject | globalThis.Date | DateTime): Time;
	from(str: string): Time;
	/**
	 * Returns `true` if `obj` is a `Time`, `false` otherwise.
	 */
	isTime(obj: any): obj is Time;
}

const Time: TimeConstructor = {
	from(arg: string | Time | TimeObject | globalThis.Date | DateTime | number, minute?: number, second?: number): Time {
		if (typeof arg === "string") {
			if (arg.match(/^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])(\.[0-9]?[0-9]?[0-9])?$/)) {
				const [hour, minute, second] = arg.split(":").map(c => parseInt(c));
				return new TimeClass({
					hour,
					minute,
					second,
				});
			}
			throw new Error("Invalid Time string");
		} else if (Time.isTime(arg)) return new TimeClass(arg.toJSON());
		else if (typeof arg === "number") {
			if (typeof minute === "number" && typeof second === "number") {
				const newlyMadeTime = new TimeClass({
					hour: arg,
					minute,
					second,
				});
				if (newlyMadeTime.toString().match(/^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/)) return newlyMadeTime;
				throw new Error("Invalid Time array, numbers only");
			}
			throw new Error("Invalid Time array, numbers only");
		} else if (arg instanceof DateTime) {
			return new TimeClass({
				hour: arg.hour,
				minute: arg.minute,
				second: arg.second,
			});
		} else if (arg instanceof globalThis.Date) {
			return new TimeClass({
				hour: arg.getHours(),
				minute: arg.getMinutes(),
				second: arg.getSeconds(),
			});
		} else {
			if (
				!(
					typeof arg === "object" &&
					"hour" in arg &&
					typeof arg.hour === "number" &&
					"minute" in arg &&
					typeof arg.minute === "number" &&
					"second" in arg &&
					typeof arg.second === "number"
				)
			)
				throw new Error("Invalid Time object");

			const newlyMadeTime = new TimeClass(arg);
			if (newlyMadeTime.toString().match(/^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/)) return newlyMadeTime;

			throw new Error("Invalid Time object");
		}
	},
	isTime(obj: any): obj is Time {
		return obj instanceof TimeClass;
	},
};

class TimeClass implements Time {
	private _hour: number;
	private _minute: number;
	private _second: number;

	constructor(data: TimeObject) {
		this._hour = parseInt(data.hour.toString());
		this._minute = parseInt(data.minute.toString());
		this._second = parseInt(data.second.toString());
	}

	private _prefix(num: number): string {
		return num < 10 ? `0${num}` : `${num}`;
	}

	toString(): string {
		return `${this._prefix(this._hour)}:${this._prefix(this._minute)}:${this._prefix(this._second)}`;
	}

	toJSON(): TimeObject {
		return {
			hour: this._hour,
			minute: this._minute,
			second: this._second,
		};
	}

	equals(otherTime: string | Time | TimeObject): boolean {
		if (typeof otherTime === "string") return otherTime === this.toString();
		else if (Time.isTime(otherTime)) return otherTime.toString() === this.toString();
		else return otherTime.hour === this._hour && otherTime.minute === this._minute && otherTime.second === this._second;
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

	toDateTime(zone?: string | Zone | undefined): DateTime {
		return DateTime.fromObject(
			{
				hour: this._hour,
				minute: this._minute,
				second: this._second,
			},
			{ zone }
		);
	}

	toJSDate(zone?: string | Zone | undefined): globalThis.Date {
		return this.toDateTime(zone).toJSDate();
	}
}

types.setTypeParser(DataType.time as any, parser(Time));
types.setTypeParser(DataType._time as any, arrayParser(Time, ","));

export { Time, TimeObject };
