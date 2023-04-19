import type { DatabaseData } from "../types/DatabaseData.js";
import type { PostgresData } from "../types/PostgresData.js";
import type { SelectSubQuery } from "../types/SelectSubQuery.js";

export interface FilterOperators<TValue, InnerPostgresData extends PostgresData, InnerDatabaseData extends DatabaseData> {
	$EQUAL?: TValue | SelectSubQuery<InnerPostgresData, InnerDatabaseData, boolean>;
	$NOT_EQUAL?: TValue | SelectSubQuery<InnerPostgresData, InnerDatabaseData, boolean>;
	$LESS_THAN?: TValue | SelectSubQuery<InnerPostgresData, InnerDatabaseData, boolean>;
	$LESS_THAN_OR_EQUAL?: TValue | SelectSubQuery<InnerPostgresData, InnerDatabaseData, boolean>;
	$GREATER_THAN?: TValue | SelectSubQuery<InnerPostgresData, InnerDatabaseData, boolean>;
	$GREATER_THAN_OR_EQUAL?: TValue | SelectSubQuery<InnerPostgresData, InnerDatabaseData, boolean>;
	$LIKE?: string;
	$NOT_LIKE?: string;
	$ILIKE?: string;
	$NOT_ILIKE?: string;
	$IN?: readonly TValue[] | SelectSubQuery<InnerPostgresData, InnerDatabaseData, boolean>;
	$NOT_IN?: readonly TValue[] | SelectSubQuery<InnerPostgresData, InnerDatabaseData, boolean>;
	$BETWEEN?: [TValue, TValue];
	$NOT_BETWEEN?: [TValue, TValue];
	$IS_NULL?: true;
	$IS_NOT_NULL?: true;
}
