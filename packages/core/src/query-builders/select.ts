import {
	type ColumnsSelection,
	entityKind,
	getTableColumns,
	is,
	QueryPromise,
	SQL,
	type SQLWrapper,
	Subquery,
	SubqueryConfig,
	ViewBaseConfig,
} from "drizzle-orm";
import {
	type AnyPgColumn,
	AnyPgTable,
	type PgDialect,
	type PgSelectConfig,
	type PgSelectHKT,
	type PgSelectHKTBase,
	PgSelectQueryBuilder,
	PgSelectQueryBuilderHKT,
	PgViewBase,
	type PreparedQueryConfig,
	SelectedFields,
} from "drizzle-orm/pg-core";

import type { PgTPreparedQuery, PgTSession } from "../session.js";
import {
	applyMixins,
	GetSelectTableName,
	GetSelectTableSelection,
	type JoinNullability,
	orderSelectedFields,
	type SelectMode,
	type SelectResult,
} from "./util.js";

type CreatePgSelectFromBuilderMode<
	TBuilderMode extends "db" | "qb",
	TTableName extends string | undefined,
	TSelection extends ColumnsSelection,
	TSelectMode extends SelectMode
> = TBuilderMode extends "db"
	? PgTSelect<TTableName, TSelection, TSelectMode>
	: PgTSelectQueryBuilder<PgSelectQueryBuilderHKT, TTableName, TSelection, TSelectMode>;

export class PgTSelectBuilder<TSelection extends SelectedFields | undefined, TBuilderMode extends "db" | "qb" = "db"> {
	static readonly [entityKind]: string = "PgTSelectBuilder";

	private fields: TSelection;
	private session: PgTSession | undefined;
	private dialect: PgDialect;
	private withList: Subquery[] = [];
	private distinct:
		| boolean
		| {
				on: (AnyPgColumn | SQLWrapper)[];
		  }
		| undefined;

	constructor(config: {
		fields: TSelection;
		session: PgTSession | undefined;
		dialect: PgDialect;
		withList?: Subquery[];
		distinct?:
			| boolean
			| {
					on: (AnyPgColumn | SQLWrapper)[];
			  };
	}) {
		this.fields = config.fields;
		this.session = config.session;
		this.dialect = config.dialect;
		if (config.withList) this.withList = config.withList;

		this.distinct = config.distinct;
	}

	/**
	 * Specify the table, subquery, or other target that you're
	 * building a select query against.
	 *
	 * {@link https://www.postgresql.org/docs/current/sql-select.html#SQL-FROM|Postgres from documentation}
	 */
	from<TFrom extends AnyPgTable | Subquery | PgViewBase | SQL>(
		source: TFrom
	): CreatePgSelectFromBuilderMode<
		TBuilderMode,
		GetSelectTableName<TFrom>,
		TSelection extends undefined ? GetSelectTableSelection<TFrom> : TSelection,
		TSelection extends undefined ? "single" : "partial"
	> {
		const isPartialSelect = !!this.fields;

		let fields: SelectedFields;
		// eslint-disable-next-line prefer-destructuring
		if (this.fields) fields = this.fields;
		else if (is(source, Subquery)) {
			// This is required to use the proxy handler to get the correct field values from the subquery
			fields = Object.fromEntries(
				//@ts-expect-error - TS doesnt like the symbol here
				Object.keys(source[SubqueryConfig].selection).map(key => [key, source[key as unknown as keyof typeof source] as unknown as SelectedFields[string]])
			);
			// @ts-expect-error - TS doesnt like the symbol here
		} else if (is(source, PgViewBase)) fields = source[ViewBaseConfig].selectedFields as SelectedFields;
		else if (is(source, SQL)) fields = {};
		else fields = getTableColumns<AnyPgTable>(source);

		return new PgTSelect({
			table: source,
			fields,
			isPartialSelect,
			session: this.session,
			dialect: this.dialect,
			withList: this.withList,
			distinct: this.distinct,
		}) as any;
	}
}

export abstract class PgTSelectQueryBuilder<
	THKT extends PgSelectHKTBase,
	TTableName extends string | undefined,
	TSelection extends ColumnsSelection,
	TSelectMode extends SelectMode,
	// eslint-disable-next-line @typescript-eslint/ban-types
	TNullabilityMap extends Record<string, JoinNullability> = TTableName extends string ? Record<TTableName, "not-null"> : {}
> extends PgSelectQueryBuilder<THKT, TTableName, TSelection, TSelectMode, TNullabilityMap> {
	static readonly [entityKind]: string = "PgTSelectQueryBuilder";

	protected session: PgTSession | undefined;

	constructor({
		table,
		fields,
		isPartialSelect,
		session,
		dialect,
		withList,
		distinct,
	}: {
		table: PgSelectConfig["table"];
		fields: PgSelectConfig["fields"];
		isPartialSelect: boolean;
		session: PgTSession | undefined;
		dialect: PgDialect;
		withList: Subquery[];
		distinct:
			| boolean
			| {
					on: (AnyPgColumn | SQLWrapper)[];
			  }
			| undefined;
	}) {
		super({
			table,
			fields,
			isPartialSelect,
			session,
			dialect,
			withList,
			distinct,
		});
	}

	/** @internal */
	getSQL(): SQL {
		return this.dialect.buildSelectQuery(this.config);
	}
}

export interface PgTSelect<
	TTableName extends string | undefined,
	TSelection extends ColumnsSelection,
	TSelectMode extends SelectMode,
	// eslint-disable-next-line @typescript-eslint/ban-types
	TNullabilityMap extends Record<string, JoinNullability> = TTableName extends string ? Record<TTableName, "not-null"> : {}
> extends PgTSelectQueryBuilder<PgSelectHKT, TTableName, TSelection, TSelectMode, TNullabilityMap>,
		QueryPromise<SelectResult<TSelection, TSelectMode, TNullabilityMap>[]> {}

export class PgTSelect<
	TTableName extends string | undefined,
	TSelection extends ColumnsSelection,
	TSelectMode extends SelectMode,
	// eslint-disable-next-line @typescript-eslint/ban-types
	TNullabilityMap extends Record<string, JoinNullability> = TTableName extends string ? Record<TTableName, "not-null"> : {}
> extends PgTSelectQueryBuilder<PgSelectHKT, TTableName, TSelection, TSelectMode, TNullabilityMap> {
	static readonly [entityKind]: string = "PgTSelect";

	private _prepare(name?: string): PgTPreparedQuery<
		PreparedQueryConfig & {
			execute: SelectResult<TSelection, TSelectMode, TNullabilityMap>[];
		}
	> {
		const { session, config, dialect, joinsNotNullableMap } = this;
		if (!session) throw new Error("Cannot execute a query on a query builder. Please use a database instance instead.");

		const fieldsList = orderSelectedFields<AnyPgColumn>(config.fields),
			query = session.prepareQuery<PreparedQueryConfig & { execute: SelectResult<TSelection, TSelectMode, TNullabilityMap>[] }>(
				dialect.sqlToQuery(this.getSQL()),
				fieldsList,
				name
			);
		query.joinsNotNullableMap = joinsNotNullableMap;
		return query;
	}

	/**
	 * Create a prepared statement for this query. This allows
	 * the database to remember this query for the given session
	 * and call it by name, rather than specifying the full query.
	 *
	 * {@link https://www.postgresql.org/docs/current/sql-prepare.html|Postgres prepare documentation}
	 */
	prepare(name: string): PgTPreparedQuery<
		PreparedQueryConfig & {
			execute: SelectResult<TSelection, TSelectMode, TNullabilityMap>[];
		}
	> {
		return this._prepare(name);
	}

	execute: ReturnType<this["prepare"]>["execute"] = (placeholderValues, extensionContext) => {
		return this._prepare().execute(placeholderValues, extensionContext);
	};
}

applyMixins(PgTSelect, [QueryPromise]);
