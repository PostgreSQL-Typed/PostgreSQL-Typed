/* eslint-disable brace-style */
import { entityKind, type InferModel, type Query, QueryPromise, type SQL, type SQLWrapper, Table, type UpdateSet } from "drizzle-orm";
import type {
	AnyPgTable,
	PgDialect,
	PgUpdateConfig,
	PgUpdateSetSource,
	PreparedQueryConfig,
	QueryResultHKT,
	QueryResultKind,
	SelectedFields,
} from "drizzle-orm/pg-core";

import type { PgTPreparedQuery, PgTSession } from "../session.js";
import { mapUpdateSet, orderSelectedFields, SelectResultFields } from "./util.js";

export class PgTUpdateBuilder<TTable extends AnyPgTable, TQueryResult extends QueryResultHKT> {
	static readonly [entityKind]: string = "PgTUpdateBuilder";

	declare readonly _: {
		readonly table: TTable;
	};

	constructor(
		private table: TTable,
		private session: PgTSession,
		private dialect: PgDialect
	) {}

	set(values: PgUpdateSetSource<TTable>): PgTUpdate<TTable, TQueryResult> {
		return new PgTUpdate<TTable, TQueryResult>(this.table, mapUpdateSet(this.table, values), this.session, this.dialect);
	}
}

export class PgTUpdate<TTable extends AnyPgTable, TQueryResult extends QueryResultHKT, TReturning extends Record<string, unknown> | undefined = undefined>
	extends QueryPromise<TReturning extends undefined ? QueryResultKind<TQueryResult, never> : TReturning[]>
	implements SQLWrapper
{
	static readonly [entityKind]: string = "PgTUpdate";

	declare readonly _: {
		readonly table: TTable;
		readonly return: TReturning;
	};

	private config: PgUpdateConfig;

	constructor(
		table: TTable,
		set: UpdateSet,
		private session: PgTSession,
		private dialect: PgDialect
	) {
		super();
		this.config = { set, table };
	}

	where(where: SQL | undefined): this {
		this.config.where = where;
		return this;
	}

	returning(): PgTUpdate<TTable, TQueryResult, InferModel<TTable>>;
	returning<TSelectedFields extends SelectedFields>(fields: TSelectedFields): PgTUpdate<TTable, TQueryResult, SelectResultFields<TSelectedFields>>;
	returning(
		fields: SelectedFields = this.config.table[
			(
				Table as unknown as {
					Symbol: {
						Columns: keyof TTable;
					};
				}
			).Symbol.Columns as keyof AnyPgTable
		] as unknown as SelectedFields
	): PgTUpdate<TTable, any, any> {
		this.config.returning = orderSelectedFields(fields);
		return this as PgTUpdate<TTable, any>;
	}

	/** @internal */
	getSQL(): SQL {
		return this.dialect.buildUpdateQuery(this.config);
	}

	toSQL(): Omit<Query, "typings"> {
		const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
		return rest;
	}

	private _prepare(name?: string): PgTPreparedQuery<
		PreparedQueryConfig & {
			execute: TReturning extends undefined ? QueryResultKind<TQueryResult, never> : TReturning[];
		}
	> {
		return this.session.prepareQuery(this.dialect.sqlToQuery(this.getSQL()), this.config.returning, name);
	}

	prepare(name: string): PgTPreparedQuery<
		PreparedQueryConfig & {
			execute: TReturning extends undefined ? QueryResultKind<TQueryResult, never> : TReturning[];
		}
	> {
		return this._prepare(name);
	}

	override execute: ReturnType<this["prepare"]>["execute"] = (placeholderValues, extensionContext) => {
		return this._prepare().execute(placeholderValues, extensionContext);
	};
}
