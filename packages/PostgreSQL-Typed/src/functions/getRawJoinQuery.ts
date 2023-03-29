import type { Table } from "../classes/Table.js";
import type { DatabaseData } from "../types/interfaces/DatabaseData.js";
import type { PostgresData } from "../types/interfaces/PostgresData.js";
import type { JoinQuery } from "../types/types/JoinQuery.js";
import { getRawOnQuery } from "./getRawOnQuery.js";
import { isJoinType } from "./isJoinType.js";

export function getRawJoinQuery<
	InnerPostgresData extends PostgresData,
	InnerDatabaseData extends DatabaseData,
	Ready extends boolean,
	JoinedTables extends Table<InnerPostgresData, InnerDatabaseData, Ready, any, any>,
	JoinedTable extends Table<InnerPostgresData, InnerDatabaseData, Ready, any, any>,
	Filter extends JoinQuery<JoinedTables, JoinedTable> = JoinQuery<JoinedTables, JoinedTable>
>(filter: Filter, table: JoinedTable): { query: string; variables: unknown[] } {
	//* Table.location is in the format of "database.schema.table" but we only want "schema.table"
	const tableLocation = table.location.split(".").slice(1).join(".");

	if (filter.$TYPE && !isJoinType(filter.$TYPE)) {
		//TODO make this a custom error
		throw new Error("Invalid join type");
	}

	switch (filter.$TYPE) {
		case "CROSS":
		case "NATURAL":
		case "NATURAL INNER":
		case "NATURAL LEFT":
		case "NATURAL RIGHT":
			return { query: `${filter.$TYPE} JOIN ${tableLocation}`, variables: [] };

		default: {
			const onQuery = getRawOnQuery<InnerPostgresData, InnerDatabaseData, Ready, JoinedTables, JoinedTable>(filter.$ON);
			return {
				query: `${filter.$TYPE ?? "INNER"} JOIN ${tableLocation}\nON ${onQuery.query}`,
				variables: onQuery.variables,
			};
		}
	}
}
