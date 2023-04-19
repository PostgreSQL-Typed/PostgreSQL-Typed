import { getParsedType, isOneOf, ParsedType } from "@postgresql-typed/util";

import type { Table } from "../classes/Table.js";
import type { DatabaseData } from "../types/types/DatabaseData.js";
import type { GroupBy as GroupByQuery } from "../types/types/GroupBy.js";
import type { PostgresData } from "../types/types/PostgresData.js";
import type { Safe } from "../types/types/Safe.js";
import type { PGTError } from "../util/PGTError.js";
import { getPGTError } from "./getPGTError.js";

export function getRawGroupBy<
	InnerPostgresData extends PostgresData,
	InnerDatabaseData extends DatabaseData,
	Ready extends boolean,
	JoinedTables extends Table<InnerPostgresData, InnerDatabaseData, Ready, any, any>,
	GroupBy extends GroupByQuery<InnerPostgresData, InnerDatabaseData, Ready, JoinedTables> = GroupByQuery<
		InnerPostgresData,
		InnerDatabaseData,
		Ready,
		JoinedTables
	>
>(groupBy: GroupBy, tables: Table<InnerPostgresData, InnerDatabaseData, Ready, any, any>[]): Safe<string, PGTError> {
	const availableColumns = tables.flatMap(table => table.columns.map(column => `${table.schema.name}.${table.name}.${column.toString()}`)),
		parsedType = getParsedType(groupBy);

	//* Make sure the groupBy is an array or a string
	if (!isOneOf([ParsedType.array, ParsedType.string], parsedType)) {
		return {
			success: false,
			error: getPGTError({
				code: "invalid_type",
				expected: [ParsedType.array, ParsedType.string],
				received: parsedType,
			}),
		};
	}

	//* If the groupBy is an array, make sure all the items are strings
	if (Array.isArray(groupBy)) {
		for (const column of groupBy) {
			const columnType = getParsedType(column);
			if (columnType !== ParsedType.string) {
				return {
					success: false,
					error: getPGTError({
						code: "invalid_type",
						expected: ParsedType.string,
						received: columnType,
					}),
				};
			}

			//* Make sure the column is available
			if (!availableColumns.includes(column)) {
				return {
					success: false,
					error: getPGTError({
						code: "invalid_string",
						expected: availableColumns,
						received: column,
					}),
				};
			}
		}

		//* Return the groupBy
		return {
			success: true,
			data: `GROUP BY ${groupBy
				.map(group => {
					//* %schema.table%.column
					const strings = group.split(".") as [string, string, string],
						tableLocation = `%${strings[0]}.${strings[1]}%.${strings[2]}`;
					return tableLocation;
				})
				.join(", ")}`,
		};
	} else {
		//* Make sure the column is available
		if (!availableColumns.includes(groupBy)) {
			return {
				success: false,
				error: getPGTError({
					code: "invalid_string",
					expected: availableColumns,
					received: groupBy,
				}),
			};
		}

		//* %schema.table%.column
		const strings = groupBy.split(".") as [string, string, string],
			tableLocation = `%${strings[0]}.${strings[1]}%.${strings[2]}`;

		//* Return the groupBy
		return {
			success: true,
			data: `GROUP BY ${tableLocation}`,
		};
	}
}
