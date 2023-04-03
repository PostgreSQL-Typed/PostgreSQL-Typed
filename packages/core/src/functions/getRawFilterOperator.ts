import type { ConstructorFromParser, Parsers, PGTPParserClass } from "@postgresql-typed/parsers";

import type { FilterOperators } from "../types/interfaces/FilterOperators.js";
import { isFilterOperator } from "./isFilterOperator.js";

export function getRawFilterOperator(
	filter: FilterOperators<unknown>,
	parser: PGTPParserClass<ConstructorFromParser<Parsers>>
): [string, ...(Parsers | string)[]] {
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
		case "$EQUAL": {
			//* Make sure the input value is valid;
			if (!parser.isValid(filter.$EQUAL)) {
				//TODO make this a custom error
				throw new Error("Invalid input value");
			}

			//* Double check that the value is valid;
			const result = parser.parser.safeFrom(filter.$EQUAL as any);
			if (!result.success) throw new Error("Invalid input value");

			return ["= %?%", result.data];
		}
		case "$NOT_EQUAL": {
			//* Make sure the input value is valid;
			if (!parser.isValid(filter.$NOT_EQUAL)) {
				//TODO make this a custom error
				throw new Error("Invalid input value");
			}

			//* Double check that the value is valid;
			const result = parser.parser.safeFrom(filter.$NOT_EQUAL as any);
			if (!result.success) throw new Error("Invalid input value");

			return ["!= %?%", result.data];
		}
		case "$GREATER_THAN": {
			//* Make sure the input value is valid;
			if (!parser.isValid(filter.$GREATER_THAN)) {
				//TODO make this a custom error
				throw new Error("Invalid input value");
			}

			//* Double check that the value is valid;
			const result = parser.parser.safeFrom(filter.$GREATER_THAN as any);
			if (!result.success) throw new Error("Invalid input value");

			return ["> %?%", result.data];
		}
		case "$GREATER_THAN_OR_EQUAL": {
			//* Make sure the input value is valid;
			if (!parser.isValid(filter.$GREATER_THAN_OR_EQUAL)) {
				//TODO make this a custom error
				throw new Error("Invalid input value");
			}

			//* Double check that the value is valid;
			const result = parser.parser.safeFrom(filter.$GREATER_THAN_OR_EQUAL as any);
			if (!result.success) throw new Error("Invalid input value");

			return [">= %?%", result.data];
		}
		case "$LESS_THAN": {
			//* Make sure the input value is valid;
			if (!parser.isValid(filter.$LESS_THAN)) {
				//TODO make this a custom error
				throw new Error("Invalid input value");
			}

			//* Double check that the value is valid;
			const result = parser.parser.safeFrom(filter.$LESS_THAN as any);
			if (!result.success) throw new Error("Invalid input value");

			return ["< %?%", result.data];
		}
		case "$LESS_THAN_OR_EQUAL": {
			//* Make sure the input value is valid;
			if (!parser.isValid(filter.$LESS_THAN_OR_EQUAL)) {
				//TODO make this a custom error
				throw new Error("Invalid input value");
			}

			//* Double check that the value is valid;
			const result = parser.parser.safeFrom(filter.$LESS_THAN_OR_EQUAL as any);
			if (!result.success) throw new Error("Invalid input value");

			return ["<= %?%", result.data];
		}
		case "$LIKE":
			if (typeof filter.$LIKE !== "string") throw new TypeError("LIKE filter must be a string");
			return ["LIKE %?%", filter.$LIKE];
		case "$NOT_LIKE":
			if (typeof filter.$NOT_LIKE !== "string") throw new TypeError("NOT LIKE filter must be a string");
			return ["NOT LIKE %?%", filter.$NOT_LIKE];
		case "$ILIKE":
			if (typeof filter.$ILIKE !== "string") throw new TypeError("ILIKE filter must be a string");
			return ["ILIKE %?%", filter.$ILIKE];
		case "$NOT_ILIKE":
			if (typeof filter.$NOT_ILIKE !== "string") throw new TypeError("NOT ILIKE filter must be a string");
			return ["NOT ILIKE %?%", filter.$NOT_ILIKE];
		case "$IN": {
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

			//* Make sure all the values are valid
			if (!filter.$IN.every(a => parser.isValid(a))) {
				//TODO make this a custom error
				throw new Error("Invalid input value");
			}

			const results = filter.$IN.map(a => parser.parser.safeFrom(a as any));
			if (!results.every(a => a.success)) throw new Error("Invalid input value");

			const questionMarks = filter.$IN.map(() => "%?%").join(", ");
			return [`IN (${questionMarks})`, ...results.map(a => (a as { data: Parsers }).data)];
		}
		case "$NOT_IN": {
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

			//* Make sure all the values are valid
			if (!filter.$NOT_IN.every(a => parser.isValid(a))) {
				//TODO make this a custom error
				throw new Error("Invalid input value");
			}

			const results = filter.$NOT_IN.map(a => parser.parser.safeFrom(a as any));
			if (!results.every(a => a.success)) throw new Error("Invalid input value");

			const questionMarks = filter.$NOT_IN.map(() => "%?%").join(", ");
			return [`NOT IN (${questionMarks})`, ...results.map(a => (a as { data: Parsers }).data)];
		}
		case "$BETWEEN": {
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

			//* Make sure all the values are valid
			if (!filter.$BETWEEN.every(a => parser.isValid(a))) {
				//TODO make this a custom error
				throw new Error("Invalid input value");
			}

			const valueA = parser.parser.safeFrom(filter.$BETWEEN[0] as any),
				valueB = parser.parser.safeFrom(filter.$BETWEEN[1] as any);

			if (!valueA.success || !valueB.success) throw new Error("Invalid input value");

			return ["BETWEEN %?% AND %?%", valueA.data, valueB.data];
		}
		case "$NOT_BETWEEN": {
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

			//* Make sure all the values are valid
			if (!filter.$NOT_BETWEEN.every(a => parser.isValid(a))) {
				//TODO make this a custom error
				throw new Error("Invalid input value");
			}

			const valueA = parser.parser.safeFrom(filter.$NOT_BETWEEN[0] as any),
				valueB = parser.parser.safeFrom(filter.$NOT_BETWEEN[1] as any);

			if (!valueA.success || !valueB.success) throw new Error("Invalid input value");

			return ["NOT BETWEEN %?% AND %?%", valueA.data, valueB.data];
		}
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
