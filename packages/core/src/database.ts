import { ExtractTablesWithRelations, RelationalSchemaConfig, TablesRelationalConfig } from "drizzle-orm";
import { NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import { PgDatabase, PgDialect } from "drizzle-orm/pg-core";

import { PgTExtensionManager } from "./extensions.js";
import { PgTSession } from "./session.js";

export class PgTDatabase<
	TFullSchema extends Record<string, unknown> = Record<string, never>,
	TSchema extends TablesRelationalConfig = ExtractTablesWithRelations<TFullSchema>
> extends PgDatabase<NodePgQueryResultHKT, TFullSchema, TSchema> {
	constructor(dialect: PgDialect, private session: PgTSession<Record<string, unknown>, TablesRelationalConfig>, schema?: RelationalSchemaConfig<TSchema>) {
		super(dialect, session, schema);
	}

	public get extensions(): PgTExtensionManager {
		return this.session.extensions;
	}

	/**
	 * Connects to the database and initializes the extensions.
	 */
	async connect(): Promise<void> {
		await this.session.client.connect();
		await this.extensions.initialize();
	}
}
