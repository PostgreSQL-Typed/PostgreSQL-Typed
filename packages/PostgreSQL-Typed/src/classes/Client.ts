import postgres from "postgres";

import type { PostgresData } from "../types/interfaces/PostgresData.js";
import { RawDatabaseData } from "../types/interfaces/RawDatabaseData.js";
import { RawPostgresData } from "../types/types/RawPostgresData.js";
import { SchemaLocations } from "../types/types/SchemaLocations.js";
import { TableLocations } from "../types/types/TableLocations.js";
import { Database } from "./Database.js";
import { Schema } from "./Schema.js";
import { Table } from "./Table.js";

export class Client<InnerPostgresData extends PostgresData, Ready extends boolean = false> {
	public readonly client: postgres.Sql;
	private _ready = false;
	private _connectionError: unknown = undefined;

	constructor(
		public readonly postgresData: RawPostgresData<InnerPostgresData>,
		// eslint-disable-next-line @typescript-eslint/ban-types
		public readonly options?: postgres.Options<{}>
	) {
		this.client = postgres(options);
	}

	async testConnection(): Promise<Client<InnerPostgresData, true>> {
		if (this._ready) return this as any;
		try {
			await this.client`SELECT 1`;
			this._ready = true;
			return this as any;
		} catch (error) {
			this._ready = false;
			this._connectionError = error;
			return this as any;
		}
	}

	get ready(): Ready {
		return this._ready as Ready;
	}

	get connectionError(): unknown {
		return this._connectionError;
	}

	get databaseNames(): (keyof InnerPostgresData)[] {
		return Object.keys(this.postgresData) as any;
	}

	database<Database extends keyof InnerPostgresData>(database: Database) {
		return new Database<InnerPostgresData, InnerPostgresData[Database], Ready>(this, this.postgresData[database]);
	}

	get databases(): Database<InnerPostgresData, InnerPostgresData[keyof InnerPostgresData], Ready>[] {
		return this.databaseNames.map(database => this.database(database));
	}

	schema<SchemaLocation extends SchemaLocations<InnerPostgresData>>(
		schema: SchemaLocation
	): SchemaLocation extends `${infer Database}.${string}` ? Schema<InnerPostgresData, InnerPostgresData[Database], Ready, SchemaLocation> : never {
		const [database] = (schema as string).split(".");
		return new Schema<InnerPostgresData, InnerPostgresData[typeof database], Ready, SchemaLocation>(this, this.postgresData[database], schema) as any;
	}

	get schemas(): Schema<InnerPostgresData, InnerPostgresData[keyof InnerPostgresData], Ready, SchemaLocations<InnerPostgresData>>[] {
		return this.schemaLocations.map(
			schema => this.schema(schema) as Schema<InnerPostgresData, InnerPostgresData[keyof InnerPostgresData], Ready, SchemaLocations<InnerPostgresData>>
		);
	}

	get schemaLocations(): SchemaLocations<InnerPostgresData>[] {
		return Object.values(this.postgresData).flatMap(([databaseName, databaseData]: [string, RawDatabaseData<InnerPostgresData[keyof InnerPostgresData]>]) =>
			databaseData.schemas.map(schema => `${databaseName}.${schema.name.toString()}` as SchemaLocations<InnerPostgresData>)
		);
	}

	table<
		TableLocation extends TableLocations<InnerPostgresData>,
		TemporarySchemaLocation = TableLocation extends `${infer Database}.${infer Schema}.${string}` ? `${Database}.${Schema}` : never,
		SchemaLocation extends SchemaLocations<InnerPostgresData> = TemporarySchemaLocation extends SchemaLocations<InnerPostgresData>
			? TemporarySchemaLocation
			: never
	>(table: TableLocation): Table<InnerPostgresData, InnerPostgresData[keyof InnerPostgresData], Ready, SchemaLocation, TableLocation> {
		const [database] = (table as string).split(".");
		return new Table<InnerPostgresData, InnerPostgresData[keyof InnerPostgresData], Ready, SchemaLocation, TableLocation>(
			this,
			this.postgresData[database as keyof InnerPostgresData],
			table
		) as any;
	}

	get tables(): Table<
		InnerPostgresData,
		InnerPostgresData[keyof InnerPostgresData],
		Ready,
		SchemaLocations<InnerPostgresData>,
		TableLocations<InnerPostgresData>
	>[] {
		return this.tableLocations.map(table => this.table(table));
	}

	get tableLocations(): TableLocations<InnerPostgresData>[] {
		return Object.entries(this.postgresData).flatMap(([databaseName, databaseData]: [string, RawDatabaseData<InnerPostgresData[keyof InnerPostgresData]>]) =>
			databaseData.schemas.flatMap(schema =>
				schema.tables.map(table => `${databaseName}.${schema.name.toString()}.${table.name}` as TableLocations<InnerPostgresData>)
			)
		);
	}
}
