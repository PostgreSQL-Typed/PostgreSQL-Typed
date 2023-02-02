/* eslint-disable camelcase */
import type { ClientConfig, PoolConfig } from "pg";
import { Client, Pool } from "pg";
import type { z } from "zod";

import { Table } from "../classes/Table";
import type { DatabaseData } from "../types/interfaces/DatabaseData";
import type { TableLocations } from "../types/types/TableLocations";
import type { Tables } from "../types/types/Tables";

export class Database<DbData extends DatabaseData, Ready extends boolean = false, ClientType extends "client" | "pool" = "client"> {
	private _client: Client | Pool | undefined;
	private _ready = false;

	constructor(
		public readonly database_data: {
			name: DbData["name"];
			schemas: {
				name: keyof DbData["schemas"];
				tables: {
					name: Tables<DbData>;
					primary_key?: string;
				}[];
			}[];
		},
		public readonly database_zod_data?: {
			name: DbData["name"];
			schemas: {
				name: keyof DbData["schemas"];
				tables: {
					name: Tables<DbData>;
					// eslint-disable-next-line @typescript-eslint/ban-types
					zod: z.ZodObject<{}>;
				}[];
			}[];
		}
	) {}

	async connect<Type extends "client" | "pool">(
		type: Type,
		config?: Type extends "client" ? string | ClientConfig : PoolConfig
	): Promise<Database<DbData, true, Type>> {
		if (this._ready && !!this._client) return this as any;
		if (this._ready) this._ready = false;

		this._client = type === "client" ? new Client(config) : new Pool(config as PoolConfig);

		await this._client.connect();
		this._ready = true;

		return this as any;
	}

	getTable<TableName extends TableLocations<DbData>>(table_name: TableName): Table<DbData, Ready, ClientType, TableName> {
		return new Table<DbData, Ready, ClientType, TableName>(this, table_name);
	}

	getTables(): Table<DbData, Ready, ClientType, TableLocations<DbData>>[] {
		return this.table_locations.map(table_name => this.getTable(table_name));
	}

	get database_name(): DbData["name"] {
		return this.database_data.name;
	}

	get schema_names(): (keyof DbData["schemas"])[] {
		return this.database_data.schemas.map(schema => schema.name);
	}

	get table_names(): Tables<DbData>[] {
		return this.database_data.schemas.flatMap(schema => schema.tables.map(table => table.name as string)) as Tables<DbData>[];
	}

	get table_locations(): TableLocations<DbData>[] {
		return this.database_data.schemas.flatMap(schema =>
			schema.tables.map(table => `${schema.name as string}.${table.name as string}` as TableLocations<DbData>)
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
