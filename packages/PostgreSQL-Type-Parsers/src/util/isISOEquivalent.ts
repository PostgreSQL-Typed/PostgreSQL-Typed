import { DateTime } from "luxon";

export function isISOEquivalent(value1: string, value2: string): boolean {
	return DateTime.fromISO(value1).toUTC().toMillis() === DateTime.fromISO(value2).toUTC().toMillis();
}
