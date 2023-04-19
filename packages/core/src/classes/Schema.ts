import type { DatabaseData } from "../types/types/DatabaseData.js";
import type { PostgresData } from "../types/types/PostgresData.js";
import type { RawDatabaseData } from "../types/types/RawDatabaseData.js";
import type { SchemaLocations } from "../types/types/SchemaLocations.js";
import type { TableLocationByPath } from "../types/types/TableLocationByPath.js";
import type { TableLocations } from "../types/types/TableLocations.js";
import type { BaseClient } from "./BaseClient.js";
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
		public readonly client: BaseClient<InnerPostgresData, Ready>,
		private readonly databaseData: RawDatabaseData<InnerDatabaseData>,
		public readonly location: SchemaLocation
	) {}

	get name(): SchemaLocation extends `${string}.${infer Schema}` ? Schema : never {
		return (this.location as string).split(".")[1] as any;
	}

	get database(): Database<InnerPostgresData, InnerDatabaseData, Ready> {
		return new Database<InnerPostgresData, InnerDatabaseData, Ready>(this.client, this.databaseData);
	}

	get db(): Database<InnerPostgresData, InnerDatabaseData, Ready> {
		return this.database;
	}

	get tableNames(): (keyof InnerDatabaseData["schemas"][SchemaName]["tables"])[] {
		/* c8 ignore next 2 */
		//* The ?? [] is an assert never. It should never be reached, but if it is, it will return an empty array.
		return this.databaseData.schemas.find(schema => schema.name === this.name)?.tables.map(table => table.name) ?? [];
	}

	table<
		TableName extends keyof InnerDatabaseData["schemas"][SchemaName]["tables"],
		TableLocation extends TableLocations<InnerPostgresData> = TableLocationByPath<InnerPostgresData, DatabaseName, SchemaName, TableName>
	>(tableName: TableName): Table<InnerPostgresData, InnerDatabaseData, Ready, SchemaLocation, TableLocation> {
		//* Validate the table name exists (Is needed for non-TypeScript users)
		if (!this.tableNames.includes(tableName)) throw new Error(`Table "${tableName.toString()}" does not exist in schema "${this.name}"`);

		return new Table<InnerPostgresData, InnerDatabaseData, Ready, SchemaLocation, TableLocation>(
			this.client,
			this.databaseData,
			`${this.location}.${tableName.toString()}` as TableLocation
		);
	}

	tbl<
		TableName extends keyof InnerDatabaseData["schemas"][SchemaName]["tables"],
		TableLocation extends TableLocations<InnerPostgresData> = TableLocationByPath<InnerPostgresData, DatabaseName, SchemaName, TableName>
	>(tableName: TableName): Table<InnerPostgresData, InnerDatabaseData, Ready, SchemaLocation, TableLocation> {
		return this.table<TableName, TableLocation>(tableName);
	}

	get tables(): {
		[TableName in keyof InnerDatabaseData["schemas"][SchemaName]["tables"]]: Table<
			InnerPostgresData,
			InnerDatabaseData,
			Ready,
			SchemaLocation,
			TableLocationByPath<InnerPostgresData, DatabaseName, SchemaName, TableName>
		>;
	} {
		const result: {
			[TableName in keyof InnerDatabaseData["schemas"][SchemaName]["tables"]]: Table<
				InnerPostgresData,
				InnerDatabaseData,
				Ready,
				SchemaLocation,
				TableLocationByPath<InnerPostgresData, DatabaseName, SchemaName, TableName>
			>;
		} = {} as any;

		for (const tableName of this.tableNames) result[tableName] = this.table(tableName);

		return result;
	}
}
