import { getParsedType, hasKeys, INVALID, isOneOf, OK, ParsedType, type ParseReturnType } from "@postgresql-typed/util";
import { DateTime, Zone } from "luxon";

import { OffsetDirection } from "../../types/OffsetDirection.js";
import type { ParseContext } from "../../types/ParseContext.js";
import type { SafeEquals } from "../../types/SafeEquals.js";
import type { SafeFrom } from "../../types/SafeFrom.js";
import { isValidDate } from "../../util/isValidDate.js";
import { isValidDateTime } from "../../util/isValidDateTime.js";
import { pad } from "../../util/pad.js";
import { PGTPBase } from "../../util/PGTPBase.js";
import { PGTPConstructorBase } from "../../util/PGTPConstructorBase.js";
import { throwPGTPError } from "../../util/throwPGTPError.js";
import { Date } from "./Date.js";
import { Time } from "./Time.js";
import { TimestampStyle, TimestampStyleType, TimestampTZ } from "./TimestampTZ.js";

interface TimestampObject {
	year: number;
	month: number;
	day: number;
	hour: number;
	minute: number;
	second: number;
}

interface Timestamp {
	year: number;
	month: number;
	day: number;
	hour: number;
	minute: number;
	second: number;

	value: string;

	/**
	 * @param style The style to use when converting the timestamp to a string. Defaults to `ISO`.
	 * @returns The timestamp as a string.
	 * @example
	 * const timestamp = Timestamp.from("01-01-2023 20:00:23.123456");
	 *
	 * timestamp.toString(); // "2023-01-01T20:00:23.123456Z"
	 * timestamp.toString("ISO"); // "2023-01-01T20:00:23.123456Z"
	 * timestamp.toString("ISO-Date"); // "2023-01-01"
	 * timestamp.toString("ISO-Time"); // "20:00:23.123456"
	 * timestamp.toString("ISO-Duration"); // "P2023Y1M1DT20H0M23.123456S"
	 * timestamp.toString("ISO-Duration-Short"); // "P2023Y1M1DT20H23.123456S"
	 * timestamp.toString("ISO-Duration-Basic"); // "P20230101T200023.123456S"
	 * timestamp.toString("ISO-Duration-Extended"); // "P2023-01-01T20:00:23.123456S"
	 * timestamp.toString("POSIX"); // "2023-01-01 20:00:23.123456"
	 * timestamp.toString("PostgreSQL"); // "Sunday January 01 2023 20:00:23.123456"
	 * timestamp.toString("PostgreSQL-Short"); // "Sun Jan 01 2023 20:00:23.123456"
	 * timestamp.toString("SQL"); // "2023-01 01 20:00:23.123456"
	 */
	toString(style?: TimestampStyle | TimestampStyleType): string;
	toJSON(): TimestampObject;

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

	equals(string: string): boolean;
	equals(year: number, month: number, day: number, hour: number, minute: number, second: number): boolean;
	equals(timestamp: Timestamp | globalThis.Date | DateTime): boolean;
	equals(object: TimestampObject): boolean;
	safeEquals(string: string): SafeEquals<Timestamp>;
	safeEquals(year: number, month: number, day: number, hour: number, minute: number, second: number): SafeEquals<Timestamp>;
	safeEquals(timestamp: Timestamp | globalThis.Date | DateTime): SafeEquals<Timestamp>;
	safeEquals(object: TimestampObject): SafeEquals<Timestamp>;
}

interface TimestampConstructor {
	from(string: string): Timestamp;
	from(year: number, month: number, day: number, hour: number, minute: number, second: number): Timestamp;
	from(timestamp: Timestamp | globalThis.Date | DateTime): Timestamp;
	from(object: TimestampObject): Timestamp;
	safeFrom(string: string): SafeFrom<Timestamp>;
	safeFrom(year: number, month: number, day: number, hour: number, minute: number, second: number): SafeFrom<Timestamp>;
	safeFrom(timestamp: Timestamp | globalThis.Date | DateTime): SafeFrom<Timestamp>;
	safeFrom(object: TimestampObject): SafeFrom<Timestamp>;
	/**
	 * Returns `true` if `object` is a `Timestamp`, `false` otherwise.
	 */
	isTimestamp(object: any): object is Timestamp;
}

class TimestampConstructorClass extends PGTPConstructorBase<Timestamp> implements TimestampConstructor {
	constructor() {
		super();
	}

	_parse(context: ParseContext): ParseReturnType<Timestamp> {
		const [argument, ...otherArguments] = context.data,
			allowedTypes = [ParsedType.number, ParsedType.string, ParsedType.object, ParsedType["globalThis.Date"], ParsedType["luxon.DateTime"]],
			parsedType = getParsedType(argument);

		if (parsedType !== ParsedType.number && context.data.length !== 1) {
			this.setIssueForContext(
				context,
				context.data.length > 1
					? {
							code: "too_big",
							type: "arguments",
							maximum: 1,
							exact: true,
					  }
					: {
							code: "too_small",
							type: "arguments",
							minimum: 1,
							exact: true,
					  }
			);
			return INVALID;
		}

		if (!isOneOf(allowedTypes, parsedType)) {
			this.setIssueForContext(context, {
				code: "invalid_type",
				expected: allowedTypes as ParsedType[],
				received: parsedType,
			});
			return INVALID;
		}

		switch (parsedType) {
			case "string":
				return this._parseString(context, argument as string);
			case "number":
				return this._parseNumber(context, argument as number, otherArguments);
			default:
				return this._parseObject(context, argument as object);
		}
	}

	private _parseString(context: ParseContext, argument: string): ParseReturnType<Timestamp> {
		const parsedTimestamp = TimestampTZ.safeFrom(argument);
		if (parsedTimestamp.success) {
			return OK(
				new TimestampClass(
					parsedTimestamp.data.year,
					parsedTimestamp.data.month,
					parsedTimestamp.data.day,
					parsedTimestamp.data.hour,
					parsedTimestamp.data.minute,
					parsedTimestamp.data.second
				)
			);
		}
		this.setIssueForContext(context, {
			code: "invalid_string",
			received: argument,
			expected: "LIKE YYYY-MM-DD HH:MM:SS",
		});
		return INVALID;
	}

	private _parseNumber(context: ParseContext, argument: number, otherArguments: any[]): ParseReturnType<Timestamp> {
		const totalLength = otherArguments.length + 1;
		if (totalLength !== 6) {
			this.setIssueForContext(
				context,
				totalLength > 6
					? {
							code: "too_big",
							type: "arguments",
							maximum: 6,
							exact: true,
					  }
					: {
							code: "too_small",
							type: "arguments",
							minimum: 6,
							exact: true,
					  }
			);
			return INVALID;
		}

		for (const otherArgument of otherArguments) {
			const allowedTypes = [ParsedType.number],
				parsedType = getParsedType(otherArgument);

			if (!isOneOf(allowedTypes, parsedType)) {
				this.setIssueForContext(context, {
					code: "invalid_type",
					expected: allowedTypes as ParsedType[],
					received: parsedType,
				});
				return INVALID;
			}
		}

		const [year, month, day, hour, minute, second] = [argument, ...otherArguments] as number[];
		return this._parseString(context, `${pad(year, 4)}-${pad(month)}-${pad(day)} ${pad(hour)}:${pad(minute)}:${pad(second)}`);
	}

	private _parseObject(context: ParseContext, argument: object): ParseReturnType<Timestamp> {
		// Should be [Timestamp]
		if (Timestamp.isTimestamp(argument))
			return OK(new TimestampClass(argument.year, argument.month, argument.day, argument.hour, argument.minute, argument.second));

		// Should be [globalThis.Date]
		const jsDate = isValidDate(argument);
		if (jsDate.isOfSameType) {
			if (jsDate.isValid) {
				const [year, month, day, hour, minute, second] = [
					jsDate.data.getFullYear(),
					jsDate.data.getMonth() + 1,
					jsDate.data.getDate(),
					jsDate.data.getHours(),
					jsDate.data.getMinutes(),
					jsDate.data.getSeconds(),
				];
				return this._parseString(context, `${pad(year, 4)}-${pad(month)}-${pad(day)} ${pad(hour)}:${pad(minute)}:${pad(second)}`);
			}
			this.setIssueForContext(context, jsDate.error);
			return INVALID;
		}

		// Should be [luxon.DateTime]
		const luxonDate = isValidDateTime(argument);
		if (luxonDate.isOfSameType) {
			if (luxonDate.isValid) {
				const [year, month, day, hour, minute, second] = [
					luxonDate.data.year,
					luxonDate.data.month,
					luxonDate.data.day,
					luxonDate.data.hour,
					luxonDate.data.minute,
					luxonDate.data.second,
				];
				return this._parseString(context, `${pad(year, 4)}-${pad(month)}-${pad(day)} ${pad(hour)}:${pad(minute)}:${pad(second)}`);
			}
			this.setIssueForContext(context, luxonDate.error);
			return INVALID;
		}

		// Should be [TimeObject]
		const parsedObject = hasKeys<TimestampObject>(argument, [
			["year", "number"],
			["month", "number"],
			["day", "number"],
			["hour", "number"],
			["minute", "number"],
			["second", "number"],
		]);
		if (!parsedObject.success) {
			switch (true) {
				case parsedObject.otherKeys.length > 0:
					this.setIssueForContext(context, {
						code: "unrecognized_keys",
						keys: parsedObject.otherKeys,
					});
					break;
				case parsedObject.missingKeys.length > 0:
					this.setIssueForContext(context, {
						code: "missing_keys",
						keys: parsedObject.missingKeys,
					});
					break;
				case parsedObject.invalidKeys.length > 0:
					this.setIssueForContext(context, {
						code: "invalid_key_type",
						...parsedObject.invalidKeys[0],
					});
					break;
			}
			return INVALID;
		}

		const { year, month, day, hour, minute, second } = parsedObject.obj;

		if (year % 1 !== 0) {
			throwPGTPError({
				code: "not_whole",
			});
		}

		if (month % 1 !== 0) {
			throwPGTPError({
				code: "not_whole",
			});
		}

		if (month < 1) {
			throwPGTPError({
				code: "too_small",
				minimum: 1,
				type: "number",
				inclusive: true,
			});
		}

		if (month > 12) {
			throwPGTPError({
				code: "too_big",
				maximum: 12,
				type: "number",
				inclusive: true,
			});
		}

		if (day % 1 !== 0) {
			throwPGTPError({
				code: "not_whole",
			});
		}

		if (day < 1) {
			throwPGTPError({
				code: "too_small",
				minimum: 1,
				type: "number",
				inclusive: true,
			});
		}

		if (day > 31) {
			throwPGTPError({
				code: "too_big",
				maximum: 31,
				type: "number",
				inclusive: true,
			});
		}

		if (hour % 1 !== 0) {
			this.setIssueForContext(context, {
				code: "not_whole",
			});
			return INVALID;
		}

		if (hour < 0) {
			this.setIssueForContext(context, {
				code: "too_small",
				minimum: 0,
				type: "number",
				inclusive: true,
			});
			return INVALID;
		}

		if (hour > 23) {
			this.setIssueForContext(context, {
				code: "too_big",
				maximum: 23,
				type: "number",
				inclusive: true,
			});
			return INVALID;
		}

		if (minute % 1 !== 0) {
			this.setIssueForContext(context, {
				code: "not_whole",
			});
			return INVALID;
		}

		if (minute < 0) {
			this.setIssueForContext(context, {
				code: "too_small",
				minimum: 0,
				type: "number",
				inclusive: true,
			});
			return INVALID;
		}

		if (minute > 59) {
			this.setIssueForContext(context, {
				code: "too_big",
				maximum: 59,
				type: "number",
				inclusive: true,
			});
			return INVALID;
		}

		if (second < 0) {
			this.setIssueForContext(context, {
				code: "too_small",
				minimum: 0,
				type: "number",
				inclusive: true,
			});
			return INVALID;
		}

		if (second >= 60) {
			this.setIssueForContext(context, {
				code: "too_big",
				maximum: 59,
				type: "number",
				inclusive: true,
			});
			return INVALID;
		}

		return OK(new TimestampClass(year, month, day, hour, minute, second));
	}

	isTimestamp(object: any): object is Timestamp {
		return object instanceof TimestampClass;
	}
}

const Timestamp: TimestampConstructor = new TimestampConstructorClass();

class TimestampClass extends PGTPBase<Timestamp> implements Timestamp {
	constructor(private _year: number, private _month: number, private _day: number, private _hour: number, private _minute: number, private _second: number) {
		super();
	}

	_equals(context: ParseContext): ParseReturnType<{ readonly equals: boolean; readonly data: Timestamp }> {
		//@ts-expect-error - _equals receives the same context as _parse
		const parsed = Timestamp.safeFrom(...context.data);
		if (parsed.success) {
			return OK({
				equals: parsed.data.toString() === this.toString(),
				data: parsed.data,
			});
		}
		this.setIssueForContext(context, parsed.error.issue);
		return INVALID;
	}

	toString(style: TimestampStyle | TimestampStyleType = TimestampStyle.ISO): string {
		const asTimestampTZ = TimestampTZ.from({
			year: this._year,
			month: this._month,
			day: this._day,
			hour: this._hour,
			minute: this._minute,
			second: this._second,
			offset: {
				direction: OffsetDirection.plus,
				hour: 0,
				minute: 0,
			},
		});
		return asTimestampTZ.toString(style);
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
		return DateTime.fromISO(this.toString()).setZone(zone);
	}

	toJSDate(zone?: string | Zone | undefined): globalThis.Date {
		return this.toDateTime(zone).toJSDate();
	}

	get year(): number {
		return this._year;
	}

	set year(year: number) {
		const parsedType = getParsedType(year);
		if (parsedType !== ParsedType.number) {
			throwPGTPError({
				code: "invalid_type",
				expected: [ParsedType.number],
				received: parsedType,
			});
		}

		if (year % 1 !== 0) {
			throwPGTPError({
				code: "not_whole",
			});
		}

		this._year = year;
	}

	get month(): number {
		return this._month;
	}

	set month(month: number) {
		const parsedType = getParsedType(month);
		if (parsedType !== ParsedType.number) {
			throwPGTPError({
				code: "invalid_type",
				expected: [ParsedType.number],
				received: parsedType,
			});
		}

		if (month % 1 !== 0) {
			throwPGTPError({
				code: "not_whole",
			});
		}

		if (month < 1) {
			throwPGTPError({
				code: "too_small",
				minimum: 1,
				type: "number",
				inclusive: true,
			});
		}

		if (month > 12) {
			throwPGTPError({
				code: "too_big",
				maximum: 12,
				type: "number",
				inclusive: true,
			});
		}

		this._month = month;
	}

	get day(): number {
		return this._day;
	}

	set day(day: number) {
		const parsedType = getParsedType(day);
		if (parsedType !== ParsedType.number) {
			throwPGTPError({
				code: "invalid_type",
				expected: [ParsedType.number],
				received: parsedType,
			});
		}

		if (day % 1 !== 0) {
			throwPGTPError({
				code: "not_whole",
			});
		}

		if (day < 1) {
			throwPGTPError({
				code: "too_small",
				minimum: 1,
				type: "number",
				inclusive: true,
			});
		}

		if (day > 31) {
			throwPGTPError({
				code: "too_big",
				maximum: 31,
				type: "number",
				inclusive: true,
			});
		}

		this._day = day;
	}

	get hour(): number {
		return this._hour;
	}

	set hour(hour: number) {
		const parsedType = getParsedType(hour);
		if (parsedType !== ParsedType.number) {
			throwPGTPError({
				code: "invalid_type",
				expected: [ParsedType.number],
				received: parsedType,
			});
		}

		if (hour % 1 !== 0) {
			throwPGTPError({
				code: "not_whole",
			});
		}

		if (hour < 0) {
			throwPGTPError({
				code: "too_small",
				minimum: 0,
				type: "number",
				inclusive: true,
			});
		}

		if (hour > 23) {
			throwPGTPError({
				code: "too_big",
				maximum: 23,
				type: "number",
				inclusive: true,
			});
		}

		this._hour = hour;
	}

	get minute(): number {
		return this._minute;
	}

	set minute(minute: number) {
		const parsedType = getParsedType(minute);
		if (parsedType !== ParsedType.number) {
			throwPGTPError({
				code: "invalid_type",
				expected: [ParsedType.number],
				received: parsedType,
			});
		}

		if (minute % 1 !== 0) {
			throwPGTPError({
				code: "not_whole",
			});
		}

		if (minute < 0) {
			throwPGTPError({
				code: "too_small",
				minimum: 0,
				type: "number",
				inclusive: true,
			});
		}

		if (minute > 59) {
			throwPGTPError({
				code: "too_big",
				maximum: 59,
				type: "number",
				inclusive: true,
			});
		}

		this._minute = minute;
	}

	get second(): number {
		return this._second;
	}

	set second(second: number) {
		const parsedType = getParsedType(second);
		if (parsedType !== ParsedType.number) {
			throwPGTPError({
				code: "invalid_type",
				expected: [ParsedType.number],
				received: parsedType,
			});
		}

		if (second < 0) {
			throwPGTPError({
				code: "too_small",
				minimum: 0,
				type: "number",
				inclusive: true,
			});
		}

		if (second >= 60) {
			throwPGTPError({
				code: "too_big",
				maximum: 59,
				type: "number",
				inclusive: true,
			});
		}

		this._second = second;
	}

	get value(): string {
		return this.toString();
	}

	set value(timestamp: string) {
		const parsed = Timestamp.safeFrom(timestamp);
		if (parsed.success) {
			this._year = parsed.data.year;
			this._month = parsed.data.month;
			this._day = parsed.data.day;
			this._hour = parsed.data.hour;
			this._minute = parsed.data.minute;
			this._second = parsed.data.second;
		} else throw parsed.error;
	}
}

export { Timestamp, TimestampConstructor, TimestampObject };
