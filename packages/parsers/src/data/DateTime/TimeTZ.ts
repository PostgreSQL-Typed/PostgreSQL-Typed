/* eslint-disable unicorn/filename-case */
import { OID } from "@postgresql-typed/oids";
import { DateTime, Zone } from "luxon";
import { types } from "pg";

import { Offset } from "../../types/Offset.js";
import { OffsetDirection, OffsetDirectionType } from "../../types/OffsetDirection.js";
import { ParseContext } from "../../types/ParseContext.js";
import { ParseReturnType } from "../../types/ParseReturnType.js";
import { SafeEquals } from "../../types/SafeEquals.js";
import { SafeFrom } from "../../types/SafeFrom.js";
import { arrayParser } from "../../util/arrayParser.js";
import { formatOffset } from "../../util/formatOffset.js";
import { getParsedType, ParsedType } from "../../util/getParsedType.js";
import { hasKeys } from "../../util/hasKeys.js";
import { isOneOf } from "../../util/isOneOf.js";
import { isValidDate } from "../../util/isValidDate.js";
import { isValidDateTime } from "../../util/isValidDateTime.js";
import { pad } from "../../util/pad.js";
import { parser } from "../../util/parser.js";
import { PGTPBase } from "../../util/PGTPBase.js";
import { PGTPConstructorBase } from "../../util/PGTPConstructorBase.js";
import { throwPGTPError } from "../../util/throwPGTPError.js";
import { INVALID, OK } from "../../util/validation.js";
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

	toString(): string;
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
	from(hour: number, minute: number, second: number, offsetHour: number, offsetMinute: number, offsetDirection: OffsetDirection | OffsetDirectionType): TimeTZ;
	from(timetz: TimeTZ | globalThis.Date | DateTime): TimeTZ;
	from(object: TimeTZObject): TimeTZ;
	safeFrom(string: string): SafeFrom<TimeTZ>;
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

class TimeTZConstructorClass extends PGTPConstructorBase<TimeTZ> implements TimeTZConstructor {
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

	private _parseString(context: ParseContext, argument: string): ParseReturnType<TimeTZ> {
		const parsedTimestamp = TimestampTZ.safeFrom(argument);
		if (parsedTimestamp.success)
			return OK(new TimeTZClass(parsedTimestamp.data.hour, parsedTimestamp.data.minute, parsedTimestamp.data.second, parsedTimestamp.data.offset));
		this.setIssueForContext(context, {
			code: "invalid_string",
			received: argument,
			expected: "LIKE HH:MM:SS+HH:MM",
		});
		return INVALID;
	}

	private _parseNumber(context: ParseContext, argument: number, otherArguments: any[]): ParseReturnType<TimeTZ> {
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

		// Should be [hour, minute, second, offsetHour, offsetMinute, offsetDirection]
		// To validate all the arguments, we make them go through the object parser
		return this._parseObject(context, {
			hour: argument,
			minute: otherArguments[0],
			second: otherArguments[1],
			offset: {
				hour: otherArguments[2],
				minute: otherArguments[3],
				direction: otherArguments[4],
			},
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
						hour: offset / 60,
						minute: offset % 60,
						/* c8 ignore next 2 */
						// globalThis.Date.getTimezoneOffset() returns system timezone offset, so it's always positive or negative depending on the system timezone
						direction: offset < 0 ? OffsetDirection.minus : OffsetDirection.plus,
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
						hour: offset / 60,
						minute: offset % 60,
						direction: offset < 0 ? OffsetDirection.minus : OffsetDirection.plus,
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
			throwPGTPError({
				code: "not_whole",
			});
		}

		if (parsedOffset.obj.hour < 0) {
			throwPGTPError({
				code: "too_small",
				minimum: 0,
				type: "number",
				inclusive: true,
			});
		}

		if (parsedOffset.obj.hour > 23) {
			throwPGTPError({
				code: "too_big",
				maximum: 23,
				type: "number",
				inclusive: true,
			});
		}

		if (parsedOffset.obj.minute % 1 !== 0) {
			throwPGTPError({
				code: "not_whole",
			});
		}

		if (parsedOffset.obj.minute < 0) {
			throwPGTPError({
				code: "too_small",
				minimum: 0,
				type: "number",
				inclusive: true,
			});
		}

		if (parsedOffset.obj.minute > 59) {
			throwPGTPError({
				code: "too_big",
				maximum: 59,
				type: "number",
				inclusive: true,
			});
		}

		return OK(new TimeTZClass(hour, minute, second, offset));
	}

	isTimeTZ(object: any): object is TimeTZ {
		return object instanceof TimeTZClass;
	}
}

const TimeTZ: TimeTZConstructor = new TimeTZConstructorClass();

class TimeTZClass extends PGTPBase<TimeTZ> implements TimeTZ {
	constructor(private _hour: number, private _minute: number, private _second: number, private _offset: Offset) {
		super();
	}

	_equals(context: ParseContext): ParseReturnType<{ readonly equals: boolean; readonly data: TimeTZ }> {
		//@ts-expect-error - _equals receives the same context as _parse
		const parsed = TimeTZ.safeFrom(...context.data);
		if (parsed.success) {
			return OK({
				equals: parsed.data.toString() === this.toString(),
				data: parsed.data,
			});
		}
		this.setIssueForContext(context, parsed.error.issue);
		return INVALID;
	}

	toString(): string {
		return `${pad(this._hour)}:${pad(this._minute)}:${pad(this._second)}${formatOffset(this._offset, { returnEmpty: true })}`;
	}

	toJSON(): TimeTZObject {
		return {
			hour: this._hour,
			minute: this._minute,
			second: this._second,
			offset: this._offset,
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

	get offset(): Offset {
		return this._offset;
	}

	set offset(offset: Offset) {
		const parsedType = getParsedType(offset);
		if (parsedType !== ParsedType.object) {
			throwPGTPError({
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
					throwPGTPError({
						code: "unrecognized_keys",
						keys: parsedOffset.otherKeys,
					});
					break;
				case parsedOffset.missingKeys.length > 0:
					throwPGTPError({
						code: "missing_keys",
						keys: parsedOffset.missingKeys,
					});
					break;
				case parsedOffset.invalidKeys.length > 0:
					throwPGTPError({
						code: "invalid_key_type",
						...parsedOffset.invalidKeys[0],
					});
					break;
				/* c8 ignore next 9 */
				// Assert never
			}

			throwPGTPError({
				code: "invalid_type",
				expected: [ParsedType.object],
				received: parsedType,
			});
		}

		// Validate the offset
		if (parsedOffset.obj.direction !== OffsetDirection.minus && parsedOffset.obj.direction !== OffsetDirection.plus) {
			throwPGTPError({
				code: "invalid_string",
				expected: [OffsetDirection.minus, OffsetDirection.plus],
				received: parsedOffset.obj.direction,
			});
		}

		if (parsedOffset.obj.hour % 1 !== 0) {
			throwPGTPError({
				code: "not_whole",
			});
		}

		if (parsedOffset.obj.hour < 0) {
			throwPGTPError({
				code: "too_small",
				minimum: 0,
				type: "number",
				inclusive: true,
			});
		}

		if (parsedOffset.obj.hour > 23) {
			throwPGTPError({
				code: "too_big",
				maximum: 23,
				type: "number",
				inclusive: true,
			});
		}

		if (parsedOffset.obj.minute % 1 !== 0) {
			throwPGTPError({
				code: "not_whole",
			});
		}

		if (parsedOffset.obj.minute < 0) {
			throwPGTPError({
				code: "too_small",
				minimum: 0,
				type: "number",
				inclusive: true,
			});
		}

		if (parsedOffset.obj.minute > 59) {
			throwPGTPError({
				code: "too_big",
				maximum: 59,
				type: "number",
				inclusive: true,
			});
		}

		this._offset = parsedOffset.obj;
	}
}

types.setTypeParser(OID.timetz as any, parser(TimeTZ));
types.setTypeParser(OID._timetz as any, arrayParser(TimeTZ, ","));

export { TimeTZ, TimeTZConstructor, TimeTZObject };
