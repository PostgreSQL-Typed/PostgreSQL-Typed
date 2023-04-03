import type { Parsers } from "@postgresql-typed/parsers";

import type { Table } from "../classes/Table.js";
import type { DatabaseData } from "../types/interfaces/DatabaseData.js";
import type { PostgresData } from "../types/interfaces/PostgresData.js";
import type { RootFilterOperators } from "../types/interfaces/RootFilterOperators.js";
import type { OnQuery } from "../types/types/OnQuery.js";
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
): { query: string; variables: (Parsers | string)[] } {
	//* Make sure the depth is less than 10
	//TODO make the depth limit a config option
	if (depth > 10) {
		//TODO make this a custom error
		throw new Error("On filter is too deep");
	}

	const keys = Object.keys(on) as (keyof On)[];
	//* Make sure there is only one key
	if (keys.length !== 1) {
		//TODO make this a custom error
		throw new Error("On filter must have only one key");
	}

	const key = keys[0],
		spaces = " ".repeat(depth * 2 + 2);

	if (isRootFilterOperator(key as string)) {
		const queries = on[key as keyof RootFilterOperators<any>]?.map(andValue => getRawOnQuery(andValue as any, table, joinedTables, depth + 1));
		if (!queries) throw new Error("No queries found");
		return {
			query: `\n${spaces}(\n${spaces}  ${queries.map(query => query.query.trim()).join(`\n${spaces}  ${(key as string).replace("$", "")} `)}\n${spaces})`,
			variables: queries.flatMap(query => query.variables),
		};
	} else {
		const tableColumns = table.columns.map(column => `${table.schema.name}.${table.name}.${column.toString()}`);
		if (!tableColumns.includes(key.toString())) throw new Error(`Invalid column location: ${key.toString()}`);

		const onKey = on[key];

		//TODO make sure the key is a valid column location
		//* table.column = otherTable.otherColumn
		if (typeof onKey !== "object") {
			if (typeof onKey !== "string") throw new Error(`Invalid column location: ${onKey} (must be a string)`);

			const joinedColumns = joinedTables.flatMap(joinedTable =>
				joinedTable.columns.map(column => `${joinedTable.schema.name}.${joinedTable.name}.${column.toString()}`)
			);

			if (!joinedColumns.includes(onKey)) throw new Error(`Invalid column location: ${onKey}`);

			return {
				query: `${key.toString()} = ${onKey}`,
				variables: [],
			};
		}

		const columnName = key.toString().split(".")[2],
			parser = table.getParserOfTable(columnName as any),
			[rawFilterOperator, ...variables] = getRawFilterOperator(onKey as any, parser);

		return {
			query: `${key.toString()} ${rawFilterOperator}`,
			variables,
		};
	}
}
