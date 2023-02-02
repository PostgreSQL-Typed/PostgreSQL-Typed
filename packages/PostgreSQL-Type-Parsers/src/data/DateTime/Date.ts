import { DateTime, Zone } from "luxon";
import { types } from "pg";
import { DataType } from "postgresql-data-types";

import type { ParseContext } from "../../types/ParseContext";
import type { ParseReturnType } from "../../types/ParseReturnType";
import type { SafeEquals } from "../../types/SafeEquals";
import type { SafeFrom } from "../../types/SafeFrom";
import { arrayParser } from "../../util/arrayParser";
import { getParsedType, ParsedType } from "../../util/getParsedType";
import { hasKeys } from "../../util/hasKeys";
import { isOneOf } from "../../util/isOneOf";
import { isValidDate } from "../../util/isValidDate";
import { isValidDateTime } from "../../util/isValidDateTime";
import { pad } from "../../util/pad";
import { parser } from "../../util/parser";
import { PGTPBase } from "../../util/PGTPBase";
import { PGTPConstructorBase } from "../../util/PGTPConstructorBase";
import { throwPGTPError } from "../../util/throwPGTPError";
import { INVALID, OK } from "../../util/validation";

interface DateObject {
	year: number;
	month: number;
	day: number;
}

interface Date {
	year: number;
	month: number;
	day: number;

	toString(): string;
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
	equals(year: number, month: number, day: number): boolean;
	equals(date: Date | globalThis.Date | DateTime): boolean;
	equals(object: DateObject): boolean;
	safeEquals(string: string): SafeEquals<Date>;
	safeEquals(year: number, month: number, day: number): SafeEquals<Date>;
	safeEquals(date: Date | globalThis.Date | DateTime): SafeEquals<Date>;
	safeEquals(object: DateObject): SafeEquals<Date>;
}

interface DateConstructor {
	from(string: string): Date;
	from(year: number, month: number, day: number): Date;
	from(date: Date | globalThis.Date | DateTime): Date;
	from(object: DateObject): Date;
	safeFrom(string: string): SafeFrom<Date>;
	safeFrom(year: number, month: number, day: number): SafeFrom<Date>;
	safeFrom(date: Date | globalThis.Date | DateTime): SafeFrom<Date>;
	safeFrom(object: DateObject): SafeFrom<Date>;
	/**
	 * Returns `true` if `obj` is a `Date`, `false` otherwise.
	 */
	isDate(obj: any): obj is Date;
}

class DateConstructorClass extends PGTPConstructorBase<Date> implements DateConstructor {
	constructor() {
		super();
	}

	_parse(ctx: ParseContext): ParseReturnType<Date> {
		const [arg, ...otherArgs] = ctx.data,
			allowedTypes = [ParsedType.number, ParsedType.string, ParsedType.object, ParsedType["globalThis.Date"], ParsedType["luxon.DateTime"]],
			parsedType = getParsedType(arg);

		if (parsedType !== ParsedType.number && ctx.data.length !== 1) {
			this.setIssueForContext(
				ctx,
				ctx.data.length > 1
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
			this.setIssueForContext(ctx, {
				code: "invalid_type",
				expected: allowedTypes as ParsedType[],
				received: parsedType,
			});
			return INVALID;
		}

		switch (parsedType) {
			case "string":
				return this._parseString(ctx, arg as string);
			case "number":
				return this._parseNumber(ctx, arg as number, otherArgs);
			default:
				return this._parseObject(ctx, arg as object);
		}
	}

	private _parseString(ctx: ParseContext, arg: string): ParseReturnType<Date> {
		if (arg.match(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/)) {
			const [year, month, day] = arg.split("-").map(c => parseInt(c));
			return OK(new DateClass(year, month, day));
		}
		this.setIssueForContext(ctx, {
			code: "invalid_string",
			received: arg,
			expected: "LIKE YYYY-MM-DD",
		});
		return INVALID;
	}

	private _parseNumber(ctx: ParseContext, arg: number, otherArgs: any[]): ParseReturnType<Date> {
		const totalLength = otherArgs.length + 1;
		if (totalLength !== 3) {
			this.setIssueForContext(
				ctx,
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

		for (const otherArg of otherArgs) {
			const allowedTypes = [ParsedType.number],
				parsedType = getParsedType(otherArg);

			if (!isOneOf(allowedTypes, parsedType)) {
				this.setIssueForContext(ctx, {
					code: "invalid_type",
					expected: allowedTypes as ParsedType[],
					received: parsedType,
				});
				return INVALID;
			}
		}

		const [year, month, day] = [arg, ...otherArgs] as number[];
		return this._parseString(ctx, `${year}-${pad(month)}-${pad(day)}`);
	}

	private _parseObject(ctx: ParseContext, arg: object): ParseReturnType<Date> {
		// Should be [Date]
		if (Date.isDate(arg)) return OK(new DateClass(arg.year, arg.month, arg.day));

		// Should be [globalThis.Date]
		const jsDate = isValidDate(arg);
		if (jsDate.isOfSameType) {
			if (jsDate.isValid) {
				const [year, month, day] = [jsDate.data.getFullYear(), jsDate.data.getMonth() + 1, jsDate.data.getDate()];
				return this._parseString(ctx, `${year}-${pad(month)}-${pad(day)}`);
			}
			this.setIssueForContext(ctx, jsDate.error);
			return INVALID;
		}

		// Should be [luxon.DateTime]
		const luxonDate = isValidDateTime(arg);
		if (luxonDate.isOfSameType) {
			if (luxonDate.isValid) {
				const [year, month, day] = [luxonDate.data.year, luxonDate.data.month, luxonDate.data.day];
				return this._parseString(ctx, `${year}-${pad(month)}-${pad(day)}`);
			}
			this.setIssueForContext(ctx, luxonDate.error);
			return INVALID;
		}

		// Should be [DateObject]
		const parsedObject = hasKeys<DateObject>(arg, [
			["year", "number"],
			["month", "number"],
			["day", "number"],
		]);
		if (!parsedObject.success) {
			switch (true) {
				case parsedObject.otherKeys.length > 0:
					this.setIssueForContext(ctx, {
						code: "unrecognized_keys",
						keys: parsedObject.otherKeys,
					});
					break;
				case parsedObject.missingKeys.length > 0:
					this.setIssueForContext(ctx, {
						code: "missing_keys",
						keys: parsedObject.missingKeys,
					});
					break;
				case parsedObject.invalidKeys.length > 0:
					this.setIssueForContext(ctx, {
						code: "invalid_key_type",
						...parsedObject.invalidKeys[0],
					});
					break;
			}
			return INVALID;
		}

		const { year, month, day } = parsedObject.obj;
		return this._parseString(ctx, `${year}-${pad(month)}-${pad(day)}`);
	}

	isDate(obj: any): obj is Date {
		return obj instanceof DateClass;
	}
}

const Date: DateConstructor = new DateConstructorClass();

class DateClass extends PGTPBase<Date> implements Date {
	constructor(private _year: number, private _month: number, private _day: number) {
		super();
	}

	_equals(ctx: ParseContext): ParseReturnType<{ readonly equals: boolean; readonly data: Date }> {
		//@ts-expect-error - _equals receives the same context as _parse
		const parsed = Date.safeFrom(...ctx.data);
		if (parsed.success) {
			return OK({
				equals: parsed.data.toString() === this.toString(),
				data: parsed.data,
			});
		}
		this.setIssueForContext(ctx, parsed.error.issue);
		return INVALID;
	}

	toString(): string {
		return `${this._year}-${pad(this._month)}-${pad(this._day)}`;
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

		if (year < 1) {
			throwPGTPError({
				code: "too_small",
				type: "number",
				minimum: 1,
				inclusive: true,
			});
		}

		if (year > 9999) {
			throwPGTPError({
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
				type: "number",
				minimum: 1,
				inclusive: true,
			});
		}

		if (month > 12) {
			throwPGTPError({
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
				type: "number",
				minimum: 1,
				inclusive: true,
			});
		}

		if (day > 31) {
			throwPGTPError({
				code: "too_big",
				type: "number",
				maximum: 31,
				inclusive: true,
			});
		}

		this._day = day;
	}
}

types.setTypeParser(DataType.date as any, parser(Date));
types.setTypeParser(DataType._date as any, arrayParser(Date, ","));

export { Date, DateObject };
