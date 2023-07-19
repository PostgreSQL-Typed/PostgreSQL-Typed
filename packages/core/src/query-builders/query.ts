import {
	type BuildQueryResult,
	type DBQueryConfig,
	entityKind,
	type KnownKeysOnly,
	mapRelationalRow,
	QueryPromise,
	type SQL,
	type TableRelationalConfig,
	type TablesRelationalConfig,
} from "drizzle-orm";
import type { AnyPgTable, PgDialect, PreparedQueryConfig } from "drizzle-orm/pg-core";

import type { PgTPreparedQuery, PgTSession } from "../session.js";

export class PgTRelationalQueryBuilder<TSchema extends TablesRelationalConfig, TFields extends TableRelationalConfig> {
	static readonly [entityKind]: string = "PgTRelationalQueryBuilder";

	constructor(
		private fullSchema: Record<string, unknown>,
		private schema: TSchema,
		private tableNamesMap: Record<string, string>,
		private table: AnyPgTable,
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
		private table: AnyPgTable,
		private tableConfig: TableRelationalConfig,
		private dialect: PgDialect,
		private session: PgTSession,
		private config: DBQueryConfig<"many", true> | true,
		private mode: "many" | "first"
	) {
		super();
	}

	private _prepare(name?: string): PgTPreparedQuery<PreparedQueryConfig & { execute: TResult }> {
		const query = this.dialect.buildRelationalQuery(
				this.fullSchema,
				this.schema,
				this.tableNamesMap,
				this.table,
				this.tableConfig,
				this.config,
				this.tableConfig.tsName,
				[],
				true
			),
			builtQuery = this.dialect.sqlToQuery(query.sql as SQL);
		return this.session.prepareQuery<PreparedQueryConfig & { execute: TResult }>(builtQuery, undefined, name, (rawRows, mapColumnValue) => {
			const rows = rawRows.map(row => mapRelationalRow(this.schema, this.tableConfig, row, query.selection, mapColumnValue));
			if (this.mode === "first") return rows[0] as TResult;

			return rows as TResult;
		});
	}

	prepare(name: string): PgTPreparedQuery<PreparedQueryConfig & { execute: TResult }> {
		return this._prepare(name);
	}

	override execute: ReturnType<this["prepare"]>["execute"] = (placeholderValues, extensionContext) => {
		return this._prepare().execute(placeholderValues, extensionContext);
	};
}
