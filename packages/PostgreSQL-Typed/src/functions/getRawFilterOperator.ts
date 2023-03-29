import type { FilterOperators } from "../types/interfaces/FilterOperators.js";
import { isFilterOperator } from "./isFilterOperator.js";

export function getRawFilterOperator(filter: FilterOperators<unknown>): [string, ...unknown[]] {
	let keys = Object.keys(filter);
	//* Filter out the keys that have a value of undefined
	keys = keys.filter(key => filter[key as keyof typeof filter] !== undefined);
	//* Make sure there is only one key
	if (keys.length !== 1) {
		//TODO make this a custom error
		throw new Error("Filter must have only one key");
	}

	const key = keys[0];
	if (!isFilterOperator(key)) {
		//TODO make this a custom error
		throw new Error("Invalid filter operator");
	}

	switch (key) {
		case "$EQUAL":
			return ["= ?", filter.$EQUAL];
		case "$NOT_EQUAL":
			return ["!= ?", filter.$NOT_EQUAL];
		case "$GREATER_THAN":
			return ["> ?", filter.$GREATER_THAN];
		case "$GREATER_THAN_OR_EQUAL":
			return [">= ?", filter.$GREATER_THAN_OR_EQUAL];
		case "$LESS_THAN":
			return ["< ?", filter.$LESS_THAN];
		case "$LESS_THAN_OR_EQUAL":
			return ["<= ?", filter.$LESS_THAN_OR_EQUAL];
		case "$LIKE":
			return ["LIKE ?", filter.$LIKE];
		case "$NOT_LIKE":
			return ["NOT LIKE ?", filter.$NOT_LIKE];
		case "$ILIKE":
			return ["ILIKE ?", filter.$ILIKE];
		case "$NOT_ILIKE":
			return ["NOT ILIKE ?", filter.$NOT_ILIKE];
		case "$IN":
			//* Make sure the value is an array
			if (!Array.isArray(filter.$IN)) {
				//TODO make this a custom error
				throw new TypeError("IN filter must be an array");
			}

			//* Make sure it has atleast 2 entries
			if (filter.$IN.length < 2) {
				//TODO make this a custom error
				throw new Error("IN filter must have atleast 2 entries");
			}

			return ["IN ?", filter.$IN];

		case "$NOT_IN":
			//* Make sure the value is an array
			if (!Array.isArray(filter.$NOT_IN)) {
				//TODO make this a custom error
				throw new TypeError("NOT IN filter must be an array");
			}

			//* Make sure it has atleast 2 entries
			if (filter.$NOT_IN.length < 2) {
				//TODO make this a custom error
				throw new Error("NOT IN filter must have atleast 2 entries");
			}

			return ["NOT IN ?", filter.$NOT_IN];
		case "$BETWEEN":
			//* Make sure the value is an array
			if (!Array.isArray(filter.$BETWEEN)) {
				//TODO make this a custom error
				throw new TypeError("BETWEEN filter must be an array");
			}

			//* Make sure it has exactly 2 entries
			if (filter.$BETWEEN.length !== 2) {
				//TODO make this a custom error
				throw new Error("BETWEEN filter must have exactly 2 entries");
			}

			return ["BETWEEN ? AND ?", filter.$BETWEEN[0], filter.$BETWEEN[1]];

		case "$NOT_BETWEEN":
			//* Make sure the value is an array
			if (!Array.isArray(filter.$NOT_BETWEEN)) {
				//TODO make this a custom error
				throw new TypeError("NOT BETWEEN filter must be an array");
			}

			//* Make sure it has exactly 2 entries
			if (filter.$NOT_BETWEEN.length !== 2) {
				//TODO make this a custom error
				throw new Error("NOT BETWEEN filter must have exactly 2 entries");
			}

			return ["NOT BETWEEN ? AND ?", filter.$NOT_BETWEEN[0], filter.$NOT_BETWEEN[1]];
		case "$IS_NULL":
			return ["IS NULL"];
		case "$IS_NOT_NULL":
			return ["IS NOT NULL"];
		/* c8 ignore next 4 */
		default:
			//TODO make this a custom error (assert never)
			throw new Error("Filter must have a valid operator");
	}
}
