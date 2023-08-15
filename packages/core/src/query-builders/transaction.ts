import { SQL, sql, TablesRelationalConfig, TransactionRollbackError } from "drizzle-orm";
import { PgDialect, PgTransactionConfig, QueryResultHKT } from "drizzle-orm/pg-core";

import { PgTDatabase } from "../database.js";
import { PgTSession } from "../session.js";

export abstract class PgTransaction<
	TQueryResult extends QueryResultHKT,
	TFullSchema extends Record<string, unknown> = Record<string, never>,
	TSchema extends TablesRelationalConfig = Record<string, never>,
> extends PgTDatabase<TQueryResult, TFullSchema, TSchema> {
	constructor(
		dialect: PgDialect,
		session: PgTSession<any, any>,
		protected schema:
			| {
					fullSchema: Record<string, unknown>;
					schema: TSchema;
					tableNamesMap: Record<string, string>;
			  }
			| undefined,
		protected readonly nestedIndex = 0
	) {
		super(dialect, session, schema);
	}

	/* c8 ignore next 3 */
	rollback(): never {
		throw new TransactionRollbackError();
	}

	/* c8 ignore next 11 */
	/** @internal */
	getTransactionConfigSQL(config: PgTransactionConfig): SQL {
		const chunks: string[] = [];
		if (config.isolationLevel) chunks.push(`isolation level ${config.isolationLevel}`);

		if (config.accessMode) chunks.push(config.accessMode);

		if (typeof config.deferrable === "boolean") chunks.push(config.deferrable ? "deferrable" : "not deferrable");

		return sql.raw(chunks.join(" "));
	}

	/* c8 ignore next 3 */
	setTransaction(config: PgTransactionConfig): Promise<void> {
		return this.session.execute(sql`set transaction ${this.getTransactionConfigSQL(config)}`);
	}

	abstract override transaction<T>(transaction: (tx: PgTransaction<TQueryResult, TFullSchema, TSchema>) => Promise<T>): Promise<T>;
}
