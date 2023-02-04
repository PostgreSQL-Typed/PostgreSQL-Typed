import { types } from "pg";
import { DataType } from "postgresql-data-types";

import type { ParseContext } from "../../types/ParseContext";
import type { ParseReturnType } from "../../types/ParseReturnType";
import type { SafeEquals } from "../../types/SafeEquals";
import type { SafeFrom } from "../../types/SafeFrom";
import { arrayParser } from "../../util/arrayParser";
import { getParsedType, ParsedType } from "../../util/getParsedType";
import { getRegExpByGroups } from "../../util/getRegExpByGroups";
import { hasKeys } from "../../util/hasKeys";
import { isOneOf } from "../../util/isOneOf";
import { pad } from "../../util/pad";
import { parser } from "../../util/parser";
import { PGTPBase } from "../../util/PGTPBase";
import { PGTPConstructorBase } from "../../util/PGTPConstructorBase";
import { throwPGTPError } from "../../util/throwPGTPError";
import { INVALID, OK } from "../../util/validation";

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
	 * Returns `true` if `obj` is a `Interval`, `false` otherwise.
	 */
	isInterval(obj: any): obj is Interval;
}

class IntervalConstructorClass extends PGTPConstructorBase<Interval> implements IntervalConstructor {
	constructor() {
		super();
	}

	_parse(ctx: ParseContext): ParseReturnType<Interval> {
		const [arg, ...otherArgs] = ctx.data,
			allowedTypes = [ParsedType.number, ParsedType.string, ParsedType.object],
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

	private _parseString(ctx: ParseContext, arg: string): ParseReturnType<Interval> {
		//#region Regexes
		//Traditional PostgreSQL interval format 1 millennium 2 centuries 3 decades 4 year 5 months 6 days 7 hours 8 minutes 9 seconds 10 milliseconds 11 microseconds
		const TraditionalRegex = getRegExpByGroups<{
				millennium: string;
				century: string;
				decade: string;
				year: string;
				month: string;
				week: string;
				day: string;
				hour: string;
				minute: string;
				second: string;
				millisecond: string;
				microsecond: string;
			}>({
				groups: [
					"(?<century>(?:\\s+@)?\\s+[-+]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)\\s*c(?:ent(?:urie)?(?:ury)?s?)?(?:\\s+ago)?)?",
					"(?<decade>(?:\\s+@)?\\s+[-+]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)\\s*dec(?:ade)?s?(?:\\s+ago)?)?",
					"(?<day>(?:\\s+@)?\\s+[-+]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)\\s*d(?:ays?)?(?:\\s+ago)?)?",
					"(?<hour>(?:\\s+@)?\\s+[-+]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)\\s*h(?:(?:ou)?rs?)?(?:\\s+ago)?)?",
					"(?<millisecond>(?:\\s+@)?\\s+[-+]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)\\s*m(?:illi)?sec(?:ond)?s?(?:\\s+ago)?)?",
					"(?<microsecond>(?:\\s+@)?\\s+[-+]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)\\s*microseconds?(?:\\s+ago)?)?",
					"(?<millennium>(?:\\s+@)?\\s+[-+]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)\\s*mil(?:lennium)?s?(?:\\s+ago)?)?",
					"(?<month>(?:\\s+@)?\\s+[-+]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)\\s*mon(?:th)?s?(?:\\s+ago)?)?",
					"(?<minute>(?:\\s+@)?\\s+[-+]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)\\s*m(?:in(?:ute)?s?)?(?:\\s+ago)?)?",
					"(?<second>(?:\\s+@)?\\s+[-+]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)\\s*s(?:ec(?:ond)?s?)?(?:\\s+ago)?)?",
					"(?<week>(?:\\s+@)?\\s+[-+]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)\\s*w(?:eeks?)?(?:\\s+ago)?)?",
					"(?<year>(?:\\s+@)?\\s+[-+]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)\\s*y(?:(?:ea)?rs?)?(?:\\s+ago)?)?",
				],
			}),
			//Traditional PostgreSQL interval format with time as 1 millennium 2 centuries 3 decades 4 year 5 months 6 days 7:08:09
			TraditionalTimeRegex = getRegExpByGroups<{
				millennium: string;
				century: string;
				decade: string;
				year: string;
				month: string;
				week: string;
				day: string;
				hour: string;
				minute: string;
				second: string;
			}>({
				groups: [
					"(?<millennium>\\s*[-+]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)\\s*mil(?:lennium)?s?)?",
					"(?<century>\\s*[-+]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)\\s*c(?:ent(?:urie)?(?:ury)?s?)?)?",
					"(?<decade>\\s*[-+]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)\\s*dec(?:ade)?s?)?",
					"(?<year>\\s*[-+]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)\\s*y(?:(?:ea)?rs?)?)?",
					"(?<month>\\s*[-+]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)\\s*mon(?:th)?s?)?",
					"(?<week>\\s*[-+]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)\\s*w(?:eeks?)?)?",
					"(?<day>\\s*[-+]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)\\s*d(?:ays?)?)?",
					"(?:\\s*(?<hour>[-+]?(?:\\d+(?:\\.\\d*)?|\\.\\d+))(?::(?<minute>[-+]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)))(?::(?<second>[-+]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)))?)",
				],
			}),
			//P1Y2M3W4DT5H6M7S ISO 8601 “format with designators”
			ISODesignatorsRegex = getRegExpByGroups<{
				year: string;
				month: string;
				week: string;
				day: string;
				hour: string;
				minute: string;
				second: string;
			}>({
				groups: [
					"P",
					"(?<year>[-+]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)Y)?",
					"(?<month>[-+]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)M)?",
					"(?<week>[-+]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)W)?",
					"(?<day>[-+]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)D)?",
					"(?:T(?<hour>[-+]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)H)?(?<minute>[-+]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)M)?(?<second>[-+]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)S)?)?",
				],
			}),
			//PYYYYMMDDThhmmss ISO 8601 “basic format”
			ISOBasicRegex = getRegExpByGroups<{
				year: string;
				month: string;
				day: string;
				hour: string;
				minute: string;
				second: string;
			}>({
				groups: [
					"P(?:(?<year>[-+]?\\d{4}(?:\\.\\d*)?)(?<month>[-+]?\\d{2}(?:\\.\\d*)?)(?<day>[-+]?\\d{2}(?:\\.\\d*)?))?T(?<hour>[-+]?\\d{2}(?:\\.\\d*)?)(?<minute>[-+]?\\d{2}(?:\\.\\d*)?)(?<second>[-+]?\\d{2}(?:\\.\\d*)?)",
				],
			}),
			//PYYYY-MM-DDThh:mm:ss ISO 8601 “extended format”
			ISOExtendedRegex = getRegExpByGroups<{
				year: string;
				month: string;
				day: string;
				hour: string;
				minute: string;
				second: string;
			}>({
				groups: [
					"P(?:(?<year>[-+]?(?:\\d+(?:\\.\\d*)?|\\.\\d+))-(?<month>[-+]?(?:\\d+(?:\\.\\d*)?|\\.\\d+))-(?<day>[-+]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)))?T(?:(?<hour>[-+]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)):)?(?:(?<minute>[-+]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)):)?(?<second>[-+]?(?:\\d+(?:\\.\\d*)?|\\.\\d+))",
				],
			}),
			//YYYY-MM DD HH:MM:SS SQL standard interval format "year to second"
			SQLYearToSecondRegex = getRegExpByGroups<{
				year: string;
				month: string;
				day: string;
				hour: string;
				minute: string;
				second: string;
			}>({
				groups: [
					"(?<year>[-+]?(?:\\d+(?:\\.\\d*)?|\\.\\d+))-(?<month>[-+]?(?:\\d+(?:\\.\\d*)?|\\.\\d+))\\s+(?<day>[-+]?(?:\\d+(?:\\.\\d*)?|\\.\\d+))\\s+(?<hour>(?:\\d+(?:\\.\\d*)?|\\.\\d+)):(?<minute>(?:\\d+(?:\\.\\d*)?|\\.\\d+)):(?<second>(?:\\d+(?:\\.\\d*)?|\\.\\d+))",
				],
			}),
			//YYYY-MM SQL standard interval format "year to month"
			SQLYearToMonthRegex = getRegExpByGroups<{
				year: string;
				month: string;
			}>({
				groups: ["(?<year>[-+]?(?:\\d+(?:\\.\\d*)?|\\.\\d+))-(?<month>[-+]?(?:\\d+(?:\\.\\d*)?|\\.\\d+))"],
			}),
			//DD hh:mm:ss SQL standard interval format "day to second"
			SQLDayToSecondRegex = getRegExpByGroups<{
				day: string;
				hour: string;
				minute: string;
				second: string;
			}>({
				groups: [
					"(?<day>[-+]?(?:\\d+(?:\\.\\d*)?|\\.\\d+))\\s+(?<hour>[-+]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)):(?<minute>(?:\\d+(?:\\.\\d*)?|\\.\\d+)(?:\\s+ago)?)(?::(?<second>(?:\\d+(?:\\.\\d*)?|\\.\\d+)(?:\\s+ago)?))?",
				],
			}),
			//hh:mm:ss SQL standard interval format "hour to second"
			SQLHourToSecondRegex = getRegExpByGroups<{
				hour: string;
				minute: string;
				second: string;
			}>({
				groups: ["(?<hour>[-+]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)):(?<minute>(?:\\d+(?:\\.\\d*)?|\\.\\d+)):(?<second>(?:\\d+(?:\\.\\d*)?|\\.\\d+)(?:\\s+ago)?)"],
			}),
			//hh:mm SQL standard interval format "hour to minute"
			SQLMinuteToSecondRegex = getRegExpByGroups<{
				hour: string;
				minute: string;
			}>({
				groups: ["(?<hour>[-+]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)):(?<minute>(?:\\d+(?:\\.\\d*)?|\\.\\d+)(?:\\s+ago)?)"],
			}),
			//ss SQL standard interval format "second"
			SQLSecondRegex = getRegExpByGroups<{
				second: string;
			}>({
				groups: ["(?<second>[-+]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)(?:\\s+ago)?)"],
			}),
			regexes = [
				TraditionalRegex,
				TraditionalTimeRegex,
				ISODesignatorsRegex,
				ISOBasicRegex,
				ISOExtendedRegex,
				SQLYearToSecondRegex,
				SQLYearToMonthRegex,
				SQLDayToSecondRegex,
				SQLHourToSecondRegex,
				SQLMinuteToSecondRegex,
				SQLSecondRegex,
			] as {
				match: (arg: string) => {
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
			const match = regex.match(` ${arg}`);
			if (match) {
				// Clean up the match object (trim and remove all a-z characters)
				const hasAgoInAnyValue = Object.values(match).some(value => value?.trim().endsWith("ago"));
				for (const key in match) {
					match[key as keyof typeof match] = `${hasAgoInAnyValue ? "-" : ""}${
						/* c8 ignore next 2 */
						//to ignore the `?? 0` fallback
						match[key as keyof typeof match]?.trim().match(/([-+]?\d+(?:\.\d+)?)/)?.[1] ?? "0"
					}`;
				}

				result = {
					millennium: "millennium" in match && typeof match.millennium === "string" ? parseFloat(match.millennium) : 0,
					century: "century" in match && typeof match.century === "string" ? parseFloat(match.century) : 0,
					decade: "decade" in match && typeof match.decade === "string" ? parseFloat(match.decade) : 0,
					year: "year" in match && typeof match.year === "string" ? parseFloat(match.year) : 0,
					month: "month" in match && typeof match.month === "string" ? parseFloat(match.month) : 0,
					week: "week" in match && typeof match.week === "string" ? parseFloat(match.week) : 0,
					day: "day" in match && typeof match.day === "string" ? parseFloat(match.day) : 0,
					hour: "hour" in match && typeof match.hour === "string" ? parseFloat(match.hour) : 0,
					minute: "minute" in match && typeof match.minute === "string" ? parseFloat(match.minute) : 0,
					second: "second" in match && typeof match.second === "string" ? parseFloat(match.second) : 0,
					millisecond: "millisecond" in match && typeof match.millisecond === "string" ? parseFloat(match.millisecond) : 0,
					microsecond: "microsecond" in match && typeof match.microsecond === "string" ? parseFloat(match.microsecond) : 0,
				};
				break;
			}
		}

		if (!result) {
			this.setIssueForContext(ctx, {
				code: "invalid_string",
				received: arg,
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
			finalResult.milliseconds += parseFloat(`.${finalResult.seconds.toString().split(".")[1]}`) * 1000;
			finalResult.seconds = Math.floor(finalResult.seconds);
		}

		//Convert minutes to seconds
		if (finalResult.minutes % 1 !== 0) {
			finalResult.seconds += parseFloat(`.${finalResult.minutes.toString().split(".")[1]}`) * 60;
			finalResult.minutes = Math.floor(finalResult.minutes);
		}

		//Convert hours to minutes
		if (finalResult.hours % 1 !== 0) {
			finalResult.minutes += parseFloat(`.${finalResult.hours.toString().split(".")[1]}`) * 60;
			finalResult.hours = Math.floor(finalResult.hours);
		}

		//Convert days to hours
		if (finalResult.days % 1 !== 0) {
			finalResult.hours += parseFloat(`.${finalResult.days.toString().split(".")[1]}`) * 24;
			finalResult.days = Math.floor(finalResult.days);
		}

		//Convert months to days
		if (finalResult.months % 1 !== 0) {
			finalResult.days += parseFloat(`.${finalResult.months.toString().split(".")[1]}`) * 30;
			finalResult.months = Math.floor(finalResult.months);
		}

		//Convert years to days
		if (finalResult.years % 1 !== 0) {
			finalResult.days += parseFloat(`.${finalResult.years.toString().split(".")[1]}`) * 365;
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

	private _parseNumber(ctx: ParseContext, arg: number, otherArgs: any[]): ParseReturnType<Interval> {
		const totalLength = otherArgs.length + 1;
		if (totalLength !== 7) {
			this.setIssueForContext(
				ctx,
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

		const [years, months, days, hours, minutes, seconds, milliseconds] = [arg, ...otherArgs] as number[];
		return this._parseString(
			ctx,
			`${years} years ${months} months ${days} days ${hours} hours ${minutes} minutes ${seconds} seconds ${milliseconds} milliseconds`
		);
	}

	private _parseObject(ctx: ParseContext, arg: object): ParseReturnType<Interval> {
		// Should be [Interval]
		if (Interval.isInterval(arg)) return OK(new IntervalClass(arg.years, arg.months, arg.days, arg.hours, arg.minutes, arg.seconds, arg.milliseconds));

		// Should be [IntervalObject]
		const parsedObject = hasKeys<IntervalObject>(arg, [
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

		const { years, months, days, hours, minutes, seconds, milliseconds } = parsedObject.obj;
		return this._parseString(
			ctx,
			`${years ?? 0} years ${months ?? 0} months ${days ?? 0} days ${hours ?? 0} hours ${minutes ?? 0} minutes ${seconds ?? 0} seconds ${
				milliseconds ?? 0
			} milliseconds`
		);
	}

	isInterval(obj: any): obj is Interval {
		return obj instanceof IntervalClass;
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

	_equals(ctx: ParseContext): ParseReturnType<{ readonly equals: boolean; readonly data: Interval }> {
		//@ts-expect-error - _equals receives the same context as _parse
		const parsed = Interval.safeFrom(...ctx.data);
		if (parsed.success) {
			return OK({
				equals: parsed.data.toString() === this.toString(),
				data: parsed.data,
			});
		}
		this.setIssueForContext(ctx, parsed.error.issue);
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
		if (ddhhmmss.success && (typeof ddhhmmss.obj.seconds !== "undefined" || typeof ddhhmmss.obj.milliseconds !== "undefined")) {
			const { days, hours, minutes, milliseconds } = ddhhmmss.obj;
			let { seconds } = ddhhmmss.obj;
			if (typeof seconds === "undefined") seconds = 0;
			// add the milliseconds to the seconds
			if (typeof milliseconds !== "undefined") seconds += milliseconds / 1000;
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
		if (hhmmss.success && (typeof hhmmss.obj.seconds !== "undefined" || typeof hhmmss.obj.milliseconds !== "undefined")) {
			const { hours, minutes, milliseconds } = hhmmss.obj;
			let { seconds } = hhmmss.obj;
			if (typeof seconds === "undefined") seconds = 0;
			// add the milliseconds to the seconds
			if (typeof milliseconds !== "undefined") seconds += milliseconds / 1000;
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
		if (ss.success && (typeof ss.obj.seconds !== "undefined" || typeof ss.obj.milliseconds !== "undefined")) {
			const { milliseconds } = ss.obj;
			let { seconds } = ss.obj;
			if (typeof seconds === "undefined") seconds = 0;
			// add the milliseconds to the seconds
			if (typeof milliseconds !== "undefined") seconds += milliseconds / 1000;
			return `${seconds}`;
		}

		// YYYY-MM DD HH:MM:SS
		const data = this.toJSON(),
			{ years, months, days, hours, minutes, milliseconds } = data;
		let { seconds } = data;
		// add the milliseconds to the seconds
		if (typeof milliseconds !== "undefined") {
			if (typeof seconds === "undefined") seconds = 0;
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

			if (!timePart.length && !datePart.length) return "PT0S";

			if (!timePart.length) return `P${datePart}`;

			return `P${datePart}T${timePart}`;
		}

		const data = this.toJSON(),
			{ years, months, days, hours, minutes, milliseconds } = data;
		let { seconds } = data;
		// add the milliseconds to the seconds
		if (typeof milliseconds !== "undefined") {
			if (typeof seconds === "undefined") seconds = 0;
			seconds += milliseconds / 1000;
		}

		//PYYYY-MM-DDThh:mm:ss
		const formatted = `P${pad(years ?? 0, 4)}-${pad(months ?? 0)}-${pad(days ?? 0)}T${pad(hours ?? 0)}:${pad(minutes ?? 0)}:${pad(seconds ?? 0)}`;

		// Basic format is the same as ISO, except that the hyphens and colons are removed.
		if (style === IntervalStyle.ISOBasic) return formatted.replaceAll(/[-:]/g, "");
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
		if (property === "seconds" && this.milliseconds) value = (value + this.milliseconds / 1_000).toFixed(6).replace(/0+$/, "");

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
				.filter(d => d)
				.join(" "),
			timePart = timeProperties
				.map(t => this._buildPostgreSQLProperty(t, isShort))
				// remove empty strings
				.filter(t => t)
				.join(" ");

		if (!timePart.length && !datePart.length) return "0";

		if (!timePart.length) return datePart;

		const timeStyles: IntervalStyleType[] = [IntervalStyle.PostgreSQLTime, IntervalStyle.PostgreSQLTimeShort];
		if (!timeStyles.includes(style)) {
			if (!datePart.length) return timePart;
			return `${datePart} ${timePart}`;
		}

		// PostgreSQL time format is different, it uses hh:mm:ss
		const data = this.toJSON(),
			{ hours, minutes, milliseconds } = data;
		let { seconds } = data;
		// add the milliseconds to the seconds
		if (typeof milliseconds !== "undefined") {
			if (typeof seconds === "undefined") seconds = 0;
			seconds += milliseconds / 1000;
		}

		const newTimePart = `${pad(hours ?? 0)}:${pad(minutes ?? 0)}:${pad(seconds ?? 0)}`;

		if (!datePart.length) return newTimePart;

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

		if (short) return `${value} ${propertiesISOEquivalent[property]}`;
		else return `${value} ${property}`;
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
}

types.setTypeParser(DataType.interval as any, parser(Interval));
types.setTypeParser(DataType._interval as any, arrayParser(Interval));

export { Interval, IntervalObject, IntervalStyle, IntervalStyleType };
