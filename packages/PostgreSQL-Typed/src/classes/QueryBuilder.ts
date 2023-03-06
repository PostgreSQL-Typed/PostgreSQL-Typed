import { DatabaseData } from "../types/interfaces/DatabaseData.js";
import { PostgresData } from "../types/interfaces/PostgresData.js";
import { RawDatabaseData } from "../types/interfaces/RawDatabaseData.js";
import { OnQuery } from "../types/types/OnQuery.js";
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
		On extends OnQuery<JoinedTables, JoinedTable> = OnQuery<JoinedTables, JoinedTable>
	>(
		table: JoinedTable,
		on: On
		//TODO add a way to get the raw query from the on object and add it to the Query type
	): QueryBuilder<Query, InnerPostgresData, InnerDatabaseData, Ready, JoinedTables | JoinedTable> {
		//* Make sure the tables are in the same database
		if (table.database.name !== this.databaseData.name) {
			//TODO make this a custom error
			throw new Error("Cannot join tables from different databases");
		}

		//* Make sure the tables aren't already joined
		if (this.tables.includes(table)) {
			//TODO make this a custom error
			throw new Error("Cannot join the same table twice");
		}

		console.log(table.name, on);
		this.tables.push(table);
		return this as any;
	}
}
