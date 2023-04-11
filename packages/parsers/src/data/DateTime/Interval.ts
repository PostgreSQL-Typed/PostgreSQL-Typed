import { getParsedType, hasKeys, INVALID, isOneOf, OK, ParsedType, type ParseReturnType } from "@postgresql-typed/util";

import type { ParseContext } from "../../types/ParseContext.js";
import type { SafeEquals } from "../../types/SafeEquals.js";
import type { SafeFrom } from "../../types/SafeFrom.js";
import { pad } from "../../util/pad.js";
import { PGTPBase } from "../../util/PGTPBase.js";
import { PGTPConstructorBase } from "../../util/PGTPConstructorBase.js";
import { REGEXES } from "../../util/regexes.js";
import { throwPGTPError } from "../../util/throwPGTPError.js";

enum IntervalStyle {
	PostgreSQL = "PostgreSQL",
	PostgreSQLShort = "PostgreSQL-Short",
	PostgreSQLTime = "PostgreSQL-Time",
	PostgreSQLTimeShort = "PostgreSQL-Time-Short",
	ISO = "ISO",
	ISOShort = "ISO-Short",
	ISOBasic = "ISO-Basic",
	ISOExtended = "ISO-Extended",
	SQL = "SQL",
}

type IntervalPostgreSQLStyles = "PostgreSQL" | "PostgreSQL-Short" | "PostgreSQL-Time" | "PostgreSQL-Time-Short";
type IntervalISOStyles = "ISO" | "ISO-Short" | "ISO-Basic" | "ISO-Extended";
type IntervalSQLStyles = "SQL";
type IntervalStyleType = IntervalPostgreSQLStyles | IntervalISOStyles | IntervalSQLStyles;

const intervalStyles: IntervalStyleType[] = [
	IntervalStyle.PostgreSQL,
	IntervalStyle.PostgreSQLShort,
	IntervalStyle.PostgreSQLTime,
	IntervalStyle.PostgreSQLTimeShort,
	IntervalStyle.ISO,
	IntervalStyle.ISOShort,
	IntervalStyle.ISOBasic,
	IntervalStyle.ISOExtended,
	IntervalStyle.SQL,
];

interface IntervalObject {
	years?: number;
	months?: number;
	days?: number;
	hours?: number;
	minutes?: number;
	seconds?: number;
	milliseconds?: number;
}

type IntervalProperties = keyof Omit<IntervalObject, "milliseconds">;
type FullIntervalProperties = keyof IntervalObject;

interface Interval {
	years: number;
	months: number;
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
	milliseconds: number;

	value: string;
	postgres: string;

	/**
	 * @param style The style to use when converting the interval to a string. Defaults to `PostgreSQL`.
	 * @returns The interval as a string.
	 * @example
	 * const interval = Interval.from("1 year 2 months 4 hours 5 minutes 6 seconds 7 milliseconds");
	 *
	 * interval.toString(); // "1 year 2 months 4 hours 5 minutes 6 seconds 7 milliseconds"
	 * interval.toString("PostgreSQL"); // "1 year 2 months 4 hours 5 minutes 6 seconds 7 milliseconds"
	 * interval.toString("PostgreSQL-Short"); // "1 yr 2 mons 4hrs 5mins 6secs 7msecs"
	 * interval.toString("PostgreSQL-Time"); // "1 year 2 months 04:05:06.007"
	 * interval.toString("PostgreSQL-Time-Short"); // "1 yr 2 mons 04:05:06.007"
	 * interval.toString("ISO"); // "P1Y2M0DT4H5M6.007S"
	 * interval.toString("ISO-Short"); // "P1Y2M4TH5M6.007S"
	 * interval.toString("ISO-Basic"); // "P00010200T040506.007"
	 * interval.toString("ISO-Extended"); // "P0001-02-00T04:05:06.007"
	 * interval.toString("SQL"); // "1-2 04:05:06.007"
	 */
	toString(style?: IntervalStyle | IntervalStyleType): string;
	toJSON(): IntervalObject;

	equals(string: string): boolean;
	equals(object: Interval | IntervalObject): boolean;
	equals(years: number, months: number, days: number, hours: number, minutes: number, seconds: number, milliseconds: number): boolean;
	safeEquals(string: string): SafeEquals<Interval>;
	safeEquals(object: Interval | IntervalObject): SafeEquals<Interval>;
	safeEquals(years: number, months: number, days: number, hours: number, minutes: number, seconds: number, milliseconds: number): SafeEquals<Interval>;
}

interface IntervalConstructor {
	from(string: string): Interval;
	from(years: number, months: number, days: number, hours: number, minutes: number, seconds: number, milliseconds: number): Interval;
	from(object: Interval | IntervalObject): Interval;
	safeFrom(string: string): SafeFrom<Interval>;
	safeFrom(years: number, months: number, days: number, hours: number, minutes: number, seconds: number, milliseconds: number): SafeFrom<Interval>;
	safeFrom(object: Interval | IntervalObject): SafeFrom<Interval>;
	/**
	 * Returns `true` if `object` is a `Interval`, `false` otherwise.
	 */
	isInterval(object: any): object is Interval;
}

class IntervalConstructorClass extends PGTPConstructorBase<Interval> implements IntervalConstructor {
	constructor() {
		super();
	}

	_parse(context: ParseContext): ParseReturnType<Interval> {
		const [argument, ...otherArguments] = context.data,
			allowedTypes = [ParsedType.number, ParsedType.string, ParsedType.object],
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

	private _parseString(context: ParseContext, argument: string): ParseReturnType<Interval> {
		//#region Regexes
		const regexes = [
			REGEXES.TraditionalPostgreSQLInterval,
			REGEXES.TraditionalPostgreSQLTimeInterval,
			REGEXES.ISO8601DurationsDesignators,
			REGEXES.ISO8601DurationsBasic,
			REGEXES.ISO8601DurationsExtended,
			REGEXES.SQLYearToSecond,
			REGEXES.SQLYearToMonth,
			REGEXES.SQLDayToSecond,
			REGEXES.SQLHourToSecond,
			REGEXES.SQLMinuteToSecond,
			REGEXES.SQLSecond,
		] as {
			match: (argument_: string) => {
				millennium?: string;
				century?: string;
				decade?: string;
				year?: string;
				month?: string;
				week?: string;
				day?: string;
				hour?: string;
				minute?: string;
				second?: string;
				millisecond?: string;
				microsecond?: string;
			};
		}[];
		//#endregion

		// Add a space to the beginning of the string to make the regexes easier to write

		let result: {
			millennium: number;
			century: number;
			decade: number;
			year: number;
			month: number;
			week: number;
			day: number;
			hour: number;
			minute: number;
			second: number;
			millisecond: number;
			microsecond: number;
		} | null = null;

		for (const regex of regexes) {
			const match = regex.match(` ${argument}`);
			if (match) {
				// Clean up the match object (trim and remove all a-z characters)
				const hasAgoInAnyValue = Object.values(match).some(value => value?.trim().endsWith("ago"));
				for (const key in match) {
					match[key as keyof typeof match] = `${hasAgoInAnyValue ? "-" : ""}${
						/* c8 ignore next 2 */
						//to ignore the `?? 0` fallback
						match[key as keyof typeof match]?.trim().match(/([+-]?\d+(?:\.\d+)?)/)?.[1] ?? "0"
					}`;
				}

				result = {
					millennium: "millennium" in match && typeof match.millennium === "string" ? Number.parseFloat(match.millennium) : 0,
					century: "century" in match && typeof match.century === "string" ? Number.parseFloat(match.century) : 0,
					decade: "decade" in match && typeof match.decade === "string" ? Number.parseFloat(match.decade) : 0,
					year: "year" in match && typeof match.year === "string" ? Number.parseFloat(match.year) : 0,
					month: "month" in match && typeof match.month === "string" ? Number.parseFloat(match.month) : 0,
					week: "week" in match && typeof match.week === "string" ? Number.parseFloat(match.week) : 0,
					day: "day" in match && typeof match.day === "string" ? Number.parseFloat(match.day) : 0,
					hour: "hour" in match && typeof match.hour === "string" ? Number.parseFloat(match.hour) : 0,
					minute: "minute" in match && typeof match.minute === "string" ? Number.parseFloat(match.minute) : 0,
					second: "second" in match && typeof match.second === "string" ? Number.parseFloat(match.second) : 0,
					millisecond: "millisecond" in match && typeof match.millisecond === "string" ? Number.parseFloat(match.millisecond) : 0,
					microsecond: "microsecond" in match && typeof match.microsecond === "string" ? Number.parseFloat(match.microsecond) : 0,
				};
				break;
			}
		}

		if (!result) {
			this.setIssueForContext(context, {
				code: "invalid_string",
				received: argument,
				expected: "LIKE P1Y2M3W4DT5H6M7S",
			});
			return INVALID;
		}

		const finalResult = {
			years: result.year,
			months: result.month,
			days: result.day,
			hours: result.hour,
			minutes: result.minute,
			seconds: result.second,
			milliseconds: result.millisecond,
		} satisfies IntervalObject;

		//#region Convertations
		//Convert millenniums to years
		finalResult.years += result.millennium * 1000;
		//Convert centuries to years
		finalResult.years += result.century * 100;
		//Convert decades to years
		finalResult.years += result.decade * 10;
		//Convert weeks to days
		finalResult.days += result.week * 7;
		//Convert microseconds to milliseconds
		finalResult.milliseconds += result.microsecond / 1000;

		//Convert not whole (decimal) values to smaller units
		//Convert seconds to milliseconds
		if (finalResult.seconds % 1 !== 0) {
			finalResult.milliseconds += Number.parseFloat(`.${finalResult.seconds.toString().split(".")[1]}`) * 1000;
			finalResult.seconds = Math.floor(finalResult.seconds);
		}

		//Convert minutes to seconds
		if (finalResult.minutes % 1 !== 0) {
			finalResult.seconds += Number.parseFloat(`.${finalResult.minutes.toString().split(".")[1]}`) * 60;
			finalResult.minutes = Math.floor(finalResult.minutes);
		}

		//Convert hours to minutes
		if (finalResult.hours % 1 !== 0) {
			finalResult.minutes += Number.parseFloat(`.${finalResult.hours.toString().split(".")[1]}`) * 60;
			finalResult.hours = Math.floor(finalResult.hours);
		}

		//Convert days to hours
		if (finalResult.days % 1 !== 0) {
			finalResult.hours += Number.parseFloat(`.${finalResult.days.toString().split(".")[1]}`) * 24;
			finalResult.days = Math.floor(finalResult.days);
		}

		//Convert months to days
		if (finalResult.months % 1 !== 0) {
			finalResult.days += Number.parseFloat(`.${finalResult.months.toString().split(".")[1]}`) * 30;
			finalResult.months = Math.floor(finalResult.months);
		}

		//Convert years to days
		if (finalResult.years % 1 !== 0) {
			finalResult.days += Number.parseFloat(`.${finalResult.years.toString().split(".")[1]}`) * 365;
			finalResult.years = Math.floor(finalResult.years);
		}

		//Convert too large values to smaller units
		//Convert milliseconds to seconds
		if (finalResult.milliseconds >= 1000) {
			finalResult.seconds += Math.floor(finalResult.milliseconds / 1000);
			finalResult.milliseconds = finalResult.milliseconds % 1000;
		}

		//Convert seconds to minutes
		if (finalResult.seconds >= 60) {
			finalResult.minutes += Math.floor(finalResult.seconds / 60);
			finalResult.seconds = finalResult.seconds % 60;
		}

		//Convert minutes to hours
		if (finalResult.minutes >= 60) {
			finalResult.hours += Math.floor(finalResult.minutes / 60);
			finalResult.minutes = finalResult.minutes % 60;
		}

		//Convert hours to days
		if (finalResult.hours >= 24) {
			finalResult.days += Math.floor(finalResult.hours / 24);
			finalResult.hours = finalResult.hours % 24;
		}

		//Convert days to years
		if (finalResult.days >= 365) {
			finalResult.years += Math.floor(finalResult.days / 365);
			finalResult.days = finalResult.days % 365;
		}
		//#endregion

		return OK(
			new IntervalClass(
				finalResult.years,
				finalResult.months,
				finalResult.days,
				finalResult.hours,
				finalResult.minutes,
				finalResult.seconds,
				finalResult.milliseconds
			)
		);
	}

	private _parseNumber(context: ParseContext, argument: number, otherArguments: any[]): ParseReturnType<Interval> {
		const totalLength = otherArguments.length + 1;
		if (totalLength !== 7) {
			this.setIssueForContext(
				context,
				totalLength > 7
					? {
							code: "too_big",
							type: "arguments",
							maximum: 7,
							exact: true,
					  }
					: {
							code: "too_small",
							type: "arguments",
							minimum: 7,
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

		const [years, months, days, hours, minutes, seconds, milliseconds] = [argument, ...otherArguments] as number[];
		return this._parseString(
			context,
			`${years} years ${months} months ${days} days ${hours} hours ${minutes} minutes ${seconds} seconds ${milliseconds} milliseconds`
		);
	}

	private _parseObject(context: ParseContext, argument: object): ParseReturnType<Interval> {
		// Should be [Interval]
		if (Interval.isInterval(argument))
			return OK(new IntervalClass(argument.years, argument.months, argument.days, argument.hours, argument.minutes, argument.seconds, argument.milliseconds));

		// Should be [IntervalObject]
		const parsedObject = hasKeys<IntervalObject>(argument, [
			["years", ["number", "undefined"]],
			["months", ["number", "undefined"]],
			["days", ["number", "undefined"]],
			["hours", ["number", "undefined"]],
			["minutes", ["number", "undefined"]],
			["seconds", ["number", "undefined"]],
			["milliseconds", ["number", "undefined"]],
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

		const { years, months, days, hours, minutes, seconds, milliseconds } = parsedObject.obj;
		return this._parseString(
			context,
			`${years ?? 0} years ${months ?? 0} months ${days ?? 0} days ${hours ?? 0} hours ${minutes ?? 0} minutes ${seconds ?? 0} seconds ${
				milliseconds ?? 0
			} milliseconds`
		);
	}

	isInterval(object: any): object is Interval {
		return object instanceof IntervalClass;
	}
}

const Interval: IntervalConstructor = new IntervalConstructorClass();

class IntervalClass extends PGTPBase<Interval> implements Interval {
	constructor(
		private _years: number,
		private _months: number,
		private _days: number,
		private _hours: number,
		private _minutes: number,
		private _seconds: number,
		private _milliseconds: number
	) {
		super();
	}

	_equals(context: ParseContext): ParseReturnType<{ readonly equals: boolean; readonly data: Interval }> {
		//@ts-expect-error - _equals receives the same context as _parse
		const parsed = Interval.safeFrom(...context.data);
		if (parsed.success) {
			return OK({
				equals: parsed.data.toString() === this.toString(),
				data: parsed.data,
			});
		}
		this.setIssueForContext(context, parsed.error.issue);
		return INVALID;
	}

	toString(style: IntervalStyle | IntervalStyleType = IntervalStyle.PostgreSQL): string {
		switch (style) {
			case IntervalStyle.SQL:
				return this._toStringSQL();
			case IntervalStyle.ISO:
			case IntervalStyle.ISOBasic:
			case IntervalStyle.ISOShort:
			case IntervalStyle.ISOExtended:
				return this._toStringISO(style);
			case IntervalStyle.PostgreSQL:
			case IntervalStyle.PostgreSQLShort:
			case IntervalStyle.PostgreSQLTime:
			case IntervalStyle.PostgreSQLTimeShort:
				return this._toStringPostgreSQL(style);
			default:
				throwPGTPError({
					code: "invalid_string",
					expected: intervalStyles,
					received: style,
				});
		}
	}

	private _toStringSQL(): string {
		// YYYY-MM
		const yyyyMM = hasKeys<{
			years: number;
			months: number;
		}>(this.toJSON(), [
			["years", "number"],
			["months", "number"],
		]);
		if (yyyyMM.success) return `${yyyyMM.obj.years}-${yyyyMM.obj.months}`;

		// hh:mm
		const hhmm = hasKeys<{
			hours: number;
			minutes: number;
		}>(this.toJSON(), [
			["hours", "number"],
			["minutes", "number"],
		]);
		if (hhmm.success) return `${pad(hhmm.obj.hours)}:${pad(hhmm.obj.minutes)}`;

		// DD hh:mm:ss
		const ddhhmmss = hasKeys<{
			days: number;
			hours: number;
			minutes: number;
			seconds?: number;
			milliseconds?: number;
		}>(this.toJSON(), [
			["days", "number"],
			["hours", "number"],
			["minutes", "number"],
			["seconds", ["number", "undefined"]],
			["milliseconds", ["number", "undefined"]],
		]);
		if (ddhhmmss.success && (ddhhmmss.obj.seconds !== undefined || ddhhmmss.obj.milliseconds !== undefined)) {
			const { days, hours, minutes, milliseconds } = ddhhmmss.obj;
			let { seconds } = ddhhmmss.obj;
			if (seconds === undefined) seconds = 0;
			// add the milliseconds to the seconds
			if (milliseconds !== undefined) seconds += milliseconds / 1000;
			return `${days} ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
		}

		// hh:mm:ss
		const hhmmss = hasKeys<{
			hours: number;
			minutes: number;
			seconds?: number;
			milliseconds?: number;
		}>(this.toJSON(), [
			["hours", "number"],
			["minutes", "number"],
			["seconds", ["number", "undefined"]],
			["milliseconds", ["number", "undefined"]],
		]);
		if (hhmmss.success && (hhmmss.obj.seconds !== undefined || hhmmss.obj.milliseconds !== undefined)) {
			const { hours, minutes, milliseconds } = hhmmss.obj;
			let { seconds } = hhmmss.obj;
			if (seconds === undefined) seconds = 0;
			// add the milliseconds to the seconds
			if (milliseconds !== undefined) seconds += milliseconds / 1000;
			return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
		}

		// ss
		const ss = hasKeys<{
			seconds?: number;
			milliseconds?: number;
		}>(this.toJSON(), [
			["seconds", ["number", "undefined"]],
			["milliseconds", ["number", "undefined"]],
		]);
		if (ss.success && (ss.obj.seconds !== undefined || ss.obj.milliseconds !== undefined)) {
			const { milliseconds } = ss.obj;
			let { seconds } = ss.obj;
			if (seconds === undefined) seconds = 0;
			// add the milliseconds to the seconds
			if (milliseconds !== undefined) seconds += milliseconds / 1000;
			return `${seconds}`;
		}

		// YYYY-MM DD HH:MM:SS
		const data = this.toJSON(),
			{ years, months, days, hours, minutes, milliseconds } = data;
		let { seconds } = data;
		// add the milliseconds to the seconds
		if (milliseconds !== undefined) {
			if (seconds === undefined) seconds = 0;
			seconds += milliseconds / 1000;
		}

		return `${years ?? 0}-${months ?? 0} ${days ?? 0} ${pad(hours ?? 0)}:${pad(minutes ?? 0)}:${pad(seconds ?? 0)}`;
	}

	private _toStringISO(style: IntervalISOStyles): string {
		const allowedStyles: IntervalStyleType[] = [IntervalStyle.ISO, IntervalStyle.ISOShort];
		if (allowedStyles.includes(style)) {
			const short = style === IntervalStyle.ISOShort,
				dateProperties: IntervalProperties[] = ["years", "months", "days"],
				timeProperties: IntervalProperties[] = ["hours", "minutes", "seconds"],
				datePart = dateProperties.map(d => this._buildISOProperty(d, short)).join(""),
				timePart = timeProperties.map(t => this._buildISOProperty(t, short)).join("");

			if (timePart.length === 0 && datePart.length === 0) return "PT0S";

			if (timePart.length === 0) return `P${datePart}`;

			return `P${datePart}T${timePart}`;
		}

		const data = this.toJSON(),
			{ years, months, days, hours, minutes, milliseconds } = data;
		let { seconds } = data;
		// add the milliseconds to the seconds
		if (milliseconds !== undefined) {
			if (seconds === undefined) seconds = 0;
			seconds += milliseconds / 1000;
		}

		//PYYYY-MM-DDThh:mm:ss
		const formatted = `P${pad(years ?? 0, 4)}-${pad(months ?? 0)}-${pad(days ?? 0)}T${pad(hours ?? 0)}:${pad(minutes ?? 0)}:${pad(seconds ?? 0)}`;

		// Basic format is the same as ISO, except that the hyphens and colons are removed.
		if (style === IntervalStyle.ISOBasic) return formatted.replaceAll(/[:-]/g, "");
		return formatted;
	}

	private _buildISOProperty(property: IntervalProperties, short = false): string {
		const propertiesISOEquivalent = {
			years: "Y",
			months: "M",
			days: "D",
			hours: "H",
			minutes: "M",
			seconds: "S",
		};

		let value: string | number = this[property];

		// Account for fractional part of seconds,
		// remove trailing zeroes.
		if (property === "seconds" && this.milliseconds) value = (value + this.milliseconds / 1000).toFixed(6).replace(/0+$/, "");

		if (short && !value) return "";

		return value + propertiesISOEquivalent[property];
	}

	private _toStringPostgreSQL(style: IntervalPostgreSQLStyles): string {
		const shortStyles: IntervalStyleType[] = [IntervalStyle.PostgreSQLShort, IntervalStyle.PostgreSQLTimeShort],
			isShort = shortStyles.includes(style),
			dateProperties: FullIntervalProperties[] = ["years", "months", "days"],
			timeProperties: FullIntervalProperties[] = ["hours", "minutes", "seconds", "milliseconds"],
			datePart = dateProperties
				.map(d => this._buildPostgreSQLProperty(d, isShort))
				// remove empty strings
				.filter(Boolean)
				.join(" "),
			timePart = timeProperties
				.map(t => this._buildPostgreSQLProperty(t, isShort))
				// remove empty strings
				.filter(Boolean)
				.join(" ");

		if (timePart.length === 0 && datePart.length === 0) return "0";

		if (timePart.length === 0) return datePart;

		const timeStyles: IntervalStyleType[] = [IntervalStyle.PostgreSQLTime, IntervalStyle.PostgreSQLTimeShort];
		if (!timeStyles.includes(style)) {
			if (datePart.length === 0) return timePart;
			return `${datePart} ${timePart}`;
		}

		// PostgreSQL time format is different, it uses hh:mm:ss
		const data = this.toJSON(),
			{ hours, minutes, milliseconds } = data;
		let { seconds } = data;
		// add the milliseconds to the seconds
		if (milliseconds !== undefined) {
			if (seconds === undefined) seconds = 0;
			seconds += milliseconds / 1000;
		}

		const newTimePart = `${pad(hours ?? 0)}:${pad(minutes ?? 0)}:${pad(seconds ?? 0)}`;

		if (datePart.length === 0) return newTimePart;

		return `${datePart} ${newTimePart}`;
	}

	private _buildPostgreSQLProperty(property: FullIntervalProperties, short = false): string {
		const propertiesISOEquivalent = {
				years: "yrs",
				months: "mons",
				days: "days",
				hours: "hrs",
				minutes: "mins",
				seconds: "secs",
				milliseconds: "msecs",
			},
			value = this[property];

		if (!value) return "";

		return short ? `${value} ${propertiesISOEquivalent[property]}` : `${value} ${property}`;
	}

	toJSON(): IntervalObject {
		const returnObject: IntervalObject = {};

		if (this._years !== 0) returnObject.years = this._years;
		if (this._months !== 0) returnObject.months = this._months;
		if (this._days !== 0) returnObject.days = this._days;
		if (this._hours !== 0) returnObject.hours = this._hours;
		if (this._minutes !== 0) returnObject.minutes = this._minutes;
		if (this._seconds !== 0) returnObject.seconds = this._seconds;
		if (this._milliseconds !== 0) returnObject.milliseconds = this._milliseconds;

		return returnObject;
	}

	get years(): number {
		return this._years;
	}

	set years(years: number) {
		const parsedType = getParsedType(years);
		if (parsedType !== ParsedType.number) {
			throwPGTPError({
				code: "invalid_type",
				expected: [ParsedType.number],
				received: parsedType,
			});
		}

		if (years % 1 !== 0) {
			throwPGTPError({
				code: "not_whole",
			});
		}

		this._years = years;
	}

	get months(): number {
		return this._months;
	}

	set months(months: number) {
		const parsedType = getParsedType(months);
		if (parsedType !== ParsedType.number) {
			throwPGTPError({
				code: "invalid_type",
				expected: [ParsedType.number],
				received: parsedType,
			});
		}

		if (months % 1 !== 0) {
			throwPGTPError({
				code: "not_whole",
			});
		}

		this._months = months;
	}

	get days(): number {
		return this._days;
	}

	set days(days: number) {
		const parsedType = getParsedType(days);
		if (parsedType !== ParsedType.number) {
			throwPGTPError({
				code: "invalid_type",
				expected: [ParsedType.number],
				received: parsedType,
			});
		}

		if (days % 1 !== 0) {
			throwPGTPError({
				code: "not_whole",
			});
		}

		this._days = days;
	}

	get hours(): number {
		return this._hours;
	}

	set hours(hours: number) {
		const parsedType = getParsedType(hours);
		if (parsedType !== ParsedType.number) {
			throwPGTPError({
				code: "invalid_type",
				expected: [ParsedType.number],
				received: parsedType,
			});
		}

		if (hours % 1 !== 0) {
			throwPGTPError({
				code: "not_whole",
			});
		}

		this._hours = hours;
	}

	get minutes(): number {
		return this._minutes;
	}

	set minutes(minutes: number) {
		const parsedType = getParsedType(minutes);
		if (parsedType !== ParsedType.number) {
			throwPGTPError({
				code: "invalid_type",
				expected: [ParsedType.number],
				received: parsedType,
			});
		}

		if (minutes % 1 !== 0) {
			throwPGTPError({
				code: "not_whole",
			});
		}

		this._minutes = minutes;
	}

	get seconds(): number {
		return this._seconds;
	}

	set seconds(seconds: number) {
		const parsedType = getParsedType(seconds);
		if (parsedType !== ParsedType.number) {
			throwPGTPError({
				code: "invalid_type",
				expected: [ParsedType.number],
				received: parsedType,
			});
		}

		if (seconds % 1 !== 0) {
			throwPGTPError({
				code: "not_whole",
			});
		}

		this._seconds = seconds;
	}

	get milliseconds(): number {
		return this._milliseconds;
	}

	set milliseconds(milliseconds: number) {
		const parsedType = getParsedType(milliseconds);
		if (parsedType !== ParsedType.number) {
			throwPGTPError({
				code: "invalid_type",
				expected: [ParsedType.number],
				received: parsedType,
			});
		}

		this._milliseconds = milliseconds;
	}

	get value(): string {
		return this.toString();
	}

	set value(interval: string) {
		const parsed = Interval.safeFrom(interval);
		if (parsed.success) {
			this._years = parsed.data.years;
			this._months = parsed.data.months;
			this._days = parsed.data.days;
			this._hours = parsed.data.hours;
			this._minutes = parsed.data.minutes;
			this._seconds = parsed.data.seconds;
			this._milliseconds = parsed.data.milliseconds;
		} else throw parsed.error;
	}

	get postgres(): string {
		return this.toString();
	}

	set postgres(interval: string) {
		const parsed = Interval.safeFrom(interval);
		if (parsed.success) {
			this._years = parsed.data.years;
			this._months = parsed.data.months;
			this._days = parsed.data.days;
			this._hours = parsed.data.hours;
			this._minutes = parsed.data.minutes;
			this._seconds = parsed.data.seconds;
			this._milliseconds = parsed.data.milliseconds;
		} else throw parsed.error;
	}
}

export { Interval, IntervalConstructor, IntervalObject, IntervalStyle, IntervalStyleType };
