import type { Table } from "../../classes/Table.js";
import type { DatabaseData } from "../interfaces/DatabaseData.js";
import type { PostgresData } from "../interfaces/PostgresData.js";
import type { TableColumnsFromSchemaOnwards } from "./TableColumnsFromSchemaOnwards.js";

export type SelectQuery<
	InnerPostgresData extends PostgresData,
	InnerDatabaseData extends DatabaseData,
	Ready extends boolean,
	JoinedTables extends Table<InnerPostgresData, InnerDatabaseData, Ready, any, any>,
	JoinedTablesColumns extends TableColumnsFromSchemaOnwards<JoinedTables> = TableColumnsFromSchemaOnwards<JoinedTables>
> =
	| "*"
	| "COUNT(*)"
	| JoinedTablesColumns
	| JoinedTablesColumns[]
	| Partial<
			Record<
				"COUNT(*)",
				| {
						alias?: string;
				  }
				| true
			> &
				Record<
					JoinedTablesColumns,
					| {
							alias?: string;
							distinct?: boolean | "ON";
					  }
					| true
				> & {
					"*": true;
				}
	  >;
