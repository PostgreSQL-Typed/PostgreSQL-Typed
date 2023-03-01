import type { z } from "zod";

import { Table } from "../classes/Table.js";
import type { DatabaseData } from "../types/interfaces/DatabaseData.js";
import { PostgresData } from "../types/interfaces/PostgresData.js";
import { RawDatabaseData } from "../types/interfaces/RawDatabaseData.js";
import { SchemaLocationByPath } from "../types/types/SchemaLocationByPath.js";
import { SchemaLocations } from "../types/types/SchemaLocations.js";
import { SchemaLocationsByDatabaseWithDatabase } from "../types/types/SchemaLocationsByDatabaseWithDatabase.js";
import { TableLocationByPath } from "../types/types/TableLocationByPath.js";
import { TableLocations } from "../types/types/TableLocations.js";
import { TableLocationsByDatabase } from "../types/types/TableLocationsByDatabase.js";
import { TableLocationsByDatabaseWithDatabase } from "../types/types/TableLocationsByDatabaseWithDatabase.js";
import type { Tables } from "../types/types/Tables.js";
import { Client } from "./Client.js";
import { Schema } from "./Schema.js";

export class Database<
	InnerPostgresData extends PostgresData,
	InnerDatabaseData extends DatabaseData,
	Ready extends boolean,
	PossibleSchemaLocations extends SchemaLocations<InnerPostgresData> = SchemaLocationsByDatabaseWithDatabase<InnerDatabaseData> extends SchemaLocations<InnerPostgresData>
		? SchemaLocationsByDatabaseWithDatabase<InnerDatabaseData>
		: never,
	PossibleTableLocations extends TableLocations<InnerPostgresData> = TableLocationsByDatabaseWithDatabase<InnerDatabaseData> extends TableLocations<InnerPostgresData>
		? TableLocationsByDatabaseWithDatabase<InnerDatabaseData>
		: never
> {
	constructor(
		public readonly client: Client<InnerPostgresData, Ready>,
		private readonly databaseData: RawDatabaseData<InnerDatabaseData>,
		private readonly databaseZodData?: {
			name: InnerDatabaseData["name"];
			schemas: {
				name: keyof InnerDatabaseData["schemas"];
				tables: {
					name: Tables<InnerDatabaseData>;
					// eslint-disable-next-line @typescript-eslint/ban-types
					zod: z.ZodObject<{}>;
				}[];
			}[];
		}
	) {}

	get databaseName(): InnerDatabaseData["name"] {
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
		return new Schema<InnerPostgresData, InnerDatabaseData, Ready, SchemaLocation>(
			this.client,
			this.databaseData,
			`${this.databaseName}.${schemaName.toString()}` as SchemaLocation
		);
	}

	get tableNames(): Tables<InnerDatabaseData>[] {
		return this.databaseData.schemas.flatMap(schema => schema.tables.map(table => table.name as string)) as Tables<InnerDatabaseData>[];
	}

	table<
		TableNameWithSchema extends TableLocationsByDatabase<InnerDatabaseData>,
		DatabaseName extends InnerDatabaseData["name"] = InnerDatabaseData["name"],
		SchemaName extends keyof InnerDatabaseData["schemas"] = TableNameWithSchema extends `${infer Schema}.${string}` ? Schema : never,
		TableName extends keyof InnerDatabaseData["schemas"][SchemaName]["tables"] = TableNameWithSchema extends `${string}.${infer Table}` ? Table : never,
		SchemaLocation extends SchemaLocations<InnerPostgresData> = SchemaLocationByPath<InnerPostgresData, DatabaseName, SchemaName>,
		TableLocation extends TableLocations<InnerPostgresData> = TableLocationByPath<InnerPostgresData, DatabaseName, SchemaName, TableName>
	>(tableNameWithSchema: TableNameWithSchema): Table<InnerPostgresData, InnerDatabaseData, Ready, SchemaLocation, TableLocation> {
		return new Table<InnerPostgresData, InnerDatabaseData, Ready, SchemaLocation, TableLocation>(
			this.client,
			this.databaseData,
			`${this.databaseName}.${tableNameWithSchema}` as TableLocation
		);
	}

	get tables(): Table<InnerPostgresData, InnerDatabaseData, Ready, PossibleSchemaLocations, PossibleTableLocations>[] {
		return this.tableLocations.map(tableName => this.table(tableName));
	}

	get tableLocations(): TableLocationsByDatabase<InnerDatabaseData>[] {
		return this.databaseData.schemas.flatMap(schema =>
			schema.tables.map(table => `${schema.name.toString()}.${table.name}` as TableLocationsByDatabase<InnerDatabaseData>)
		);
	}
}
