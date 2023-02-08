import type { FilterOperators } from "../types/interfaces/FilterOperators.js";

export const isFilterOperator = (value: any): value is keyof FilterOperators<any> =>
	[
		"$EQUAL",
		"$NOT_EQUAL",
		"$LESS_THAN",
		"$LESS_THAN_OR_EQUAL",
		"$GREATER_THAN",
		"$GREATER_THAN_OR_EQUAL",
		"$LIKE",
		"$NOT_LIKE",
		"$ILIKE",
		"$NOT_ILIKE",
		"$IN",
		"$NOT_IN",
		"$BETWEEN",
		"$NOT_BETWEEN",
		"$IS_NULL",
		"$IS_NOT_NULL",
	].includes(value);
