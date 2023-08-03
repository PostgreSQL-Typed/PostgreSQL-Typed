/* eslint-disable unicorn/filename-case */
import { entityKind, type Query, QueryPromise, type Simplify, type SQL } from "drizzle-orm";
import type { PgDialect, PgMaterializedView, PreparedQueryConfig, QueryResultHKT, QueryResultKind } from "drizzle-orm/pg-core";

import type { PgTPreparedQuery, PgTSession } from "../session.js";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PgTRefreshMaterializedView<TQueryResult extends QueryResultHKT> extends QueryPromise<QueryResultKind<TQueryResult, never>> {}

export class PgTRefreshMaterializedView<TQueryResult extends QueryResultHKT> extends QueryPromise<QueryResultKind<TQueryResult, never>> {
	static readonly [entityKind]: string = "PgTRefreshMaterializedView";

	private config: {
		view: PgMaterializedView;
		concurrently?: boolean;
		withNoData?: boolean;
	};

	constructor(
		view: PgMaterializedView,
		private session: PgTSession,
		private dialect: PgDialect
	) {
		super();
		this.config = { view };
	}

	concurrently(): this {
		if (this.config.withNoData !== undefined) throw new Error("Cannot use concurrently and withNoData together");

		this.config.concurrently = true;
		return this;
	}

	withNoData(): this {
		if (this.config.concurrently !== undefined) throw new Error("Cannot use concurrently and withNoData together");

		this.config.withNoData = true;
		return this;
	}

	/** @internal */
	getSQL(): SQL {
		return this.dialect.buildRefreshMaterializedViewQuery(this.config);
	}

	toSQL(): Simplify<Omit<Query, "typings">> {
		const { typings: _typings, ...rest } = this.dialect.sqlToQuery(this.getSQL());
		return rest;
	}

	private _prepare(name?: string): PgTPreparedQuery<
		PreparedQueryConfig & {
			execute: QueryResultKind<TQueryResult, never>;
		}
	> {
		return this.session.prepareQuery(this.dialect.sqlToQuery(this.getSQL()), undefined, name);
	}

	prepare(name: string): PgTPreparedQuery<
		PreparedQueryConfig & {
			execute: QueryResultKind<TQueryResult, never>;
		}
	> {
		return this._prepare(name);
	}

	execute: ReturnType<this["prepare"]>["execute"] = (placeholderValues, extensionContext) => {
		return this._prepare().execute(placeholderValues, extensionContext);
	};
}
