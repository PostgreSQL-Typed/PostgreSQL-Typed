import {
	type BuildQueryResult,
	BuildRelationalQueryResult,
	type DBQueryConfig,
	entityKind,
	type KnownKeysOnly,
	mapRelationalRow,
	Query,
	QueryPromise,
	QueryWithTypings,
	SQL,
	type TableRelationalConfig,
	type TablesRelationalConfig,
} from "drizzle-orm";
import type { PgDialect, PgTable, PreparedQuery, PreparedQueryConfig } from "drizzle-orm/pg-core";

import type { PgTSession } from "../session.js";

export class PgTRelationalQueryBuilder<TSchema extends TablesRelationalConfig, TFields extends TableRelationalConfig> {
	static readonly [entityKind]: string = "PgTRelationalQueryBuilder";

	constructor(
		private fullSchema: Record<string, unknown>,
		private schema: TSchema,
		private tableNamesMap: Record<string, string>,
		private table: PgTable,
		private tableConfig: TableRelationalConfig,
		private dialect: PgDialect,
		private session: PgTSession
	) {}

	findMany<TConfig extends DBQueryConfig<"many", true, TSchema, TFields>>(
		config?: KnownKeysOnly<TConfig, DBQueryConfig<"many", true, TSchema, TFields>>
	): PgTRelationalQuery<BuildQueryResult<TSchema, TFields, TConfig>[]> {
		return new PgTRelationalQuery(
			this.fullSchema,
			this.schema,
			this.tableNamesMap,
			this.table,
			this.tableConfig,
			this.dialect,
			this.session,
			config ? (config as DBQueryConfig<"many", true>) : {},
			"many"
		);
	}

	findFirst<TSelection extends Omit<DBQueryConfig<"many", true, TSchema, TFields>, "limit">>(
		config?: KnownKeysOnly<TSelection, Omit<DBQueryConfig<"many", true, TSchema, TFields>, "limit">>
	): PgTRelationalQuery<BuildQueryResult<TSchema, TFields, TSelection> | undefined> {
		return new PgTRelationalQuery(
			this.fullSchema,
			this.schema,
			this.tableNamesMap,
			this.table,
			this.tableConfig,
			this.dialect,
			this.session,
			config ? { ...(config as DBQueryConfig<"many", true> | undefined), limit: 1 } : { limit: 1 },
			"first"
		);
	}
}

export class PgTRelationalQuery<TResult> extends QueryPromise<TResult> {
	static readonly [entityKind]: string = "PgTRelationalQuery";

	protected declare $brand: "PgTRelationalQuery";

	constructor(
		private fullSchema: Record<string, unknown>,
		private schema: TablesRelationalConfig,
		private tableNamesMap: Record<string, string>,
		private table: PgTable,
		private tableConfig: TableRelationalConfig,
		private dialect: PgDialect,
		private session: PgTSession,
		private config: DBQueryConfig<"many", true> | true,
		private mode: "many" | "first"
	) {
		super();
	}

	private _prepare(name?: string): PreparedQuery<PreparedQueryConfig & { execute: TResult }> {
		const { query, builtQuery } = this._toSQL();

		return this.session.prepareQuery<PreparedQueryConfig & { execute: TResult }>(builtQuery, undefined, name, (rawRows, mapColumnValue) => {
			const rows = rawRows.map(row => mapRelationalRow(this.schema, this.tableConfig, row, query.selection, mapColumnValue));
			if (this.mode === "first") return rows[0] as TResult;

			return rows as TResult;
		});
	}

	prepare(name: string): PreparedQuery<PreparedQueryConfig & { execute: TResult }> {
		return this._prepare(name);
	}

	private _toSQL(): { query: BuildRelationalQueryResult; builtQuery: QueryWithTypings } {
		const query = this.dialect.buildRelationalQueryWithoutPK({
				fullSchema: this.fullSchema,
				queryConfig: this.config,
				schema: this.schema,
				table: this.table,
				tableAlias: this.tableConfig.tsName,
				tableConfig: this.tableConfig,
				tableNamesMap: this.tableNamesMap,
			}),
			builtQuery = this.dialect.sqlToQuery(query.sql as SQL);

		return { builtQuery, query };
	}

	/* c8 ignore next 3 */
	toSQL(): Query {
		return this._toSQL().builtQuery;
	}

	override execute(): Promise<TResult> {
		return this._prepare().execute();
	}
}
