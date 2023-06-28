import type { PostQueryHookData, PreQueryHookData } from "@postgresql-typed/util";
//@ts-expect-error - It does have mapResultRow
import { fillPlaceholders, Logger, mapResultRow, NoopLogger, Query, RelationalSchemaConfig, SelectedFieldsOrdered, TablesRelationalConfig } from "drizzle-orm";
import { NodePgClient, NodePgQueryResultHKT, NodePgSession, NodePgSessionOptions, NodePgTransaction } from "drizzle-orm/node-postgres";
import { AnyPgColumn, PgDialect, PgSession, PgTransactionConfig, PreparedQuery, PreparedQueryConfig } from "drizzle-orm/pg-core";
import type { QueryArrayConfig, QueryConfig } from "pg";

import { PgTExtensionManager } from "./extensions.js";

export class PgTPreparedQuery<T extends PreparedQueryConfig> extends PreparedQuery<T> {
	private rawQuery: QueryConfig;
	private query: QueryArrayConfig;

	constructor(
		private client: NodePgClient,
		private extensions: PgTExtensionManager,
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
		if (!this.extensions.initialized) await this.extensions.initialize();
		const parameters = fillPlaceholders(this.parameters, placeholderValues);

		this.logger.logQuery(this.rawQuery.text, parameters);

		const { fields, rawQuery, client, query, joinsNotNullableMap, customResultMapper } = this as this & {
			joinsNotNullableMap?: Record<string, boolean>;
		};
		if (!fields && !customResultMapper) {
			const data: PreQueryHookData = {
				input: {
					query: rawQuery,
					values: parameters,
				},
				output: undefined,
			};

			let override = false;
			await this.extensions.callHook("pgt:pre-query", data);
			if (data.output === undefined) data.output = await client.query({ ...data.input.query }, data.input.values);
			else {
				await this.extensions.callHook("pgt:pre-query-override", data as PostQueryHookData);
				override = true;
			}

			if (!override) await this.extensions.callHook("pgt:post-query", data as PostQueryHookData);
			return this.mapValue(data.output);
		}

		const data: PreQueryHookData = {
			input: {
				query,
				values: parameters,
			},
			output: undefined,
		};

		let override = false;
		await this.extensions.callHook("pgt:pre-query", data);
		if (data.output === undefined) data.output = await client.query({ ...data.input.query }, data.input.values);
		else {
			await this.extensions.callHook("pgt:pre-query-override", data as PostQueryHookData);
			override = true;
		}

		if (!override) await this.extensions.callHook("pgt:post-query", data as PostQueryHookData);

		const result = this.mapValue(data.output);
		return customResultMapper ? customResultMapper(result.rows) : result.rows.map(row => mapResultRow<T["execute"]>(fields, row, joinsNotNullableMap));
	}

	async all(placeholderValues: Record<string, unknown> | undefined = {}): Promise<T["all"]> {
		const parameters = fillPlaceholders(this.parameters, placeholderValues);
		return this.client.query(this.rawQuery, parameters).then(result => result.rows);
	}

	private mapValue<T>(value: T): T {
		if (typeof value !== "object" || value === null) return value;
		if (Array.isArray(value)) return value.map(element => this.mapValue(element)) as unknown as T;
		if ("value" in value) return value.value as unknown as T;
		return Object.fromEntries(Object.entries(value).map(([key, value]) => [key, this.mapValue(value)])) as unknown as T;
	}
}

export class PgTSession<TFullSchema extends Record<string, unknown>, TSchema extends TablesRelationalConfig> extends PgSession<
	NodePgQueryResultHKT,
	TFullSchema,
	TSchema
> {
	private logger: Logger;
	private nodePgSession: NodePgSession<TFullSchema, TSchema>;

	constructor(
		public client: NodePgClient,
		public extensions: PgTExtensionManager,
		dialect: PgDialect,
		schema: RelationalSchemaConfig<TSchema> | undefined,
		options: NodePgSessionOptions = {}
	) {
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
		return new PgTPreparedQuery(this.client, this.extensions, query.sql, query.params, this.logger, fields, name, customResultMapper);
	}

	override async transaction<T>(
		transaction: (tx: NodePgTransaction<TFullSchema, TSchema>) => Promise<T>,
		config?: PgTransactionConfig | undefined
	): Promise<T> {
		return this.nodePgSession.transaction(transaction, config);
	}
}