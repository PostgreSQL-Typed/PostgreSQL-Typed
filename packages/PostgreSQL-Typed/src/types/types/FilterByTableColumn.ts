import type { Table } from "../../index.js";
import type { DatabaseData } from "../interfaces/DatabaseData.js";
import type { PostgresData } from "../interfaces/PostgresData.js";
import type { Condition } from "./Condition.js";
import type { TableColumnsFromSchemaOnwards } from "./TableColumnsFromSchemaOnwards.js";

export type FilterByTableColumn<
	FromTable extends Table<any, any, any, any, any>,
	ColumnLocation extends TableColumnsFromSchemaOnwards<FromTable>,
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
	ColumnData extends InnerDatabaseData["schemas"][SchemaName]["tables"][TableName]["columns"][ColumnName] = InnerDatabaseData["schemas"][SchemaName]["tables"][TableName]["columns"][ColumnName]
> = Condition<ColumnData>;
