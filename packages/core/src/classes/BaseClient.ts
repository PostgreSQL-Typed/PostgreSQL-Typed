import {
	type ClientHooks,
	type Context,
	isValid,
	loadPgTConfig,
	type ParseReturnType,
	PgTError,
	type PostgresData,
	type Query,
	type Safe,
} from "@postgresql-typed/util";
import { Hookable } from "hookable";

import { installExtension } from "../functions/installExtension.js";
import type { RawDatabaseData } from "../types/types/RawDatabaseData.js";
import type { RawPostgresData } from "../types/types/RawPostgresData.js";
import type { SchemaLocationByPath } from "../types/types/SchemaLocationByPath.js";
import type { SchemaLocations } from "../types/types/SchemaLocations.js";
import type { TableLocationByPath } from "../types/types/TableLocationByPath.js";
import type { TableLocations } from "../types/types/TableLocations.js";
import { getErrorMap } from "../util/errorMap.js";
import { Database } from "./Database.js";
import { Schema } from "./Schema.js";
import { Table } from "./Table.js";

export abstract class BaseClient<InnerPostgresData extends PostgresData, Ready extends boolean = false> extends Hookable<ClientHooks> {
	constructor(private readonly postgresData: RawPostgresData<InnerPostgresData>) {
		super();
	}

	abstract testConnection(): Promise<BaseClient<InnerPostgresData, true> | BaseClient<InnerPostgresData, false>>;

	/**
	 * Internal query function that should be implemented by the client. This function should not be called directly.
	 */
	abstract _query<Data>(context: Context): Promise<ParseReturnType<Query<Data>>>;

	abstract get ready(): Ready;
	abstract get connectionError(): PgTError | undefined;

	async query<Data>(query: string, variables: string[]): Promise<Query<Data>>;
	async query<Data>(...data: unknown[]): Promise<Query<Data>>;
	async query<Data>(...data: unknown[]): Promise<Query<Data>> {
		const result = await this.safeQuery<Data>(...data);
		if (result.success) return result.data;
		throw result.error;
	}

	async safeQuery<Data>(query: string, variables: string[]): Promise<Safe<Query<Data>>>;
	async safeQuery<Data>(...data: unknown[]): Promise<Safe<Query<Data>>>;
	async safeQuery<Data>(...data: unknown[]): Promise<Safe<Query<Data>>> {
		const context: Context = {
				issue: undefined,
				errorMap: getErrorMap(),
				data,
			},
			result = await this._query<Data>(context);

		return this._handleResult<Data>(context, result);
	}

	private _handleResult<Data>(context: Context, result: ParseReturnType<Query<Data>>): Safe<Query<Data>> {
		if (isValid(result)) return { success: true, data: result.value };
		if (!context.issue) throw new Error("Validation failed but no issue detected.");
		const error = new PgTError(context.issue);
		return { success: false, error };
	}

	get databaseNames(): (keyof InnerPostgresData)[] {
		return Object.keys(this.postgresData) as (keyof InnerPostgresData)[];
	}

	database<DatabaseName extends keyof InnerPostgresData>(database: DatabaseName): Database<InnerPostgresData, InnerPostgresData[DatabaseName], Ready> {
		//* Validate the database name exists (Is needed for non-TypeScript users)
		if (!this.databaseNames.includes(database)) throw new Error(`Database "${database.toString()}" does not exist`);

		return new Database<InnerPostgresData, InnerPostgresData[DatabaseName], Ready>(this, this.postgresData[database]);
	}

	db<DatabaseName extends keyof InnerPostgresData>(database: DatabaseName): Database<InnerPostgresData, InnerPostgresData[DatabaseName], Ready> {
		return this.database<DatabaseName>(database);
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
		//* Validate the schema location exists (Is needed for non-TypeScript users)
		if (!this.schemaLocations.includes(schema)) throw new Error(`Schema "${schema}" does not exist`);

		const [database] = (schema as string).split(".");
		return new Schema<InnerPostgresData, InnerPostgresData[typeof database], Ready, SchemaLocation>(this, this.postgresData[database], schema) as any;
	}

	sch<SchemaLocation extends SchemaLocations<InnerPostgresData>>(schema: SchemaLocation) {
		return this.schema<SchemaLocation>(schema);
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
		//* Map over the databases and schemas and return the schema locations (database.schema)
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
		//* Validate the table location exists (Is needed for non-TypeScript users)
		if (!this.tableLocations.includes(table)) throw new Error(`Table "${table}" does not exist`);

		const [database] = (table as string).split(".");
		return new Table<InnerPostgresData, InnerPostgresData[keyof InnerPostgresData], Ready, SchemaLocation, TableLocation>(
			this,
			this.postgresData[database as keyof InnerPostgresData],
			table
		) as any;
	}

	tbl<
		TableLocation extends TableLocations<InnerPostgresData>,
		DatabaseName extends keyof InnerPostgresData = TableLocation extends `${infer Database}.${string}` ? Database : never,
		TemporarySchemaLocation = TableLocation extends `${infer Database}.${infer Schema}.${string}` ? `${Database}.${Schema}` : never,
		SchemaLocation extends SchemaLocations<InnerPostgresData> = TemporarySchemaLocation extends SchemaLocations<InnerPostgresData>
			? TemporarySchemaLocation
			: never
	>(table: TableLocation): Table<InnerPostgresData, InnerPostgresData[DatabaseName], Ready, SchemaLocation, TableLocation> {
		return this.table<TableLocation, DatabaseName, TemporarySchemaLocation, SchemaLocation>(table);
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
		//* Map over the databases and schemas and return the table locations (database.schema.table)
		return Object.entries(this.postgresData).flatMap(([databaseName, databaseData]: [string, RawDatabaseData<InnerPostgresData[keyof InnerPostgresData]>]) =>
			databaseData.schemas.flatMap(schema =>
				schema.tables.map(table => `${databaseName}.${schema.name.toString()}.${table.name}` as TableLocations<InnerPostgresData>)
			)
		);
	}

	async initExtensions(): Promise<void> {
		const { config } = await loadPgTConfig(),
			{ extensions } = config.core;

		if (extensions.length === 0) return;
		for (const extension of extensions) {
			if (!extension) continue;
			await (Array.isArray(extension) ? installExtension(config, this, extension[0], extension[1]) : installExtension(config, this, extension, {}));
		}
	}
}
