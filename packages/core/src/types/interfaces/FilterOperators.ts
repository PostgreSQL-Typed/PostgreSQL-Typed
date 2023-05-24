import type { PgTPError } from "@postgresql-typed/parsers";
import type { DatabaseData, PgTError, PostgresData, Safe } from "@postgresql-typed/util";

import type { SelectSubQuery } from "../types/SelectSubQuery.js";

export interface FilterOperators<TValue, InnerPostgresData extends PostgresData, InnerDatabaseData extends DatabaseData> {
	$EQUAL?: TValue | Safe<SelectSubQuery<InnerPostgresData, InnerDatabaseData, boolean>, PgTError | PgTPError>;
	$NOT_EQUAL?: TValue | Safe<SelectSubQuery<InnerPostgresData, InnerDatabaseData, boolean>, PgTError | PgTPError>;
	$LESS_THAN?: TValue | Safe<SelectSubQuery<InnerPostgresData, InnerDatabaseData, boolean>, PgTError | PgTPError>;
	$LESS_THAN_OR_EQUAL?: TValue | Safe<SelectSubQuery<InnerPostgresData, InnerDatabaseData, boolean>, PgTError | PgTPError>;
	$GREATER_THAN?: TValue | Safe<SelectSubQuery<InnerPostgresData, InnerDatabaseData, boolean>, PgTError | PgTPError>;
	$GREATER_THAN_OR_EQUAL?: TValue | Safe<SelectSubQuery<InnerPostgresData, InnerDatabaseData, boolean>, PgTError | PgTPError>;
	$LIKE?: string;
	$NOT_LIKE?: string;
	$ILIKE?: string;
	$NOT_ILIKE?: string;
	$IN?: readonly TValue[] | Safe<SelectSubQuery<InnerPostgresData, InnerDatabaseData, boolean>, PgTError | PgTPError>;
	$NOT_IN?: readonly TValue[] | Safe<SelectSubQuery<InnerPostgresData, InnerDatabaseData, boolean>, PgTError | PgTPError>;
	$BETWEEN?: [TValue, TValue];
	$NOT_BETWEEN?: [TValue, TValue];
	$IS_NULL?: true;
	$IS_NOT_NULL?: true;
}
//TODO Add a shorthand for $EQUAL
