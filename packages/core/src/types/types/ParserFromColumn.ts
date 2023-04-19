import type { Parsers } from "@postgresql-typed/parsers";

import type { DatabaseData } from "./DatabaseData.js";

export type ParserFromColumn<
	Paths extends string,
	Column extends string,
	InnerDatabaseData extends DatabaseData
> = Paths extends `${infer SchemaName}.${infer TableName}.${infer ColumnName}`
	? ColumnName extends Column
		? ColumnName extends keyof InnerDatabaseData["schemas"][SchemaName]["tables"][TableName]["columns"]
			? InnerDatabaseData["schemas"][SchemaName]["tables"][TableName]["columns"][ColumnName] extends Parsers | null
				? InnerDatabaseData["schemas"][SchemaName]["tables"][TableName]["columns"][ColumnName]
				: never
			: never
		: never
	: never;
