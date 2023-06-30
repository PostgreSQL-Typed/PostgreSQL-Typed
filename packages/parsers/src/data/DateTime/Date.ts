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

interface DateObject {
	year: number;
	month: number;
	day: number;
}

interface Date {
	year: number;
	month: number;
	day: number;

	value: string;
	postgres: string;

	toString(): string;
	toNumber(): number;
	toJSON(): DateObject;

	/**
	 * @param zone The zone to convert the date to. Defaults to 'local'.
	 */
	toDateTime(zone?: string | Zone | undefined): DateTime;
	/**
	 * @param zone The zone to convert the date to. Defaults to 'local'.
	 */
	toJSDate(zone?: string | Zone | undefined): globalThis.Date;

	equals(string: string): boolean;
	equals(unixTimestamp: number): boolean;
	equals(year: number, month: number, day: number): boolean;
	equals(date: Date | globalThis.Date | DateTime): boolean;
	equals(object: DateObject): boolean;
	safeEquals(string: string): SafeEquals<Date>;
	safeEquals(unixTimestamp: number): SafeEquals<Date>;
	safeEquals(year: number, month: number, day: number): SafeEquals<Date>;
	safeEquals(date: Date | globalThis.Date | DateTime): SafeEquals<Date>;
	safeEquals(object: DateObject): SafeEquals<Date>;
}

interface DateConstructor {
	from(string: string): Date;
	from(unixTimestamp: number): Date;
	from(year: number, month: number, day: number): Date;
	from(date: Date | globalThis.Date | DateTime): Date;
	from(object: DateObject): Date;
	safeFrom(string: string): SafeFrom<Date>;
	safeFrom(unixTimestamp: number): SafeFrom<Date>;
	safeFrom(year: number, month: number, day: number): SafeFrom<Date>;
	safeFrom(date: Date | globalThis.Date | DateTime): SafeFrom<Date>;
	safeFrom(object: DateObject): SafeFrom<Date>;
	/**
	 * Returns `true` if `object` is a `Date`, `false` otherwise.
	 */
	isDate(object: any): object is Date;
}

class DateConstructorClass extends PgTPConstructorBase<Date> implements DateConstructor {
	constructor() {
		super();
	}

	_parse(context: ParseContext): ParseReturnType<Date> {
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

	private _parseString(context: ParseContext, argument: string): ParseReturnType<Date> {
		const parsedTimestamp = TimestampTZ.safeFrom(argument);
		if (parsedTimestamp.success) return OK(new DateClass(parsedTimestamp.data.year, parsedTimestamp.data.month, parsedTimestamp.data.day));
		this.setIssueForContext(context, {
			code: "invalid_string",
			received: argument,
			expected: "LIKE YYYY-MM-DD",
		});
		return INVALID;
	}

	private _parseNumber(context: ParseContext, argument: number, otherArguments: any[]): ParseReturnType<Date> {
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

		const [year, month, day] = [argument, ...otherArguments] as number[];
		return this._parseString(context, `${year}-${pad(month)}-${pad(day)}`);
	}

	private _parseObject(context: ParseContext, argument: object): ParseReturnType<Date> {
		// Should be [Date]
		if (Date.isDate(argument)) return OK(new DateClass(argument.year, argument.month, argument.day));

		// Should be [globalThis.Date]
		const jsDate = isValidDate(argument);
		if (jsDate.isOfSameType) {
			if (jsDate.isValid) {
				const [year, month, day] = [jsDate.data.getFullYear(), jsDate.data.getMonth() + 1, jsDate.data.getDate()];
				return this._parseString(context, `${year}-${pad(month)}-${pad(day)}`);
			}
			this.setIssueForContext(context, jsDate.error);
			return INVALID;
		}

		// Should be [luxon.DateTime]
		const luxonDate = isValidDateTime(argument);
		if (luxonDate.isOfSameType) {
			if (luxonDate.isValid) {
				const [year, month, day] = [luxonDate.data.year, luxonDate.data.month, luxonDate.data.day];
				return this._parseString(context, `${year}-${pad(month)}-${pad(day)}`);
			}
			this.setIssueForContext(context, luxonDate.error);
			return INVALID;
		}

		// Should be [DateObject]
		const parsedObject = hasKeys<DateObject>(argument, [
			["year", "number"],
			["month", "number"],
			["day", "number"],
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

		const { year, month, day } = parsedObject.obj;
		return this._parseString(context, `${year}-${pad(month)}-${pad(day)}`);
	}

	isDate(object: any): object is Date {
		return object instanceof DateClass;
	}
}

const Date: DateConstructor = new DateConstructorClass();

class DateClass extends PgTPBase<Date> implements Date {
	constructor(private _year: number, private _month: number, private _day: number) {
		super();
	}

	_equals(context: ParseContext): ParseReturnType<{ readonly equals: boolean; readonly data: Date }> {
		//@ts-expect-error - _equals receives the same context as _parse
		const parsed = Date.safeFrom(...context.data);
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
		return `${this._year}-${pad(this._month)}-${pad(this._day)}`;
	}

	toNumber(): number {
		return this.toDateTime("UTC").toMillis();
	}

	toJSON(): DateObject {
		return {
			year: this._year,
			month: this._month,
			day: this._day,
		};
	}

	toDateTime(zone?: string | Zone | undefined): DateTime {
		return DateTime.fromObject(
			{
				year: this._year,
				month: this._month,
				day: this._day,
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
			});
		}

		if (year < 1) {
			throwPgTPError({
				code: "too_small",
				type: "number",
				minimum: 1,
				inclusive: true,
			});
		}

		if (year > 9999) {
			throwPgTPError({
				code: "too_big",
				type: "number",
				maximum: 9999,
				inclusive: true,
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
			});
		}

		if (month < 1) {
			throwPgTPError({
				code: "too_small",
				type: "number",
				minimum: 1,
				inclusive: true,
			});
		}

		if (month > 12) {
			throwPgTPError({
				code: "too_big",
				type: "number",
				maximum: 12,
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
			throwPgTPError({
				code: "invalid_type",
				expected: [ParsedType.number],
				received: parsedType,
			});
		}

		if (day % 1 !== 0) {
			throwPgTPError({
				code: "not_whole",
			});
		}

		if (day < 1) {
			throwPgTPError({
				code: "too_small",
				type: "number",
				minimum: 1,
				inclusive: true,
			});
		}

		if (day > 31) {
			throwPgTPError({
				code: "too_big",
				type: "number",
				maximum: 31,
				inclusive: true,
			});
		}

		this._day = day;
	}

	get value(): string {
		return this.toString();
	}

	set value(date: string) {
		const parsed = Date.safeFrom(date);
		if (parsed.success) {
			this._year = parsed.data.year;
			this._month = parsed.data.month;
			this._day = parsed.data.day;
		} else throw parsed.error;
	}

	get postgres(): string {
		return this.toString();
	}

	set postgres(date: string) {
		const parsed = Date.safeFrom(date);
		if (parsed.success) {
			this._year = parsed.data.year;
			this._month = parsed.data.month;
			this._day = parsed.data.day;
		} else throw parsed.error;
	}
}

export { Date, DateConstructor, DateObject };
