import type { IsValid } from "../types/IsValid";

export const isValidDate = (date: unknown): IsValid<globalThis.Date> => {
	if (!(date instanceof globalThis.Date)) return { isOfSameType: false };
	if (isNaN(date as any)) {
		return {
			isOfSameType: true,
			isValid: false,
			error: {
				code: "invalid_date",
			},
		};
	}
	return { isOfSameType: true, isValid: true, data: date };
};
