/* eslint-disable brace-style */
import { entityKind, type InferModel, type Query, QueryPromise, type Simplify, type SQL, type SQLWrapper, Table } from "drizzle-orm";
import type { AnyPgTable, PgDeleteConfig, PgDialect, PreparedQueryConfig, QueryResultHKT, QueryResultKind, SelectedFieldsFlat } from "drizzle-orm/pg-core";

import type { PgTPreparedQuery, PgTSession } from "../session.js";
import { orderSelectedFields, SelectResultFields } from "./util.js";

export class PgTDelete<TTable extends AnyPgTable, TQueryResult extends QueryResultHKT, TReturning extends Record<string, unknown> | undefined = undefined>
	extends QueryPromise<TReturning extends undefined ? QueryResultKind<TQueryResult, never> : TReturning[]>
	implements SQLWrapper
{
	static readonly [entityKind]: string = "PgTDelete";

	private config: PgDeleteConfig;

	constructor(
		table: TTable,
		private session: PgTSession,
		private dialect: PgDialect
	) {
		super();
		this.config = { table };
	}

	where(where: SQL | undefined): Omit<this, "where"> {
		this.config.where = where;
		return this;
	}

	returning(): PgTDelete<TTable, TQueryResult, InferModel<TTable>>;
	returning<TSelectedFields extends SelectedFieldsFlat>(fields: TSelectedFields): PgTDelete<TTable, TQueryResult, SelectResultFields<TSelectedFields>>;
	returning(
		fields: SelectedFieldsFlat = this.config.table[
			(
				Table as unknown as {
					Symbol: {
						Columns: keyof TTable;
					};
				}
			).Symbol.Columns as keyof AnyPgTable
		] as unknown as SelectedFieldsFlat
	): PgTDelete<TTable, any, any> {
		this.config.returning = orderSelectedFields(fields);
		return this as PgTDelete<TTable, any>;
	}

	/** @internal */
	getSQL(): SQL {
		return this.dialect.buildDeleteQuery(this.config);
	}

	toSQL(): Simplify<Omit<Query, "typings">> {
		const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
		return rest;
	}

	private _prepare(name?: string): PgTPreparedQuery<
		PreparedQueryConfig & {
			execute: TReturning extends undefined ? QueryResultKind<TQueryResult, never> : TReturning[];
		}
	> {
		return this.session.prepareQuery<
			PreparedQueryConfig & {
				execute: TReturning extends undefined ? QueryResultKind<TQueryResult, never> : TReturning[];
			}
		>(this.dialect.sqlToQuery(this.getSQL()), this.config.returning, name);
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
