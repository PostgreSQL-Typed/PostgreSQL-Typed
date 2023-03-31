import postgres from "postgres";

import type { PostgresData } from "../types/interfaces/PostgresData.js";
import type { RawDatabaseData } from "../types/interfaces/RawDatabaseData.js";
import type { RawPostgresData } from "../types/types/RawPostgresData.js";
import type { SchemaLocationByPath } from "../types/types/SchemaLocationByPath.js";
import type { SchemaLocations } from "../types/types/SchemaLocations.js";
import type { TableLocationByPath } from "../types/types/TableLocationByPath.js";
import type { TableLocations } from "../types/types/TableLocations.js";
import { Database } from "./Database.js";
import { Schema } from "./Schema.js";
import { Table } from "./Table.js";

export class Client<InnerPostgresData extends PostgresData, Ready extends boolean = false> {
	private _client: postgres.Sql;
	private _ready = false;
	private _connectionError: unknown = undefined;

	constructor(
		private readonly postgresData: RawPostgresData<InnerPostgresData>,
		connectionOptions?:
			| string
			| {
					url?: string;
					// eslint-disable-next-line @typescript-eslint/ban-types
					options?: postgres.Options<{}>;
			  }
	) {
		this._client =
			typeof connectionOptions === "string"
				? postgres(connectionOptions)
				: connectionOptions !== undefined && "url" in connectionOptions && typeof connectionOptions.url === "string"
				? postgres(connectionOptions.url, connectionOptions.options)
				: postgres(connectionOptions?.options);
	}

	// eslint-disable-next-line @typescript-eslint/ban-types
	async testConnection(
		connectionOptions?:
			| string
			| {
					url?: string;
					// eslint-disable-next-line @typescript-eslint/ban-types
					options?: postgres.Options<{}>;
			  }
	): Promise<Client<InnerPostgresData, true> | Client<InnerPostgresData, false>> {
		this._ready = false;
		this._connectionError = undefined;
		if (connectionOptions !== undefined) {
			this._client =
				typeof connectionOptions === "string"
					? postgres(connectionOptions)
					: "url" in connectionOptions && typeof connectionOptions.url === "string"
					? postgres(connectionOptions.url, connectionOptions.options)
					: postgres(connectionOptions.options);
		}
		try {
			await this._client`SELECT 1`;
			this._ready = true;
			return this as Client<InnerPostgresData, true>;
		} catch (error) {
			this._connectionError = error;
			return this as Client<InnerPostgresData, false>;
		}
	}

	get client(): postgres.Sql {
		return this._client;
	}

	get ready(): Ready {
		return this._ready as Ready;
	}

	get connectionError(): unknown {
		return this._connectionError;
	}

	get databaseNames(): (keyof InnerPostgresData)[] {
		return Object.keys(this.postgresData) as (keyof InnerPostgresData)[];
	}

	database<DatabaseName extends keyof InnerPostgresData>(database: DatabaseName) {
		// Validate the database name exists (Is needed for non-TypeScript users)
		if (!this.databaseNames.includes(database)) throw new Error(`Database "${database.toString()}" does not exist`);

		return new Database<InnerPostgresData, InnerPostgresData[DatabaseName], Ready>(this, this.postgresData[database]);
	}

	get databases(): {
		[DatabaseName in keyof InnerPostgresData]: Database<InnerPostgresData, InnerPostgresData[DatabaseName], Ready>;
	} {
		const result: {
			[DatabaseName in keyof InnerPostgresData]: Database<InnerPostgresData, InnerPostgresData[DatabaseName], Ready>;
		} = {} as any;

		for (const databaseName of this.databaseNames) result[databaseName] = this.database(databaseName);

		return result;
	}

	schema<SchemaLocation extends SchemaLocations<InnerPostgresData>>(
		schema: SchemaLocation
	): SchemaLocation extends `${infer Database}.${string}` ? Schema<InnerPostgresData, InnerPostgresData[Database], Ready, SchemaLocation> : never {
		// Validate the schema location exists (Is needed for non-TypeScript users)
		if (!this.schemaLocations.includes(schema)) throw new Error(`Schema "${schema}" does not exist`);

		const [database] = (schema as string).split(".");
		return new Schema<InnerPostgresData, InnerPostgresData[typeof database], Ready, SchemaLocation>(this, this.postgresData[database], schema) as any;
	}

	get schemas(): {
		[DatabaseName in keyof InnerPostgresData]: {
			[SchemaName in keyof InnerPostgresData[DatabaseName]["schemas"]]: Schema<
				InnerPostgresData,
				InnerPostgresData[DatabaseName],
				Ready,
				SchemaLocationByPath<InnerPostgresData, DatabaseName, SchemaName> extends SchemaLocations<InnerPostgresData>
					? SchemaLocationByPath<InnerPostgresData, DatabaseName, SchemaName>
					: never
			>;
		};
	} {
		return Object.fromEntries(
			Object.entries(this.postgresData).map(([databaseName, databaseData]: [string, RawDatabaseData<InnerPostgresData[keyof InnerPostgresData]>]) => [
				databaseName,
				Object.fromEntries(
					databaseData.schemas.map(schema => [
						schema.name,
						new Schema<
							InnerPostgresData,
							InnerPostgresData[keyof InnerPostgresData],
							Ready,
							SchemaLocationByPath<InnerPostgresData, typeof databaseName, typeof schema.name>
						>(
							this,
							databaseData,
							`${databaseName}.${schema.name.toString()}` as SchemaLocationByPath<InnerPostgresData, typeof databaseName, typeof schema.name>
						),
					])
				),
			])
		) as any;
	}

	get schemaLocations(): SchemaLocations<InnerPostgresData>[] {
		// Map over the databases and schemas and return the schema locations (database.schema)
		return Object.entries(this.postgresData).flatMap(([databaseName, databaseData]: [string, RawDatabaseData<InnerPostgresData[keyof InnerPostgresData]>]) =>
			databaseData.schemas.map(schema => `${databaseName}.${schema.name.toString()}` as SchemaLocations<InnerPostgresData>)
		);
	}

	table<
		TableLocation extends TableLocations<InnerPostgresData>,
		DatabaseName extends keyof InnerPostgresData = TableLocation extends `${infer Database}.${string}` ? Database : never,
		TemporarySchemaLocation = TableLocation extends `${infer Database}.${infer Schema}.${string}` ? `${Database}.${Schema}` : never,
		SchemaLocation extends SchemaLocations<InnerPostgresData> = TemporarySchemaLocation extends SchemaLocations<InnerPostgresData>
			? TemporarySchemaLocation
			: never
	>(table: TableLocation): Table<InnerPostgresData, InnerPostgresData[DatabaseName], Ready, SchemaLocation, TableLocation> {
		// Validate the table location exists (Is needed for non-TypeScript users)
		if (!this.tableLocations.includes(table)) throw new Error(`Table "${table}" does not exist`);

		const [database] = (table as string).split(".");
		return new Table<InnerPostgresData, InnerPostgresData[keyof InnerPostgresData], Ready, SchemaLocation, TableLocation>(
			this,
			this.postgresData[database as keyof InnerPostgresData],
			table
		) as any;
	}

	get tables(): {
		[DatabaseName in keyof InnerPostgresData]: {
			[SchemaName in keyof InnerPostgresData[DatabaseName]["schemas"]]: {
				[TableName in keyof InnerPostgresData[DatabaseName]["schemas"][SchemaName]["tables"]]: Table<
					InnerPostgresData,
					InnerPostgresData[DatabaseName],
					Ready,
					SchemaLocationByPath<InnerPostgresData, DatabaseName, SchemaName> extends SchemaLocations<InnerPostgresData>
						? SchemaLocationByPath<InnerPostgresData, DatabaseName, SchemaName>
						: never,
					TableLocationByPath<InnerPostgresData, DatabaseName, SchemaName, TableName> extends TableLocations<InnerPostgresData>
						? TableLocationByPath<InnerPostgresData, DatabaseName, SchemaName, TableName>
						: never
				>;
			};
		};
	} {
		return Object.fromEntries(
			Object.entries(this.postgresData).map(([databaseName, databaseData]: [string, RawDatabaseData<InnerPostgresData[keyof InnerPostgresData]>]) => [
				databaseName,
				Object.fromEntries(
					databaseData.schemas.map(schema => [
						schema.name,
						Object.fromEntries(
							schema.tables.map(table => [
								table.name,
								new Table<
									InnerPostgresData,
									InnerPostgresData[keyof InnerPostgresData],
									Ready,
									SchemaLocationByPath<InnerPostgresData, typeof databaseName, typeof schema.name> extends SchemaLocations<InnerPostgresData>
										? SchemaLocationByPath<InnerPostgresData, typeof databaseName, typeof schema.name>
										: never,
									TableLocationByPath<InnerPostgresData, typeof databaseName, typeof schema.name, typeof table.name> extends TableLocations<InnerPostgresData>
										? TableLocationByPath<InnerPostgresData, typeof databaseName, typeof schema.name, typeof table.name>
										: never
								>(this, databaseData, `${databaseName}.${schema.name.toString()}.${table.name}` as any),
							])
						),
					])
				),
			])
		) as any;
	}

	get tableLocations(): TableLocations<InnerPostgresData>[] {
		// Map over the databases and schemas and return the table locations (database.schema.table)
		return Object.entries(this.postgresData).flatMap(([databaseName, databaseData]: [string, RawDatabaseData<InnerPostgresData[keyof InnerPostgresData]>]) =>
			databaseData.schemas.flatMap(schema =>
				schema.tables.map(table => `${databaseName}.${schema.name.toString()}.${table.name}` as TableLocations<InnerPostgresData>)
			)
		);
	}
}
