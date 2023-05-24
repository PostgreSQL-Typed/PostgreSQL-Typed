import type { DatabaseData, PostgresData } from "@postgresql-typed/util";

import type { Table } from "../../classes/Table.js";
import type { TableColumnsFromSchemaOnwards } from "./TableColumnsFromSchemaOnwards.js";

export type OrderByDirection = "ASC" | "DESC";
export type OrderByNulls = "NULLS FIRST" | "NULLS LAST";

export type OrderBy<
	InnerPostgresData extends PostgresData,
	InnerDatabaseData extends DatabaseData,
	Ready extends boolean,
	JoinedTables extends Table<InnerPostgresData, InnerDatabaseData, Ready, any, any>,
	JoinedTablesColumns extends TableColumnsFromSchemaOnwards<JoinedTables> = TableColumnsFromSchemaOnwards<JoinedTables>
> = {
	columns?: Partial<Record<JoinedTablesColumns, OrderByDirection>>;
	nulls?: OrderByNulls;
};
