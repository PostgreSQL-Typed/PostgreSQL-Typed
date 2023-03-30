export type SelectQuery<JoinedTablesColumns extends string> =
	| "*"
	| "COUNT(*)"
	| JoinedTablesColumns
	| JoinedTablesColumns[]
	| Partial<
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
