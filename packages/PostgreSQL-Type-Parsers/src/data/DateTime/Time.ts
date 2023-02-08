import { DateTime, Zone } from "luxon";
import { types } from "pg";
import { DataType } from "postgresql-data-types";

import { arrayParser } from "../../util/arrayParser.js";
import { parser } from "../../util/parser.js";

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
	from(string: string): Time;
	/**
	 * Returns `true` if `object` is a `Time`, `false` otherwise.
	 */
	isTime(object: any): object is Time;
}

const Time: TimeConstructor = {
	from(argument: string | Time | TimeObject | globalThis.Date | DateTime | number, minute?: number, second?: number): Time {
		if (typeof argument === "string") {
			if (/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)(\.\d{1,3})?$/.test(argument)) {
				const [hour, minute, second] = argument.split(":").map(c => Number.parseInt(c));
				return new TimeClass({
					hour,
					minute,
					second,
				});
			}
			throw new Error("Invalid Time string");
		} else if (Time.isTime(argument)) return new TimeClass(argument.toJSON());
		else if (typeof argument === "number") {
			if (typeof minute === "number" && typeof second === "number") {
				const newlyMadeTime = new TimeClass({
					hour: argument,
					minute,
					second,
				});
				if (/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(newlyMadeTime.toString())) return newlyMadeTime;
				throw new Error("Invalid Time array, numbers only");
			}
			throw new Error("Invalid Time array, numbers only");
		} else if (argument instanceof DateTime) {
			return new TimeClass({
				hour: argument.hour,
				minute: argument.minute,
				second: argument.second,
			});
		} else if (argument instanceof globalThis.Date) {
			return new TimeClass({
				hour: argument.getHours(),
				minute: argument.getMinutes(),
				second: argument.getSeconds(),
			});
		} else {
			if (
				!(
					typeof argument === "object" &&
					"hour" in argument &&
					typeof argument.hour === "number" &&
					"minute" in argument &&
					typeof argument.minute === "number" &&
					"second" in argument &&
					typeof argument.second === "number"
				)
			)
				throw new Error("Invalid Time object");

			const newlyMadeTime = new TimeClass(argument);
			if (/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(newlyMadeTime.toString())) return newlyMadeTime;

			throw new Error("Invalid Time object");
		}
	},
	isTime(object: any): object is Time {
		return object instanceof TimeClass;
	},
};

class TimeClass implements Time {
	private _hour: number;
	private _minute: number;
	private _second: number;

	constructor(data: TimeObject) {
		this._hour = Number.parseInt(data.hour.toString());
		this._minute = Number.parseInt(data.minute.toString());
		this._second = Number.parseInt(data.second.toString());
	}

	private _prefix(number: number): string {
		return number < 10 ? `0${number}` : `${number}`;
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
