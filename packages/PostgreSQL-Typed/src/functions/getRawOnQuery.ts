import type { Table } from "../classes/Table.js";
import type { DatabaseData } from "../types/interfaces/DatabaseData.js";
import type { PostgresData } from "../types/interfaces/PostgresData.js";
import type { OnQuery } from "../types/types/OnQuery.js";
import { getRawFilterOperator } from "./getRawFilterOperator.js";

export function getRawOnQuery<
	InnerPostgresData extends PostgresData,
	InnerDatabaseData extends DatabaseData,
	Ready extends boolean,
	JoinedTables extends Table<InnerPostgresData, InnerDatabaseData, Ready, any, any>,
	JoinedTable extends Table<InnerPostgresData, InnerDatabaseData, Ready, any, any>,
	On extends OnQuery<JoinedTables, JoinedTable> = OnQuery<JoinedTables, JoinedTable>
>(on: On, depth = 0): { query: string; variables: unknown[] } {
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
		spaces = " ".repeat(depth * 2 + 4);

	switch (key) {
		case "$AND": {
			const queries = on.$AND?.map(andValue => getRawOnQuery(andValue as any, depth + 1));
			if (!queries) throw new Error("No queries found");
			return {
				query: `\n${spaces}(\n${spaces} ${queries.map(query => query.query.trim()).join(`\n${spaces} AND `)}\n${spaces})`,
				variables: queries.flatMap(query => query.variables),
			};
		}
		case "$OR": {
			const queries = on.$OR?.map(orValue => getRawOnQuery(orValue as any, depth + 1));
			if (!queries) throw new Error("No queries found");
			return {
				query: `\n${spaces}(\n${spaces} ${queries.map(query => query.query.trim()).join(`\n${spaces} OR `)}\n${spaces})`,
				variables: queries.flatMap(query => query.variables),
			};
		}
		default: {
			//TODO make sure the key is a valid column location
			//* table.column = otherTable.otherColumn
			if (typeof on[key] !== "object") {
				return {
					query: `${key.toString()} = ${on[key]}`,
					variables: [],
				};
			}
			const [rawFilterOperator, ...variables] = getRawFilterOperator(on[key] as any);

			return {
				query: `${key.toString()} ${rawFilterOperator}`,
				variables,
			};
		}
	}
}
