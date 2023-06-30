/* eslint-disable unicorn/filename-case */
import { getParsedType, hasKeys, INVALID, isOneOf, OK, ParsedType, type ParseReturnType } from "@postgresql-typed/util";
import { DateTime, Zone } from "luxon";

import type { Offset } from "../../types/Offset.js";
import { OffsetDirection, type OffsetDirectionType } from "../../types/OffsetDirection.js";
import type { ParseContext } from "../../types/ParseContext.js";
import type { SafeEquals } from "../../types/SafeEquals.js";
import type { SafeFrom } from "../../types/SafeFrom.js";
import { formatOffset } from "../../util/formatOffset.js";
import { isValidDate } from "../../util/isValidDate.js";
import { isValidDateTime } from "../../util/isValidDateTime.js";
import { pad } from "../../util/pad.js";
import { PgTPBase } from "../../util/PgTPBase.js";
import { PgTPConstructorBase } from "../../util/PgTPConstructorBase.js";
import { REGEXES } from "../../util/regexes.js";
import { throwPgTPError } from "../../util/throwPgTPError.js";
import { validateTimeZone } from "../../util/validateTimeZone.js";
import { Date } from "./Date.js";
import { Time } from "./Time.js";
import { Timestamp } from "./Timestamp.js";
import { TimeTZ } from "./TimeTZ.js";

enum TimestampStyle {
	ISO = "ISO",
	ISODate = "ISO-Date",
	ISOTime = "ISO-Time",
	ISODuration = "ISO-Duration",
	ISODurationShort = "ISO-Duration-Short",
	ISODurationBasic = "ISO-Duration-Basic",
	ISODurationExtended = "ISO-Duration-Extended",
	POSIX = "POSIX",
	PostgreSQL = "PostgreSQL",
	PostgreSQLShort = "PostgreSQL-Short",
	SQL = "SQL",
}

type TimestampISOStyles = "ISO" | "ISO-Date" | "ISO-Time";
type TimestampISODurationStyles = "ISO-Duration" | "ISO-Duration-Short" | "ISO-Duration-Basic" | "ISO-Duration-Extended";
type TimestampPOSIXStyles = "POSIX";
type TimestampPostgreSQLStyles = "PostgreSQL" | "PostgreSQL-Short";
type TimestampSQLStyles = "SQL";
type TimestampStyleType = TimestampISOStyles | TimestampISODurationStyles | TimestampPOSIXStyles | TimestampPostgreSQLStyles | TimestampSQLStyles;

const timestampStyles: TimestampStyleType[] = [
	TimestampStyle.ISO,
	TimestampStyle.ISODate,
	TimestampStyle.ISOTime,
	TimestampStyle.ISODuration,
	TimestampStyle.ISODurationShort,
	TimestampStyle.ISODurationBasic,
	TimestampStyle.ISODurationExtended,
	TimestampStyle.POSIX,
	TimestampStyle.PostgreSQL,
	TimestampStyle.PostgreSQLShort,
	TimestampStyle.SQL,
];

interface TimestampTZObject {
	year: number;
	month: number;
	day: number;
	hour: number;
	minute: number;
	second: number;
	offset: Offset;
}

type TimestampTZProperties = keyof Omit<TimestampTZObject, "offset">;

interface TimestampTZ {
	year: number;
	month: number;
	day: number;
	hour: number;
	minute: number;
	second: number;
	offset: Offset;

	value: string;
	postgres: string;

	/**
	 * @param style The style to use when converting the timestamp to a string. Defaults to `ISO`.
	 * @returns The timestamp as a string.
	 * @example
	 * const timestamp = TimestampTZ.from("01-01-2023 20:00:23.123456 PST+05:00");
	 *
	 * timestamp.toString(); // "2023-01-01T20:00:23.123456-13:00"
	 * timestamp.toString("ISO"); // "2023-01-01T20:00:23.123456-13:00"
	 * timestamp.toString("ISO-Date"); // "2023-01-01"
	 * timestamp.toString("ISO-Time"); // "20:00:23.123456-13:00"
	 * timestamp.toString("ISO-Duration"); // "P2023Y1M1DT20H0M23.123456S"
	 * timestamp.toString("ISO-Duration-Short"); // "P2023Y1M1DT20H23.123456S"
	 * timestamp.toString("ISO-Duration-Basic"); // "P20230101T200023.123456S"
	 * timestamp.toString("ISO-Duration-Extended"); // "P2023-01-01T20:00:23.123456S"
	 * timestamp.toString("POSIX"); // "2023-01-01 20:00:23.123456-13:00"
	 * timestamp.toString("PostgreSQL"); // "Sunday January 01 2023 20:00:23.123456 -13:00"
	 * timestamp.toString("PostgreSQL-Short"); // "Sun Jan 01 2023 20:00:23.123456 -13:00"
	 * timestamp.toString("SQL"); // "2023-01 01 20:00:23.123456-13:00"
	 */
	toString(style?: TimestampStyle | TimestampStyleType): string;
	/**
	 * @returns The timestamp as a unix timestamp.
	 */
	toNumber(): number;
	toJSON(): TimestampTZObject;

	toDate(): Date;
	toTime(): Time;
	toTimeTZ(): TimeTZ;
	toTimestamp(): Timestamp;

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
	equals(
		year: number,
		month: number,
		day: number,
		hour: number,
		minute: number,
		second: number,
		offsetHour: number,
		offsetMinute: number,
		offsetDirection: OffsetDirection | OffsetDirectionType
	): boolean;
	equals(timestamptz: TimestampTZ | globalThis.Date | DateTime): boolean;
	equals(object: TimestampTZObject): boolean;
	safeEquals(string: string): SafeEquals<TimestampTZ>;
	safeEquals(unixTimestamp: number): SafeEquals<TimestampTZ>;
	safeEquals(
		year: number,
		month: number,
		day: number,
		hour: number,
		minute: number,
		second: number,
		offsetHour: number,
		offsetMinute: number,
		offsetDirection: OffsetDirection | OffsetDirectionType
	): SafeEquals<TimestampTZ>;
	safeEquals(timestamptz: TimestampTZ | globalThis.Date | DateTime): SafeEquals<TimestampTZ>;
	safeEquals(object: TimestampTZObject): SafeEquals<TimestampTZ>;
}

interface TimestampTZConstructor {
	from(string: string): TimestampTZ;
	from(unixTimestamp: number): TimestampTZ;
	from(
		year: number,
		month: number,
		day: number,
		hour: number,
		minute: number,
		second: number,
		offsetHour: number,
		offsetMinute: number,
		offsetDirection: OffsetDirection | OffsetDirectionType
	): TimestampTZ;
	from(timestamptz: TimestampTZ | globalThis.Date | DateTime): TimestampTZ;
	from(object: TimestampTZObject): TimestampTZ;
	safeFrom(string: string): SafeFrom<TimestampTZ>;
	safeFrom(unixTimestamp: number): SafeFrom<TimestampTZ>;
	safeFrom(
		year: number,
		month: number,
		day: number,
		hour: number,
		minute: number,
		second: number,
		offsetHour: number,
		offsetMinute: number,
		offsetDirection: OffsetDirection | OffsetDirectionType
	): SafeFrom<TimestampTZ>;
	safeFrom(timestamptz: TimestampTZ | globalThis.Date | DateTime): SafeFrom<TimestampTZ>;
	safeFrom(object: TimestampTZObject): SafeFrom<TimestampTZ>;
	/**
	 * Returns `true` if `object` is a `TimestampTZ`, `false` otherwise.
	 */
	isTimestampTZ(object: any): object is TimestampTZ;
}

class TimestampTZConstructorClass extends PgTPConstructorBase<TimestampTZ> implements TimestampTZConstructor {
	constructor() {
		super();
	}

	_parse(context: ParseContext): ParseReturnType<TimestampTZ> {
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

	private _parseString(context: ParseContext, argument: string): ParseReturnType<TimestampTZ> {
		const today = DateTime.now(),
			posixDateTime = REGEXES.POSIXDateTime.match(argument),
			postgresDateTime = REGEXES.PostgreSQLDateTime.match(argument);

		// posixDateTime and postgresDateTime return the same groups so we can use the same logic for both
		if (posixDateTime || postgresDateTime) {
			// Remove the null type because we know it's not null
			const dateTime = (posixDateTime || postgresDateTime) as {
					dayOfWeek?: string;
					year: string;
					month: string;
					day: string;
					hour: string;
					minute: string;
					ampm?: string;
					second?: string;
					timezone?: string;
					timezoneSign?: string;
					timezoneHour?: string;
					timezoneMinute?: string;
				},
				{ year, month, day, minute, second, ampm, timezoneSign, timezoneHour, timezoneMinute } = dateTime;
			let { timezone, hour } = dateTime;
			if (ampm?.toLowerCase() === "pm") hour = `${Number.parseInt(hour) + 12}`;

			timezone ??= "GMT";
			if (timezone === "BC" || timezone === "Z") timezone = "GMT";
			const validatedTimezone = validateTimeZone(timezone);
			if (validatedTimezone === false) {
				this.setIssueForContext(context, {
					code: "invalid_timezone",
					received: timezone,
				});
				return INVALID;
			}

			let offsetNumber = validatedTimezone;
			if (timezoneSign !== undefined) {
				if (timezoneSign === "-" && timezoneHour !== undefined) {
					// parse timezoneHour and timezoneMinute as numbers
					const parsedTimezoneHour = Number.parseInt(timezoneHour),
						parsedTimezoneMinute = Number.parseInt(timezoneMinute || "0");

					/* c8 ignore next 8 */
					// Assert never
					if (Number.isNaN(parsedTimezoneHour) || Number.isNaN(parsedTimezoneMinute)) {
						this.setIssueForContext(context, {
							code: "invalid_timezone",
							received: `${timezone}${timezoneSign}${timezoneHour}${timezoneMinute ? `:${timezoneMinute}` : ""}`,
						});
						return INVALID;
					}

					// Make the parsed numbers negative
					offsetNumber -= parsedTimezoneHour * 60 + parsedTimezoneMinute;
				} else if (timezoneSign === "+" && timezoneHour !== undefined) {
					// parse timezoneHour and timezoneMinute as numbers
					const parsedTimezoneHour = Number.parseInt(timezoneHour),
						parsedTimezoneMinute = Number.parseInt(timezoneMinute || "0");

					/* c8 ignore next 8 */
					// Assert never
					if (Number.isNaN(parsedTimezoneHour) || Number.isNaN(parsedTimezoneMinute)) {
						this.setIssueForContext(context, {
							code: "invalid_timezone",
							received: `${timezone}${timezoneSign}${timezoneHour}${timezoneMinute ? `:${timezoneMinute}` : ""}`,
						});
						return INVALID;
					}

					offsetNumber += parsedTimezoneHour * 60 + parsedTimezoneMinute;
					/* c8 ignore next 8 */
					// Assert never
				} else {
					this.setIssueForContext(context, {
						code: "invalid_timezone",
						received: `${timezone}${timezoneSign}${timezoneHour || 0}${timezoneMinute ? `:${timezoneMinute}` : ""}`,
					});
					return INVALID;
				}
			}

			return OK(
				new TimestampTZClass(
					Number.parseInt(year),
					Number.parseInt(month),
					Number.parseInt(day),
					Number.parseInt(hour),
					Number.parseInt(minute),
					Number.parseFloat(second || "0"),
					{
						direction: offsetNumber < 0 ? OffsetDirection.minus : OffsetDirection.plus,
						hour: Math.floor(Math.abs(offsetNumber) / 60),
						minute: Math.abs(offsetNumber) % 60,
					}
				)
			);
		}

		const isoDateTime = REGEXES.ISO8601DateTime.match(argument);
		if (isoDateTime) {
			const { year, month, day, hour, minute, second, timezoneSign, timezoneHour, timezoneMinute } = isoDateTime;

			if (timezoneSign !== undefined) {
				if (["+", "-"].includes(timezoneSign) && timezoneHour !== undefined) {
					return OK(
						new TimestampTZClass(
							Number.parseInt(year),
							Number.parseInt(month),
							Number.parseInt(day),
							Number.parseInt(hour),
							Number.parseInt(minute),
							Number.parseFloat(second),
							{
								direction: timezoneSign === "-" ? OffsetDirection.minus : OffsetDirection.plus,
								hour: Number.parseInt(timezoneHour),
								minute: Number.parseInt(timezoneMinute || "0"),
							}
						)
					);
					/* c8 ignore next 8 */
					// Assert never
				} else {
					this.setIssueForContext(context, {
						code: "invalid_timezone",
						received: `${timezoneSign}${timezoneHour || 0}${timezoneMinute ? `:${timezoneMinute}` : ""}`,
					});
					return INVALID;
				}
			}

			return OK(
				new TimestampTZClass(
					Number.parseInt(year),
					Number.parseInt(month),
					Number.parseInt(day),
					Number.parseInt(hour),
					Number.parseInt(minute),
					Number.parseFloat(second),
					{
						direction: OffsetDirection.plus,
						hour: 0,
						minute: 0,
					}
				)
			);
		}

		const isoDate = REGEXES.ISO8601Date.match(argument);
		if (isoDate) {
			const { year, month, day } = isoDate;

			return OK(
				new TimestampTZClass(Number.parseInt(year), Number.parseInt(month), Number.parseInt(day), 0, 0, 0, {
					direction: OffsetDirection.plus,
					hour: 0,
					minute: 0,
				})
			);
		}

		const isoTime = REGEXES.ISO8601Time.match(argument);
		if (isoTime) {
			const { minute, second, ampm, timezoneSign, timezoneHour, timezoneMinute } = isoTime;
			let { hour } = isoTime;
			if (ampm?.toLowerCase() === "pm") hour = `${Number.parseInt(hour) + 12}`;

			if (timezoneSign !== undefined) {
				if (["+", "-"].includes(timezoneSign) && timezoneHour !== undefined) {
					return OK(
						new TimestampTZClass(today.year, today.month, today.day, Number.parseInt(hour), Number.parseInt(minute), Number.parseFloat(second || "0"), {
							direction: timezoneSign === "-" ? OffsetDirection.minus : OffsetDirection.plus,
							hour: Number.parseInt(timezoneHour),
							minute: Number.parseInt(timezoneMinute || "0"),
						})
					);
					/* c8 ignore next 8 */
					// Assert never
				} else {
					this.setIssueForContext(context, {
						code: "invalid_timezone",
						received: `${timezoneSign}${timezoneHour || 0}${timezoneMinute ? `:${timezoneMinute}` : ""}`,
					});
					return INVALID;
				}
			}

			return OK(
				new TimestampTZClass(today.year, today.month, today.day, Number.parseInt(hour), Number.parseInt(minute), Number.parseFloat(second || "0"), {
					direction: OffsetDirection.plus,
					hour: 0,
					minute: 0,
				})
			);
		}

		const posixTime = REGEXES.POSIXTime.match(argument);
		if (posixTime) {
			// Remove the null type because we know it's not null
			const { minute, second, ampm, timezoneSign, timezoneHour, timezoneMinute } = posixTime;
			let { timezone, hour } = posixTime;
			if (ampm?.toLowerCase() === "pm") hour = `${Number.parseInt(hour) + 12}`;

			timezone ??= "GMT";
			if (timezone === "BC" || timezone === "Z") timezone = "GMT";
			const validatedTimezone = validateTimeZone(timezone);
			if (validatedTimezone === false) {
				this.setIssueForContext(context, {
					code: "invalid_timezone",
					received: timezone,
				});
				return INVALID;
			}

			let offsetNumber = validatedTimezone;
			if (timezoneSign !== undefined) {
				if (timezoneSign === "-" && timezoneHour !== undefined) {
					// parse timezoneHour and timezoneMinute as numbers
					const parsedTimezoneHour = Number.parseInt(timezoneHour),
						parsedTimezoneMinute = Number.parseInt(timezoneMinute || "0");

					/* c8 ignore next 8 */
					// Assert never
					if (Number.isNaN(parsedTimezoneHour) || Number.isNaN(parsedTimezoneMinute)) {
						this.setIssueForContext(context, {
							code: "invalid_timezone",
							received: `${timezone}${timezoneSign}${timezoneHour}${timezoneMinute ? `:${timezoneMinute}` : ""}`,
						});
						return INVALID;
					}

					// Make the parsed numbers negative
					offsetNumber -= parsedTimezoneHour * 60 + parsedTimezoneMinute;
				} else if (timezoneSign === "+" && timezoneHour !== undefined) {
					// parse timezoneHour and timezoneMinute as numbers
					const parsedTimezoneHour = Number.parseInt(timezoneHour),
						parsedTimezoneMinute = Number.parseInt(timezoneMinute || "0");

					/* c8 ignore next 8 */
					// Assert never
					if (Number.isNaN(parsedTimezoneHour) || Number.isNaN(parsedTimezoneMinute)) {
						this.setIssueForContext(context, {
							code: "invalid_timezone",
							received: `${timezone}${timezoneSign}${timezoneHour}${timezoneMinute ? `:${timezoneMinute}` : ""}`,
						});
						return INVALID;
					}

					offsetNumber += parsedTimezoneHour * 60 + parsedTimezoneMinute;
					/* c8 ignore next 8 */
					// Assert never
				} else {
					this.setIssueForContext(context, {
						code: "invalid_timezone",
						received: `${timezone}${timezoneSign}${timezoneHour || 0}${timezoneMinute ? `:${timezoneMinute}` : ""}`,
					});
					return INVALID;
				}
			}

			return OK(
				new TimestampTZClass(today.year, today.month, today.day, Number.parseInt(hour), Number.parseInt(minute), Number.parseFloat(second || "0"), {
					direction: offsetNumber < 0 ? OffsetDirection.minus : OffsetDirection.plus,
					hour: Math.floor(Math.abs(offsetNumber) / 60),
					minute: Math.abs(offsetNumber) % 60,
				})
			);
		}

		const durationRegexes = [REGEXES.SQLYearToSecond, REGEXES.ISO8601DurationsDesignators, REGEXES.ISO8601DurationsBasic, REGEXES.ISO8601DurationsExtended];
		// All of these regexes are mutually exclusive, so we can just loop through them until we find a match
		for (const regex of durationRegexes) {
			const match = regex.match(argument);
			if (match) {
				const { year, month, day, hour, minute, second } = match;

				return OK(
					new TimestampTZClass(
						Number.parseInt(year) || 0,
						Number.parseInt(month) || 0,
						Number.parseInt(day) || 0,
						Number.parseInt(hour) || 0,
						Number.parseInt(minute) || 0,
						Number.parseFloat(second) || 0,
						{
							direction: OffsetDirection.plus,
							hour: 0,
							minute: 0,
						}
					)
				);
			}
		}

		this.setIssueForContext(context, {
			code: "invalid_string",
			received: argument,
			expected: "LIKE YYYY-MM-DD HH:MM:SS+HH:MM",
		});
		return INVALID;
	}

	private _parseNumber(context: ParseContext, argument: number, otherArguments: any[]): ParseReturnType<TimestampTZ> {
		const totalLength = otherArguments.length + 1;
		if (totalLength === 1) {
			return this._parseObject(
				context,
				DateTime.fromMillis(argument, {
					zone: "UTC",
				})
			);
		}

		if (totalLength !== 9) {
			this.setIssueForContext(
				context,
				totalLength > 9
					? {
							code: "too_big",
							type: "arguments",
							maximum: 9,
							exact: true,
					  }
					: {
							code: "too_small",
							type: "arguments",
							minimum: 9,
							exact: true,
					  }
			);
			return INVALID;
		}

		// Should be [year, month, day, hour, minute, second, offsetHour, offsetMinute, offsetDirection]
		// To validate all the arguments, we make them go through the object parser
		return this._parseObject(context, {
			year: argument,
			month: otherArguments[0],
			day: otherArguments[1],
			hour: otherArguments[2],
			minute: otherArguments[3],
			second: otherArguments[4],
			offset: {
				hour: otherArguments[5],
				minute: otherArguments[6],
				direction: otherArguments[7],
			},
		});
	}

	private _parseObject(context: ParseContext, argument: object): ParseReturnType<TimestampTZ> {
		// Should be [TimestampTZ]
		if (TimestampTZ.isTimestampTZ(argument))
			return OK(new TimestampTZClass(argument.year, argument.month, argument.day, argument.hour, argument.minute, argument.second, argument.offset));

		// Should be [globalThis.Date]
		const jsDate = isValidDate(argument);
		if (jsDate.isOfSameType) {
			if (jsDate.isValid) {
				const [year, month, day, hour, minute, second, offset, milliseconds] = [
					jsDate.data.getFullYear(),
					jsDate.data.getMonth() + 1,
					jsDate.data.getDate(),
					jsDate.data.getHours(),
					jsDate.data.getMinutes(),
					jsDate.data.getSeconds(),
					jsDate.data.getTimezoneOffset(),
					jsDate.data.getMilliseconds(),
				];
				return OK(
					new TimestampTZClass(year, month, day, hour, minute, second + milliseconds / 1000, {
						hour: Math.abs(offset / 60),
						minute: Math.abs(offset % 60),
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
				const [year, month, day, hour, minute, second, offset, milliseconds] = [
					luxonDate.data.year,
					luxonDate.data.month,
					luxonDate.data.day,
					luxonDate.data.hour,
					luxonDate.data.minute,
					luxonDate.data.second,
					luxonDate.data.offset,
					luxonDate.data.millisecond,
				];
				return OK(
					new TimestampTZClass(year, month, day, hour, minute, second + milliseconds / 1000, {
						hour: Math.abs(offset / 60),
						minute: Math.abs(offset % 60),
						direction: offset < 0 ? OffsetDirection.minus : OffsetDirection.plus,
					})
				);
			}
			this.setIssueForContext(context, luxonDate.error);
			return INVALID;
		}

		// Should be [TimestampTZObject]
		const parsedObject = hasKeys<TimestampTZObject>(argument, [
			["year", "number"],
			["month", "number"],
			["day", "number"],
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

		const { year, month, day, hour, minute, second, offset } = parsedObject.obj,
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

		if (year % 1 !== 0) {
			throwPgTPError({
				code: "not_whole",
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
				minimum: 1,
				type: "number",
				inclusive: true,
			});
		}

		if (month > 12) {
			throwPgTPError({
				code: "too_big",
				maximum: 12,
				type: "number",
				inclusive: true,
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
				minimum: 1,
				type: "number",
				inclusive: true,
			});
		}

		if (day > 31) {
			throwPgTPError({
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
			});
		}

		if (parsedOffset.obj.hour < 0) {
			throwPgTPError({
				code: "too_small",
				minimum: 0,
				type: "number",
				inclusive: true,
			});
		}

		if (parsedOffset.obj.hour > 23) {
			throwPgTPError({
				code: "too_big",
				maximum: 23,
				type: "number",
				inclusive: true,
			});
		}

		if (parsedOffset.obj.minute % 1 !== 0) {
			throwPgTPError({
				code: "not_whole",
			});
		}

		if (parsedOffset.obj.minute < 0) {
			throwPgTPError({
				code: "too_small",
				minimum: 0,
				type: "number",
				inclusive: true,
			});
		}

		if (parsedOffset.obj.minute > 59) {
			throwPgTPError({
				code: "too_big",
				maximum: 59,
				type: "number",
				inclusive: true,
			});
		}

		return OK(new TimestampTZClass(year, month, day, hour, minute, second, parsedOffset.obj));
	}

	isTimestampTZ(object: any): object is TimestampTZ {
		return object instanceof TimestampTZClass;
	}
}

const TimestampTZ: TimestampTZConstructor = new TimestampTZConstructorClass();

class TimestampTZClass extends PgTPBase<TimestampTZ> implements TimestampTZ {
	constructor(
		private _year: number,
		private _month: number,
		private _day: number,
		private _hour: number,
		private _minute: number,
		private _second: number,
		private _offset: Offset
	) {
		super();
	}

	_equals(context: ParseContext): ParseReturnType<{ readonly equals: boolean; readonly data: TimestampTZ }> {
		//@ts-expect-error - _equals receives the same context as _parse
		const parsed = TimestampTZ.safeFrom(...context.data);
		if (parsed.success) {
			return OK({
				equals: parsed.data.toDateTime("UTC").toString() === this.toDateTime("UTC").toString(),
				data: parsed.data,
			});
		}
		this.setIssueForContext(context, parsed.error.issue);
		return INVALID;
	}

	toString(style: TimestampStyle | TimestampStyleType = TimestampStyle.ISO): string {
		switch (style) {
			case TimestampStyle.ISO:
				return this._toStringISO();
			case TimestampStyle.ISODate:
				return this._toStringISODate();
			case TimestampStyle.ISOTime:
				return this._toStringISOTime();
			case TimestampStyle.ISODuration:
			case TimestampStyle.ISODurationBasic:
			case TimestampStyle.ISODurationShort:
			case TimestampStyle.ISODurationExtended:
				return this._toStringISODuration(style);
			case TimestampStyle.POSIX:
				return this._toStringPOSIX();
			case TimestampStyle.PostgreSQL:
			case TimestampStyle.PostgreSQLShort:
				return this._toStringPostgreSQL(style);
			case TimestampStyle.SQL:
				return this._toStringSQL();

			default:
				throwPgTPError({
					code: "invalid_string",
					expected: timestampStyles,
					received: style,
				});
		}
	}

	private _toStringISO(): string {
		return `${this._toStringISODate()}T${this._toStringISOTime()}`;
	}

	private _toStringISODate(): string {
		return `${pad(this._year, 4)}-${pad(this._month)}-${pad(this._day)}`;
	}

	private _toStringISOTime(): string {
		return `${pad(this._hour)}:${pad(this._minute)}:${pad(this._second)}${formatOffset(this._offset, { returnZ: true })}`;
	}

	private _toStringISODuration(style: TimestampISODurationStyles): string {
		const allowedStyles: TimestampISODurationStyles[] = [TimestampStyle.ISODuration, TimestampStyle.ISODurationShort];
		if (allowedStyles.includes(style)) {
			const short = style === TimestampStyle.ISODurationShort,
				dateProperties: TimestampTZProperties[] = ["year", "month", "day"],
				timeProperties: TimestampTZProperties[] = ["hour", "minute", "second"],
				datePart = dateProperties.map(d => this._buildISODurationProperty(d, short)).join(""),
				timePart = timeProperties.map(t => this._buildISODurationProperty(t, short)).join("");

			if (timePart.length === 0 && datePart.length === 0) return "PT0S";

			if (timePart.length === 0) return `P${datePart}`;

			return `P${datePart}T${timePart}`;
		}

		const data = this.toJSON(),
			{ year, month, day, hour, minute, second } = data,
			//PYYYY-MM-DDThh:mm:ss
			formatted = `P${pad(year, 4)}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(minute)}:${pad(second)}`;

		// Basic format is the same as ISO, except that the hyphens and colons are removed.
		if (style === TimestampStyle.ISODurationBasic) return formatted.replaceAll(/[:-]/g, "");
		return formatted;
	}

	private _buildISODurationProperty(property: TimestampTZProperties, short = false): string {
		const propertiesISOEquivalent = {
				year: "Y",
				month: "M",
				day: "D",
				hour: "H",
				minute: "M",
				second: "S",
			},
			value: string | number = this[property];

		if (short && value === 0) return "";
		return value + propertiesISOEquivalent[property];
	}

	private _toStringPOSIX(): string {
		return `${this._toStringISODate()} ${pad(this._hour)}:${pad(this._minute)}:${pad(this._second)}${formatOffset(this._offset, { returnEmpty: true })}`;
	}

	private _toStringPostgreSQL(style: TimestampPostgreSQLStyles): string {
		const dateTime = DateTime.fromISO(this._toStringISO(), {
				setZone: true,
				locale: "en",
			}),
			isShort = style === TimestampStyle.PostgreSQLShort,
			dayOfWeek = isShort ? dateTime.weekdayShort : dateTime.weekdayLong,
			month = isShort ? dateTime.monthShort : dateTime.monthLong;

		return `${dayOfWeek} ${month} ${pad(this._day)} ${this._year} ${pad(this._hour)}:${pad(this._minute)}:${pad(this._second)} GMT${formatOffset(this._offset, {
			returnEmpty: true,
		})}`;
	}

	private _toStringSQL(): string {
		// YYYY-MM DD HH:MM:SS+HH:MM
		const data = this.toJSON(),
			{ year, month, day, hour, minute, second } = data;

		return `${year}-${month} ${day} ${pad(hour)}:${pad(minute)}:${pad(second)}${formatOffset(this._offset, {
			returnEmpty: true,
		})}`;
	}

	toNumber(): number {
		return this.toDateTime("UTC").toMillis();
	}

	toJSON(): TimestampTZObject {
		return {
			year: this._year,
			month: this._month,
			day: this._day,
			hour: this._hour,
			minute: this._minute,
			second: this._second,
			offset: this._offset,
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

	toTimeTZ(): TimeTZ {
		return TimeTZ.from({
			hour: this._hour,
			minute: this._minute,
			second: this._second,
			offset: this._offset,
		});
	}

	toTimestamp(): Timestamp {
		return Timestamp.from({
			year: this._year,
			month: this._month,
			day: this._day,
			hour: this._hour,
			minute: this._minute,
			second: this._second,
		});
	}

	toDateTime(zone?: string | Zone | undefined): DateTime {
		return DateTime.fromISO(this._toStringISO(), { setZone: true }).setZone(zone);
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
				minimum: 1,
				type: "number",
				inclusive: true,
			});
		}

		if (month > 12) {
			throwPgTPError({
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
				minimum: 1,
				type: "number",
				inclusive: true,
			});
		}

		if (day > 31) {
			throwPgTPError({
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
			throwPgTPError({
				code: "invalid_type",
				expected: [ParsedType.number],
				received: parsedType,
			});
		}

		if (hour % 1 !== 0) {
			throwPgTPError({
				code: "not_whole",
			});
		}

		if (hour < 0) {
			throwPgTPError({
				code: "too_small",
				minimum: 0,
				type: "number",
				inclusive: true,
			});
		}

		if (hour > 23) {
			throwPgTPError({
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
			throwPgTPError({
				code: "invalid_type",
				expected: [ParsedType.number],
				received: parsedType,
			});
		}

		if (minute % 1 !== 0) {
			throwPgTPError({
				code: "not_whole",
			});
		}

		if (minute < 0) {
			throwPgTPError({
				code: "too_small",
				minimum: 0,
				type: "number",
				inclusive: true,
			});
		}

		if (minute > 59) {
			throwPgTPError({
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
			throwPgTPError({
				code: "invalid_type",
				expected: [ParsedType.number],
				received: parsedType,
			});
		}

		if (second < 0) {
			throwPgTPError({
				code: "too_small",
				minimum: 0,
				type: "number",
				inclusive: true,
			});
		}

		if (second >= 60) {
			throwPgTPError({
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
			});
		}

		if (parsedOffset.obj.hour < 0) {
			throwPgTPError({
				code: "too_small",
				minimum: 0,
				type: "number",
				inclusive: true,
			});
		}

		if (parsedOffset.obj.hour > 23) {
			throwPgTPError({
				code: "too_big",
				maximum: 23,
				type: "number",
				inclusive: true,
			});
		}

		if (parsedOffset.obj.minute % 1 !== 0) {
			throwPgTPError({
				code: "not_whole",
			});
		}

		if (parsedOffset.obj.minute < 0) {
			throwPgTPError({
				code: "too_small",
				minimum: 0,
				type: "number",
				inclusive: true,
			});
		}

		if (parsedOffset.obj.minute > 59) {
			throwPgTPError({
				code: "too_big",
				maximum: 59,
				type: "number",
				inclusive: true,
			});
		}

		this._offset = parsedOffset.obj;
	}

	get value(): string {
		return this.toString();
	}

	set value(timestamp: string) {
		const parsed = TimestampTZ.safeFrom(timestamp);
		if (parsed.success) {
			this._year = parsed.data.year;
			this._month = parsed.data.month;
			this._day = parsed.data.day;
			this._hour = parsed.data.hour;
			this._minute = parsed.data.minute;
			this._second = parsed.data.second;
			this._offset = parsed.data.offset;
		} else throw parsed.error;
	}

	get postgres(): string {
		return this.toString();
	}

	set postgres(timestamp: string) {
		const parsed = TimestampTZ.safeFrom(timestamp);
		if (parsed.success) {
			this._year = parsed.data.year;
			this._month = parsed.data.month;
			this._day = parsed.data.day;
			this._hour = parsed.data.hour;
			this._minute = parsed.data.minute;
			this._second = parsed.data.second;
			this._offset = parsed.data.offset;
		} else throw parsed.error;
	}
}

export { TimestampStyle, TimestampStyleType, TimestampTZ, TimestampTZConstructor, TimestampTZObject };
