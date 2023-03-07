import { IANAZone } from "luxon";

export function validateTimeZone(timeZone: string): number | false {
	try {
		return IANAZone.create(timeZone).offset(Date.now());
	} catch {
		return false;
	}
}
