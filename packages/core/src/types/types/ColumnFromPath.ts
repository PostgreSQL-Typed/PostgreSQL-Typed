export type ColumnFromPath<Path extends string> = Path extends `${string}.${string}.${infer ColumnName}`
	? ColumnName extends string
		? ColumnName
		: never
	: never;
