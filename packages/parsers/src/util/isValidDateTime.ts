import { DateTime } from "luxon";

import type { IsValid } from "../types/IsValid.js";

export const isValidDateTime = (date: unknown): IsValid<DateTime> => {
	if (!(date instanceof DateTime)) return { isOfSameType: false };
	if (!date.isValid) {
		return {
			isOfSameType: true,
			isValid: false,
			error: {
				code: "invalid_luxon_date",
				received: date,
			},
		};
	}
	return { isOfSameType: true, isValid: true, data: date };
};
