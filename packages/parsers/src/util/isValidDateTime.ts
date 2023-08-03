import { DateTime } from "luxon";

import type { IsValid } from "../types/IsValid.js";

export const isValidDateTime = (date: unknown): IsValid<DateTime> => {
	if (!(date instanceof DateTime)) return { isOfSameType: false };
	if (!date.isValid) {
		return {
			error: {
				code: "invalid_luxon_date",
				received: date,
			},
			isOfSameType: true,
			isValid: false,
		};
	}
	return { data: date, isOfSameType: true, isValid: true };
};
