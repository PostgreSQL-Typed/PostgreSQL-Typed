import { DatabaseData } from "../types/interfaces/DatabaseData.js";
import { PostgresData } from "../types/interfaces/PostgresData.js";
import { RawDatabaseData } from "../types/interfaces/RawDatabaseData.js";
import { TableColumnsFromSchemaOnwards } from "../types/types/TableColumnsFromSchemaOnwards.js";
import { TableLocationsFromSchemaOnwards } from "../types/types/TableLocationsFromSchemaOnwards.js";
import { Client } from "./Client.js";
import { Table } from "./Table.js";

export class QueryBuilder<
	Query extends string,
	InnerPostgresData extends PostgresData,
	InnerDatabaseData extends DatabaseData,
	Ready extends boolean,
	JoinedTables extends Table<InnerPostgresData, InnerDatabaseData, Ready, any, any>,
	JoinedTablesPaths extends TableLocationsFromSchemaOnwards<JoinedTables> = TableLocationsFromSchemaOnwards<JoinedTables>,
	JoinedTablesColumns extends TableColumnsFromSchemaOnwards<JoinedTables> = TableColumnsFromSchemaOnwards<JoinedTables>
> {
	tables: Table<InnerPostgresData, InnerDatabaseData, Ready, any, any>[] = [];
	constructor(
		private readonly client: Client<InnerPostgresData, Ready>,
		private readonly databaseData: RawDatabaseData<InnerDatabaseData>,
		readonly table: JoinedTables
	) {
		this.tables.push(table);
	}

	join<
		JoinedTable extends Table<InnerPostgresData, InnerDatabaseData, Ready, any, any>,
		JoinedTableColumns extends TableColumnsFromSchemaOnwards<JoinedTable> = TableColumnsFromSchemaOnwards<JoinedTable>
	>(
		table: JoinedTable,
		on: {
			$ON: {
				[key in JoinedTableColumns]: string;
			};
		}
	): QueryBuilder<Query, InnerPostgresData, InnerDatabaseData, Ready, JoinedTables | JoinedTable> {
		console.log(table.name, on);
		this.tables.push(table);
		return this;
	}
}
