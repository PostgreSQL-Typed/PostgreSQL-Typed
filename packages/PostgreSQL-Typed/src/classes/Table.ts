import type { QueryResult } from "pg";

import type { Database } from "../classes/Database.js";
import { QueryBuilder } from "../classes/QueryBuilder.js";
import type { DatabaseData } from "../types/interfaces/DatabaseData.js";
import type { SelectOptions } from "../types/interfaces/SelectOptions.js";
import type { ColumnNamesOfTable } from "../types/types/ColumnNamesOfTable.js";
import type { ColumnsOfTable } from "../types/types/ColumnsOfTable.js";
import type { Include } from "../types/types/Include.js";
import type { PrimaryKeyOfTable } from "../types/types/PrimaryKeyOfTable.js";
import type { TableLocations } from "../types/types/TableLocations.js";

export class Table<
	InnerDatabaseData extends DatabaseData,
	Ready extends boolean,
	ClientType extends "client" | "pool",
	TableLocation extends TableLocations<InnerDatabaseData>
> {
	constructor(public readonly database: Database<InnerDatabaseData, Ready, ClientType>, public readonly tableLocation: TableLocation) {}

	get table_name(): TableLocation extends `${string}.${infer Table}` ? Table : never {
		return (this.tableLocation as string).split(".")[1] as any;
	}

	get schema_name(): TableLocation extends `${infer Schema}.${string}` ? Schema : never {
		return (this.tableLocation as string).split(".")[0] as any;
	}

	get primary_key(): TableLocation extends `${infer SchemaName}.${infer TableName}`
		? InnerDatabaseData["schemas"][SchemaName]["tables"][TableName]["primary_key"]
		: undefined {
		return this.database.database_data.schemas.find(s => s.name === this.schema_name)?.tables.find(t => t.name === (this.table_name as string))
			?.primary_key as any;
	}

	async select<
		ColumNames extends ColumnNamesOfTable<InnerDatabaseData, TableLocation>,
		Columns extends ColumnsOfTable<InnerDatabaseData, TableLocation>,
		IncludePrimaryKey extends boolean = false
	>(
		columns: ColumNames | "*",
		options?: SelectOptions<Columns>,
		includePrimaryKey?: IncludePrimaryKey
	): Promise<
		Ready extends false
			? never
			: ColumNames extends "*"
			? QueryResult<Columns>
			: QueryResult<{
					[Column in Include<
						keyof Columns,
						IncludePrimaryKey extends true ? (ColumNames | [PrimaryKeyOfTable<InnerDatabaseData, TableLocation>])[number] : ColumNames[number]
					>]: Columns[Column];
			  }>
	> {
		if (!this.database.ready || !this.database.client) throw new Error("Database is not ready");

		const queryBuilder = new QueryBuilder(this);
		return this.database.client.query(queryBuilder.getSelectQuery(columns, options, includePrimaryKey)) as any;
	}
}
