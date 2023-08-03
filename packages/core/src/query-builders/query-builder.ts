/* eslint-disable unicorn/filename-case */
import { type ColumnsSelection, entityKind, SelectionProxyHandler, type SQL, type SQLWrapper, WithSubquery } from "drizzle-orm";
import { type AnyPgColumn, PgDialect, type SelectedFields, type WithSubqueryWithSelection } from "drizzle-orm/pg-core";

import { PgTSelectBuilder } from "./select.js";

export abstract class TypedQueryBuilder<TSelection, TResult = unknown> implements SQLWrapper {
	static readonly [entityKind]: string = "TypedQueryBuilder";

	declare _: {
		selectedFields: TSelection;
		result: TResult;
	};

	abstract getSelectedFields(): TSelection;

	abstract getSQL(): SQL;
}

export class PgTQueryBuilder {
	static readonly [entityKind]: string = "PgTQueryBuilder";

	private dialect: PgDialect | undefined;

	$with<TAlias extends string>(alias: TAlias) {
		// eslint-disable-next-line @typescript-eslint/no-this-alias, unicorn/no-this-assignment
		const queryBuilder = this;

		return {
			as<TSelection extends ColumnsSelection>(
				qb: TypedQueryBuilder<TSelection> | ((qb: PgTQueryBuilder) => TypedQueryBuilder<TSelection>)
			): WithSubqueryWithSelection<TSelection, TAlias> {
				if (typeof qb === "function") qb = qb(queryBuilder);

				return new Proxy(
					new WithSubquery(qb.getSQL(), qb.getSelectedFields() as SelectedFields, alias, true),
					new SelectionProxyHandler({ alias, sqlAliasedBehavior: "alias", sqlBehavior: "error" })
				) as WithSubqueryWithSelection<TSelection, TAlias>;
			},
		};
	}

	with(...queries: WithSubquery[]) {
		// eslint-disable-next-line @typescript-eslint/no-this-alias, unicorn/no-this-assignment
		const self = this;

		function select(): PgTSelectBuilder<undefined, "qb">;
		function select<TSelection extends SelectedFields>(fields: TSelection): PgTSelectBuilder<TSelection, "qb">;
		function select<TSelection extends SelectedFields>(fields?: TSelection): PgTSelectBuilder<TSelection | undefined, "qb"> {
			return new PgTSelectBuilder({
				dialect: self.getDialect(),
				fields: fields ?? undefined,
				session: undefined,
				withList: queries,
			});
		}

		function selectDistinct(): PgTSelectBuilder<undefined, "qb">;
		function selectDistinct<TSelection extends SelectedFields>(fields: TSelection): PgTSelectBuilder<TSelection, "qb">;
		function selectDistinct(fields?: SelectedFields): PgTSelectBuilder<SelectedFields | undefined, "qb"> {
			return new PgTSelectBuilder({
				dialect: self.getDialect(),
				distinct: true,
				fields: fields ?? undefined,
				session: undefined,
			});
		}

		function selectDistinctOn(on: (AnyPgColumn | SQLWrapper)[]): PgTSelectBuilder<undefined, "qb">;
		function selectDistinctOn<TSelection extends SelectedFields>(on: (AnyPgColumn | SQLWrapper)[], fields: TSelection): PgTSelectBuilder<TSelection, "qb">;
		function selectDistinctOn(on: (AnyPgColumn | SQLWrapper)[], fields?: SelectedFields): PgTSelectBuilder<SelectedFields | undefined, "qb"> {
			return new PgTSelectBuilder({
				dialect: self.getDialect(),
				distinct: { on },
				fields: fields ?? undefined,
				session: undefined,
			});
		}

		return { select, selectDistinct, selectDistinctOn };
	}

	select(): PgTSelectBuilder<undefined, "qb">;
	select<TSelection extends SelectedFields>(fields: TSelection): PgTSelectBuilder<TSelection, "qb">;
	select<TSelection extends SelectedFields>(fields?: TSelection): PgTSelectBuilder<TSelection | undefined, "qb"> {
		return new PgTSelectBuilder({
			dialect: this.getDialect(),
			fields: fields ?? undefined,
			session: undefined,
		});
	}

	selectDistinct(): PgTSelectBuilder<undefined>;
	selectDistinct<TSelection extends SelectedFields>(fields: TSelection): PgTSelectBuilder<TSelection>;
	selectDistinct(fields?: SelectedFields): PgTSelectBuilder<SelectedFields | undefined> {
		return new PgTSelectBuilder({
			dialect: this.getDialect(),
			distinct: true,
			fields: fields ?? undefined,
			session: undefined,
		});
	}

	selectDistinctOn(on: (AnyPgColumn | SQLWrapper)[]): PgTSelectBuilder<undefined>;
	selectDistinctOn<TSelection extends SelectedFields>(on: (AnyPgColumn | SQLWrapper)[], fields: TSelection): PgTSelectBuilder<TSelection>;
	selectDistinctOn(on: (AnyPgColumn | SQLWrapper)[], fields?: SelectedFields): PgTSelectBuilder<SelectedFields | undefined> {
		return new PgTSelectBuilder({
			dialect: this.getDialect(),
			distinct: { on },
			fields: fields ?? undefined,
			session: undefined,
		});
	}

	// Lazy load dialect to avoid circular dependency
	private getDialect() {
		if (!this.dialect) this.dialect = new PgDialect();

		return this.dialect;
	}
}
