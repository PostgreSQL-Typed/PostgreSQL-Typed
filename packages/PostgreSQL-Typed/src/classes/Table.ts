import type { DatabaseData } from "../types/interfaces/DatabaseData.js";
import { PostgresData } from "../types/interfaces/PostgresData.js";
import { RawDatabaseData } from "../types/interfaces/RawDatabaseData.js";
import { SchemaLocations } from "../types/types/SchemaLocations.js";
import type { TableLocations } from "../types/types/TableLocations.js";
import { Client } from "./Client.js";
import { Database } from "./Database.js";
import { QueryBuilder } from "./QueryBuilder.js";
import { Schema } from "./Schema.js";

export class Table<
	InnerPostgresData extends PostgresData,
	InnerDatabaseData extends DatabaseData,
	Ready extends boolean,
	SchemaLocation extends SchemaLocations<InnerPostgresData>,
	TableLocation extends TableLocations<InnerPostgresData>
> {
	constructor(
		public readonly client: Client<InnerPostgresData, Ready>,
		private readonly databaseData: RawDatabaseData<InnerDatabaseData>,
		public readonly tableLocation: TableLocation
	) {}

	get tableName(): TableLocation extends `${string}.${string}.${infer Table}` ? Table : never {
		return (this.tableLocation as string).split(".")[2] as any;
	}

	get schemaName(): TableLocation extends `${string}.${infer Schema}.${string}` ? Schema : never {
		return (this.tableLocation as string).split(".")[1] as any;
	}

	get schema(): Schema<InnerPostgresData, InnerDatabaseData, Ready, SchemaLocation> {
		return new Schema<InnerPostgresData, InnerDatabaseData, Ready, SchemaLocation>(
			this.client,
			this.databaseData,
			`${this.databaseName}.${this.schemaName}` as any
		);
	}

	get databaseName(): TableLocation extends `${infer Database}.${string}.${string}` ? Database : never {
		return (this.tableLocation as string).split(".")[0] as any;
	}

	get database(): Database<InnerPostgresData, InnerDatabaseData, Ready> {
		return new Database<InnerPostgresData, InnerDatabaseData, Ready>(this.client, this.databaseData);
	}

	get primaryKey(): TableLocation extends `${infer SchemaName}.${infer TableName}`
		? InnerDatabaseData["schemas"][SchemaName]["tables"][TableName]["primary_key"]
		: undefined {
		return this.databaseData.schemas.find(s => s.name === this.schemaName)?.tables.find(t => t.name === (this.tableName as string))?.primary_key as any;
	}

	get query(): QueryBuilder<never, InnerPostgresData, InnerDatabaseData, Ready, this> {
		return new QueryBuilder<never, InnerPostgresData, InnerDatabaseData, Ready, this>(this.client, this.databaseData, this);
	}

	/* async select<
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
		if (!this.client.ready || !this.client.client) throw new Error("Database is not ready");

		const queryBuilder = new QueryBuilder(this);
		return this.client.query(queryBuilder.getSelectQuery(columns, options, includePrimaryKey)) as any;
	} */
}
