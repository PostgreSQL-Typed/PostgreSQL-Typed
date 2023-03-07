import { getRegExpByGroups } from "./getRegExpByGroups.js";

export const REGEXES = {
	/**
	 * Traditional PostgreSQL interval format
	 * @example "1 millennium 2 centuries 3 decades 4 year 5 months 6 days 7 hours 8 minutes 9 seconds 10 milliseconds 11 microseconds"
	 */
	TraditionalPostgreSQLInterval: getRegExpByGroups<{
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
	/**
	 * Traditional PostgreSQL interval format with time
	 * @exmaple "1 millennium 2 centuries 3 decades 4 year 5 months 6 days 7:08:09"
	 */
	TraditionalPostgreSQLTimeInterval: getRegExpByGroups<{
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
	/**
	 * ISO 8601 Durations “format with designators”
	 * @example "P1Y2M3W4DT5H6M7S"
	 * @see https://en.wikipedia.org/wiki/ISO_8601#Durations
	 */
	ISO8601DurationsDesignators: getRegExpByGroups<{
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
	/**
	 * ISO 8601 Durations “basic format”
	 * @example "PYYYYMMDDThhmmss"
	 * @see https://en.wikipedia.org/wiki/ISO_8601#Durations
	 */
	ISO8601DurationsBasic: getRegExpByGroups<{
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
	/**
	 * ISO 8601 Durations “extended format”
	 * @example "PYYYY-MM-DDThh:mm:ss"
	 * @see https://en.wikipedia.org/wiki/ISO_8601#Durations
	 */
	ISO8601DurationsExtended: getRegExpByGroups<{
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
	/**
	 * SQL standard interval format "year to second"
	 * @example "YYYY-MM DD HH:MM:SS"
	 */
	SQLYearToSecond: getRegExpByGroups<{
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
	/**
	 * SQL standard interval format "year to month"
	 * @example "YYYY-MM"
	 */
	SQLYearToMonth: getRegExpByGroups<{
		year: string;
		month: string;
	}>({
		groups: ["(?<year>[-+]?(?:\\d+(?:\\.\\d*)?|\\.\\d+))-(?<month>[-+]?(?:\\d+(?:\\.\\d*)?|\\.\\d+))"],
	}),
	/**
	 * SQL standard interval format "day to second"
	 * @example "DD hh:mm:ss"
	 */
	SQLDayToSecond: getRegExpByGroups<{
		day: string;
		hour: string;
		minute: string;
		second: string;
	}>({
		groups: [
			"(?<day>[-+]?(?:\\d+(?:\\.\\d*)?|\\.\\d+))\\s+(?<hour>[-+]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)):(?<minute>(?:\\d+(?:\\.\\d*)?|\\.\\d+)(?:\\s+ago)?)(?::(?<second>(?:\\d+(?:\\.\\d*)?|\\.\\d+)(?:\\s+ago)?))?",
		],
	}),
	/**
	 * SQL standard interval format "hour to second"
	 * @example "hh:mm:ss"
	 */
	SQLHourToSecond: getRegExpByGroups<{
		hour: string;
		minute: string;
		second: string;
	}>({
		groups: ["(?<hour>[-+]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)):(?<minute>(?:\\d+(?:\\.\\d*)?|\\.\\d+)):(?<second>(?:\\d+(?:\\.\\d*)?|\\.\\d+)(?:\\s+ago)?)"],
	}),
	//hh:mm SQL standard interval format "hour to minute"
	SQLMinuteToSecond: getRegExpByGroups<{
		hour: string;
		minute: string;
	}>({
		groups: ["(?<hour>[-+]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)):(?<minute>(?:\\d+(?:\\.\\d*)?|\\.\\d+)(?:\\s+ago)?)"],
	}),
	/**
	 * SQL standard interval format "second"
	 * @example "ss"
	 */
	SQLSecond: getRegExpByGroups<{
		second: string;
	}>({
		groups: ["(?<second>[-+]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)(?:\\s+ago)?)"],
	}),
	/**
	 * ISO 8601 Dates (The dashes may be replaced by slashes or be omitted entirely.) (The length of the numbers are checked)
	 * @example "YYYY-MM-DD" or "DD-MM-YYYY" or "MM-DD-YYYY" or "YY-MM-DD" or "DD-MM-YY" or "MM-DD-YY
	 * @see https://en.wikipedia.org/wiki/ISO_8601#Dates
	 */
	ISO8601Date: getRegExpByGroups<{
		year: string;
		month: string;
		day: string;
	}>({
		groups: [
			"(?<year>[-+]?(?:\\d{4}))[-/]?(?<month>[-+]?(?:0[1-9]|1[0-2]))[-/]?(?<day>[-+]?(?:0[1-9]|[12][0-9]|3[01]))",
			"(?<day>[-+]?(?:0[1-9]|[12][0-9]|3[01]))[-/]?(?<month>[-+]?(?:0[1-9]|1[0-2]))[-/]?(?<year>[-+]?(?:\\d{4}))",
			"(?<month>[-+]?(?:0[1-9]|1[0-2]))[-/]?(?<day>[-+]?(?:0[1-9]|[12][0-9]|3[01]))[-/]?(?<year>[-+]?(?:\\d{4}))",
			"(?<year>[-+]?(?:\\d{2}))[-/]?(?<month>[-+]?(?:0[1-9]|1[0-2]))[-/]?(?<day>[-+]?(?:0[1-9]|[12][0-9]|3[01]))",
			"(?<day>[-+]?(?:0[1-9]|[12][0-9]|3[01]))[-/]?(?<month>[-+]?(?:0[1-9]|1[0-2]))[-/]?(?<year>[-+]?(?:\\d{2}))",
			"(?<month>[-+]?(?:0[1-9]|1[0-2]))[-/]?(?<day>[-+]?(?:0[1-9]|[12][0-9]|3[01]))[-/]?(?<year>[-+]?(?:\\d{2}))",
		],
		isOrCondition: true,
	}),
	/**
	 * ISO 8601 Times (With optional timezone) (The dashes may be replaced by slashes or be omitted entirely.) (The length of the numbers are checked, except for seconds which can be a decimal)
	 * @example "hh:mm:ss" or "hh:mm:ss±hh:mm" or "hh:mm:ss±hh" or "hh:mm:ssZ"
	 * @see https://en.wikipedia.org/wiki/ISO_8601#Times
	 */
	ISO8601Time: getRegExpByGroups<{
		hour: string;
		minute: string;
		second?: string;
		ampm?: string;
		timezoneSign?: string;
		timezoneHour?: string;
		timezoneMinute?: string;
	}>({
		groups: [
			"(?<hour>[-+]?(?:[01][0-9]|2[0-3]))[:.]?(?<minute>[-+]?(?:[0-5][0-9]))[:.]?(?<second>[-+]?(?:[0-5][0-9]|60)(?:\\.\\d+)?)?(?:\\s*(?<ampm>[AaPp][Mm](?![A-Za-z]))?)?(?:Z|(\\s)?(?<timezoneSign>[-+])(?<timezoneHour>[-+]?(?:[01][0-9]|2[0-3]))[:.]?(?<timezoneMinute>[-+]?(?:[0-5][0-9]))?)?",
		],
	}),
	/**
	 * ISO 8601 DateTimes (The ISO 8601 date and time formats can be combined into a single expression)
	 * @example "YYYY-MM-DDThh:mm:ss" or "YYYY-MM-DDThh:mm:ss±hh:mm" or "YYYY-MM-DDThh:mm:ss±hh" or "YYYY-MM-DDThh:mm:ssZ" or "YYYY-MM-DD hh:mm:ss" or "YYYY-MM-DD hh:mm:ss±hh:mm" or "YYYY-MM-DD hh:mm:ss±hh" or "YYYY-MM-DD hh:mm:ss"
	 * @see https://en.wikipedia.org/wiki/ISO_8601#Combined_date_and_time_representations
	 */
	ISO8601DateTime: getRegExpByGroups<{
		year: string;
		month: string;
		day: string;
		hour: string;
		minute: string;
		second: string;
		timezoneSign?: string;
		timezoneHour?: string;
		timezoneMinute?: string;
	}>({
		groups: [
			"(?<year>[-+]?(?:\\d{4}))[-/]?(?<month>[-+]?(?:0[1-9]|1[0-2]))[-/]?(?<day>[-+]?(?:0[1-9]|[12][0-9]|3[01]))(?:\\s|T)(?<hour>[-+]?(?:[01][0-9]|2[0-3]))[:.]?(?<minute>[-+]?(?:[0-5][0-9]))[:.]?(?<second>[-+]?(?:[0-5][0-9]|60)(?:\\.\\d+)?)(?:Z|(\\s)?(?<timezoneSign>[-+])(?<timezoneHour>[-+]?(?:[01][0-9]|2[0-3]))[:.]?(?<timezoneMinute>[-+]?(?:[0-5][0-9]))?)?",
			"(?<day>[-+]?(?:0[1-9]|[12][0-9]|3[01]))[-/]?(?<month>[-+]?(?:0[1-9]|1[0-2]))[-/]?(?<year>[-+]?(?:\\d{4}))(?:\\s|T)(?<hour>[-+]?(?:[01][0-9]|2[0-3]))[:.]?(?<minute>[-+]?(?:[0-5][0-9]))[:.]?(?<second>[-+]?(?:[0-5][0-9]|60)(?:\\.\\d+)?)(?:Z|(\\s)?(?<timezoneSign>[-+])(?<timezoneHour>[-+]?(?:[01][0-9]|2[0-3]))[:.]?(?<timezoneMinute>[-+]?(?:[0-5][0-9]))?)?",
			"(?<month>[-+]?(?:0[1-9]|1[0-2]))[-/]?(?<day>[-+]?(?:0[1-9]|[12][0-9]|3[01]))[-/]?(?<year>[-+]?(?:\\d{4}))(?:\\s|T)(?<hour>[-+]?(?:[01][0-9]|2[0-3]))[:.]?(?<minute>[-+]?(?:[0-5][0-9]))[:.]?(?<second>[-+]?(?:[0-5][0-9]|60)(?:\\.\\d+)?)(?:Z|(\\s)?(?<timezoneSign>[-+])(?<timezoneHour>[-+]?(?:[01][0-9]|2[0-3]))[:.]?(?<timezoneMinute>[-+]?(?:[0-5][0-9]))?)?",
			"(?<year>[-+]?(?:\\d{2}))[-/]?(?<month>[-+]?(?:0[1-9]|1[0-2]))[-/]?(?<day>[-+]?(?:0[1-9]|[12][0-9]|3[01]))(?:\\s|T)(?<hour>[-+]?(?:[01][0-9]|2[0-3]))[:.]?(?<minute>[-+]?(?:[0-5][0-9]))[:.]?(?<second>[-+]?(?:[0-5][0-9]|60)(?:\\.\\d+)?)(?:Z|(\\s)?(?<timezoneSign>[-+])(?<timezoneHour>[-+]?(?:[01][0-9]|2[0-3]))[:.]?(?<timezoneMinute>[-+]?(?:[0-5][0-9]))?)?",
			"(?<day>[-+]?(?:0[1-9]|[12][0-9]|3[01]))[-/]?(?<month>[-+]?(?:0[1-9]|1[0-2]))[-/]?(?<year>[-+]?(?:\\d{2}))(?:\\s|T)(?<hour>[-+]?(?:[01][0-9]|2[0-3]))[:.]?(?<minute>[-+]?(?:[0-5][0-9]))[:.]?(?<second>[-+]?(?:[0-5][0-9]|60)(?:\\.\\d+)?)(?:Z|(\\s)?(?<timezoneSign>[-+])(?<timezoneHour>[-+]?(?:[01][0-9]|2[0-3]))[:.]?(?<timezoneMinute>[-+]?(?:[0-5][0-9]))?)?",
			"(?<month>[-+]?(?:0[1-9]|1[0-2]))[-/]?(?<day>[-+]?(?:0[1-9]|[12][0-9]|3[01]))[-/]?(?<year>[-+]?(?:\\d{2}))(?:\\s|T)(?<hour>[-+]?(?:[01][0-9]|2[0-3]))[:.]?(?<minute>[-+]?(?:[0-5][0-9]))[:.]?(?<second>[-+]?(?:[0-5][0-9]|60)(?:\\.\\d+)?)(?:Z|(\\s)?(?<timezoneSign>[-+])(?<timezoneHour>[-+]?(?:[01][0-9]|2[0-3]))[:.]?(?<timezoneMinute>[-+]?(?:[0-5][0-9]))?)?",
		],
		isOrCondition: true,
	}),
	/**
	 * POSIX DateTimes (With optional timezone) (The length of the numbers are checked)
	 * @example "YYYY-MM-DD hh:mm:ss <timezone>±hh:mm" or "YYYY-MM-DD hh:mm:ss <timezone>±hh" or "YYYY-MM-DD hh:mm:ss <timezone>" or "YYYY-MM-DD hh:mm:ss"
	 * Timezone can be any string like GMT, UTC, EST, CST, MST, PST, etc. (case insensitive)
	 * They can also be like Europe/Paris, America/New_York, etc. (case insensitive)
	 */
	POSIXDateTime: getRegExpByGroups<{
		year: string;
		month: string;
		day: string;
		hour: string;
		minute: string;
		second?: string;
		ampm?: string;
		timezone?: string;
		timezoneSign?: string;
		timezoneHour?: string;
		timezoneMinute?: string;
	}>({
		groups: [
			"(?<year>[-+]?(?:\\d{4}))[-/]?(?<month>[-+]?(?:0[1-9]|1[0-2]))[-/]?(?<day>[-+]?(?:0[1-9]|[12][0-9]|3[01]))\\s(?<hour>[-+]?(?:[01][0-9]|2[0-3]))[:.]?(?<minute>[-+]?(?:[0-5][0-9]))[:.]?(?<second>[-+]?(?:[0-5][0-9]|60)(?:\\.\\d+)?)?(?:\\s*(?<ampm>[AaPp][Mm](?![A-Za-z]))?)?(?:\\s*(?<timezone>[A-Za-z_\\/]+)?(?:(?<timezoneSign>[-+])(?<timezoneHour>\\d{1,2})(?::(?<timezoneMinute>\\d{1,2}))?)?)?(?:\\sBC)?",
			"(?<day>[-+]?(?:0[1-9]|[12][0-9]|3[01]))[-/]?(?<month>[-+]?(?:0[1-9]|1[0-2]))[-/]?(?<year>[-+]?(?:\\d{4}))\\s(?<hour>[-+]?(?:[01][0-9]|2[0-3]))[:.]?(?<minute>[-+]?(?:[0-5][0-9]))[:.]?(?<second>[-+]?(?:[0-5][0-9]|60)(?:\\.\\d+)?)?(?:\\s*(?<ampm>[AaPp][Mm](?![A-Za-z]))?)?(?:\\s*(?<timezone>[A-Za-z_\\/]+)?(?:(?<timezoneSign>[-+])(?<timezoneHour>\\d{1,2})(?::(?<timezoneMinute>\\d{1,2}))?)?)?(?:\\sBC)?",
			"(?<month>[-+]?(?:0[1-9]|1[0-2]))[-/]?(?<day>[-+]?(?:0[1-9]|[12][0-9]|3[01]))[-/]?(?<year>[-+]?(?:\\d{4}))\\s(?<hour>[-+]?(?:[01][0-9]|2[0-3]))[:.]?(?<minute>[-+]?(?:[0-5][0-9]))[:.]?(?<second>[-+]?(?:[0-5][0-9]|60)(?:\\.\\d+)?)?(?:\\s*(?<ampm>[AaPp][Mm](?![A-Za-z]))?)?(?:\\s*(?<timezone>[A-Za-z_\\/]+)?(?:(?<timezoneSign>[-+])(?<timezoneHour>\\d{1,2})(?::(?<timezoneMinute>\\d{1,2}))?)?)?(?:\\sBC)?",
			"(?<year>[-+]?(?:\\d{2}))[-/]?(?<month>[-+]?(?:0[1-9]|1[0-2]))[-/]?(?<day>[-+]?(?:0[1-9]|[12][0-9]|3[01]))\\s(?<hour>[-+]?(?:[01][0-9]|2[0-3]))[:.]?(?<minute>[-+]?(?:[0-5][0-9]))[:.]?(?<second>[-+]?(?:[0-5][0-9]|60)(?:\\.\\d+)?)?(?:\\s*(?<ampm>[AaPp][Mm](?![A-Za-z]))?)?(?:\\s*(?<timezone>[A-Za-z_\\/]+)?(?:(?<timezoneSign>[-+])(?<timezoneHour>\\d{1,2})(?::(?<timezoneMinute>\\d{1,2}))?)?)?(?:\\sBC)?",
			"(?<day>[-+]?(?:0[1-9]|[12][0-9]|3[01]))[-/]?(?<month>[-+]?(?:0[1-9]|1[0-2]))[-/]?(?<year>[-+]?(?:\\d{2}))\\s(?<hour>[-+]?(?:[01][0-9]|2[0-3]))[:.]?(?<minute>[-+]?(?:[0-5][0-9]))[:.]?(?<second>[-+]?(?:[0-5][0-9]|60)(?:\\.\\d+)?)?(?:\\s*(?<ampm>[AaPp][Mm](?![A-Za-z]))?)?(?:\\s*(?<timezone>[A-Za-z_\\/]+)?(?:(?<timezoneSign>[-+])(?<timezoneHour>\\d{1,2})(?::(?<timezoneMinute>\\d{1,2}))?)?)?(?:\\sBC)?",
			"(?<month>[-+]?(?:0[1-9]|1[0-2]))[-/]?(?<day>[-+]?(?:0[1-9]|[12][0-9]|3[01]))[-/]?(?<year>[-+]?(?:\\d{2}))\\s(?<hour>[-+]?(?:[01][0-9]|2[0-3]))[:.]?(?<minute>[-+]?(?:[0-5][0-9]))[:.]?(?<second>[-+]?(?:[0-5][0-9]|60)(?:\\.\\d+)?)?(?:\\s*(?<ampm>[AaPp][Mm](?![A-Za-z]))?)?(?:\\s*(?<timezone>[A-Za-z_\\/]+)?(?:(?<timezoneSign>[-+])(?<timezoneHour>\\d{1,2})(?::(?<timezoneMinute>\\d{1,2}))?)?)?(?:\\sBC)?",
		],
		isOrCondition: true,
	}),
	/**
	 * POSIX DateTimes (With optional timezone) (The length of the numbers are checked)
	 * @example "hh:mm:ss <timezone>±hh:mm" or "hh:mm:ss <timezone>±hh" or "hh:mm:ss <timezone>" or "hh:mm"
	 * Timezone can be any string like GMT, UTC, EST, CST, MST, PST, etc. (case insensitive)
	 * They can also be like Europe/Paris, America/New_York, etc. (case insensitive)
	 */
	POSIXTime: getRegExpByGroups<{
		hour: string;
		minute: string;
		second?: string;
		ampm?: string;
		timezone?: string;
		timezoneSign?: string;
		timezoneHour?: string;
		timezoneMinute?: string;
	}>({
		groups: [
			"(?<hour>[-+]?(?:[01][0-9]|2[0-3]))[:.]?(?<minute>[-+]?(?:[0-5][0-9]))[:.]?(?<second>[-+]?(?:[0-5][0-9]|60)(?:\\.\\d+)?)?(?:\\s*(?<ampm>[AaPp][Mm](?![A-Za-z]))?)?(?:\\s*(?<timezone>[A-Za-z_\\/]+)?(?:(?<timezoneSign>[-+])(?<timezoneHour>\\d{1,2})(?::(?<timezoneMinute>\\d{1,2}))?)?)?",
		],
	}),
	/**
	 * PostgreSQL DateTimes (With optional day of week and optional timezone)
	 * @example "Mon Feb 10 15:30:00 2020 PST" or "Feb 10 15:30:00 2020" or "Mon Feb 10 2020 15:30:00 PST" or "Feb 10 2020 15:30:00"
	 * Timezone can be any string like GMT, UTC, EST, CST, MST, PST, etc. (case insensitive)
	 * They can also be like Europe/Paris, America/New_York, etc. (case insensitive)
	 *
	 * The day of week is optional and can be any string like Mon, Tue, Wed, Thu, Fri, Sat, Sun (case insensitive)
	 * They can also be like Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday (case insensitive)
	 *
	 * The month can be any string like Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec (case insensitive)
	 * They can also be like January, February, March, April, May, June, July, August, September, October, November, December (case insensitive)
	 */
	PostgreSQLDateTime: getRegExpByGroups<{
		dayOfWeek?: string;
		year: string;
		month: string;
		day: string;
		hour: string;
		minute: string;
		second: string;
		ampm?: string;
		timezone?: string;
		timezoneSign?: string;
		timezoneHour?: string;
		timezoneMinute?: string;
	}>({
		groups: [
			"(?:(?<dayOfWeek>(?:Mon(day)?|Tue(sday)?|Wed(nesday)?|Thu(rsday)?|Fri(day)?|Sat(urday)?|Sun(day)?)\\s+)?(?<month>(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?))\\s+(?<day>[-+]?(?:\\d+(?:\\.\\d*)?|\\.\\d+))\\s+(?<hour>[-+]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)):(?<minute>[-+]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)):(?<second>[-+]?(?:\\d+(?:\\.\\d*)?|\\.\\d+))(?:\\s*(?<ampm>[AaPp][Mm](?![A-Za-z]))?)?\\s+(?<year>[-+]?(?:\\d+(?:\\.\\d*)?|\\.\\d+))(?:\\s+(?<timezone>[A-Za-z_\\/]+)?(?:(?<timezoneSign>[-+])(?<timezoneHour>\\d{1,2})(?::(?<timezoneMinute>\\d{1,2}))?)?)?)(?:\\sBC)?",
			"(?:(?<dayOfWeek>(?:Mon(day)?|Tue(sday)?|Wed(nesday)?|Thu(rsday)?|Fri(day)?|Sat(urday)?|Sun(day)?)\\s+)?(?<month>(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?))\\s+(?<day>[-+]?(?:\\d+(?:\\.\\d*)?|\\.\\d+))\\s+(?<year>[-+]?(?:\\d+(?:\\.\\d*)?|\\.\\d+))\\s+(?<hour>[-+]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)):(?<minute>[-+]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)):(?<second>[-+]?(?:\\d+(?:\\.\\d*)?|\\.\\d+))(?:\\s*(?<ampm>[AaPp][Mm](?![A-Za-z]))?)?(?:\\s+(?<timezone>[A-Za-z_\\/]+)?(?:(?<timezoneSign>[-+])(?<timezoneHour>\\d{1,2})(?::(?<timezoneMinute>\\d{1,2}))?)?)?)(?:\\sBC)?",
		],
		isOrCondition: true,
	}),
} satisfies Record<string, ReturnType<typeof getRegExpByGroups>>;
