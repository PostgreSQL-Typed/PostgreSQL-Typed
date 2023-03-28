import { OID } from "@postgresql-typed/oids";
import { DateTime, Zone } from "luxon";
import pg from "pg";
const { types } = pg;

import type { ParseContext } from "../../types/ParseContext.js";
import type { ParseReturnType } from "../../types/ParseReturnType.js";
import type { SafeEquals } from "../../types/SafeEquals.js";
import type { SafeFrom } from "../../types/SafeFrom.js";
import { arrayParser } from "../../util/arrayParser.js";
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

	toString(): string;
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
	equals(hour: number, minute: number, second: number): boolean;
	equals(time: Time | globalThis.Date | DateTime): boolean;
	equals(object: TimeObject): boolean;
	safeEquals(string: string): SafeEquals<Time>;
	safeEquals(hour: number, minute: number, second: number): SafeEquals<Time>;
	safeEquals(time: Time | globalThis.Date | DateTime): SafeEquals<Time>;
	safeEquals(object: TimeObject): SafeEquals<Time>;
}

interface TimeConstructor {
	from(string: string): Time;
	from(hour: number, minute: number, second: number): Time;
	from(time: Time | globalThis.Date | DateTime): Time;
	from(object: TimeObject): Time;
	safeFrom(string: string): SafeFrom<Time>;
	safeFrom(hour: number, minute: number, second: number): SafeFrom<Time>;
	safeFrom(time: Time | globalThis.Date | DateTime): SafeFrom<Time>;
	safeFrom(object: TimeObject): SafeFrom<Time>;
	/**
	 * Returns `true` if `object` is a `Time`, `false` otherwise.
	 */
	isTime(object: any): object is Time;
}

class TimeConstructorClass extends PGTPConstructorBase<Time> implements TimeConstructor {
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

	private _parseString(context: ParseContext, argument: string): ParseReturnType<Time> {
		const parsedTimestamp = TimestampTZ.safeFrom(argument);
		if (parsedTimestamp.success) return OK(new TimeClass(parsedTimestamp.data.hour, parsedTimestamp.data.minute, parsedTimestamp.data.second));

		this.setIssueForContext(context, {
			code: "invalid_string",
			received: argument,
			expected: "LIKE HH:MM:SS",
		});
		return INVALID;
	}

	private _parseNumber(context: ParseContext, argument: number, otherArguments: any[]): ParseReturnType<Time> {
		const totalLength = otherArguments.length + 1;
		if (totalLength !== 3) {
			this.setIssueForContext(
				context,
				totalLength > 3
					? {
							code: "too_big",
							type: "arguments",
							maximum: 3,
							exact: true,
					  }
					: {
							code: "too_small",
							type: "arguments",
							minimum: 3,
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

		return OK(new TimeClass(hour, minute, second));
	}

	isTime(object: any): object is Time {
		return object instanceof TimeClass;
	}
}

const Time: TimeConstructor = new TimeConstructorClass();

class TimeClass extends PGTPBase<Time> implements Time {
	constructor(private _hour: number, private _minute: number, private _second: number) {
		super();
	}

	_equals(context: ParseContext): ParseReturnType<{ readonly equals: boolean; readonly data: Time }> {
		//@ts-expect-error - _equals receives the same context as _parse
		const parsed = Time.safeFrom(...context.data);
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
		return `${pad(this._hour)}:${pad(this._minute)}:${pad(this._second)}`;
	}

	toJSON(): TimeObject {
		return {
			hour: this._hour,
			minute: this._minute,
			second: this._second,
		};
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
}

types.setTypeParser(OID.time as any, parser(Time));
types.setTypeParser(OID._time as any, arrayParser(Time, ","));

export { Time, TimeConstructor, TimeObject };
