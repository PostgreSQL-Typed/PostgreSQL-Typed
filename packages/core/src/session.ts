import type { PgTExtensionContext, PostQueryHookData, PreQueryHookData } from "@postgresql-typed/util";
import { fillPlaceholders, Logger, NoopLogger, Query, RelationalSchemaConfig, SelectedFieldsOrdered, SQL, sql, TablesRelationalConfig } from "drizzle-orm";
import { NodePgQueryResultHKT, NodePgSessionOptions } from "drizzle-orm/node-postgres";
import { AnyPgColumn, PgDialect, PgTransactionConfig, PreparedQuery, PreparedQueryConfig } from "drizzle-orm/pg-core";
import type { Client, PoolClient, QueryArrayConfig, QueryConfig } from "pg";
import pg from "pg";

import { PgTDriver } from "./driver.js";
import { PgTExtensionManager } from "./extensions.js";
import { mapResultRow } from "./functions/mapResultRow.js";
import { PgTransaction } from "./query-builders/transaction.js";

export type NodePgClient = pg.Pool | PoolClient | Client;
const { Pool } = pg;

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
			rowMode: "array",
			text: queryString,
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

export class PgTSession<TFullSchema extends Record<string, unknown> = Record<string, never>, TSchema extends TablesRelationalConfig = Record<string, never>> {
	private logger: Logger;

	constructor(
		public client: NodePgClient,
		public extensions: PgTExtensionManager,
		public driver: PgTDriver,
		private dialect: PgDialect,
		private schema: RelationalSchemaConfig<TSchema> | undefined,
		private options: NodePgSessionOptions = {}
	) {
		this.logger = options.logger ?? new NoopLogger();
	}

	prepareQuery<T extends PreparedQueryConfig = PreparedQueryConfig>(
		query: Query,
		fields: SelectedFieldsOrdered<AnyPgColumn> | undefined,
		name: string | undefined,
		customResultMapper?: (rows: unknown[][], mapColumnValue?: (value: unknown) => unknown) => T["execute"]
	): PgTPreparedQuery<T> {
		return new PgTPreparedQuery(this.client, this.extensions, this.driver, query.sql, query.params, this.logger, fields, name, customResultMapper);
	}

	execute<T>(query: SQL): Promise<T> {
		// eslint-disable-next-line unicorn/no-useless-undefined
		const prepared = this.prepareQuery<PreparedQueryConfig & { execute: T }>(this.dialect.sqlToQuery(query), undefined, undefined);
		return prepared.execute();
	}

	/* c8 ignore next 4 */
	all<T = unknown>(query: SQL): Promise<T[]> {
		// eslint-disable-next-line unicorn/no-useless-undefined
		return this.prepareQuery<PreparedQueryConfig & { all: T[] }>(this.dialect.sqlToQuery(query), undefined, undefined).all();
	}

	async transaction<T>(transaction: (tx: PgTTransaction<TFullSchema, TSchema>) => Promise<T>, config?: PgTransactionConfig | undefined): Promise<T> {
		const session =
				this.client instanceof Pool ? new PgTSession(await this.client.connect(), this.extensions, this.driver, this.dialect, this.schema, this.options) : this,
			tx = new PgTTransaction(this.dialect, session, this.schema);
		await tx.execute(sql`begin${config ? sql` ${tx.getTransactionConfigSQL(config)}` : undefined}`);
		try {
			const result = await transaction(tx);
			await tx.execute(sql`commit`);
			return result;
			/* c8 ignore next 3 */
		} catch (error) {
			await tx.execute(sql`rollback`);
			throw error;
		} finally {
			if (this.client instanceof Pool) (session.client as PoolClient).release();
		}
	}
}

export class PgTTransaction<TFullSchema extends Record<string, unknown>, TSchema extends TablesRelationalConfig> extends PgTransaction<
	NodePgQueryResultHKT,
	TFullSchema,
	TSchema
> {
	/* c8 ignore next 13 */
	override async transaction<T>(transaction: (tx: PgTTransaction<TFullSchema, TSchema>) => Promise<T>): Promise<T> {
		const savepointName = `sp${this.nestedIndex + 1}`,
			tx = new PgTTransaction(this.dialect, this.session, this.schema, this.nestedIndex + 1);
		await tx.execute(sql.raw(`savepoint ${savepointName}`));
		try {
			const result = await transaction(tx);
			await tx.execute(sql.raw(`release savepoint ${savepointName}`));
			return result;
		} catch (error) {
			await tx.execute(sql.raw(`rollback to savepoint ${savepointName}`));
			throw error;
		}
	}
}
