import { Table } from "../classes/Table.js";
import type { DatabaseData } from "../types/interfaces/DatabaseData.js";
import { PostgresData } from "../types/interfaces/PostgresData.js";
import { RawDatabaseData } from "../types/interfaces/RawDatabaseData.js";
import { SchemaLocationByPath } from "../types/types/SchemaLocationByPath.js";
import { SchemaLocations } from "../types/types/SchemaLocations.js";
import { TableLocationByPath } from "../types/types/TableLocationByPath.js";
import { TableLocations } from "../types/types/TableLocations.js";
import { TableLocationsByDatabase } from "../types/types/TableLocationsByDatabase.js";
import { Client } from "./Client.js";
import { Schema } from "./Schema.js";

export class Database<InnerPostgresData extends PostgresData, InnerDatabaseData extends DatabaseData, Ready extends boolean> {
	constructor(public readonly client: Client<InnerPostgresData, Ready>, private readonly databaseData: RawDatabaseData<InnerDatabaseData>) {}

	get name(): InnerDatabaseData["name"] {
		return this.databaseData.name;
	}

	get schemaNames(): (keyof InnerDatabaseData["schemas"])[] {
		return this.databaseData.schemas.map(schema => schema.name);
	}

	schema<
		SchemaName extends keyof InnerDatabaseData["schemas"],
		DatabaseName extends InnerDatabaseData["name"] = InnerDatabaseData["name"],
		SchemaLocation extends SchemaLocations<InnerPostgresData> = SchemaLocationByPath<InnerPostgresData, DatabaseName, SchemaName>
	>(schemaName: SchemaName) {
		// Validate the schema name exists (Is needed for non-TypeScript users)
		if (!this.schemaNames.includes(schemaName)) throw new Error(`Schema "${schemaName.toString()}" does not exist in database "${this.name}"`);

		return new Schema<InnerPostgresData, InnerDatabaseData, Ready, SchemaLocation>(
			this.client,
			this.databaseData,
			`${this.name}.${schemaName.toString()}` as SchemaLocation
		);
	}

	get schemas(): {
		[SchemaName in keyof InnerDatabaseData["schemas"]]: Schema<
			InnerPostgresData,
			InnerDatabaseData,
			Ready,
			SchemaLocationByPath<InnerPostgresData, InnerDatabaseData["name"], SchemaName>
		>;
	} {
		const result: {
			[SchemaName in keyof InnerDatabaseData["schemas"]]: Schema<
				InnerPostgresData,
				InnerDatabaseData,
				Ready,
				SchemaLocationByPath<InnerPostgresData, InnerDatabaseData["name"], SchemaName>
			>;
		} = {} as any;

		for (const schemaName of this.schemaNames) result[schemaName] = this.schema(schemaName);

		return result as any;
	}

	table<
		TableNameWithSchema extends TableLocationsByDatabase<InnerDatabaseData>,
		DatabaseName extends InnerDatabaseData["name"] = InnerDatabaseData["name"],
		SchemaName extends keyof InnerDatabaseData["schemas"] = TableNameWithSchema extends `${infer Schema}.${string}` ? Schema : never,
		TableName extends keyof InnerDatabaseData["schemas"][SchemaName]["tables"] = TableNameWithSchema extends `${string}.${infer Table}` ? Table : never,
		SchemaLocation extends SchemaLocations<InnerPostgresData> = SchemaLocationByPath<InnerPostgresData, DatabaseName, SchemaName>,
		TableLocation extends TableLocations<InnerPostgresData> = TableLocationByPath<InnerPostgresData, DatabaseName, SchemaName, TableName>
	>(tableNameWithSchema: TableNameWithSchema): Table<InnerPostgresData, InnerDatabaseData, Ready, SchemaLocation, TableLocation> {
		// Validate the table location exists (Is needed for non-TypeScript users)
		if (!this.tableLocations.includes(tableNameWithSchema)) throw new Error(`Table "${tableNameWithSchema}" does not exist in database "${this.name}"`);

		return new Table<InnerPostgresData, InnerDatabaseData, Ready, SchemaLocation, TableLocation>(
			this.client,
			this.databaseData,
			`${this.name}.${tableNameWithSchema}` as TableLocation
		);
	}

	get tables(): {
		[SchemaName in keyof InnerDatabaseData["schemas"]]: {
			[TableName in keyof InnerDatabaseData["schemas"][SchemaName]["tables"]]: Table<
				InnerPostgresData,
				InnerDatabaseData,
				Ready,
				SchemaLocationByPath<InnerPostgresData, InnerDatabaseData["name"], SchemaName>,
				TableLocationByPath<InnerPostgresData, InnerDatabaseData["name"], SchemaName, TableName>
			>;
		};
	} {
		return Object.fromEntries(
			this.databaseData.schemas.map(schema => [
				schema.name,
				Object.fromEntries(
					schema.tables.map(table => [table.name, this.table(`${schema.name.toString()}.${table.name}` as TableLocationsByDatabase<InnerDatabaseData>)])
				),
			])
		) as any;
	}

	get tableLocations(): TableLocationsByDatabase<InnerDatabaseData>[] {
		return this.databaseData.schemas.flatMap(schema =>
			schema.tables.map(table => `${schema.name.toString()}.${table.name}` as TableLocationsByDatabase<InnerDatabaseData>)
		);
	}
}
