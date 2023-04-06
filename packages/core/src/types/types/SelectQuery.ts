export type SelectQueryObject<JoinedTablesColumns extends string> = Partial<
	Record<
		"COUNT(*)",
		| {
				alias?: string;
		  }
		| true
	> &
		Record<
			JoinedTablesColumns,
			| {
					alias?: string;
					distinct?: boolean | "ON";
			  }
			| true
		> & {
			"*": true;
		}
>;

export type SelectQuery<JoinedTablesColumns extends string> =
	| "*"
	| "COUNT(*)"
	| JoinedTablesColumns
	| JoinedTablesColumns[]
	| SelectQueryObject<JoinedTablesColumns>;
