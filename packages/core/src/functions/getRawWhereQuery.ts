import type { ConstructorFromParser, Parsers, PGTPError, PGTPParserClass } from "@postgresql-typed/parsers";
import { getParsedType, hasKeys, ParsedType } from "@postgresql-typed/util";

import type { Table } from "../classes/Table.js";
import { FilterOperators } from "../types/interfaces/FilterOperators.js";
import type { DatabaseData } from "../types/types/DatabaseData.js";
import type { PostgresData } from "../types/types/PostgresData.js";
import type { Safe } from "../types/types/Safe.js";
import type { WhereQuery } from "../types/types/WhereQuery.js";
import type { PGTError } from "../util/PGTError.js";
import { getPGTError } from "./getPGTError.js";
import { getRawFilterOperator } from "./getRawFilterOperator.js";
import { isRootFilterOperator } from "./isRootFilterOperator.js";

export function getRawWhereQuery<
	InnerPostgresData extends PostgresData,
	InnerDatabaseData extends DatabaseData,
	Ready extends boolean,
	JoinedTables extends Table<InnerPostgresData, InnerDatabaseData, Ready, any, any>,
	Columns extends string,
	Where extends WhereQuery<JoinedTables, Columns> = WhereQuery<JoinedTables, Columns>
>(
	where: Where,
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

	const keys = Object.keys(where) as (keyof Where)[];
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

	//* $and: [where, where, where] | $or: [where, where, where]
	if (isRootFilterOperator(key as string)) {
		//* Make sure the value is an array
		const parsedType = getParsedType(where[key]);
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

		//* Make sure the array is not empty
		if ((where[key] as Where[]).length === 0) {
			return {
				success: false,
				error: getPGTError({
					code: "too_small",
					type: "array",
					minimum: 1,
					inclusive: true,
				}),
			};
		}

		//* Get the raw where query for each where object
		const queries = (where[key] as Where[]).map(andValue => getRawWhereQuery(andValue as any, joinedTables, depth + 1)),
			succeededQueries: { query: string; variables: (Parsers | string)[] }[] = [];

		//* Make sure all the queries succeeded
		for (const query of queries) {
			if (!query.success) return query;
			succeededQueries.push(query.data);
		}

		//* Return the raw where query
		return {
			success: true,
			data: {
				query: `WHERE\n${spaces}(\n${spaces}  ${succeededQueries
					.map(query => query.query.trim())
					.map(query => (query.startsWith("WHERE") ? query.slice(5).trim() : query))
					.join(`\n${spaces}  ${(key as string).replace("$", "")} `)}\n${spaces})`,
				variables: succeededQueries.flatMap(query => query.variables),
			},
		};
	}

	//* { column: value } | { column: { $operator: value } }
	const joinedColumns = new Set(
			joinedTables.flatMap(joinedTable => joinedTable.columns.map(column => `${joinedTable.schema.name}.${joinedTable.name}.${column.toString()}`))
		),
		//* Make sure the key is a column
		parsedObject = hasKeys<Where>(
			where,
			[...joinedColumns].map(column => [column, [ParsedType.object, ParsedType.string, ParsedType.undefined]])
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

	//* Make sure the value is an object or a string (not undefined)
	const parsedType = getParsedType(where[key]);
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

	const whereKey = where[key] as string | FilterOperators<any, any, any>;

	//* table.column = otherTable.otherColumn
	if (typeof whereKey === "string") {
		const columnsWithoutSelf = [...joinedColumns].filter(column => column !== key.toString());

		//* Make sure the column exists
		if (!columnsWithoutSelf.includes(whereKey)) {
			return {
				success: false,
				error: getPGTError({
					code: "invalid_string",
					expected: columnsWithoutSelf,
					received: whereKey,
				}),
			};
		}

		//* Return the raw where query
		return {
			success: true,
			data: {
				query: `${key.toString()} = ${whereKey}`,
				variables: [],
			},
		};
	}

	const [schemaName, tableName, columnName] = key.toString().split("."),
		table = joinedTables.find(table => table.schema.name === schemaName && table.name === tableName);

	//* Make sure the table exists, this should never happen, but just in case
	/* c8 ignore next */
	if (!table) throw new Error("Internal error: table does not exist");

	//* Get the raw filter operator
	const result = getRawFilterOperator(whereKey, table.getParserOfColumn(columnName as any) as PGTPParserClass<ConstructorFromParser<Parsers>>);

	//* Make sure the filter operator succeeded
	if (!result.success) return result;
	const [rawFilterOperator, ...variables] = result.data;

	//* Return the raw where query
	return {
		success: true,
		data: {
			query: `WHERE ${key.toString()} ${rawFilterOperator}`,
			variables,
		},
	};
}
