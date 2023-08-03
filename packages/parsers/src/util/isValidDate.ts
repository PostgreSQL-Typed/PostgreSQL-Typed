import type { IsValid } from "../types/IsValid.js";

export const isValidDate = (date: unknown): IsValid<globalThis.Date> => {
	if (!(date instanceof globalThis.Date)) return { isOfSameType: false };
	if (Number.isNaN(+date)) {
		return {
			error: {
				code: "invalid_date",
				received: date,
			},
			isOfSameType: true,
			isValid: false,
		};
	}
	return { data: date, isOfSameType: true, isValid: true };
};
