import { Time, Timestamp, TimestampTZ, TimeTZ } from "@postgresql-typed/parsers";

import type { PgTTzSwitcherOptions, TzSwitcher } from "../index.js";

export function checkValue<T>(value: T, options: PgTTzSwitcherOptions, target: keyof TzSwitcher, current: keyof TzSwitcher): T {
	if (Array.isArray(value)) return value.map(v => checkValue(v, options, target, current)) as unknown as T;

	if (typeof value !== "object" || value === null) return value;

	const { timestamp, timestamptz, time, timetz } = options;

	if (timestamp && Timestamp.isTimestamp(value))
		return Timestamp.from(value.toDateTime(timestamp[current]).setZone(timestamp[target]).toFormat("yyyy-MM-dd HH:mm:ss")) as unknown as T;

	if (timestamptz && TimestampTZ.isTimestampTZ(value))
		return TimestampTZ.from(value.toDateTime(timestamptz[target]).toFormat("yyyy-MM-dd HH:mm:ssZZ")) as unknown as T;

	if (time && Time.isTime(value)) return Time.from(value.toDateTime(time[current]).setZone(time[target]).toFormat("HH:mm:ss")) as unknown as T;

	if (timetz && TimeTZ.isTimeTZ(value)) return TimeTZ.from(value.toDateTime(timetz[target]).toFormat("HH:mm:ssZZ")) as unknown as T;

	return Object.fromEntries(Object.entries(value).map(([key, value]) => [key, checkValue(value, options, target, current)])) as T;
}
