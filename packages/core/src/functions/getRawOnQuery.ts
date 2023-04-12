import type { ConstructorFromParser, Parsers, PGTPError, PGTPParserClass } from "@postgresql-typed/parsers";
import { getParsedType, hasKeys, ParsedType } from "@postgresql-typed/util";

import type { Table } from "../classes/Table.js";
import type { DatabaseData } from "../types/interfaces/DatabaseData.js";
import type { FilterOperators } from "../types/interfaces/FilterOperators.js";
import type { PostgresData } from "../types/interfaces/PostgresData.js";
import type { OnQuery } from "../types/types/OnQuery.js";
import type { Safe } from "../types/types/Safe.js";
import type { PGTError } from "../util/PGTError.js";
import { getPGTError } from "./getPGTError.js";
import { getRawFilterOperator } from "./getRawFilterOperator.js";
import { isRootFilterOperator } from "./isRootFilterOperator.js";

export function getRawOnQuery<
	InnerPostgresData extends PostgresData,
	InnerDatabaseData extends DatabaseData,
	Ready extends boolean,
	JoinedTables extends Table<InnerPostgresData, InnerDatabaseData, Ready, any, any>,
	JoinedTable extends Table<InnerPostgresData, InnerDatabaseData, Ready, any, any>,
	On extends OnQuery<JoinedTables, JoinedTable> = OnQuery<JoinedTables, JoinedTable>
>(
	on: On,
	table: JoinedTable,
	joinedTables: Table<InnerPostgresData, InnerDatabaseData, Ready, any, any>[],
	depth = 0
): Safe<{ query: string; variables: (Parsers | string)[] }, PGTError | PGTPError> {
	//* Make sure the depth is less than 10
	//TODO make the depth limit a config option
	if (depth > 10) {
		return {
			success: false,
			error: getPGTError({
				code: "too_big",
				type: "depth",
				maximum: 10,
				inclusive: true,
			}),
		};
	}

	const keys = Object.keys(on) as (keyof On)[];
	//* Make sure there is only one key
	if (keys.length !== 1) {
		return {
			success: false,
			error: getPGTError(
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

	const key = keys[0],
		spaces = " ".repeat(depth * 2 + 2);

	if (isRootFilterOperator(key as string)) {
		const parsedType = getParsedType(on[key]);
		if (parsedType !== ParsedType.array) {
			return {
				success: false,
				error: getPGTError({
					code: "invalid_type",
					expected: ParsedType.array,
					received: parsedType,
				}),
			};
		}

		const queries = (on[key] as On[]).map(andValue => getRawOnQuery(andValue as any, table, joinedTables, depth + 1)),
			succeededQueries: { query: string; variables: (Parsers | string)[] }[] = [];

		for (const query of queries) {
			if (!query.success) return query;
			succeededQueries.push(query.data);
		}

		return {
			success: true,
			data: {
				query: `\n${spaces}(\n${spaces}  ${succeededQueries
					.map(query => query.query.trim())
					.join(`\n${spaces}  ${(key as string).replace("$", "")} `)}\n${spaces})`,
				variables: succeededQueries.flatMap(query => query.variables),
			},
		};
	} else {
		const tableColumns = table.columns.map(column => `${table.schema.name}.${table.name}.${column.toString()}`),
			parsedObject = hasKeys<On>(
				on,
				tableColumns.map(column => [column, [ParsedType.object, ParsedType.string, ParsedType.undefined]])
			);
		if (!parsedObject.success) {
			let error: PGTError;
			switch (true) {
				case parsedObject.otherKeys.length > 0:
					error = getPGTError({
						code: "unrecognized_keys",
						keys: parsedObject.otherKeys,
					});
					break;
				/* c8 ignore next 6 */
				case parsedObject.missingKeys.length > 0:
					error = getPGTError({
						code: "missing_keys",
						keys: parsedObject.missingKeys,
					});
					break;
				case parsedObject.invalidKeys.length > 0:
					error = getPGTError({
						code: "invalid_key_type",
						...parsedObject.invalidKeys[0],
					});
					break;
				/* c8 ignore next 6 */
				default:
					error = getPGTError({
						code: "unrecognized_keys",
						keys: [],
					});
			}
			return { success: false, error };
		}

		const parsedType = getParsedType(on[key]);
		if (parsedType === ParsedType.undefined) {
			return {
				success: false,
				error: getPGTError({
					code: "invalid_type",
					expected: [ParsedType.object, ParsedType.string],
					received: parsedType,
				}),
			};
		}

		const onKey = on[key] as string | FilterOperators<unknown>;

		//* table.column = otherTable.otherColumn
		if (typeof onKey === "string") {
			const joinedColumns = joinedTables.flatMap(joinedTable =>
				joinedTable.columns.map(column => `${joinedTable.schema.name}.${joinedTable.name}.${column.toString()}`)
			);

			if (!joinedColumns.includes(onKey)) {
				return {
					success: false,
					error: getPGTError({
						code: "invalid_string",
						expected: joinedColumns,
						received: onKey,
					}),
				};
			}

			return {
				success: true,
				data: {
					query: `${key.toString()} = ${onKey}`,
					variables: [],
				},
			};
		}

		const columnName = key.toString().split(".")[2],
			result = getRawFilterOperator(onKey, table.getParserOfColumn(columnName as any) as PGTPParserClass<ConstructorFromParser<Parsers>>);

		if (!result.success) return result;
		const [rawFilterOperator, ...variables] = result.data;

		return {
			success: true,
			data: {
				query: `${key.toString()} ${rawFilterOperator}`,
				variables,
			},
		};
	}
}
