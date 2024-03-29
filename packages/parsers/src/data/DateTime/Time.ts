import { getParsedType, hasKeys, INVALID, isOneOf, OK, ParsedType, type ParseReturnType } from "@postgresql-typed/util";
import { DateTime, Zone } from "luxon";

import type { ParseContext } from "../../types/ParseContext.js";
import type { SafeEquals } from "../../types/SafeEquals.js";
import type { SafeFrom } from "../../types/SafeFrom.js";
import { isValidDate } from "../../util/isValidDate.js";
import { isValidDateTime } from "../../util/isValidDateTime.js";
import { pad } from "../../util/pad.js";
import { PgTPBase } from "../../util/PgTPBase.js";
import { PgTPConstructorBase } from "../../util/PgTPConstructorBase.js";
import { throwPgTPError } from "../../util/throwPgTPError.js";
import { TimestampTZ } from "./TimestampTZ.js";

interface TimeObject {
	hour: number;
	minute: number;
	second: number;
}

interface Time {
	hour: number;
	minute: number;
	second: number;

	value: string;
	postgres: string;

	toString(): string;
	toNumber(): number;
	toJSON(): TimeObject;

	/**
	 * @param zone The zone to convert the time to. Defaults to 'local'.
	 */
	toDateTime(zone?: string | Zone | undefined): DateTime;

	/**
	 * @param zone The zone to convert the time to. Defaults to 'local'.
	 */
	toJSDate(zone?: string | Zone | undefined): globalThis.Date;

	equals(string: string): boolean;
	equals(unixTimestamp: number): boolean;
	equals(hour: number, minute: number, second: number): boolean;
	equals(time: Time | globalThis.Date | DateTime): boolean;
	equals(object: TimeObject): boolean;
	safeEquals(string: string): SafeEquals<Time>;
	safeEquals(unixTimestamp: number): SafeEquals<Time>;
	safeEquals(hour: number, minute: number, second: number): SafeEquals<Time>;
	safeEquals(time: Time | globalThis.Date | DateTime): SafeEquals<Time>;
	safeEquals(object: TimeObject): SafeEquals<Time>;
}

interface TimeConstructor {
	from(string: string): Time;
	from(unixTimestamp: number): Time;
	from(hour: number, minute: number, second: number): Time;
	from(time: Time | globalThis.Date | DateTime): Time;
	from(object: TimeObject): Time;
	safeFrom(string: string): SafeFrom<Time>;
	safeFrom(unixTimestamp: number): SafeFrom<Time>;
	safeFrom(hour: number, minute: number, second: number): SafeFrom<Time>;
	safeFrom(time: Time | globalThis.Date | DateTime): SafeFrom<Time>;
	safeFrom(object: TimeObject): SafeFrom<Time>;
	/**
	 * Returns `true` if `object` is a `Time`, `false` otherwise.
	 */
	isTime(object: any): object is Time;
}

class TimeConstructorClass extends PgTPConstructorBase<Time> implements TimeConstructor {
	constructor() {
		super();
	}

	_parse(context: ParseContext): ParseReturnType<Time> {
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

	private _parseString(context: ParseContext, argument: string): ParseReturnType<Time> {
		const parsedTimestamp = TimestampTZ.safeFrom(argument);
		if (parsedTimestamp.success) return OK(new TimeClass(parsedTimestamp.data.hour, parsedTimestamp.data.minute, parsedTimestamp.data.second));

		this.setIssueForContext(context, {
			code: "invalid_string",
			expected: "LIKE HH:MM:SS",
			received: argument,
		});
		return INVALID;
	}

	private _parseNumber(context: ParseContext, argument: number, otherArguments: any[]): ParseReturnType<Time> {
		const totalLength = otherArguments.length + 1;
		if (totalLength === 1) {
			return this._parseObject(
				context,
				DateTime.fromMillis(argument, {
					zone: "UTC",
				})
			);
		}

		if (totalLength !== 3) {
			this.setIssueForContext(
				context,
				totalLength > 3
					? {
							code: "too_big",
							exact: true,
							maximum: 3,
							received: totalLength,
							type: "arguments",
					  }
					: {
							code: "too_small",
							exact: true,
							minimum: 3,
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

		const [hour, minute, second] = [argument, ...otherArguments] as number[];
		return this._parseString(context, `${pad(hour)}:${pad(minute)}:${pad(second)}`);
	}

	private _parseObject(context: ParseContext, argument: object): ParseReturnType<Time> {
		// Should be [Time]
		if (Time.isTime(argument)) return OK(new TimeClass(argument.hour, argument.minute, argument.second));

		// Should be [globalThis.Date]
		const jsDate = isValidDate(argument);
		if (jsDate.isOfSameType) {
			if (jsDate.isValid) {
				const [hour, minute, second] = [jsDate.data.getHours(), jsDate.data.getMinutes(), jsDate.data.getSeconds()];
				return this._parseString(context, `${pad(hour)}:${pad(minute)}:${pad(second)}`);
			}
			this.setIssueForContext(context, jsDate.error);
			return INVALID;
		}

		// Should be [luxon.DateTime]
		const luxonDate = isValidDateTime(argument);
		if (luxonDate.isOfSameType) {
			if (luxonDate.isValid) {
				const [hour, minute, second] = [luxonDate.data.hour, luxonDate.data.minute, luxonDate.data.second];
				return this._parseString(context, `${pad(hour)}:${pad(minute)}:${pad(second)}`);
			}
			this.setIssueForContext(context, luxonDate.error);
			return INVALID;
		}

		// Should be [TimeObject]
		const parsedObject = hasKeys<TimeObject>(argument, [
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

		const { hour, minute, second } = parsedObject.obj;

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

		return OK(new TimeClass(hour, minute, second));
	}

	isTime(object: any): object is Time {
		return object instanceof TimeClass;
	}
}

const Time: TimeConstructor = new TimeConstructorClass();

class TimeClass extends PgTPBase<Time> implements Time {
	constructor(
		private _hour: number,
		private _minute: number,
		private _second: number
	) {
		super();
	}

	_equals(context: ParseContext): ParseReturnType<{ readonly equals: boolean; readonly data: Time }> {
		//@ts-expect-error - _equals receives the same context as _parse
		const parsed = Time.safeFrom(...context.data);
		if (parsed.success) {
			return OK({
				data: parsed.data,
				equals: parsed.data.toString() === this.toString(),
			});
		}
		this.setIssueForContext(context, parsed.error.issue);
		return INVALID;
	}

	toString(): string {
		return `${pad(this._hour)}:${pad(this._minute)}:${pad(this._second)}`;
	}

	toNumber(): number {
		const todayUnix = DateTime.now().setZone("UTC").startOf("day").toMillis();
		return this.toDateTime("UTC").toMillis() - todayUnix;
	}

	toJSON(): TimeObject {
		return {
			hour: this._hour,
			minute: this._minute,
			second: this._second,
		};
	}

	toDateTime(zone?: string | Zone | undefined): DateTime {
		const millisecond = Math.round((this._second % 1) * 1000);
		return DateTime.fromObject(
			{
				hour: this._hour,
				millisecond: millisecond >= 1000 ? 999 : millisecond,
				minute: this._minute,
				second: Math.trunc(this._second),
			},
			{ zone }
		);
	}

	toJSDate(zone?: string | Zone | undefined): globalThis.Date {
		return this.toDateTime(zone).toJSDate();
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

	set value(time: string) {
		const parsed = Time.safeFrom(time);
		if (parsed.success) {
			this._hour = parsed.data.hour;
			this._minute = parsed.data.minute;
			this._second = parsed.data.second;
		} else throw parsed.error;
	}

	get postgres(): string {
		return this.toString();
	}

	set postgres(time: string) {
		const parsed = Time.safeFrom(time);
		if (parsed.success) {
			this._hour = parsed.data.hour;
			this._minute = parsed.data.minute;
			this._second = parsed.data.second;
		} else throw parsed.error;
	}
}

export { Time, TimeConstructor, TimeObject };
