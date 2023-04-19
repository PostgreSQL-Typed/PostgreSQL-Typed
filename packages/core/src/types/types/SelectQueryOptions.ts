export type SelectQueryOptions = {
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
};
