/* eslint-disable brace-style */
import { entityKind, InferModel, is, Param, Query, QueryPromise, Simplify, SQL, sql, SQLWrapper, Table } from "drizzle-orm";
import {
	type AnyPgTable,
	IndexColumn,
	type PgDialect,
	type PgInsertConfig,
	type PgInsertValue,
	PgUpdateSetSource,
	type PreparedQueryConfig,
	type QueryResultHKT,
	type QueryResultKind,
	SelectedFieldsFlat,
} from "drizzle-orm/pg-core";

import type { PgTPreparedQuery, PgTSession } from "../session.js";
import { mapUpdateSet, orderSelectedFields, SelectResultFields } from "./util.js";

export class PgTInsertBuilder<TTable extends AnyPgTable, TQueryResult extends QueryResultHKT> {
	static readonly [entityKind]: string = "PgTInsertBuilder";

	constructor(
		private table: TTable,
		private session: PgTSession,
		private dialect: PgDialect
	) {}

	values(value: PgInsertValue<TTable>): PgTInsert<TTable, TQueryResult>;
	values(values: PgInsertValue<TTable>[]): PgTInsert<TTable, TQueryResult>;
	values(values: PgInsertValue<TTable> | PgInsertValue<TTable>[]): PgTInsert<TTable, TQueryResult> {
		values = Array.isArray(values) ? values : [values];
		if (values.length === 0) throw new Error("values() must be called with at least one value");

		const mappedValues = values.map(entry => {
			const result: Record<string, Param | SQL> = {},
				// @ts-expect-error -- TS doesn't like this, but it's fine
				cols = this.table[Table.Symbol.Columns as keyof typeof this.table] as typeof this.table._.columns;
			for (const colKey of Object.keys(entry)) {
				const colValue = entry[colKey as keyof typeof entry];
				result[colKey] = is(colValue, SQL) ? colValue : new Param(colValue, cols[colKey]);
			}
			return result;
		});

		return new PgTInsert(this.table, mappedValues, this.session, this.dialect);
	}
}

export class PgTInsert<TTable extends AnyPgTable, TQueryResult extends QueryResultHKT, TReturning extends Record<string, unknown> | undefined = undefined>
	extends QueryPromise<TReturning extends undefined ? QueryResultKind<TQueryResult, never> : TReturning[]>
	implements SQLWrapper
{
	static readonly [entityKind]: string = "PgTInsert";

	declare _: {
		table: TTable;
		return: TReturning;
	};

	private config: PgInsertConfig<TTable>;

	constructor(
		table: TTable,
		values: PgInsertConfig["values"],
		private session: PgTSession,
		private dialect: PgDialect
	) {
		super();
		this.config = { table, values };
	}

	returning(): PgTInsert<TTable, TQueryResult, InferModel<TTable>>;
	returning<TSelectedFields extends SelectedFieldsFlat>(fields: TSelectedFields): PgTInsert<TTable, TQueryResult, SelectResultFields<TSelectedFields>>;
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
	): PgTInsert<TTable, any, any> {
		this.config.returning = orderSelectedFields(fields);
		return this;
	}

	onConflictDoNothing(config: { target?: IndexColumn | IndexColumn[]; where?: SQL } = {}): this {
		if (config.target === undefined) this.config.onConflict = sql`do nothing`;
		else {
			let targetColumn = "";
			targetColumn = Array.isArray(config.target)
				? config.target.map(it => this.dialect.escapeName(it.name)).join(",")
				: this.dialect.escapeName(config.target.name);

			const whereSql = config.where ? sql` where ${config.where}` : undefined;
			this.config.onConflict = sql`(${sql.raw(targetColumn)}) do nothing${whereSql}`;
		}
		return this;
	}

	onConflictDoUpdate(config: { target: IndexColumn | IndexColumn[]; where?: SQL; set: PgUpdateSetSource<TTable> }): this {
		const whereSql = config.where ? sql` where ${config.where}` : undefined,
			setSql = this.dialect.buildUpdateSet(this.config.table, mapUpdateSet(this.config.table, config.set));
		let targetColumn = "";
		targetColumn = Array.isArray(config.target)
			? config.target.map(it => this.dialect.escapeName(it.name)).join(",")
			: this.dialect.escapeName(config.target.name);
		this.config.onConflict = sql`(${sql.raw(targetColumn)}) do update set ${setSql}${whereSql}`;
		return this;
	}

	/** @internal */
	getSQL(): SQL {
		return this.dialect.buildInsertQuery(this.config);
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
