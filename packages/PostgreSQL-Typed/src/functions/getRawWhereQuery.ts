import type { Table } from "../classes/Table.js";
import type { DatabaseData } from "../types/interfaces/DatabaseData.js";
import type { PostgresData } from "../types/interfaces/PostgresData.js";
import type { WhereQuery } from "../types/types/WhereQuery.js";
import { getRawFilterOperator } from "./getRawFilterOperator.js";

export function getRawWhereQuery<
	InnerPostgresData extends PostgresData,
	InnerDatabaseData extends DatabaseData,
	Ready extends boolean,
	JoinedTables extends Table<InnerPostgresData, InnerDatabaseData, Ready, any, any>,
	Where extends WhereQuery<JoinedTables> = WhereQuery<JoinedTables>
>(where: Where, depth = 0): { query: string; variables: unknown[] } {
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

	switch (key) {
		case "$AND": {
			const queries = where.$AND?.map(andValue => getRawWhereQuery(andValue as any, depth + 1));
			if (!queries) throw new Error("No queries found");
			return {
				query: `\n${spaces}(\n${spaces}  ${queries.map(query => query.query.trim()).join(`\n${spaces}  AND `)}\n${spaces})`,
				variables: queries.flatMap(query => query.variables),
			};
		}
		case "$OR": {
			const queries = where.$OR?.map(orValue => getRawWhereQuery(orValue as any, depth + 1));
			if (!queries) throw new Error("No queries found");
			return {
				query: `\n${spaces}(\n${spaces}  ${queries.map(query => query.query.trim()).join(`\n${spaces}  OR `)}\n${spaces})`,
				variables: queries.flatMap(query => query.variables),
			};
		}
		default: {
			//TODO make sure the key is a valid column location
			const [rawFilterOperator, ...variables] = getRawFilterOperator(where[key] as any);

			return {
				query: `${key.toString()} ${rawFilterOperator}`,
				variables,
			};
		}
	}
}
