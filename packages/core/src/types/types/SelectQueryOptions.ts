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
};
