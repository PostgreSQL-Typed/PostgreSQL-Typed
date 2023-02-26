import type { z } from "zod";

import { Table } from "../classes/Table.js";
import type { DatabaseData } from "../types/interfaces/DatabaseData.js";
import { PostgresData } from "../types/interfaces/PostgresData.js";
import { RawDatabaseData } from "../types/interfaces/RawDatabaseData.js";
import { TableLocationByPath } from "../types/types/TableLocationByPath.js";
import { TableLocationsByDatabase } from "../types/types/TableLocationsByDatabase.js";
import type { Tables } from "../types/types/Tables.js";
import { Client } from "./Client.js";

export class Database<InnerPostgresData extends PostgresData, InnerDatabaseData extends DatabaseData, Ready extends boolean> {
	constructor(
		public readonly client: Client<InnerPostgresData, Ready>,
		public readonly databaseData: RawDatabaseData<InnerDatabaseData>,
		public readonly databaseZodData?: {
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

	table<
		TableName extends TableLocationsByDatabase<InnerDatabaseData>,
		DatabaseName extends InnerDatabaseData["name"],
		SchemaName extends TableName extends `${infer Schema}.${string}` ? Schema : never,
		TableLocation extends TableLocationByPath<InnerPostgresData, DatabaseName, SchemaName, TableName>
	>(tableName: TableName): Table<InnerPostgresData, InnerDatabaseData, Ready, TableLocation> {
		return new Table<InnerPostgresData, InnerDatabaseData, Ready, TableLocation>(this, tableName);
	}

	get tables(): Table<InnerPostgresData, InnerDatabaseData, Ready, TableLocationsByDatabase<InnerDatabaseData>>[] {
		return this.tableLocations.map(tableName => this.table(tableName));
	}

	get databaseName(): InnerDatabaseData["name"] {
		return this.databaseData.name;
	}

	get schemaNames(): (keyof InnerDatabaseData["schemas"])[] {
		return this.databaseData.schemas.map(schema => schema.name);
	}

	get tableNames(): Tables<InnerDatabaseData>[] {
		return this.databaseData.schemas.flatMap(schema => schema.tables.map(table => table.name as string)) as Tables<InnerDatabaseData>[];
	}

	get tableLocations(): TableLocationsByDatabase<InnerDatabaseData>[] {
		return this.databaseData.schemas.flatMap(schema =>
			schema.tables.map(table => `${schema.name.toString()}.${table.name}` as TableLocationsByDatabase<InnerDatabaseData>)
		);
	}
}
