import type { DatabaseData } from "../types/interfaces/DatabaseData.js";
import type { PostgresData } from "../types/interfaces/PostgresData.js";
import { RawDatabaseData } from "../types/interfaces/RawDatabaseData.js";
import type { SchemaLocations } from "../types/types/SchemaLocations.js";
import { TableLocationByPath } from "../types/types/TableLocationByPath.js";
import { TableLocations } from "../types/types/TableLocations.js";
import type { Client } from "./Client.js";
import { Database } from "./Database.js";
import { Table } from "./Table.js";

export class Schema<
	InnerPostgresData extends PostgresData,
	InnerDatabaseData extends DatabaseData,
	Ready extends boolean,
	SchemaLocation extends SchemaLocations<InnerPostgresData>,
	DatabaseName extends keyof InnerPostgresData = SchemaLocation extends `${infer Database}.${string}` ? Database : never,
	SchemaName extends keyof InnerPostgresData[DatabaseName]["schemas"] = SchemaLocation extends `${string}.${infer Schema}` ? Schema : never
> {
	constructor(
		public readonly client: Client<InnerPostgresData, Ready>,
		private readonly databaseData: RawDatabaseData<InnerDatabaseData>,
		public readonly schemaLocation: SchemaLocation
	) {}

	get schemaName(): SchemaLocation extends `${string}.${infer Schema}` ? Schema : never {
		return (this.schemaLocation as string).split(".")[1] as any;
	}

	get databaseName(): SchemaLocation extends `${infer Database}.${string}` ? Database : never {
		return (this.schemaLocation as string).split(".")[0] as any;
	}

	get database(): Database<InnerPostgresData, InnerDatabaseData, Ready> {
		return new Database<InnerPostgresData, InnerDatabaseData, Ready>(this.client, this.databaseData);
	}

	get tableNames(): (keyof InnerDatabaseData["schemas"][SchemaName]["tables"])[] {
		return this.databaseData.schemas.flatMap(schema => schema.tables.map(table => table.name as string));
	}

	table<
		TableName extends keyof InnerDatabaseData["schemas"][SchemaName]["tables"],
		TableLocation extends TableLocations<InnerPostgresData> = TableLocationByPath<InnerPostgresData, DatabaseName, SchemaName, TableName>
	>(tableName: TableName): Table<InnerPostgresData, InnerDatabaseData, Ready, SchemaLocation, TableLocation> {
		return new Table<InnerPostgresData, InnerDatabaseData, Ready, SchemaLocation, TableLocation>(
			this.client,
			this.databaseData,
			`${this.schemaLocation}.${tableName.toString()}` as TableLocation
		);
	}

	get tables(): Table<InnerPostgresData, InnerDatabaseData, Ready, SchemaLocation, TableLocationByPath<InnerPostgresData, DatabaseName, SchemaName>>[] {
		return this.tableNames.map(tableName => this.table(tableName));
	}
}
