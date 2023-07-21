import type { IsValid } from "../types/IsValid.js";

export const isValidDate = (date: unknown): IsValid<globalThis.Date> => {
	if (!(date instanceof globalThis.Date)) return { isOfSameType: false };
	if (Number.isNaN(+date)) {
		return {
			isOfSameType: true,
			isValid: false,
			error: {
				code: "invalid_date",
				received: date,
			},
		};
	}
	return { isOfSameType: true, isValid: true, data: date };
};
