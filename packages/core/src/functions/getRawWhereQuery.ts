import type { Parsers } from "@postgresql-typed/parsers";

import type { Table } from "../classes/Table.js";
import type { DatabaseData } from "../types/interfaces/DatabaseData.js";
import type { PostgresData } from "../types/interfaces/PostgresData.js";
import type { RootFilterOperators } from "../types/interfaces/RootFilterOperators.js";
import type { WhereQuery } from "../types/types/WhereQuery.js";
import { getRawFilterOperator } from "./getRawFilterOperator.js";
import { isRootFilterOperator } from "./isRootFilterOperator.js";

export function getRawWhereQuery<
	InnerPostgresData extends PostgresData,
	InnerDatabaseData extends DatabaseData,
	Ready extends boolean,
	JoinedTables extends Table<InnerPostgresData, InnerDatabaseData, Ready, any, any>,
	Columns extends string,
	Where extends WhereQuery<JoinedTables, Columns> = WhereQuery<JoinedTables, Columns>
>(where: Where, joinedTables: Table<InnerPostgresData, InnerDatabaseData, Ready, any, any>[], depth = 0): { query: string; variables: (Parsers | string)[] } {
	//* Make sure the depth is less than 10
	//TODO make the depth limit a config option
	if (depth > 10) {
		//TODO make this a custom error
		throw new Error("On filter is too deep");
	}

	const keys = Object.keys(where) as (keyof Where)[];
	//* Make sure there is only one key
	if (keys.length !== 1) {
		//TODO make this a custom error
		throw new Error("Where filter must have only one key");
	}

	const key = keys[0],
		spaces = " ".repeat(depth * 2 + 2);

	if (isRootFilterOperator(key as string)) {
		const queries = where[key as keyof RootFilterOperators<any>]?.map(andValue => getRawWhereQuery(andValue as any, joinedTables, depth + 1));
		if (!queries) throw new Error("No queries found");
		return {
			query: `\n${spaces}(\n${spaces}  ${queries.map(query => query.query.trim()).join(`\n${spaces}  ${(key as string).replace("$", "")} `)}\n${spaces})`,
			variables: queries.flatMap(query => query.variables),
		};
	} else {
		const whereKey = where[key],
			joinedColumns = new Set(
				joinedTables.flatMap(joinedTable => joinedTable.columns.map(column => `${joinedTable.schema.name}.${joinedTable.name}.${column.toString()}`))
			);

		//* Make sure the key is a valid column
		if (!joinedColumns.has(key.toString())) {
			//TODO make this a custom error
			throw new Error("Invalid column");
		}

		//* table.column = otherTable.otherColumn
		if (typeof whereKey !== "object") {
			if (typeof whereKey !== "string") {
				//TODO make this a custom error
				throw new TypeError("Invalid where filter value");
			}

			//* Make sure they don't equal each other
			if (key.toString() === whereKey.toString()) {
				//TODO make this a custom error
				throw new Error("Cannot compare a column to itself");
			}

			//* Make sure the other key is a valid column
			if (!joinedColumns.has(whereKey.toString())) {
				//TODO make this a custom error
				throw new Error("Invalid column");
			}

			return {
				query: `${key.toString()} = ${whereKey}`,
				variables: [],
			};
		}

		const [schemaName, tableName, columnName] = key.toString().split("."),
			table = joinedTables.find(table => table.schema.name === schemaName && table.name === tableName);

		//* Make sure the table exists
		if (!table) {
			//TODO make this a custom error
			throw new Error("Invalid column");
		}

		const [rawFilterOperator, ...variables] = getRawFilterOperator(whereKey as any, table.getParserOfTable(columnName as any));

		return {
			query: `${key.toString()} ${rawFilterOperator}`,
			variables,
		};
	}
}
