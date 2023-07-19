import {
	ColumnsSelection,
	DrizzleTypeError,
	entityKind,
	ExtractTablesWithRelations,
	RelationalSchemaConfig,
	SelectionProxyHandler,
	SQLWrapper,
	TablesRelationalConfig,
	WithSubquery,
} from "drizzle-orm";
import { NodePgTransaction } from "drizzle-orm/node-postgres";
import {
	AnyPgColumn,
	AnyPgTable,
	PgDialect,
	PgMaterializedView,
	PgTransactionConfig,
	QueryResultHKT,
	QueryResultKind,
	SelectedFields,
	WithSubqueryWithSelection,
} from "drizzle-orm/pg-core";

import { PgTExtensionManager } from "./extensions.js";
import { PgTDelete } from "./query-builders/delete.js";
import { PgTInsertBuilder } from "./query-builders/insert.js";
import { PgTRelationalQueryBuilder } from "./query-builders/query.js";
import { PgTQueryBuilder, TypedQueryBuilder } from "./query-builders/query-builder.js";
import { PgTRefreshMaterializedView } from "./query-builders/refresh-materialized-view.js";
import { PgTSelectBuilder } from "./query-builders/select.js";
import { PgTUpdateBuilder } from "./query-builders/update.js";
import { PgTSession } from "./session.js";

export class PgTDatabase<
	TQueryResult extends QueryResultHKT,
	TFullSchema extends Record<string, unknown> = Record<string, never>,
	TSchema extends TablesRelationalConfig = ExtractTablesWithRelations<TFullSchema>
> {
	static readonly [entityKind]: string = "PgDatabase";

	declare readonly _: {
		readonly schema: TSchema | undefined;
		readonly tableNamesMap: Record<string, string>;
	};

	query: TFullSchema extends Record<string, never>
		? DrizzleTypeError<"Seems like the schema generic is missing - did you forget to add it to your DB type?">
		: {
				[K in keyof TSchema]: PgTRelationalQueryBuilder<TSchema, TSchema[K]>;
		  };

	constructor(
		/** @internal */
		readonly dialect: PgDialect,
		/** @internal */
		readonly session: PgTSession<TFullSchema, TSchema>,
		schema: RelationalSchemaConfig<TSchema> | undefined
	) {
		this._ = schema ? { schema: schema.schema, tableNamesMap: schema.tableNamesMap } : { schema: undefined, tableNamesMap: {} };
		this.query = {} as (typeof this)["query"];
		if (this._.schema) {
			for (const [tableName, columns] of Object.entries(this._.schema)) {
				(this.query as PgTDatabase<TQueryResult, Record<string, any>>["query"])[tableName] = new PgTRelationalQueryBuilder(
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					schema!.fullSchema,
					this._.schema,
					this._.tableNamesMap,
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					schema!.fullSchema[tableName] as AnyPgTable,
					columns,
					dialect,
					session as PgTSession
				);
			}
		}
	}

	$with<TAlias extends string>(alias: TAlias) {
		return {
			as<TSelection extends ColumnsSelection>(
				qb: TypedQueryBuilder<TSelection> | ((qb: PgTQueryBuilder) => TypedQueryBuilder<TSelection>)
			): WithSubqueryWithSelection<TSelection, TAlias> {
				if (typeof qb === "function") qb = qb(new PgTQueryBuilder());

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

		function select(): PgTSelectBuilder<undefined>;
		function select<TSelection extends SelectedFields>(fields: TSelection): PgTSelectBuilder<TSelection>;
		function select(fields?: SelectedFields): PgTSelectBuilder<SelectedFields | undefined> {
			return new PgTSelectBuilder({
				fields: fields ?? undefined,
				session: self.session as PgTSession,
				dialect: self.dialect,
				withList: queries,
			});
		}

		return { select };
	}

	select(): PgTSelectBuilder<undefined>;
	select<TSelection extends SelectedFields>(fields: TSelection): PgTSelectBuilder<TSelection>;
	select(fields?: SelectedFields): PgTSelectBuilder<SelectedFields | undefined> {
		return new PgTSelectBuilder({
			fields: fields ?? undefined,
			session: this.session as PgTSession,
			dialect: this.dialect,
		});
	}

	selectDistinct(): PgTSelectBuilder<undefined>;
	selectDistinct<TSelection extends SelectedFields>(fields: TSelection): PgTSelectBuilder<TSelection>;
	selectDistinct(fields?: SelectedFields): PgTSelectBuilder<SelectedFields | undefined> {
		return new PgTSelectBuilder({
			fields: fields ?? undefined,
			session: this.session as PgTSession,
			dialect: this.dialect,
			distinct: true,
		});
	}

	selectDistinctOn(on: (AnyPgColumn | SQLWrapper)[]): PgTSelectBuilder<undefined>;
	selectDistinctOn<TSelection extends SelectedFields>(on: (AnyPgColumn | SQLWrapper)[], fields: TSelection): PgTSelectBuilder<TSelection>;
	selectDistinctOn(on: (AnyPgColumn | SQLWrapper)[], fields?: SelectedFields): PgTSelectBuilder<SelectedFields | undefined> {
		return new PgTSelectBuilder({
			fields: fields ?? undefined,
			session: this.session as PgTSession,
			dialect: this.dialect,
			distinct: { on },
		});
	}

	update<TTable extends AnyPgTable>(table: TTable): PgTUpdateBuilder<TTable, TQueryResult> {
		return new PgTUpdateBuilder(table, this.session as PgTSession, this.dialect);
	}

	insert<TTable extends AnyPgTable>(table: TTable): PgTInsertBuilder<TTable, TQueryResult> {
		return new PgTInsertBuilder(table, this.session as PgTSession, this.dialect);
	}

	delete<TTable extends AnyPgTable>(table: TTable): PgTDelete<TTable, TQueryResult> {
		return new PgTDelete(table, this.session as PgTSession, this.dialect);
	}

	refreshMaterializedView<TView extends PgMaterializedView>(view: TView): PgTRefreshMaterializedView<TQueryResult> {
		return new PgTRefreshMaterializedView(view, this.session as PgTSession, this.dialect);
	}

	execute<TRow extends Record<string, unknown> = Record<string, unknown>>(query: SQLWrapper): Promise<QueryResultKind<TQueryResult, TRow>> {
		return this.session.execute(query.getSQL());
	}

	transaction<T>(transaction: (tx: NodePgTransaction<TFullSchema, TSchema>) => Promise<T>, config?: PgTransactionConfig): Promise<T> {
		return this.session.transaction(transaction, config);
	}

	public get extensions(): PgTExtensionManager {
		return this.session.extensions;
	}

	/**
	 * Connects to the database and initializes the extensions.
	 */
	async connect(): Promise<void> {
		await this.session.client.connect();
		await this.extensions.initialize();
	}
}
