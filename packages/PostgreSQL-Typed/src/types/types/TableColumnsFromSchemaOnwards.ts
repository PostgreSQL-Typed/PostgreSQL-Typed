import { Table } from "../../index.js";
import { DatabaseData } from "../interfaces/DatabaseData.js";
import { Join } from "./Join.js";
import { NestedPaths } from "./NestedPaths.js";
import { TableLocations } from "./TableLocations.js";

export type TableColumnsFromSchemaOnwards<
	Tables extends Table<any, any, any, any, any>,
	InnerDatabaseData extends DatabaseData = Tables extends Table<any, infer InnerDatabaseData, any, any, any> ? InnerDatabaseData : never,
	TableLocation extends TableLocations<any> = Tables extends Table<any, any, any, any, infer TableLocation> ? TableLocation : never,
	SchemaName extends keyof InnerDatabaseData["schemas"] = TableLocation extends `${string}.${infer InnerSchemaName}.${string}` ? InnerSchemaName : never,
	TableName extends keyof InnerDatabaseData["schemas"][SchemaName]["tables"] = TableLocation extends `${string}.${string}.${infer InnerTableName}`
		? InnerTableName
		: never
> = SchemaName extends never
	? never
	: TableName extends never
	? never
	: Join<
			NestedPaths<{
				[schema_name in SchemaName]: {
					[table_name in TableName]: {
						[column_name in keyof InnerDatabaseData["schemas"][schema_name]["tables"][table_name]["columns"]]: string;
					};
				};
			}>,
			"."
	  >;