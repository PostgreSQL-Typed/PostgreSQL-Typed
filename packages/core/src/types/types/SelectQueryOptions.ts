import type { PgTPError } from "@postgresql-typed/parsers";
import type { DatabaseData, PgTError, PostgresData, Safe } from "@postgresql-typed/util";

import type { SelectSubQuery } from "./SelectSubQuery.js";

export type SelectQueryOptions<InnerPostgresData extends PostgresData, InnerDatabaseData extends DatabaseData, Ready extends boolean> = {
	/**
	 * If the query should be returned as a string
	 *
	 * @default false
	 */
	raw?: boolean;
	/**
	 * If the query should only return the values instead of the full parser objects/classes
	 *
	 * @default false
	 */
	valuesOnly?: boolean;
	/**
	 * If the query is a subquery, this allows you to use this query as a subquery in another query (for example in a join, or in a where clause)
	 *
	 * @default false
	 */
	subquery?: boolean;
	/**
	 * If there were any previous subqueries, this will take over the previously used table locations and variables (index), this will make sure that the variables are unique and that the table locations are unique
	 *
	 * @default undefined
	 */
	previousSubquery?: Safe<SelectSubQuery<InnerPostgresData, InnerDatabaseData, Ready>, PgTError | PgTPError>;
};
