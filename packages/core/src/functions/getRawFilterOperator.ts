import type { ConstructorFromParser, Parsers, PgTPError, PgTPParserClass } from "@postgresql-typed/parsers";
import { isBox } from "@postgresql-typed/parsers";
import { getParsedType, hasKeys, isOneOf, ParsedType, type PgTError, type Safe } from "@postgresql-typed/util";

import { Database } from "../classes/Database.js";
import type { FilterOperators } from "../types/interfaces/FilterOperators.js";
import type { SelectSubQuery } from "../types/types/SelectSubQuery.js";
import { getPgTError } from "./getPgTError.js";
import { filterOperators, isFilterOperator } from "./isFilterOperator.js";

export function getRawFilterOperator(
	filter: FilterOperators<unknown, any, any>,
	parser: PgTPParserClass<ConstructorFromParser<Parsers>>,
	database: Database<any, any, boolean>,
	spaces: number
): Safe<{ result: [string, ...(Parsers | string)[]]; subquery?: SelectSubQuery<any, any, boolean> }, PgTError | PgTPError> {
	const keys = Object.keys(filter),
		delimiter = isBox(parser.parser) ? ";" : ",";

	//* Make sure there is only one key
	if (keys.length !== 1) {
		return {
			success: false,
			error: getPgTError(
				keys.length > 1
					? {
							code: "too_big",
							type: "keys",
							maximum: 1,
							exact: true,
					  }
					: {
							code: "too_small",
							type: "keys",
							minimum: 1,
							exact: true,
					  }
			),
		};
	}

	const key = keys[0];
	if (!isFilterOperator(key)) {
		return {
			success: false,
			error: getPgTError({
				code: "invalid_join_type",
				expected: filterOperators,
				received: key,
			}),
		};
	}

	switch (key) {
		case "$EQUAL":
		case "$NOT_EQUAL":
		case "$GREATER_THAN":
		case "$GREATER_THAN_OR_EQUAL":
		case "$LESS_THAN":
		case "$LESS_THAN_OR_EQUAL": {
			//* Make sure the input value is valid;
			const result = parser.isValid(filter[key]),
				operator =
					key === "$EQUAL"
						? "="
						: key === "$NOT_EQUAL"
						? "!="
						: key === "$GREATER_THAN"
						? ">"
						: key === "$GREATER_THAN_OR_EQUAL"
						? ">="
						: key === "$LESS_THAN"
						? "<"
						: "<=";

			if (!result.success) {
				//* Check if it is a subquery
				const parsedType = getParsedType(filter[key]);
				if (parsedType !== ParsedType.object) return result;

				const parsedObject = hasKeys<Safe<Record<string, unknown>>>(filter[key] as any, [
					["success", [ParsedType.boolean]],
					["data", [ParsedType.object, ParsedType.undefined]],
					["error", [ParsedType.object, ParsedType.undefined]],
				]);

				if (!parsedObject.success) return result;
				if (!parsedObject.obj.success) return parsedObject.obj;

				const parsedData = hasKeys<SelectSubQuery<any, any, boolean>>(parsedObject.obj.data, [
					["query", ParsedType.string],
					["variables", ParsedType.array],
					["variablesIndex", ParsedType.number],
					["usedTableLocations", ParsedType.array],
					["database", ParsedType.object],
				]);

				if (!parsedData.success) {
					return {
						success: false,
						error: getPgTError(
							parsedData.otherKeys.length > 0
								? {
										code: "unrecognized_keys",
										keys: parsedData.otherKeys,
								  }
								: parsedData.missingKeys.length > 0
								? {
										code: "missing_keys",
										keys: parsedData.missingKeys,
								  }
								: {
										code: "invalid_key_type",
										...parsedData.invalidKeys[0],
								  }
						),
					};
				}

				if (!(parsedData.obj.database instanceof Database)) {
					return {
						success: false,
						error: getPgTError({
							code: "invalid_type",
							expected: ParsedType.object,
							received: getParsedType(parsedData.obj.database),
						}),
					};
				}

				if (parsedData.obj.database.name !== database.name) {
					return {
						success: false,
						error: getPgTError({
							code: "invalid_join",
							type: "database",
						}),
					};
				}

				for (const usedTableLocation of parsedData.obj.usedTableLocations) {
					const usedTableType = getParsedType(usedTableLocation);
					if (usedTableType !== ParsedType.string) {
						return {
							success: false,
							error: getPgTError({
								code: "invalid_type",
								expected: ParsedType.string,
								received: usedTableType,
							}),
						};
					}
				}

				const spacesString = " ".repeat(spaces);
				return {
					success: true,
					data: {
						result: [`${operator} (\n${spacesString}  ${parsedData.obj.query.split("\n").join(`\n${spacesString}  `)}\n${spacesString})`],
						subquery: parsedData.obj,
					},
				};
			}

			const parsedType = getParsedType(result.data);
			if (isOneOf(["null", "undefined"], parsedType)) {
				return {
					success: false,
					error: getPgTError({
						code: "invalid_type",
						expected: parsedType === "null" ? "not null" : "not undefined",
						received: parsedType,
					}),
				};
			}

			const value: Parsers | string = Array.isArray(result.data) ? `{${result.data.map(v => v?.value).join(delimiter)}}` : (result.data as Parsers);
			return {
				success: true,
				data: { result: [`${operator} %?%`, value] },
			};
		}
		case "$LIKE":
		case "$NOT_LIKE":
		case "$ILIKE":
		case "$NOT_ILIKE": {
			const parsedType = getParsedType(filter[key]);
			if (parsedType !== "string") {
				return {
					success: false,
					error: getPgTError({
						code: "invalid_type",
						expected: "string",
						received: parsedType,
					}),
				};
			}

			const operator = key.slice(1).replace("_", " ");
			return {
				success: true,
				data: { result: [`${operator} %?%`, filter[key] as string] },
			};
		}
		case "$IN":
		case "$NOT_IN": {
			const filterKey = filter[key];
			//* Make sure the value is an array
			if (!Array.isArray(filterKey)) {
				return {
					success: false,
					error: getPgTError({
						code: "invalid_type",
						expected: "array",
						received: getParsedType(filterKey),
					}),
				};
			}

			//* Make sure it has atleast 1 entry
			if (filterKey.length === 0) {
				return {
					success: false,
					error: getPgTError({
						code: "too_small",
						type: "array",
						minimum: 1,
						inclusive: true,
					}),
				};
			}

			//* Make sure all the values are valid
			const succeeded: (Parsers | Parsers[])[] = [];
			for (const value of filterKey) {
				const result = parser.isValid(value);
				if (!result.success) return result;
				const parsedType = getParsedType(result.data);
				if (isOneOf(["null", "undefined"], parsedType)) {
					return {
						success: false,
						error: getPgTError({
							code: "invalid_type",
							expected: parsedType === "null" ? "not null" : "not undefined",
							received: parsedType,
						}),
					};
				}
				succeeded.push(result.data as Parsers | Parsers[]);
			}

			const finalValues: (Parsers | string)[] = succeeded.map(v => (Array.isArray(v) ? `{${v.map(v => v?.value).join(delimiter)}}` : v)),
				questionMarks = filterKey.map(() => "%?%").join(", "),
				operator = key.slice(1).replace("_", " ");
			return {
				success: true,
				data: { result: [`${operator} (${questionMarks})`, ...finalValues] },
			};
		}
		case "$BETWEEN":
		case "$NOT_BETWEEN": {
			const filterKey = filter[key];
			//* Make sure the value is an array
			if (!Array.isArray(filterKey)) {
				return {
					success: false,
					error: getPgTError({
						code: "invalid_type",
						expected: "array",
						received: getParsedType(filterKey),
					}),
				};
			}

			//* Make sure it has exactly 2 entries
			if (filterKey.length !== 2) {
				return filterKey.length < 2
					? {
							success: false,
							error: getPgTError({
								code: "too_small",
								type: "array",
								minimum: 2,
								exact: true,
							}),
					  }
					: {
							success: false,
							error: getPgTError({
								code: "too_big",
								type: "array",
								maximum: 2,
								exact: true,
							}),
					  };
			}

			const valueA = parser.isValid(filterKey[0] as any),
				valueB = parser.isValid(filterKey[1] as any);

			if (!valueA.success) return valueA;
			if (!valueB.success) return valueB;

			const valueAType = getParsedType(valueA.data),
				valueBType = getParsedType(valueB.data);

			if (isOneOf(["null", "undefined"], valueAType)) {
				return {
					success: false,
					error: getPgTError({
						code: "invalid_type",
						expected: valueAType === "null" ? "not null" : "not undefined",
						received: valueAType,
					}),
				};
			}

			if (isOneOf(["null", "undefined"], valueBType)) {
				return {
					success: false,
					error: getPgTError({
						code: "invalid_type",
						expected: valueBType === "null" ? "not null" : "not undefined",
						received: valueBType,
					}),
				};
			}

			const operator = key.slice(1).replace("_", " ");
			return {
				success: true,
				data: {
					result: [
						`${operator} %?% AND %?%`,
						Array.isArray(valueA.data) ? `{${valueA.data.map(v => v?.value).join(delimiter)}}` : (valueA.data as Parsers),
						Array.isArray(valueB.data) ? `{${valueB.data.map(v => v?.value).join(delimiter)}}` : (valueB.data as Parsers),
					],
				},
			};
		}
		case "$IS_NULL":
		case "$IS_NOT_NULL":
			if (filter[key] !== true) {
				return {
					success: false,
					error: getPgTError({
						code: "invalid_type",
						expected: "boolean",
						received: getParsedType(filter[key]),
					}),
				};
			}
			return {
				success: true,
				data: { result: [key.slice(1).replace("_", " ")] },
			};
		/* c8 ignore next 4 */
		default:
			//TODO make this a custom error (assert never)
			throw new Error("Filter must have a valid operator");
	}
}
