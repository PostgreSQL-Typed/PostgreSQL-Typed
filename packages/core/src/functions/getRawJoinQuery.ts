import { Int4, type Int4Constructor, type Parsers, type PGTPError, PGTPParser, type PGTPParserClass } from "@postgresql-typed/parsers";
import { type DatabaseData, getParsedType, hasKeys, ParsedType, type PGTError, type PostgresData, type Safe } from "@postgresql-typed/util";

import type { Table } from "../classes/Table.js";
import type { JoinQuery } from "../types/types/JoinQuery.js";
import type { SelectSubQuery } from "../types/types/SelectSubQuery.js";
import { getPGTError } from "./getPGTError.js";
import { getRawOnQuery } from "./getRawOnQuery.js";
import { isJoinType, joinTypes } from "./isJoinType.js";

//* This is a custom type for the count function
export type Count = Int4;
export const CountParser: PGTPParserClass<Int4Constructor> = PGTPParser(Int4);

export function getRawJoinQuery<
	InnerPostgresData extends PostgresData,
	InnerDatabaseData extends DatabaseData,
	Ready extends boolean,
	JoinedTables extends Table<InnerPostgresData, InnerDatabaseData, Ready, any, any>,
	JoinedTable extends Table<InnerPostgresData, InnerDatabaseData, Ready, any, any>,
	Filter extends JoinQuery<JoinedTables, JoinedTable> = JoinQuery<JoinedTables, JoinedTable>
>(
	filter: Filter,
	table: JoinedTable,
	joinedTables: Table<InnerPostgresData, InnerDatabaseData, Ready, any, any>[]
): Safe<{ query: string; variables: (Parsers | string)[]; tableLocation: string; subqueries: SelectSubQuery<any, any, boolean>[] }, PGTError | PGTPError> {
	//* Table.location is in the format of "database.schema.table" but we only want "schema.table"
	const tableLocation: string = table.location.split(".").slice(1).join("."),
		//* Make sure the filter is an object
		parsedType = getParsedType(filter);
	if (parsedType !== ParsedType.object) {
		return {
			success: false,
			error: getPGTError({
				code: "invalid_type",
				expected: ParsedType.object,
				received: parsedType,
			}),
		};
	}

	//* Make sure the filter has the correct keys
	const parsedObject = hasKeys<Filter>(filter, [
		["$ON", [ParsedType.object, ParsedType.undefined]],
		["$TYPE", [ParsedType.string, ParsedType.undefined]],
	]);
	if (!parsedObject.success) {
		let error: PGTError;
		switch (true) {
			case parsedObject.otherKeys.length > 0:
				error = getPGTError({
					code: "unrecognized_keys",
					keys: parsedObject.otherKeys,
				});
				break;
			case parsedObject.missingKeys.length > 0:
				error = getPGTError({
					code: "missing_keys",
					keys: parsedObject.missingKeys,
				});
				break;
			default:
				error = getPGTError({
					code: "invalid_key_type",
					...parsedObject.invalidKeys[0],
				});
				break;
		}
		return { success: false, error };
	}

	//* If the filter has a $TYPE key, make sure it's a valid join type
	if (filter.$TYPE && !isJoinType(filter.$TYPE)) {
		return {
			success: false,
			error: getPGTError({
				code: "invalid_join_type",
				expected: joinTypes,
				received: filter.$TYPE,
			}),
		};
	}

	switch (filter.$TYPE) {
		case "CROSS":
		case "NATURAL":
		case "NATURAL INNER":
		case "NATURAL LEFT":
		case "NATURAL RIGHT":
			return { success: true, data: { query: `${filter.$TYPE} JOIN ${tableLocation}`, variables: [], tableLocation, subqueries: [] } };

		default: {
			const parsedObject = hasKeys<Filter>(filter, [
				["$ON", ParsedType.object],
				["$TYPE", [ParsedType.string, ParsedType.undefined]],
			]);

			//* Make sure the ON filter is set and is an object
			if (!parsedObject.success) {
				let error: PGTError;
				switch (true) {
					/* c8 ignore next 6 */
					case parsedObject.otherKeys.length > 0:
						error = getPGTError({
							code: "unrecognized_keys",
							keys: parsedObject.otherKeys,
						});
						break;
					case parsedObject.missingKeys.length > 0:
						error = getPGTError({
							code: "missing_keys",
							keys: parsedObject.missingKeys,
						});
						break;
					default:
						error = getPGTError({
							code: "invalid_key_type",
							...parsedObject.invalidKeys[0],
						});
						break;
				}
				return { success: false, error };
			}

			//* Get the ON query
			const onQuery = getRawOnQuery<InnerPostgresData, InnerDatabaseData, Ready, JoinedTables, JoinedTable>(filter.$ON, table, joinedTables);
			if (!onQuery.success) return onQuery;
			return {
				success: true,
				data: {
					query: `${filter.$TYPE ?? "INNER"} JOIN ${tableLocation} %${tableLocation}%\nON ${onQuery.data.query}`,
					variables: onQuery.data.variables,
					tableLocation,
					subqueries: onQuery.data.subqueries,
				},
			};
		}
	}
}
