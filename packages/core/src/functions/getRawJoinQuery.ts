import type { Parsers, PGTPError } from "@postgresql-typed/parsers";
import { getParsedType, hasKeys, ParsedType } from "@postgresql-typed/util";

import type { Table } from "../classes/Table.js";
import type { DatabaseData } from "../types/interfaces/DatabaseData.js";
import type { PostgresData } from "../types/interfaces/PostgresData.js";
import type { JoinQuery } from "../types/types/JoinQuery.js";
import type { Safe } from "../types/types/Safe.js";
import type { PGTError } from "../util/PGTError.js";
import { getPGTError } from "./getPGTError.js";
import { getRawOnQuery } from "./getRawOnQuery.js";
import { isJoinType, joinTypes } from "./isJoinType.js";

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
): Safe<{ query: string; variables: (Parsers | string)[]; tableLocation: string }, PGTError | PGTPError> {
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
			return { success: true, data: { query: `${filter.$TYPE} JOIN ${tableLocation}`, variables: [], tableLocation } };

		default: {
			const parsedObject = hasKeys<Filter>(filter, [
				["$ON", ParsedType.object],
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
					case parsedObject.invalidKeys.length > 0:
						error = getPGTError({
							code: "invalid_key_type",
							...parsedObject.invalidKeys[0],
						});
						break;
					default:
						error = getPGTError({
							code: "unrecognized_keys",
							keys: [],
						});
				}
				return { success: false, error };
			}

			const onQuery = getRawOnQuery<InnerPostgresData, InnerDatabaseData, Ready, JoinedTables, JoinedTable>(filter.$ON, table, joinedTables);
			if (!onQuery.success) return onQuery;
			return {
				success: true,
				data: {
					query: `${filter.$TYPE ?? "INNER"} JOIN ${tableLocation} %${tableLocation}%\nON ${onQuery.data.query}`,
					variables: onQuery.data.variables,
					tableLocation,
				},
			};
		}
	}
}
