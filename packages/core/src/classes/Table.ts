import type { DatabaseData } from "../types/interfaces/DatabaseData.js";
import type { PostgresData } from "../types/interfaces/PostgresData.js";
import type { RawDatabaseData } from "../types/interfaces/RawDatabaseData.js";
import type { ColumnsOfTable } from "../types/types/ColumnsOfTable.js";
import type { PGTPParserOfColumn } from "../types/types/PGTPParserOfColumn.js";
import type { SchemaLocations } from "../types/types/SchemaLocations.js";
import type { TableLocations } from "../types/types/TableLocations.js";
import type { BaseClient } from "./BaseClient.js";
import { Database } from "./Database.js";
import { Schema } from "./Schema.js";
import { SelectBuilder } from "./SelectBuilder.js";

export class Table<
	InnerPostgresData extends PostgresData,
	InnerDatabaseData extends DatabaseData,
	Ready extends boolean,
	SchemaLocation extends SchemaLocations<InnerPostgresData>,
	TableLocation extends TableLocations<InnerPostgresData>
> {
	constructor(
		public readonly client: BaseClient<InnerPostgresData, Ready>,
		private readonly databaseData: RawDatabaseData<InnerDatabaseData>,
		public readonly location: TableLocation
	) {}

	get name(): TableLocation extends `${string}.${string}.${infer Table}` ? Table : never {
		return (this.location as string).split(".")[2] as any;
	}

	get schema(): Schema<InnerPostgresData, InnerDatabaseData, Ready, SchemaLocation> {
		const [databaseName, schemaName] = (this.location as string).split(".");
		return new Schema<InnerPostgresData, InnerDatabaseData, Ready, SchemaLocation>(this.client, this.databaseData, `${databaseName}.${schemaName}` as any);
	}

	get sch(): Schema<InnerPostgresData, InnerDatabaseData, Ready, SchemaLocation> {
		return this.schema;
	}

	get database(): Database<InnerPostgresData, InnerDatabaseData, Ready> {
		return new Database<InnerPostgresData, InnerDatabaseData, Ready>(this.client, this.databaseData);
	}

	get db(): Database<InnerPostgresData, InnerDatabaseData, Ready> {
		return this.database;
	}

	get primaryKey(): TableLocation extends `${string}.${infer SchemaName}.${infer TableName}`
		? InnerDatabaseData["schemas"][SchemaName]["tables"][TableName]["primary_key"]
		: undefined {
		const [, schemaName] = (this.location as string).split(".");
		return this.databaseData.schemas.find(s => s.name === schemaName)?.tables.find(t => t.name === (this.name as string))?.primary_key as any;
	}

	get select(): SelectBuilder<InnerPostgresData, InnerDatabaseData, Ready, this> {
		return new SelectBuilder<InnerPostgresData, InnerDatabaseData, Ready, this>(this.client, this.databaseData, this);
	}

	get columns(): ColumnsOfTable<InnerPostgresData, TableLocation>[] {
		return Object.keys(
			this.databaseData.schemas.find(s => s.name === this.schema.name)?.tables.find(t => t.name === (this.name as string))?.columns ?? {}
		) as ColumnsOfTable<InnerPostgresData, TableLocation>[];
	}

	getParserOfTable<Column extends ColumnsOfTable<InnerPostgresData, TableLocation>>(
		column: Column
	): PGTPParserOfColumn<InnerPostgresData, TableLocation, Column> {
		const columnObject = this.databaseData.schemas.find(s => s.name === this.schema.name)?.tables.find(t => t.name === (this.name as string))?.columns[column];

		if (!columnObject) throw new Error(`Column ${column} does not exist in table ${this.name}`);

		return columnObject as any;
	}
}
