import type { ConstructorFromParser, Constructors, FromParameters, Parsers } from "@postgresql-typed/parsers";

import type { Table } from "../../classes/Table.js";
import type { FilterOperators } from "../interfaces/FilterOperators.js";
import type { DatabaseData } from "./DatabaseData.js";
import type { PostgresData } from "./PostgresData.js";

export type FilterByTableColumn<
	FromTable extends Table<any, any, any, any, any>,
	ColumnLocation extends string,
	InnerPostgresData extends PostgresData = FromTable extends Table<infer PGData, any, any, any, any> ? PGData : never,
	InnerDatabaseData extends DatabaseData = FromTable extends Table<InnerPostgresData, infer DBData, any, any, any> ? DBData : never,
	SchemaName extends keyof InnerDatabaseData["schemas"] = ColumnLocation extends `${infer InnerSchemaName}.${string}.${string}` ? InnerSchemaName : never,
	TableName extends keyof InnerDatabaseData["schemas"][SchemaName]["tables"] = ColumnLocation extends `${string}.${infer InnerTableName}.${string}`
		? InnerTableName
		: never,
	ColumnName extends keyof InnerDatabaseData["schemas"][SchemaName]["tables"][TableName]["columns"] = ColumnLocation extends `${string}.${string}.${infer InnerColumnName}`
		? InnerColumnName extends keyof InnerDatabaseData["schemas"][SchemaName]["tables"][TableName]["columns"]
			? InnerColumnName
			: never
		: never,
	ColumnData extends InnerDatabaseData["schemas"][SchemaName]["tables"][TableName]["columns"][ColumnName] = InnerDatabaseData["schemas"][SchemaName]["tables"][TableName]["columns"][ColumnName],
	ActualType extends FromParameters<Constructors> = ColumnData extends Parsers
		? ConstructorFromParser<ColumnData> extends Constructors
			? FromParameters<ConstructorFromParser<ColumnData>>
			: never
		: never
> = FilterOperators<NonNullable<ActualType>, InnerPostgresData, InnerDatabaseData>;
