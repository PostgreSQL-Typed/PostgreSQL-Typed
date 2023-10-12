import { getParsedType, hasKeys, INVALID, isOneOf, OK, ParsedType, type ParseReturnType } from "@postgresql-typed/util";
import { DateTime, Zone } from "luxon";

import { OffsetDirection } from "../../types/OffsetDirection.js";
import type { ParseContext } from "../../types/ParseContext.js";
import type { SafeEquals } from "../../types/SafeEquals.js";
import type { SafeFrom } from "../../types/SafeFrom.js";
import { isValidDate } from "../../util/isValidDate.js";
import { isValidDateTime } from "../../util/isValidDateTime.js";
import { pad } from "../../util/pad.js";
import { PgTPBase } from "../../util/PgTPBase.js";
import { PgTPConstructorBase } from "../../util/PgTPConstructorBase.js";
import { throwPgTPError } from "../../util/throwPgTPError.js";
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
	postgres: string;

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
	/**
	 * @returns The timestamp as a unix timestamp.
	 */
	toNumber(): number;
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
	equals(unixTimestamp: number): boolean;
	equals(year: number, month: number, day: number, hour: number, minute: number, second: number): boolean;
	equals(timestamp: Timestamp | globalThis.Date | DateTime): boolean;
	equals(object: TimestampObject): boolean;
	safeEquals(string: string): SafeEquals<Timestamp>;
	safeEquals(unixTimestamp: number): SafeEquals<Timestamp>;
	safeEquals(year: number, month: number, day: number, hour: number, minute: number, second: number): SafeEquals<Timestamp>;
	safeEquals(timestamp: Timestamp | globalThis.Date | DateTime): SafeEquals<Timestamp>;
	safeEquals(object: TimestampObject): SafeEquals<Timestamp>;
}

interface TimestampConstructor {
	from(string: string): Timestamp;
	from(unixTimestamp: number): Timestamp;
	from(year: number, month: number, day: number, hour: number, minute: number, second: number): Timestamp;
	from(timestamp: Timestamp | globalThis.Date | DateTime): Timestamp;
	from(object: TimestampObject): Timestamp;
	safeFrom(string: string): SafeFrom<Timestamp>;
	safeFrom(unixTimestamp: number): SafeFrom<Timestamp>;
	safeFrom(year: number, month: number, day: number, hour: number, minute: number, second: number): SafeFrom<Timestamp>;
	safeFrom(timestamp: Timestamp | globalThis.Date | DateTime): SafeFrom<Timestamp>;
	safeFrom(object: TimestampObject): SafeFrom<Timestamp>;
	/**
	 * Returns `true` if `object` is a `Timestamp`, `false` otherwise.
	 */
	isTimestamp(object: any): object is Timestamp;
}

class TimestampConstructorClass extends PgTPConstructorBase<Timestamp> implements TimestampConstructor {
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
							exact: true,
							maximum: 1,
							received: context.data.length,
							type: "arguments",
					  }
					: {
							code: "too_small",
							exact: true,
							minimum: 1,
							received: context.data.length,
							type: "arguments",
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
			expected: "LIKE YYYY-MM-DD HH:MM:SS",
			received: argument,
		});
		return INVALID;
	}

	private _parseNumber(context: ParseContext, argument: number, otherArguments: any[]): ParseReturnType<Timestamp> {
		const totalLength = otherArguments.length + 1;
		if (totalLength === 1) {
			return this._parseObject(
				context,
				DateTime.fromMillis(argument, {
					zone: "UTC",
				})
			);
		}

		if (totalLength !== 6) {
			this.setIssueForContext(
				context,
				totalLength > 6
					? {
							code: "too_big",
							exact: true,
							maximum: 6,
							received: totalLength,
							type: "arguments",
					  }
					: {
							code: "too_small",
							exact: true,
							minimum: 6,
							received: totalLength,
							type: "arguments",
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
				const [year, month, day, hour, minute, second, millisecond] = [
					jsDate.data.getFullYear(),
					jsDate.data.getMonth() + 1,
					jsDate.data.getDate(),
					jsDate.data.getHours(),
					jsDate.data.getMinutes(),
					jsDate.data.getSeconds(),
					jsDate.data.getMilliseconds(),
				];
				return this._parseString(
					context,
					`${pad(year, 4)}-${pad(month)}-${pad(day)} ${pad(hour)}:${pad(minute)}:${pad(second)}${millisecond === 0 ? "" : `.${pad(millisecond, 3)}`}`
				);
			}
			this.setIssueForContext(context, jsDate.error);
			return INVALID;
		}

		// Should be [luxon.DateTime]
		const luxonDate = isValidDateTime(argument);
		if (luxonDate.isOfSameType) {
			if (luxonDate.isValid) {
				const [year, month, day, hour, minute, second, millisecond] = [
					luxonDate.data.year,
					luxonDate.data.month,
					luxonDate.data.day,
					luxonDate.data.hour,
					luxonDate.data.minute,
					luxonDate.data.second,
					luxonDate.data.millisecond,
				];
				return this._parseString(
					context,
					`${pad(year, 4)}-${pad(month)}-${pad(day)} ${pad(hour)}:${pad(minute)}:${pad(second)}${millisecond === 0 ? "" : `.${pad(millisecond, 3)}`}`
				);
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
			throwPgTPError({
				code: "not_whole",
				received: year,
			});
		}

		if (month % 1 !== 0) {
			throwPgTPError({
				code: "not_whole",
				received: month,
			});
		}

		if (month < 1) {
			throwPgTPError({
				code: "too_small",
				inclusive: true,
				minimum: 1,
				received: month,
				type: "number",
			});
		}

		if (month > 12) {
			throwPgTPError({
				code: "too_big",
				inclusive: true,
				maximum: 12,
				received: month,
				type: "number",
			});
		}

		if (day % 1 !== 0) {
			throwPgTPError({
				code: "not_whole",
				received: day,
			});
		}

		if (day < 1) {
			throwPgTPError({
				code: "too_small",
				inclusive: true,
				minimum: 1,
				received: day,
				type: "number",
			});
		}

		if (day > 31) {
			throwPgTPError({
				code: "too_big",
				inclusive: true,
				maximum: 31,
				received: day,
				type: "number",
			});
		}

		if (hour % 1 !== 0) {
			this.setIssueForContext(context, {
				code: "not_whole",
				received: hour,
			});
			return INVALID;
		}

		if (hour < 0) {
			this.setIssueForContext(context, {
				code: "too_small",
				inclusive: true,
				minimum: 0,
				received: hour,
				type: "number",
			});
			return INVALID;
		}

		if (hour > 23) {
			this.setIssueForContext(context, {
				code: "too_big",
				inclusive: true,
				maximum: 23,
				received: hour,
				type: "number",
			});
			return INVALID;
		}

		if (minute % 1 !== 0) {
			this.setIssueForContext(context, {
				code: "not_whole",
				received: minute,
			});
			return INVALID;
		}

		if (minute < 0) {
			this.setIssueForContext(context, {
				code: "too_small",
				inclusive: true,
				minimum: 0,
				received: minute,
				type: "number",
			});
			return INVALID;
		}

		if (minute > 59) {
			this.setIssueForContext(context, {
				code: "too_big",
				inclusive: true,
				maximum: 59,
				received: minute,
				type: "number",
			});
			return INVALID;
		}

		if (second < 0) {
			this.setIssueForContext(context, {
				code: "too_small",
				inclusive: true,
				minimum: 0,
				received: second,
				type: "number",
			});
			return INVALID;
		}

		if (second >= 60) {
			this.setIssueForContext(context, {
				code: "too_big",
				inclusive: true,
				maximum: 59,
				received: second,
				type: "number",
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

class TimestampClass extends PgTPBase<Timestamp> implements Timestamp {
	constructor(
		private _year: number,
		private _month: number,
		private _day: number,
		private _hour: number,
		private _minute: number,
		private _second: number
	) {
		super();
	}

	_equals(context: ParseContext): ParseReturnType<{ readonly equals: boolean; readonly data: Timestamp }> {
		//@ts-expect-error - _equals receives the same context as _parse
		const parsed = Timestamp.safeFrom(...context.data);
		if (parsed.success) {
			return OK({
				data: parsed.data,
				equals: parsed.data.toString() === this.toString(),
			});
		}
		this.setIssueForContext(context, parsed.error.issue);
		return INVALID;
	}

	toString(style: TimestampStyle | TimestampStyleType = TimestampStyle.ISO): string {
		const asTimestampTZ = TimestampTZ.from({
			day: this._day,
			hour: this._hour,
			minute: this._minute,
			month: this._month,
			offset: {
				direction: OffsetDirection.plus,
				hour: 0,
				minute: 0,
			},
			second: this._second,
			year: this._year,
		});
		return asTimestampTZ.toString(style);
	}

	toNumber(): number {
		return this.toDateTime("UTC").toMillis();
	}

	toJSON(): TimestampObject {
		return {
			day: this._day,
			hour: this._hour,
			minute: this._minute,
			month: this._month,
			second: this._second,
			year: this._year,
		};
	}

	toDate(): Date {
		return Date.from({
			day: this._day,
			month: this._month,
			year: this._year,
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
		const millisecond = Math.round((this._second % 1) * 1000);
		return DateTime.fromObject(
			{
				day: this._day,
				hour: this._hour,
				millisecond: millisecond >= 1000 ? 999 : millisecond,
				minute: this._minute,
				month: this._month,
				second: Math.trunc(this._second),
				year: this._year,
			},
			{ zone }
		);
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
			throwPgTPError({
				code: "invalid_type",
				expected: [ParsedType.number],
				received: parsedType,
			});
		}

		if (year % 1 !== 0) {
			throwPgTPError({
				code: "not_whole",
				received: year,
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
			throwPgTPError({
				code: "invalid_type",
				expected: [ParsedType.number],
				received: parsedType,
			});
		}

		if (month % 1 !== 0) {
			throwPgTPError({
				code: "not_whole",
				received: month,
			});
		}

		if (month < 1) {
			throwPgTPError({
				code: "too_small",
				inclusive: true,
				minimum: 1,
				received: month,
				type: "number",
			});
		}

		if (month > 12) {
			throwPgTPError({
				code: "too_big",
				inclusive: true,
				maximum: 12,
				received: month,
				type: "number",
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
			throwPgTPError({
				code: "invalid_type",
				expected: [ParsedType.number],
				received: parsedType,
			});
		}

		if (day % 1 !== 0) {
			throwPgTPError({
				code: "not_whole",
				received: day,
			});
		}

		if (day < 1) {
			throwPgTPError({
				code: "too_small",
				inclusive: true,
				minimum: 1,
				received: day,
				type: "number",
			});
		}

		if (day > 31) {
			throwPgTPError({
				code: "too_big",
				inclusive: true,
				maximum: 31,
				received: day,
				type: "number",
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
			throwPgTPError({
				code: "invalid_type",
				expected: [ParsedType.number],
				received: parsedType,
			});
		}

		if (hour % 1 !== 0) {
			throwPgTPError({
				code: "not_whole",
				received: hour,
			});
		}

		if (hour < 0) {
			throwPgTPError({
				code: "too_small",
				inclusive: true,
				minimum: 0,
				received: hour,
				type: "number",
			});
		}

		if (hour > 23) {
			throwPgTPError({
				code: "too_big",
				inclusive: true,
				maximum: 23,
				received: hour,
				type: "number",
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
			throwPgTPError({
				code: "invalid_type",
				expected: [ParsedType.number],
				received: parsedType,
			});
		}

		if (minute % 1 !== 0) {
			throwPgTPError({
				code: "not_whole",
				received: minute,
			});
		}

		if (minute < 0) {
			throwPgTPError({
				code: "too_small",
				inclusive: true,
				minimum: 0,
				received: minute,
				type: "number",
			});
		}

		if (minute > 59) {
			throwPgTPError({
				code: "too_big",
				inclusive: true,
				maximum: 59,
				received: minute,
				type: "number",
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
			throwPgTPError({
				code: "invalid_type",
				expected: [ParsedType.number],
				received: parsedType,
			});
		}

		if (second < 0) {
			throwPgTPError({
				code: "too_small",
				inclusive: true,
				minimum: 0,
				received: second,
				type: "number",
			});
		}

		if (second >= 60) {
			throwPgTPError({
				code: "too_big",
				inclusive: true,
				maximum: 59,
				received: second,
				type: "number",
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

	get postgres(): string {
		return this.toString();
	}

	set postgres(timestamp: string) {
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
