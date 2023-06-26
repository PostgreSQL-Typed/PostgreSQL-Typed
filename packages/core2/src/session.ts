//@ts-expect-error - It does have mapResultRow
import { fillPlaceholders, Logger, mapResultRow, NoopLogger, Query, RelationalSchemaConfig, SelectedFieldsOrdered, TablesRelationalConfig } from "drizzle-orm";
import { NodePgClient, NodePgQueryResultHKT, NodePgSession, NodePgSessionOptions, NodePgTransaction } from "drizzle-orm/node-postgres";
import { AnyPgColumn, PgDialect, PgSession, PgTransactionConfig, PreparedQuery, PreparedQueryConfig } from "drizzle-orm/pg-core";
import type { QueryArrayConfig, QueryConfig } from "pg";

export class PgTPreparedQuery<T extends PreparedQueryConfig> extends PreparedQuery<T> {
	private rawQuery: QueryConfig;
	private query: QueryArrayConfig;

	constructor(
		private client: NodePgClient,
		queryString: string,
		private parameters: unknown[],
		private logger: Logger,
		private fields: SelectedFieldsOrdered<AnyPgColumn> | undefined,
		name: string | undefined,
		private customResultMapper?: (rows: unknown[][]) => T["execute"]
	) {
		super();
		this.rawQuery = {
			name,
			text: queryString,
		};
		this.query = {
			name,
			text: queryString,
			rowMode: "array",
		};
	}

	async execute(placeholderValues: Record<string, unknown> | undefined = {}): Promise<T["execute"]> {
		const parameters = fillPlaceholders(this.parameters, placeholderValues);

		this.logger.logQuery(this.rawQuery.text, parameters);

		const { fields, rawQuery, client, query, joinsNotNullableMap, customResultMapper } = this as this & {
			joinsNotNullableMap?: Record<string, boolean>;
		};
		if (!fields && !customResultMapper) return client.query(rawQuery, parameters);

		const result = await client.query(query, parameters);
		return customResultMapper ? customResultMapper(result.rows) : result.rows.map(row => mapResultRow<T["execute"]>(fields, row, joinsNotNullableMap));
	}

	async all(placeholderValues: Record<string, unknown> | undefined = {}): Promise<T["all"]> {
		const parameters = fillPlaceholders(this.parameters, placeholderValues);
		return this.client.query(this.rawQuery, parameters).then(result => result.rows);
	}
}

export class PgTSession<TFullSchema extends Record<string, unknown>, TSchema extends TablesRelationalConfig> extends PgSession<
	NodePgQueryResultHKT,
	TFullSchema,
	TSchema
> {
	private logger: Logger;
	private nodePgSession: NodePgSession<TFullSchema, TSchema>;

	constructor(private client: NodePgClient, dialect: PgDialect, schema: RelationalSchemaConfig<TSchema> | undefined, options: NodePgSessionOptions = {}) {
		super(dialect);
		this.logger = options.logger ?? new NoopLogger();

		this.nodePgSession = new NodePgSession(client, dialect, schema, options);
	}

	prepareQuery<T extends PreparedQueryConfig = PreparedQueryConfig>(
		query: Query,
		fields: SelectedFieldsOrdered<AnyPgColumn> | undefined,
		name: string | undefined,
		customResultMapper?: (rows: unknown[][]) => T["execute"]
	): PreparedQuery<T> {
		return new PgTPreparedQuery(this.client, query.sql, query.params, this.logger, fields, name, customResultMapper);
	}

	override async transaction<T>(
		transaction: (tx: NodePgTransaction<TFullSchema, TSchema>) => Promise<T>,
		config?: PgTransactionConfig | undefined
	): Promise<T> {
		return this.nodePgSession.transaction(transaction, config);
	}
}
