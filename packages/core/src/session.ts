import type { PgTExtensionContext, PostQueryHookData, PreQueryHookData } from "@postgresql-typed/util";
import { fillPlaceholders, Logger, NoopLogger, Query, RelationalSchemaConfig, SelectedFieldsOrdered, TablesRelationalConfig } from "drizzle-orm";
import { NodePgClient, NodePgQueryResultHKT, NodePgSession, NodePgSessionOptions, NodePgTransaction } from "drizzle-orm/node-postgres";
import { AnyPgColumn, PgDialect, PgSession, PgTransactionConfig, PreparedQuery, PreparedQueryConfig } from "drizzle-orm/pg-core";
import type { QueryArrayConfig, QueryConfig } from "pg";

import { PgTDriver } from "./driver.js";
import { PgTExtensionManager } from "./extensions.js";
import { mapResultRow } from "./functions/mapResultRow.js";

export class PgTPreparedQuery<T extends PreparedQueryConfig> extends PreparedQuery<T> {
	private rawQuery: QueryConfig;
	private query: QueryArrayConfig;

	constructor(
		private client: NodePgClient,
		private extensions: PgTExtensionManager,
		private driver: PgTDriver,
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

	/** @internal */
	joinsNotNullableMap?: Record<string, boolean>;

	override async execute(
		placeholderValues: Record<string, unknown> | undefined = {},
		context: PgTExtensionContext | PreQueryHookData | PostQueryHookData = {}
	): Promise<T["execute"]> {
		if (!("context" in context)) {
			const contextCopy = { ...context };
			//* Delete all properties of main context object
			for (const key in context) delete context[key as keyof typeof context];

			(context as PreQueryHookData).context = contextCopy;
		}

		context = context as PreQueryHookData | PostQueryHookData;

		/* c8 ignore next */
		if (!this.extensions.initialized) await this.extensions.initialize();
		const parameters = fillPlaceholders(this.parameters, placeholderValues);

		this.logger.logQuery(this.rawQuery.text, parameters);

		const { fields, rawQuery, client, query, joinsNotNullableMap, customResultMapper } = this as this & {
			joinsNotNullableMap?: Record<string, boolean>;
		};
		if (!fields && !customResultMapper) {
			context.input = {
				query: rawQuery,
				values: parameters,
			};

			let override = false;
			await this.extensions.callHook("pgt:pre-query", context);
			if (context.output === undefined) {
				context.output = await client.query(
					{ ...context.input.query },
					context.input.values.map(value => this.driver.serialize(value))
				);
				/* c8 ignore next 4 */
			} else {
				await this.extensions.callHook("pgt:pre-query-override", context as PostQueryHookData);
				override = true;
			}

			if (!override) await this.extensions.callHook("pgt:post-query", context as PostQueryHookData);
			return this.mapValue(context.output);
		}

		context.input = {
			query,
			values: parameters,
		};

		let override = false;
		await this.extensions.callHook("pgt:pre-query", context);
		if (context.output === undefined) {
			context.output = await client.query(
				{ ...context.input.query },
				context.input.values.map(value => this.driver.serialize(value))
			);
			/* c8 ignore next 4 */
		} else {
			await this.extensions.callHook("pgt:pre-query-override", context as PostQueryHookData);
			override = true;
		}

		if (!override) await this.extensions.callHook("pgt:post-query", context as PostQueryHookData);

		const result = this.mapValue(context.output);
		/* c8 ignore next 2 */
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		return customResultMapper ? customResultMapper(result.rows) : result.rows.map(row => mapResultRow<T["execute"]>(fields!, row, joinsNotNullableMap));
	}

	async all(
		placeholderValues: Record<string, unknown> | undefined = {},
		context: PgTExtensionContext | PreQueryHookData | PostQueryHookData = {}
	): Promise<T["all"]> {
		if (!("context" in context)) {
			const contextCopy = { ...context };
			//* Delete all properties of main context object
			for (const key in context) delete context[key as keyof typeof context];

			(context as PreQueryHookData).context = contextCopy;
		}

		context = context as PreQueryHookData | PostQueryHookData;

		const parameters = fillPlaceholders(this.parameters, placeholderValues);

		context.input = {
			query: this.rawQuery,
			values: parameters,
		};

		let override = false;
		await this.extensions.callHook("pgt:pre-query", context);
		if (context.output === undefined) {
			context.output = await this.client.query(
				{ ...context.input.query },
				context.input.values.map(value => this.driver.serialize(value))
			);
			/* c8 ignore next 4 */
		} else {
			await this.extensions.callHook("pgt:pre-query-override", context as PostQueryHookData);
			override = true;
		}

		if (!override) await this.extensions.callHook("pgt:post-query", context as PostQueryHookData);

		const result = this.mapValue(context.output);
		return result.rows;
	}

	private mapValue<T>(value: T): T {
		if (typeof value !== "object" || value === null) return value;
		if (Array.isArray(value)) return value.map(element => this.mapValue(element)) as unknown as T;
		if ("value" in value) return value.value as unknown as T;
		return Object.fromEntries(Object.entries(value).map(([key, value]) => [key, this.mapValue(value)])) as unknown as T;
	}
}

export class PgTSession<
	TFullSchema extends Record<string, unknown> = Record<string, never>,
	TSchema extends TablesRelationalConfig = Record<string, never>
> extends PgSession<NodePgQueryResultHKT, TFullSchema, TSchema> {
	private logger: Logger;
	private nodePgSession: NodePgSession<TFullSchema, TSchema>;

	constructor(
		public client: NodePgClient,
		public extensions: PgTExtensionManager,
		public driver: PgTDriver,
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
		customResultMapper?: (rows: unknown[][], mapColumnValue?: (value: unknown) => unknown) => T["execute"]
	): PgTPreparedQuery<T> {
		return new PgTPreparedQuery(this.client, this.extensions, this.driver, query.sql, query.params, this.logger, fields, name, customResultMapper);
	}

	/* c8 ignore next 6 */
	override async transaction<T>(
		transaction: (tx: NodePgTransaction<TFullSchema, TSchema>) => Promise<T>,
		config?: PgTransactionConfig | undefined
	): Promise<T> {
		return this.nodePgSession.transaction(transaction, config);
	}
}
