/* eslint-disable camelcase */
import type { ClientConfig, PoolConfig } from "pg";
import { Client, Pool } from "pg";
import type { z } from "zod";

import { Table } from "../classes/Table.js";
import type { DatabaseData } from "../types/interfaces/DatabaseData.js";
import type { TableLocations } from "../types/types/TableLocations.js";
import type { Tables } from "../types/types/Tables.js";

export class Database<InnerDatabaseData extends DatabaseData, Ready extends boolean = false, ClientType extends "client" | "pool" = "client"> {
	private _client: Client | Pool | undefined;
	private _ready = false;

	constructor(
		public readonly database_data: {
			name: InnerDatabaseData["name"];
			schemas: {
				name: keyof InnerDatabaseData["schemas"];
				tables: {
					name: Tables<InnerDatabaseData>;
					primary_key?: string;
				}[];
			}[];
		},
		public readonly database_zod_data?: {
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

	async connect<Type extends "client" | "pool">(
		type: Type,
		config?: Type extends "client" ? string | ClientConfig : PoolConfig
	): Promise<Database<InnerDatabaseData, true, Type>> {
		if (this._ready && !!this._client) return this as any;
		if (this._ready) this._ready = false;

		this._client = type === "client" ? new Client(config) : new Pool(config as PoolConfig);

		await this._client.connect();
		this._ready = true;

		return this as any;
	}

	getTable<TableName extends TableLocations<InnerDatabaseData>>(table_name: TableName): Table<InnerDatabaseData, Ready, ClientType, TableName> {
		return new Table<InnerDatabaseData, Ready, ClientType, TableName>(this, table_name);
	}

	getTables(): Table<InnerDatabaseData, Ready, ClientType, TableLocations<InnerDatabaseData>>[] {
		return this.table_locations.map(table_name => this.getTable(table_name));
	}

	get database_name(): InnerDatabaseData["name"] {
		return this.database_data.name;
	}

	get schema_names(): (keyof InnerDatabaseData["schemas"])[] {
		return this.database_data.schemas.map(schema => schema.name);
	}

	get table_names(): Tables<InnerDatabaseData>[] {
		return this.database_data.schemas.flatMap(schema => schema.tables.map(table => table.name as string)) as Tables<InnerDatabaseData>[];
	}

	get table_locations(): TableLocations<InnerDatabaseData>[] {
		return this.database_data.schemas.flatMap(schema =>
			schema.tables.map(table => `${schema.name as string}.${table.name as string}` as TableLocations<InnerDatabaseData>)
		);
	}

	get client(): Ready extends true ? (ClientType extends "client" ? Client : Pool) : undefined {
		return this._client as any;
	}

	get ready(): Ready {
		return this._ready as Ready;
	}

	async end() {
		await this._client?.end();

		// eslint-disable-next-line no-undefined
		this._client = undefined;
		this._ready = false;
	}
}
