/* eslint-disable unicorn/filename-case */
import { getParsedType, hasKeys, INVALID, isOneOf, OK, ParsedType, type ParseReturnType } from "@postgresql-typed/util";
import { DateTime, Zone } from "luxon";

import { Offset } from "../../types/Offset.js";
import { OffsetDirection, OffsetDirectionType } from "../../types/OffsetDirection.js";
import { ParseContext } from "../../types/ParseContext.js";
import { SafeEquals } from "../../types/SafeEquals.js";
import { SafeFrom } from "../../types/SafeFrom.js";
import { formatOffset } from "../../util/formatOffset.js";
import { isValidDate } from "../../util/isValidDate.js";
import { isValidDateTime } from "../../util/isValidDateTime.js";
import { pad } from "../../util/pad.js";
import { PgTPBase } from "../../util/PgTPBase.js";
import { PgTPConstructorBase } from "../../util/PgTPConstructorBase.js";
import { throwPgTPError } from "../../util/throwPgTPError.js";
import { Time } from "./Time.js";
import { TimestampTZ } from "./TimestampTZ.js";

interface TimeTZObject {
	hour: number;
	minute: number;
	second: number;
	offset: Offset;
}

interface TimeTZ {
	hour: number;
	minute: number;
	second: number;
	offset: Offset;

	value: string;
	postgres: string;

	toString(): string;
	toNumber(): number;
	toJSON(): TimeTZObject;

	toTime(): Time;

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
	equals(
		hour: number,
		minute: number,
		second: number,
		offsetHour: number,
		offsetMinute: number,
		offsetDirection: OffsetDirection | OffsetDirectionType
	): boolean;
	equals(timetz: TimeTZ | globalThis.Date | DateTime): boolean;
	equals(object: TimeTZObject): boolean;
	safeEquals(string: string): SafeEquals<TimeTZ>;
	safeEquals(unixTimestamp: number): SafeEquals<TimeTZ>;
	safeEquals(
		hour: number,
		minute: number,
		second: number,
		offsetHour: number,
		offsetMinute: number,
		offsetDirection: OffsetDirection | OffsetDirectionType
	): SafeEquals<TimeTZ>;
	safeEquals(timetz: TimeTZ | globalThis.Date | DateTime): SafeEquals<TimeTZ>;
	safeEquals(object: TimeTZObject): SafeEquals<TimeTZ>;
}

interface TimeTZConstructor {
	from(string: string): TimeTZ;
	from(unixTimestamp: number): TimeTZ;
	from(hour: number, minute: number, second: number, offsetHour: number, offsetMinute: number, offsetDirection: OffsetDirection | OffsetDirectionType): TimeTZ;
	from(timetz: TimeTZ | globalThis.Date | DateTime): TimeTZ;
	from(object: TimeTZObject): TimeTZ;
	safeFrom(string: string): SafeFrom<TimeTZ>;
	safeFrom(unixTimestamp: number): SafeFrom<TimeTZ>;
	safeFrom(
		hour: number,
		minute: number,
		second: number,
		offsetHour: number,
		offsetMinute: number,
		offsetDirection: OffsetDirection | OffsetDirectionType
	): SafeFrom<TimeTZ>;
	safeFrom(timetz: TimeTZ | globalThis.Date | DateTime): SafeFrom<TimeTZ>;
	safeFrom(object: TimeTZObject): SafeFrom<TimeTZ>;
	/**
	 * Returns `true` if `object` is a `TimeTZ`, `false` otherwise.
	 */
	isTimeTZ(object: any): object is TimeTZ;
}

class TimeTZConstructorClass extends PgTPConstructorBase<TimeTZ> implements TimeTZConstructor {
	constructor() {
		super();
	}

	_parse(context: ParseContext): ParseReturnType<TimeTZ> {
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

	private _parseString(context: ParseContext, argument: string): ParseReturnType<TimeTZ> {
		const parsedTimestamp = TimestampTZ.safeFrom(argument);
		if (parsedTimestamp.success)
			return OK(new TimeTZClass(parsedTimestamp.data.hour, parsedTimestamp.data.minute, parsedTimestamp.data.second, parsedTimestamp.data.offset));
		this.setIssueForContext(context, {
			code: "invalid_string",
			expected: "LIKE HH:MM:SS+HH:MM",
			received: argument,
		});
		return INVALID;
	}

	private _parseNumber(context: ParseContext, argument: number, otherArguments: any[]): ParseReturnType<TimeTZ> {
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

		// Should be [hour, minute, second, offsetHour, offsetMinute, offsetDirection]
		// To validate all the arguments, we make them go through the object parser
		return this._parseObject(context, {
			hour: argument,
			minute: otherArguments[0],
			offset: {
				direction: otherArguments[4],
				hour: otherArguments[2],
				minute: otherArguments[3],
			},
			second: otherArguments[1],
		});
	}

	private _parseObject(context: ParseContext, argument: object): ParseReturnType<TimeTZ> {
		// Should be [TimeTZ]
		if (TimeTZ.isTimeTZ(argument)) return OK(new TimeTZClass(argument.hour, argument.minute, argument.second, argument.offset));

		// Should be [globalThis.Date]
		const jsDate = isValidDate(argument);
		if (jsDate.isOfSameType) {
			if (jsDate.isValid) {
				const [hour, minute, second, offset] = [jsDate.data.getHours(), jsDate.data.getMinutes(), jsDate.data.getSeconds(), jsDate.data.getTimezoneOffset()];
				return OK(
					new TimeTZClass(hour, minute, second, {
						/* c8 ignore next 2 */
						// globalThis.Date.getTimezoneOffset() returns system timezone offset, so it's always positive or negative depending on the system timezone
						direction: offset < 0 ? OffsetDirection.minus : OffsetDirection.plus,

						hour: offset / 60,

						minute: offset % 60,
					})
				);
			}
			this.setIssueForContext(context, jsDate.error);
			return INVALID;
		}

		// Should be [luxon.DateTime]
		const luxonDate = isValidDateTime(argument);
		if (luxonDate.isOfSameType) {
			if (luxonDate.isValid) {
				const [hour, minute, second, offset] = [luxonDate.data.hour, luxonDate.data.minute, luxonDate.data.second, luxonDate.data.offset];
				return OK(
					new TimeTZClass(hour, minute, second, {
						direction: offset < 0 ? OffsetDirection.minus : OffsetDirection.plus,
						hour: offset / 60,
						minute: offset % 60,
					})
				);
			}
			this.setIssueForContext(context, luxonDate.error);
			return INVALID;
		}

		// Should be [TimeTZObject]
		const parsedObject = hasKeys<TimeTZObject>(argument, [
			["hour", "number"],
			["minute", "number"],
			["second", "number"],
			["offset", "object"],
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

		const { hour, minute, second, offset } = parsedObject.obj,
			parsedOffset = hasKeys<Offset>(offset, [
				["hour", "number"],
				["minute", "number"],
				["direction", "string"],
			]);
		if (!parsedOffset.success) {
			switch (true) {
				case parsedOffset.otherKeys.length > 0:
					this.setIssueForContext(context, {
						code: "unrecognized_keys",
						keys: parsedOffset.otherKeys,
					});
					break;
				case parsedOffset.missingKeys.length > 0:
					this.setIssueForContext(context, {
						code: "missing_keys",
						keys: parsedOffset.missingKeys,
					});
					break;
				case parsedOffset.invalidKeys.length > 0:
					this.setIssueForContext(context, {
						code: "invalid_key_type",
						...parsedOffset.invalidKeys[0],
					});
					break;
			}
			return INVALID;
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

		// Validate the offset
		if (parsedOffset.obj.direction !== OffsetDirection.minus && parsedOffset.obj.direction !== OffsetDirection.plus) {
			this.setIssueForContext(context, {
				code: "invalid_string",
				expected: [OffsetDirection.minus, OffsetDirection.plus],
				received: parsedOffset.obj.direction,
			});
			return INVALID;
		}

		if (parsedOffset.obj.hour % 1 !== 0) {
			throwPgTPError({
				code: "not_whole",
				received: parsedOffset.obj.hour,
			});
		}

		if (parsedOffset.obj.hour < 0) {
			throwPgTPError({
				code: "too_small",
				inclusive: true,
				minimum: 0,
				received: parsedOffset.obj.hour,
				type: "number",
			});
		}

		if (parsedOffset.obj.hour > 23) {
			throwPgTPError({
				code: "too_big",
				inclusive: true,
				maximum: 23,
				received: parsedOffset.obj.hour,
				type: "number",
			});
		}

		if (parsedOffset.obj.minute % 1 !== 0) {
			throwPgTPError({
				code: "not_whole",
				received: parsedOffset.obj.minute,
			});
		}

		if (parsedOffset.obj.minute < 0) {
			throwPgTPError({
				code: "too_small",
				inclusive: true,
				minimum: 0,
				received: parsedOffset.obj.minute,
				type: "number",
			});
		}

		if (parsedOffset.obj.minute > 59) {
			throwPgTPError({
				code: "too_big",
				inclusive: true,
				maximum: 59,
				received: parsedOffset.obj.minute,
				type: "number",
			});
		}

		return OK(new TimeTZClass(hour, minute, second, offset));
	}

	isTimeTZ(object: any): object is TimeTZ {
		return object instanceof TimeTZClass;
	}
}

const TimeTZ: TimeTZConstructor = new TimeTZConstructorClass();

class TimeTZClass extends PgTPBase<TimeTZ> implements TimeTZ {
	constructor(
		private _hour: number,
		private _minute: number,
		private _second: number,
		private _offset: Offset
	) {
		super();
	}

	_equals(context: ParseContext): ParseReturnType<{ readonly equals: boolean; readonly data: TimeTZ }> {
		//@ts-expect-error - _equals receives the same context as _parse
		const parsed = TimeTZ.safeFrom(...context.data);
		if (parsed.success) {
			return OK({
				data: parsed.data,
				equals: parsed.data.toDateTime("UTC").toString() === this.toDateTime("UTC").toString(),
			});
		}
		this.setIssueForContext(context, parsed.error.issue);
		return INVALID;
	}

	toString(): string {
		return `${pad(this._hour)}:${pad(this._minute)}:${pad(this._second)}${formatOffset(this._offset, { returnEmpty: true })}`;
	}

	toNumber(): number {
		const todayUnix = DateTime.now().setZone("UTC").startOf("day").toMillis();
		return this.toDateTime("UTC").toMillis() - todayUnix;
	}

	toJSON(): TimeTZObject {
		return {
			hour: this._hour,
			minute: this._minute,
			offset: this._offset,
			second: this._second,
		};
	}

	toTime(): Time {
		return Time.from({
			hour: this._hour,
			minute: this._minute,
			second: this._second,
		});
	}

	toDateTime(zone?: string | Zone | undefined): DateTime {
		const today = DateTime.now();
		return DateTime.fromISO(
			`${pad(today.year, 4)}-${pad(today.month)}-${pad(today.day)}T${pad(this._hour)}:${pad(this._minute)}:${pad(this._second)}${formatOffset(this._offset, {
				returnZ: true,
			})}`,
			{ setZone: true }
		).setZone(zone);
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

	get offset(): Offset {
		return this._offset;
	}

	set offset(offset: Offset) {
		const parsedType = getParsedType(offset);
		if (parsedType !== ParsedType.object) {
			throwPgTPError({
				code: "invalid_type",
				expected: [ParsedType.object],
				received: parsedType,
			});
		}

		const parsedOffset = hasKeys<Offset>(offset, [
			["hour", "number"],
			["minute", "number"],
			["direction", "string"],
		]);
		if (!parsedOffset.success) {
			switch (true) {
				case parsedOffset.otherKeys.length > 0:
					throwPgTPError({
						code: "unrecognized_keys",
						keys: parsedOffset.otherKeys,
					});
					break;
				case parsedOffset.missingKeys.length > 0:
					throwPgTPError({
						code: "missing_keys",
						keys: parsedOffset.missingKeys,
					});
					break;
				case parsedOffset.invalidKeys.length > 0:
					throwPgTPError({
						code: "invalid_key_type",
						...parsedOffset.invalidKeys[0],
					});
					break;
				/* c8 ignore next 9 */
				// Assert never
			}

			throwPgTPError({
				code: "invalid_type",
				expected: [ParsedType.object],
				received: parsedType,
			});
		}

		// Validate the offset
		if (parsedOffset.obj.direction !== OffsetDirection.minus && parsedOffset.obj.direction !== OffsetDirection.plus) {
			throwPgTPError({
				code: "invalid_string",
				expected: [OffsetDirection.minus, OffsetDirection.plus],
				received: parsedOffset.obj.direction,
			});
		}

		if (parsedOffset.obj.hour % 1 !== 0) {
			throwPgTPError({
				code: "not_whole",
				received: parsedOffset.obj.hour,
			});
		}

		if (parsedOffset.obj.hour < 0) {
			throwPgTPError({
				code: "too_small",
				inclusive: true,
				minimum: 0,
				received: parsedOffset.obj.hour,
				type: "number",
			});
		}

		if (parsedOffset.obj.hour > 23) {
			throwPgTPError({
				code: "too_big",
				inclusive: true,
				maximum: 23,
				received: parsedOffset.obj.hour,
				type: "number",
			});
		}

		if (parsedOffset.obj.minute % 1 !== 0) {
			throwPgTPError({
				code: "not_whole",
				received: parsedOffset.obj.minute,
			});
		}

		if (parsedOffset.obj.minute < 0) {
			throwPgTPError({
				code: "too_small",
				inclusive: true,
				minimum: 0,
				received: parsedOffset.obj.minute,
				type: "number",
			});
		}

		if (parsedOffset.obj.minute > 59) {
			throwPgTPError({
				code: "too_big",
				inclusive: true,
				maximum: 59,
				received: parsedOffset.obj.minute,
				type: "number",
			});
		}

		this._offset = parsedOffset.obj;
	}

	get value(): string {
		return this.toString();
	}

	set value(time: string) {
		const parsed = TimeTZ.safeFrom(time);
		if (parsed.success) {
			this._hour = parsed.data.hour;
			this._minute = parsed.data.minute;
			this._second = parsed.data.second;
			this._offset = parsed.data.offset;
		} else throw parsed.error;
	}

	get postgres(): string {
		return this.toString();
	}

	set postgres(time: string) {
		const parsed = TimeTZ.safeFrom(time);
		if (parsed.success) {
			this._hour = parsed.data.hour;
			this._minute = parsed.data.minute;
			this._second = parsed.data.second;
			this._offset = parsed.data.offset;
		} else throw parsed.error;
	}
}

export { TimeTZ, TimeTZConstructor, TimeTZObject };
